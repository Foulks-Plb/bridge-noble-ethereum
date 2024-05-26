import { Contract, Signer } from "ethers";
import MessageTransmitterABI from "../assets/abis/MessageTransmitter.json";

export async function mintReceiveMessage(message: Buffer, attestation: string, signer: Signer) {
  const contract = new Contract("0x7865fAfC2db2093669d92c0F33AeEF291086BEFD", MessageTransmitterABI, signer);
  await contract.receiveMessage(message, attestation);
}
