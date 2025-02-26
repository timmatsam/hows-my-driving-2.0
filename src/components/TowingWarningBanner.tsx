import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TowingWarningBannerProps {
  className?: string;
  searchPage?: boolean;
}

export function TowingWarningBanner({
  className,
  searchPage,
}: TowingWarningBannerProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
        className,
      )}
    >
      <div className="flex items-start">
        <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
        <div>
          <p className="font-medium">Towing Warning</p>
          <p className="mt-1 text-sm">
            As per NYC laws, vehicles that owe more than $350 in parking ticket
            or camera violations that are in judgment may be towed by a city
            marshal or sheriff after it has been booted. Vehicles can also be
            towed by the NYPD at any time if they are parked illegally or do not
            have valid registration or insurance.{" "}
            {searchPage
              ? "The following vehicle is in danger of being towed. "
              : `These vehicles have their "Total Amount Owed" highlighted in red. `}
            <Link
              href="https://www.nyc.gov/site/finance/vehicles/services-towed-vehicles-faq.page#:~:text=Your%20vehicle%20may%20be%20towed,have%20valid%20registration%20or%20insurance."
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-600 dark:hover:text-amber-300"
            >
              Source
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
