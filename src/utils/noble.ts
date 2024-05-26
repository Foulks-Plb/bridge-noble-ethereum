import { GeneratedType, OfflineSigner, Registry } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import type { Window as KeplrWindow } from "@keplr-wallet/types";
import { MsgDepositForBurn, MsgDepositForBurnWithCaller } from "./tx";
import { addressToBytes } from "./utils";
import { ethers } from "ethers";
import { ITxBurn } from "./types";

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
  ["/circle.cctp.v1.MsgDepositForBurnWithCaller", MsgDepositForBurnWithCaller],
];

function createDefaultRegistry(): Registry {
  return new Registry(cctpTypes);
}

export async function burnUSDC(
  wallet: OfflineSigner,
  amount: number,
  addressRecipient: string
): Promise<ITxBurn> {
  const client = await SigningStargateClient.connectWithSigner(RPC, wallet, {
    registry: createDefaultRegistry(),
  });
  const [account] = await wallet.getAccounts();

  const mintRecipientBytes = addressToBytes(addressRecipient);

  const msg = {
    typeUrl: "/circle.cctp.v1.MsgDepositForBurnWithCaller",
    value: {
      from: account.address,
      amount: convertUSDCtoUUSDC(amount),
      destinationDomain: 0,
      mintRecipient: mintRecipientBytes,
      burnToken: "uusdc",
      destinationCaller: mintRecipientBytes,
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

  console.log(result);

  let message = result.events[19].attributes[0].value;
  message = message.replace(/"/g, "");
  const decodedData = Buffer.from(message, "base64");
  const hash = ethers.keccak256(decodedData);

  return {
    hash: result.transactionHash,
    message: message,
    messageHash: hash,
  };
}

export async function getAttestation(hash: string) {
  const start = Date.now();

  let attestationResponse: { status: string; attestation: string } = {
    status: "pending",
    attestation: "",
  };
  while (attestationResponse?.status !== "complete") {
    const response = await fetch(
      `https://iris-api-sandbox.circle.com/v1/attestations/${hash}`
    );
    attestationResponse = await response.json();

    const now = Date.now();
    if (now - start > 5 * 60 * 1000) {
      throw new Error("Timeout");
    }
    
    await new Promise((r) => setTimeout(r, 3000));
  }

  return attestationResponse;
}

export function convertUSDCtoUUSDC(amount: number): string {
  return (amount * 1000000).toString();
}

export function convertUUSDCtoUSDC(amount: number): string {
  return (amount / 1000000).toFixed(2).toString();
}
