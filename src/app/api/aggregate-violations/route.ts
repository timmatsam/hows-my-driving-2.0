import { env } from "@/env";
import { type Violation } from "@/types/violations";
import { NextResponse } from "next/server";
const NYC_API_BASE_URL = "https://data.cityofnewyork.us/resource";
const DATASET_ID = "nc67-uf89";

export async function GET(request: Request) {
  // const { searchParams } = new URL(request.url);
  // const page = parseInt(searchParams.get("page") ?? "1");
  // const limit = parseInt(searchParams.get("limit") ?? "100");
  // const offset = (page - 1) * limit;
  /**
   * The following data is not necessarily normalized.
   * The total_
   */
  const startDate = "2024-01-01";
  try {
    // Build the query for aggregated data
    const violationsQuery = new URLSearchParams({
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
      $limit: "100",
      // $offset: offset.toString(),
      $$app_token: env.NYC_OPEN_DATA_APP_TOKEN ?? "",
    });

    const violationsRes = await fetch(
      `${NYC_API_BASE_URL}/${DATASET_ID}.json?${violationsQuery}`,
    );
    // return NextResponse.json({ test: "something" });
    if (!violationsRes.ok) {
      throw new Error("Failed to fetch data from NYC Open Data API");
    }

    const violations = (await violationsRes.json()) as Violation[];

    return NextResponse.json({
      violations,
    });
  } catch (error) {
    console.error("Error fetching aggregated violations:", error);
    return NextResponse.json(
      { error: "Failed to fetch violations" },
      { status: 500 },
    );
  }
}
