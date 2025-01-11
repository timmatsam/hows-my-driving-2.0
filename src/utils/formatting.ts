export function addCommasToNumber(num: string): string {
  // Add commas every three digits from the end
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
