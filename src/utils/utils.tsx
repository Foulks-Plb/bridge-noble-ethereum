export function shortenString(str: string): string {
  if (str.length > 12) {
    return str.slice(0, 8) + "..." + str.slice(-4);
  } else {
    return str;
  }
}

export function addressToBytes(adrress: string): Uint8Array {
  const cleanedMintRecipient = adrress.replace(/^0x/, "");
  const zeroesNeeded = 64 - cleanedMintRecipient.length;
  const mintRecipient = "0".repeat(zeroesNeeded) + cleanedMintRecipient;
  const buffer = Buffer.from(mintRecipient, "hex");
  return new Uint8Array(buffer);
}
