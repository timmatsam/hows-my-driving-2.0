import { ViolationCard } from "@/components/ViolationCard";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { type Violation } from "@/types/violations";

export const revalidate = 7 * 24 * 60 * 60; // invalidate every 7 days

export default async function AllViolationsPage() {
  const data = await fetch(`${getBaseUrl()}/api/aggregate-violations`).then(
    (res) => res.json() as Promise<{ violations: Violation[] }>,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">
        NYC Parking and Camera Violations ({data.violations.length} plates)
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.violations.map((violation, index) => (
          <ViolationCard key={index} violation={violation} />
        ))}
      </div>
    </div>
  );
}
