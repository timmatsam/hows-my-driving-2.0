import {
  type ParkingAndCameraViolation,
  type AggregateViolationByPlate,
  type ParkingViolation,
} from "@/types/violations";
import { unstable_cache } from "next/cache";
import { env } from "process";

/**
 * Aggregates parking and camera violations fines from the NYC Open Data API by plate and state.
 */
const getViolations = async (): Promise<AggregateViolationByPlate[]> => {
  const NYC_API_BASE_URL = "https://data.cityofnewyork.us/resource";
  const DATASET_ID = "nc67-uf89";
  const startDate =
    env.NODE_ENV === "development" ? "2024-01-01" : "2020-01-01";
  try {
    // Fetch all violations with necessary fields
    const query = new URLSearchParams({
      $select: "plate, state, fine_amount, issue_date, summons_number",
      $where: `issue_date between '${startDate}' and '2024-12-31' AND fine_amount IS NOT NULL AND fine_amount != '0'`,
      $order: "issue_date DESC",
      $$app_token: env.NYC_OPEN_DATA_APP_TOKEN ?? "",
    });

    const res = await fetch(`${NYC_API_BASE_URL}/${DATASET_ID}.json?${query}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", {
        status: res.status,
        statusText: res.statusText,
        body: errorText,
      });
      throw new Error(
        `Failed to fetch data from NYC Open Data API: ${res.status} ${res.statusText}`,
      );
    }

    const violations = (await res.json()) as Array<ParkingAndCameraViolation>;

    // Group violations by plate and state
    const violationsByPlate = new Map<string, AggregateViolationByPlate>();

    for (const violation of violations) {
      const key = `${violation.plate}|${violation.state}`;
      const existing = violationsByPlate.get(key);
      const violationObj: ParkingViolation = {
        issue_date: violation.issue_date,
        fine_amount: Number(violation.fine_amount),
        summons_number: violation.summons_number,
      };

      if (existing) {
        // Update existing aggregate
        existing.total_violations += 1;
        existing.total_fines += Number(violation.fine_amount);
        if (violation.issue_date > existing.last_violation_date) {
          existing.last_violation_date = violation.issue_date;
        }
        existing.individual_violations.push(violationObj);
      } else {
        // Create new aggregate
        violationsByPlate.set(key, {
          plate: violation.plate,
          state: violation.state,
          total_violations: 1,
          total_fines: Number(violation.fine_amount),
          last_violation_date: violation.issue_date,
          individual_violations: [violationObj],
        });
      }
    }

    return Array.from(violationsByPlate.values());
  } catch (error) {
    console.error("Error fetching violations:", error);
    return [];
  }
};

export const getCachedViolations = unstable_cache(getViolations);
