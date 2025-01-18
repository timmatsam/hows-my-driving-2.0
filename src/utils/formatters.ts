/**
 * Formats a string from uppercase with underscores to title case with spaces
 * Example: "MOBILE_BUS_LANE" => "Mobile Bus Lane"
 */
export const formatToTitleCase = (str: string): string => {
  return str
    .split(/[\s_]+/) // Split on spaces or underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
