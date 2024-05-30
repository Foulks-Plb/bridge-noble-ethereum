import { Contract, Signer, TransactionResponse } from "ethers";
import MessageTransmitterABI from "../assets/abis/MessageTransmitter.json";

export async function mintReceiveMessage(message: Buffer, attestation: string, signer: Signer): Promise<void> {
  try {
    const contract = new Contract("0x7865fAfC2db2093669d92c0F33AeEF291086BEFD", MessageTransmitterABI, signer);
    const tx: TransactionResponse = await contract.receiveMessage(message, attestation);
    await tx.wait();
  } catch (error) {
    console.error(error);
    throw error; 
  }
}