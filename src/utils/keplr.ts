import { GeneratedType, OfflineSigner, Registry } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import type { Window as KeplrWindow } from "@keplr-wallet/types";
import { MsgDepositForBurn } from "./tx";
import { addressToBytes } from "./utils";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

const RPC = "https://rpc.testnet.noble.strange.love";

export async function getBalanceUSDC(
  wallet: OfflineSigner | undefined,
  address: string
) {
  if (!wallet || !wallet) {
    return "0";
  }
  const client = await SigningStargateClient.connectWithSigner(RPC, wallet);

  const balances = await client.getAllBalances(address);
  const usdc = balances.find((balance) => balance.denom === "uusdc");
  return usdc?.amount ?? "0";
}

const cctpTypes: ReadonlyArray<[string, GeneratedType]> = [
  ["/circle.cctp.v1.MsgDepositForBurn", MsgDepositForBurn],
];

function createDefaultRegistry(): Registry {
  return new Registry(cctpTypes);
}

export async function burnUSDC(wallet: OfflineSigner, amount: number, addressRecipient: string) {
  const client = await SigningStargateClient.connectWithSigner(RPC, wallet, {
    registry: createDefaultRegistry(),
  });
  const [account] = await wallet.getAccounts();

  const mintRecipientBytes = addressToBytes(addressRecipient)

  const msg = {
    typeUrl: "/circle.cctp.v1.MsgDepositForBurn",
    value: {
      from: account.address,
      amount: convertUSDCtoUUSDC(amount),
      destinationDomain: 0,
      mintRecipient: mintRecipientBytes,
      burnToken: "uusdc",
    },
  };

  const fee = {
    amount: [
      {
        denom: "uusdc",
        amount: "0",
      },
    ],
    gas: "200000",
  };
  const memo = "";
  const result = await client.signAndBroadcast(
    account.address,
    [msg],
    fee,
    memo
  );

  console.log(
    `Burned on Noble: https://mintscan.io/noble-testnet/tx/${result.transactionHash}`
  );
}

export function convertUSDCtoUUSDC(amount: number): string {
  return (amount * 1000000).toString();
}

export function convertUUSDCtoUSDC(amount: number): string {
  return ((amount / 1000000).toFixed(2)).toString();
}
