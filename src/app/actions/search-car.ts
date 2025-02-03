"use server";

import type * as z from "zod";
import { type AggregateViolationByPlate } from "@/types/violations";
import { carSearchSchema } from "@/components/search-form/schema";
import { env } from "process";

const DATASET_ID = "nc67-uf89";
export type Violation = Omit<
  AggregateViolationByPlate,
  "individual_violations"
>;

export async function searchCar(
  values: z.infer<typeof carSearchSchema>,
): Promise<{ violation: Violation | null; error: string | null }> {
  const validatedFields = carSearchSchema.safeParse({
    state: values.state,
    plate: values.plate,
  });

  if (!validatedFields.success) {
    return {
      violation: null,
      error: "Something went wrong on our end. Please try again.",
    };
  }

  const { state, plate } = validatedFields.data;
  const query = new URLSearchParams({
    $select: `
        COUNT(*) as total_violations,
        SUM(fine_amount) as total_fines,
        MAX(issue_date) as last_violation_date
      `
      .trim()
      .replace(/\s+/g, " "),
    $where: `plate = '${plate}' AND state = '${state}'`,
    $$app_token: env.NYC_OPEN_DATA_APP_TOKEN ?? "",
  });

  try {
    const response = await fetch(
      `https://data.cityofnewyork.us/resource/${DATASET_ID}.json?${query}`,
    );
    const data = (await response.json()) as Array<{
      total_violations: string;
      total_fines: string;
      last_violation_date: string;
    }>;

    const firstResult = data[0];
    if (!firstResult || Number(firstResult.total_violations) === 0) {
      return { violation: null, error: "No violations found for this vehicle" };
    }

    // Convert string values to numbers as per our type definition
    return {
      violation: {
        plate,
        state,
        total_violations: Number(firstResult.total_violations),
        total_fines: Number(firstResult.total_fines),
        last_violation_date: firstResult.last_violation_date,
      },
      error: null,
    };
  } catch {
    return { violation: null, error: "Error fetching violation data" };
  }
}
