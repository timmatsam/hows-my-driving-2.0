import { ViolationDetailsTable } from "@/components/ViolationDetailsTable";
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
        <h1 className="text-base font-semibold text-gray-900">
          Violation Details
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of all individual violations for plate of {plate} in {state}.
        </p>
        <p className="mt-2 text-sm text-gray-700">
          {violationDetails.length} total violations have been found.
        </p>
      </div>
      <ViolationDetailsTable details={violationDetails} />
    </div>
  );
}
