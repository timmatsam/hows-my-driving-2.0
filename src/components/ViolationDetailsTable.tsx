import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ParkingViolation,
  type ParkingViolationLocation,
} from "@/types/violations";

type ViolationDetailsTableProps = {
  year: string;
  details: Array<ParkingViolationLocation & ParkingViolation>;
};

export function ViolationDetailsTable({
  year,
  details,
}: ViolationDetailsTableProps) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={3} className="text-center text-lg font-bold">
              Fines for {year}
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="w-[150px]">Fine Amount</TableHead>
            <TableHead>Street</TableHead>
            <TableHead className="w-[150px]">Date Issued</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.map((detail) => (
            <TableRow key={detail.summons_number}>
              <TableCell className="font-medium">
                ${detail.fine_amount.toLocaleString("en-US")}
              </TableCell>
              <TableCell>{detail.street_name}</TableCell>
              <TableCell>
                {new Date(detail.issue_date).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
