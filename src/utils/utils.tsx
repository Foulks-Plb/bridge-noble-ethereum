export function shortenString(str: string): string {
  if (str.length > 12) {
    return str.slice(0, 8) + "..." + str.slice(-4);
  } else {
    return str;
  }
}
