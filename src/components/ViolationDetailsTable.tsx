import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  type ParkingViolationLocation,
  type IndividualViolationDetails,
} from "@/types/violations";
import { formatToTitleCase } from "@/utils/formatters";

type ViolationDetailsTableProps = {
  details: Array<IndividualViolationDetails>;
};

export function ViolationDetailsTable({ details }: ViolationDetailsTableProps) {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <Table className="min-w-full border-separate border-spacing-0">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 z-10 border-b border-border bg-muted/50 py-3.5 pl-4 pr-3 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                  Fine Amount
                </TableHead>
                <TableHead className="sticky top-0 z-10 border-b border-border bg-muted/50 px-3 py-3.5 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:table-cell">
                  Street
                </TableHead>
                <TableHead className="sticky top-0 z-10 hidden border-b border-border bg-muted/50 px-3 py-3.5 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:table-cell">
                  Date Issued
                </TableHead>
                <TableHead className="sticky top-0 z-10 hidden border-b border-border bg-muted/50 px-3 py-3.5 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:table-cell">
                  Type of Violation
                </TableHead>
                <TableHead className="sticky top-0 z-10 border-b border-border bg-muted/50 px-3 py-3.5 text-left text-sm font-semibold backdrop-blur backdrop-filter">
                  Summons Number
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((detail, idx) => (
                <TableRow key={detail.summons_number}>
                  <TableCell
                    className={cn(
                      idx !== details.length - 1
                        ? "border-b border-border"
                        : "",
                      "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-normal text-gray-500 sm:pl-6 lg:pl-8",
                    )}
                  >
                    ${detail.fine_amount}
                  </TableCell>
                  <TableCell
                    className={cn(
                      idx !== details.length - 1
                        ? "border-b border-border"
                        : "",
                      "whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell",
                      !detail.street_name && "text-opacity-30",
                    )}
                  >
                    {formatLocation({
                      intersecting_street: detail.intersecting_street,
                      house_number: detail.house_number,
                      street_name: detail.street_name,
                    })}
                  </TableCell>
                  <TableCell
                    className={cn(
                      idx !== details.length - 1
                        ? "border-b border-border"
                        : "",
                      "hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell",
                    )}
                  >
                    {new Date(detail.issue_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    className={cn(
                      idx !== details.length - 1
                        ? "border-b border-border"
                        : "",
                      "hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell",
                    )}
                  >
                    {formatToTitleCase(detail.violation)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      idx !== details.length - 1
                        ? "border-b border-border"
                        : "",
                      "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                    )}
                  >
                    {detail.summons_number}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

const formatLocation = ({
  house_number,
  street_name,
  intersecting_street,
}: Omit<ParkingViolationLocation, "summons_number">) => {
  if (!street_name) return "Location not specified";

  let location = "";

  // Add house number if it exists
  if (house_number) {
    location += `${house_number} `;
  }

  // Handle street name, removing "@ Un" if present
  const cleanStreetName = street_name.replace(/\s*@\s*Un\s*$/, "");
  location += cleanStreetName;

  // Add intersection if it exists
  if (intersecting_street) {
    location += ` at ${intersecting_street}`;
  }

  return location;
};
