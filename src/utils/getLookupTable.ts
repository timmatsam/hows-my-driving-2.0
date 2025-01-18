import { ParkingViolationsTable } from "@/types/violations";
import { unstable_cache } from "next/cache";

export interface PathParams {
  plate: string;
  state: string;
}

export type StreetLookup = Record<
  string,
  {
    house_number: string;
    street_name: string;
  }
>;

interface ParkingViolationResponse {
  summons_number: string;
  house_number: string;
  street_name: string;
}

/**
 * Builds a lookup table for street names and house numbers
 * @param year - The id of the dataset that corresponds to the year of the violations to lookup
 * @returns A lookup object for O(1) access to street information by summons number
 *
 * @example
 * // Raw data returned from API:
 * [
 *   {
 *     "summons_number": "1234567890",
 *     "house_number": "123",
 *     "street_name": "MAIN STREET"
 *   },
 *   {
 *     "summons_number": "9876543210",
 *     "house_number": "456",
 *     "street_name": "BROADWAY"
 *   }
 * ]
 *
 * // Transformed into lookup structure:
 * {
 *   "1234567890": {
 *     "house_number": "123",
 *     "street_name": "MAIN STREET"
 *   },
 *   "9876543210": {
 *     "house_number": "456",
 *     "street_name": "BROADWAY"
 *   }
 * }
 *
 * // Usage:
 * const lookup = await buildStreetLookup();
 * const streetInfo = lookup["1234567890"];  // O(1) lookup
 * console.log(streetInfo.street_name); // "MAIN STREET"
 */
async function buildStreetLookup({
  plate,
  state,
}: PathParams): Promise<StreetLookup> {
  const parkingViolationsIssuedFetchUrls = Object.entries(
    ParkingViolationsTable,
  ).map(([yearKey, id]) => {
    const yearFromKey = yearKey.slice(5, 9); // YEAR_2024 -> 2024
    const query = `
    SELECT summons_number, house_number, street_name 
    WHERE plate_id = '${plate}' AND registration_state = '${state}' 
    AND issue_date BETWEEN '${yearFromKey}-01-01T00:00:00.000' AND '${yearFromKey}-12-31T23:59:59.999'
  `;
    return `https://data.cityofnewyork.us/resource/${id}.json?\$query=${encodeURIComponent(query)}`;
  });

  try {
    const responses = await Promise.all(
      parkingViolationsIssuedFetchUrls.map((url) =>
        fetch(url).then(
          (response) => response.json() as Promise<ParkingViolationResponse[]>,
        ),
      ),
    );
    const hashmap: StreetLookup = {};
    for (const arr of responses) {
      for (const violation of arr) {
        hashmap[violation.summons_number] = {
          house_number: violation.house_number,
          street_name: violation.street_name,
        };
      }
    }
    return hashmap;
  } catch (error) {
    console.error("Error building street lookup:", error);
    throw error;
  }
}

export const cachedBuildStreetLookup = unstable_cache(buildStreetLookup);