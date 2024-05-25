import { OfflineSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import type { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

const RPC = "https://rpc.testnet.noble.strange.love";

export async function getBalanceUSDC(wallet: OfflineSigner, address: string) {
  const client = await SigningStargateClient.connectWithSigner(
    RPC,
    wallet
  );

  const balances = await client.getAllBalances(address);
  const usdc = balances.find((balance) => balance.denom === "uusdc");
  return usdc?.amount ?? "0";
}
