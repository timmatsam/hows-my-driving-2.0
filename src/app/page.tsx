import { ViolationCard } from "@/components/ViolationCard";
import { type Violation } from "@/types/violations";
import { env } from "@/env";

// invalidate every 7 days
export const revalidate = 604800;

export default async function AllViolationsPage() {
  const violations = await getViolations();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">
        NYC Parking and Camera Violations ({violations.length} plates)
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {violations.map((violation, index) => (
          <ViolationCard key={index} violation={violation} />
        ))}
      </div>
    </div>
  );
}

const getViolations = async (): Promise<Violation[]> => {
  const NYC_API_BASE_URL = "https://data.cityofnewyork.us/resource";
  const DATASET_ID = "nc67-uf89";
  const startDate = "2020-01-01";
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
      // $limit: "100",
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

    return (await violationsRes.json()) as Violation[];
  } catch (error) {
    console.error("Error fetching aggregated violations:", error);
    return [];
  }
};
