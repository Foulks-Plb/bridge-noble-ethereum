import { Contract } from "ethers";
import MessageTransmitterABI from "../assets/abis/MessageTransmitter.json";

export async function mintReceiveMessage(message: any, attestation: string, provider: any) {
  console.log(message, attestation)
  const contract = new Contract("0x7865fAfC2db2093669d92c0F33AeEF291086BEFD", MessageTransmitterABI, provider);
  await contract.receiveMessage(message, attestation);
}
