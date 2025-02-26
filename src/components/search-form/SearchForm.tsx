"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { searchCar } from "@/app/actions/search-car";
import { carSearchSchema } from "@/components/search-form/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StateCombobox } from "@/components/search-form/StateCombobox";
import { type z } from "zod";
import {
  ViolationCard,
  ViolationCardSkeleton,
} from "@/components/ViolationCard";
import { type AggregateViolationByPlate } from "@/types/violations";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { TowingWarningBanner } from "../TowingWarningBanner";

type Violation = Omit<AggregateViolationByPlate, "individual_violations">;

export function SearchForm() {
  const [violation, setViolation] = useState<Violation | null>();
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const plateParam = searchParams.get("plate")?.toUpperCase();
  const stateParam = searchParams.get("state")?.toUpperCase();

  const form = useForm<z.infer<typeof carSearchSchema>>({
    resolver: zodResolver(carSearchSchema),
    defaultValues: {
      state: stateParam ?? "NY",
      plate: plateParam ?? "",
    },
    mode: "onTouched",
  });

  async function onSubmit(values: z.infer<typeof carSearchSchema>) {
    setPending(true);
    searchCar({
      plate: values.plate.toUpperCase(),
      state: values.state,
    })
      .then((result) => {
        if (!result.violation) {
          toast.error("No violations found for this vehicle");
          setViolation(null);
          return;
        }

        form.reset({ plate: "" });
        setViolation(result.violation);
        void router.push(
          `/dashboard/search?plate=${result.violation.plate}&state=${result.violation.state}`,
        );

        setPending(false);
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setPending(false);
      });
  }

  useEffect(() => {
    if (plateParam && stateParam) {
      void form.handleSubmit(onSubmit)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="mx-4 md:mx-10 md:mt-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-6 flex flex-col gap-y-8 md:block md:gap-y-1"
        >
          <div className="flex flex-col items-start gap-4 md:mb-6 md:flex-row">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="w-full md:max-h-[64px] md:w-1/4">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <StateCombobox
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plate"
              render={({ field }) => (
                <FormItem className="w-full md:max-h-[64px] md:w-1/4">
                  <FormLabel>License Plate</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter license plate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={!form.formState.isValid || pending}>
            {pending ? "Submitting..." : "Search"}
          </Button>
        </form>
      </Form>
      {pending && <ViolationCardSkeleton className="md:w-1/2" />}
      {violation && !pending && (
        <>
          {violation.total_owed > 350 && (
            <TowingWarningBanner className="mb-6" searchPage />
          )}
          <Link href={`/dashboard/${violation.plate}/${violation.state}`}>
            <ViolationCard
              violation={violation}
              className="hover:shadow-lg md:w-1/2"
            />
          </Link>
        </>
      )}
      {!violation && typeof violation !== "undefined" && !pending && (
        <p className="text-left text-sm text-gray-500">
          No violations found for this vehicle
        </p>
      )}
    </div>
  );
}
