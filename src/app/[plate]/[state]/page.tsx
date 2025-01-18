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
    <div>
      <h1 className="text-2xl font-bold">
        Fines for {plate} in {state}: {violationDetails.length} details found
      </h1>
      <ViolationDetailsTable year={"2023"} details={violationDetails} />
    </div>
  );
}
