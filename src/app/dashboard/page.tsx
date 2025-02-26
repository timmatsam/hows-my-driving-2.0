import { ViolationCard } from "@/components/ViolationCard";
import { Pages } from "@/types/pages";
import { getCachedViolations } from "@/utils/getViolations";
import Link from "next/link";
import { TowingWarningBanner } from "@/components/TowingWarningBanner";

export default async function AllViolationsPage() {
  const violations = await getCachedViolations();
  const violationsSliced = violations.slice(0, 100);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">
        NYC Parking and Camera Violations ({violationsSliced.length} plates)
      </h1>
      <TowingWarningBanner className="mb-6" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {violationsSliced.map((violation, index) => (
          <Link
            href={`${Pages.DASHBOARD}/${violation.plate}/${violation.state}`}
            key={index}
            className="no-underline"
          >
            <ViolationCard
              violation={violation}
              className="md:hover:shadow-lg md:hover:shadow-primary/20"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
