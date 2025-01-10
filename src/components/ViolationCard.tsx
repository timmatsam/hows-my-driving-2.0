import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Violation } from "@/types/violations";

export function ViolationCard({ violation }: { violation: Violation }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg md:text-xl">
          <span>{violation.plate}</span>
          <span className="text-sm font-normal">{violation.state}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">Total Amount Owed</p>
          <p className="text-2xl font-bold">
            ${Number(violation.total_fines).toFixed(2)}
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
