import { type AggregateViolationByPlate } from "@/types/violations";
import { unstable_cache } from "next/cache";
import { env } from "process";

/**
 * Aggregates parking and camera violations fines from the NYC Open Data API by plate and state.
 */
const getViolations = async (): Promise<Array<AggregateViolationByPlate>> => {
  const NYC_API_BASE_URL = "https://data.cityofnewyork.us/resource";
  const DATASET_ID = "nc67-uf89";
  const startDate =
    env.NODE_ENV === "development" ? "2023-01-01" : "2016-01-01";
  const endDate = "2024-12-31";

  try {
    // Fetch aggregated violations using SoQL
    const query = new URLSearchParams({
      $select: `
        plate,
        state,
        COUNT(*) as total_violations,
        SUM(fine_amount) as total_fines,
        MAX(issue_date) as last_violation_date
      `
        .trim()
        .replace(/\s+/g, " "),
      $where: `issue_date >= '${startDate}' AND issue_date <= '${endDate}' AND fine_amount IS NOT NULL AND fine_amount != '0'`,
      $group: "plate, state",
      $order: "total_violations DESC",
      $limit: "1000",
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

    const aggregatedViolations =
      (await res.json()) as Array<AggregateViolationByPlate>;

    // Convert string numbers to actual numbers
    return aggregatedViolations.map((violation) => ({
      plate: violation.plate,
      state: violation.state,
      total_violations: Number(violation.total_violations),
      total_fines: Number(violation.total_fines),
      last_violation_date: violation.last_violation_date,
    }));
  } catch (error) {
    console.error("Error fetching violations:", error);
    return [];
  }
};

export const getCachedViolations = unstable_cache(getViolations);
