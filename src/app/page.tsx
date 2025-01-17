import { ViolationCard } from "@/components/ViolationCard";
import { getViolations } from "@/utils/getViolations";
import { unstable_cacheLife as cacheLife } from "next/cache";
import Link from "next/link";

export default async function AllViolationsPage() {
  "use cache";
  cacheLife("weeks");

  const violations = await getViolations();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">
        NYC Parking and Camera Violations ({violations.length} plates)
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {violations.map((violation, index) => (
          <Link
            href={`/${violation.plate}/${violation.state}`}
            key={index}
            className="no-underline"
          >
            <ViolationCard violation={violation} className="hover:shadow-lg" />
          </Link>
        ))}
      </div>
    </div>
  );
}

