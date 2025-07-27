import { IndividualViolationsAreaChart } from "@/components/IndividualViolationsAreaChart";
import { ViolationDetailsTable } from "@/components/ViolationDetailsTable";
import { type IndividualViolationDetails } from "@/types/violations";
import { cachedBuildStreetLookup } from "@/utils/getViolationDetailsByPlateAndState";
import { type PathParams } from "@/utils/getViolationDetailsByPlateAndState";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<PathParams>;
}) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-3/4 rounded bg-gray-200"></div>
          <div className="h-[500px] rounded bg-gray-100"></div>
        </div>
      }
    >
      <ViolationContent params={params} />
    </Suspense>
  );
}

async function ViolationContent({ params }: { params: Promise<PathParams> }) {
  const { plate, state } = await params;

  const violationDetails = await cachedBuildStreetLookup({
    plate,
    state,
  });
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold text-primary">
          Violation Details [ {violationDetails.length} found ]
        </h1>
        <p className="mt-2 text-sm text-primary/50">
          A list of all individual violations for plate of {plate} of state{" "}
          {state}.
        </p>
        <IndividualViolationsAreaChart
          data={transformDataForAreaChart(violationDetails)}
        />
      </div>
      <ViolationDetailsTable details={violationDetails} />
    </div>
  );
}

function transformDataForAreaChart(violations: IndividualViolationDetails[]) {
  // Map to store the count of violations per month
  const violationCounts: Record<string, number> = {};

  // Process each violation
  violations.forEach((violation) => {
    const date = new Date(violation.issue_date);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    // Increment the count for the month
    violationCounts[month] = (violationCounts[month] ?? 0) + 1;
  });

  // Convert the map to an array of { x, y } objects
  const areaChartData = Object.entries(violationCounts).map(
    ([month, count]) => ({
      yearMonth: month,
      totalViolations: count,
    }),
  );

  // Sort by month for chronological order
  areaChartData.sort((a, b) => (a.yearMonth < b.yearMonth ? -1 : 1));

  return areaChartData;
}
