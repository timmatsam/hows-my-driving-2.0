import { ViolationDetailsTable } from "@/components/ViolationDetailsTable";
import { buildStreetLookup } from "@/utils/getLookupTable";
import { type PathParams } from "@/utils/getLookupTable";
import { getViolations } from "@/utils/getViolations";
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

  const violationsMatchedByPlateAndState = (await getViolations()).find(
    (violation) => violation.plate === plate && violation.state === state,
  );

  const lookup = await buildStreetLookup({
    plate,
    state,
  });
  const violationLocationDetails =
    violationsMatchedByPlateAndState?.individual_violations.map((violation) => {
      const locationDetails = lookup[violation.summons_number];

      return { ...violation, ...locationDetails };
    });

  if (!violationLocationDetails)
    return (
      <div>
        No violations found for plate: {plate} in {state}
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Fines for {plate} in {state}: {violationLocationDetails.length} details
        found
      </h1>
      <ViolationDetailsTable year={"2023"} details={violationLocationDetails} />
    </div>
  );
}
