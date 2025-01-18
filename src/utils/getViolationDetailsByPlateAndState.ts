import { env } from "@/env";
import {
  type ParkingAndCameraViolation,
  ParkingViolationsTable,
  type ViolationsDetails,
} from "@/types/violations";
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
 */
async function getViolationDetailsByPlateAndState({
  plate,
  state,
}: PathParams): Promise<Array<ViolationsDetails>> {
  const NYC_API_BASE_URL = "https://data.cityofnewyork.us/resource";

  const parkingViolationsIssuedFetchUrls = Object.entries(
    ParkingViolationsTable,
  ).map(([yearKey, id]) => {
    const yearFromKey = yearKey.slice(5, 9); // YEAR_2024 -> 2024
    const query = `
    SELECT summons_number, house_number, street_name 
    WHERE plate_id = '${plate}' AND registration_state = '${state}' 
    AND issue_date BETWEEN '${yearFromKey}-01-01T00:00:00.000' AND '${yearFromKey}-12-31T23:59:59.999'
  `;
    return `${NYC_API_BASE_URL}/${id}.json?\$query=${encodeURIComponent(query)}`;
  });

  try {
  } catch (error) {
    console.error("Error building street lookup:", error);
    throw error;
  }

  try {
    const parkingAndCameraViolations = await fetch(
      `${NYC_API_BASE_URL}/nc67-uf89.json?${generateQueryForParkingAndCameraViolationsByPlateAndState(plate, state)}`,
    ).then(
      (response) =>
        response.json() as Promise<Array<ParkingAndCameraViolation>>,
    );
    const responses = await Promise.all(
      parkingViolationsIssuedFetchUrls.map((url) =>
        fetch(url).then(
          (response) =>
            response.json() as Promise<Array<ParkingViolationResponse>>,
        ),
      ),
    );

    // Create a lookup map for location details by summons number
    const locationLookup = new Map<
      string,
      { street_name?: string; house_number?: string }
    >();
    for (const response of responses) {
      for (const violation of response) {
        locationLookup.set(violation.summons_number, {
          street_name: violation.street_name,
          house_number: violation.house_number,
        });
      }
    }

    // Combine violation data with location details
    return parkingAndCameraViolations.map((violation) => {
      const locationDetails = locationLookup.get(violation.summons_number);
      return {
        ...violation,
        street_name: locationDetails?.street_name,
        house_number: locationDetails?.house_number,
      };
    });
  } catch (error) {
    console.error("Error building street lookup:", error);
    throw error;
  }
}

const generateQueryForParkingAndCameraViolationsByPlateAndState = (
  plate: string,
  state: string,
) => {
  const startDate =
    env.NODE_ENV === "development"
      ? "2023-01-01T00:00:00.000"
      : "2020-01-01T00:00:00.000";
  const endDate = "2024-12-31T23:59:59.999";

  return new URLSearchParams({
    $select: `
      fine_amount,
      issue_date,
      summons_number
    `,
    $where: `plate = '${plate}' AND state = '${state}' AND issue_date between '${startDate}' and '${endDate}' AND fine_amount IS NOT NULL AND fine_amount != '0'`,
    $limit: "50000",
    $$app_token: env.NYC_OPEN_DATA_APP_TOKEN ?? "",
  });
};

export const cachedBuildStreetLookup = unstable_cache(
  getViolationDetailsByPlateAndState,
);
