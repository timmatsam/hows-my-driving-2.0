import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type GetViolationsResponse } from "@/utils/getViolations";
import { Skeleton } from "@/components/ui/skeleton";

interface ViolationCardProps {
  violation: GetViolationsResponse;
}

export function ViolationCard({
  violation,
  className,
}: ViolationCardProps & { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg md:text-xl">
          <span>{violation.plate}</span>
          <span className="text-sm font-normal">{violation.state}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">Total Amount Owed</p>
          <p
            className={cn(
              "text-2xl font-bold",
              getAmountOwedColorClass(violation.total_owed),
            )}
          >
            ${violation.total_owed.toLocaleString("en-US")}
          </p>
          <p className="text-sm text-muted-foreground">Total Amount Paid</p>
          <p className="text-xl">
            ${violation.total_paid.toLocaleString("en-US")}
          </p>
          <p className="text-sm text-muted-foreground">Number of Violations</p>
          <p className="text-xl">{violation.total_violations}</p>
          <p className="text-sm text-muted-foreground">Last Violation Date</p>
          <p className="text-xl">{formatDate(violation.last_violation_date)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ViolationCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg md:text-xl">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-12" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">Total Amount Owed</p>
          <Skeleton className="h-8 w-32" />
          <p className="text-sm text-muted-foreground">Total Amount Paid</p>
          <Skeleton className="h-7 w-32" />
          <p className="text-sm text-muted-foreground">Number of Violations</p>
          <Skeleton className="h-7 w-16" />
          <p className="text-sm text-muted-foreground">Last Violation Date</p>
          <Skeleton className="h-7 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Determine the color based on the amount owed
const getAmountOwedColorClass = (amountOwed: number) => {
  if (amountOwed <= 0) return "text-green-600";
  if (amountOwed < 350) return "text-amber-500";
  return "text-red-600";
};
