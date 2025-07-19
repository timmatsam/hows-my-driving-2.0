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
          <div className="overflow-x-auto">
            <Table className="border-separate border-spacing-0">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 z-10 border-b border-border bg-muted/50 py-3.5 pl-4 pr-3 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                  Fine Amount
                </TableHead>
                <TableHead className="sticky top-0 z-10 border-b border-border bg-muted/50 px-3 py-3.5 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:table-cell">
                  Street
                </TableHead>
                <TableHead className="sticky top-0 z-10 border-b border-border bg-muted/50 px-3 py-3.5 text-left text-sm font-semibold backdrop-blur backdrop-filter">
                  Date Issued
                </TableHead>
                <TableHead className="sticky top-0 z-10 border-b border-border bg-muted/50 px-3 py-3.5 text-left text-sm font-semibold backdrop-blur backdrop-filter">
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
                      "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                    )}
                  >
                    {new Date(detail.issue_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    className={cn(
                      idx !== details.length - 1
                        ? "border-b border-border"
                        : "",
                      "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
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
    </div>
  );
}

const formatLocation = ({
  house_number,
  street_name,
  intersecting_street,
}: Omit<ParkingViolationLocation, "summons_number">) => {
  if (!street_name) return "Location not specified";

  // Clean up the street name and intersecting street
  const cleanStreetName = street_name.replace(/\s*@\s*Un\s*$/, "");
  const cleanIntersectingStreet = intersecting_street?.replace(/^\s*@\s*/, "");

  // Create a formatted address for display
  let displayAddress = "";

  // Add house number if it exists
  if (house_number) {
    displayAddress += `${house_number} `;
  }

  // Add street name
  displayAddress += cleanStreetName;

  // Add intersecting street if it exists
  if (cleanIntersectingStreet && !house_number) {
    displayAddress += ` & ${cleanIntersectingStreet}`;
  }

  // Generate Google Maps link
  const mapsLink = getGoogleMapsLink(
    cleanStreetName,
    house_number,
    cleanIntersectingStreet,
  );

  // Return JSX with link
  return (
    <a
      href={mapsLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
      title="View on Google Maps"
    >
      {displayAddress}
    </a>
  );
};

const getGoogleMapsLink = (
  street_name?: string,
  house_number?: string,
  intersecting_street?: string,
) => {
  if (!street_name) return "#";

  let address = "";

  // If we have a house number, create address with house number
  if (house_number) {
    address = `${house_number} ${street_name}, New York, NY`;
  }
  // Otherwise if we have an intersecting street, create intersection address
  else if (intersecting_street) {
    address = `${street_name} and ${intersecting_street}, New York, NY`;
  }
  // Fall back to just the street name
  else {
    address = `${street_name}, New York, NY`;
  }

  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};

//streetname: NB WEBSTER AVE @ E 1 intersection: at 88TH ST	