import {
  type AggregateViolationByPlate,
  type ParkingViolation,
} from "@/types/violations";
import { unstable_cache } from "next/cache";
import { env } from "process";

/**
 * Aggregates parking and camera violations fines from the NYC Open Data API, while
 * also fetching individual violations for each plate, which is associated with each aggregate record.
 */
export const getViolations = async (): Promise<AggregateViolationByPlate[]> => {
  const NYC_API_BASE_URL = "https://data.cityofnewyork.us/resource";
  const DATASET_ID = "nc67-uf89";
  const startDate =
    env.NODE_ENV === "development" ? "2024-01-01" : "2020-01-01";
  try {
    // First, get aggregated stats
    const aggregateQuery = new URLSearchParams({
      $select: [
        "plate",
        "state",
        "COUNT(*) as total_violations",
        "SUM(fine_amount) as total_fines",
        "MAX(issue_date) as last_violation_date",
      ].join(", "),
      $where: `issue_date between '${startDate}' and '2024-12-31' AND fine_amount IS NOT NULL AND fine_amount != '0'`,
      $group: "plate, state",
      $order: "total_fines DESC",
      $limit: env.NODE_ENV === "development" ? "100" : "1000",
      $$app_token: env.NYC_OPEN_DATA_APP_TOKEN ?? "",
    });

    const aggregateRes = await fetch(
      `${NYC_API_BASE_URL}/${DATASET_ID}.json?${aggregateQuery}`,
    );

    if (!aggregateRes.ok) {
      const errorText = await aggregateRes.text();
      console.error("API Error Response:", {
        status: aggregateRes.status,
        statusText: aggregateRes.statusText,
        body: errorText,
      });
      throw new Error(
        `Failed to fetch data from NYC Open Data API: ${aggregateRes.status} ${aggregateRes.statusText}`,
      );
    }

    const aggregateData = (await aggregateRes.json()) as Omit<
      AggregateViolationByPlate,
      "individual_violations"
    >[];

    // Now fetch individual violations for each plate
    return await Promise.all(
      aggregateData.map(async (item) => {
        const detailsQuery = new URLSearchParams({
          $select: "issue_date, fine_amount, summons_number",
          $where: `plate = '${item.plate}' AND state = '${item.state}' AND issue_date between '${startDate}' and '2024-12-31' AND fine_amount IS NOT NULL AND fine_amount != '0'`,
          $order: "issue_date DESC",
          $$app_token: env.NYC_OPEN_DATA_APP_TOKEN ?? "",
        });

        const detailsRes = await fetch(
          `${NYC_API_BASE_URL}/${DATASET_ID}.json?${detailsQuery}`,
          { cache: "force-cache" },
        );

        if (!detailsRes.ok) {
          console.error(detailsRes);
          console.error(`Failed to fetch details for ${item.plate}`);
          return {
            plate: item.plate,
            state: item.state,
            total_violations: Number(item.total_violations),
            total_fines: Number(item.total_fines),
            last_violation_date: item.last_violation_date,
            individual_violations: [],
          };
        }

        const details = (await detailsRes.json()) as ParkingViolation[];

        return {
          plate: item.plate,
          state: item.state,
          total_violations: Number(item.total_violations),
          total_fines: Number(item.total_fines),
          last_violation_date: item.last_violation_date,
          individual_violations: details.map((detail) => ({
            issue_date: detail.issue_date,
            fine_amount: Number(detail.fine_amount),
            summons_number: detail.summons_number,
          })),
        };
      }),
    );
  } catch (error) {
    console.error("Error fetching aggregated violations:", error);
    return [];
  }
};

export const getCachedViolations = unstable_cache(getViolations);
