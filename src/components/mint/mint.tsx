import { useEffect, useState } from "react";
import Info, { Currency } from "../info/info";
import { ethers } from "ethers";
import { shortenString } from "../../utils/utils";
import ButtonAction from "../button-action/button-action";
import { getAttestation } from "../../utils/noble";
import { ITxBurn } from "../../utils/types";
import SpinLoading from "../spin-loading/spin-loading";
import { mintReceiveMessage } from "../../utils/ethereum";

export default function Mint({ txBurn }: { txBurn: ITxBurn | undefined }) {
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");

  const [txHashBurn, setTxHashBurn] = useState<string>("");
  const [attestation, setAttestation] = useState<string>("");
  const [message, setMessage] = useState();

  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      getMetamaskAccount();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (txBurn) {
        setAttestation("");
        setIsSearching(true);
        setTxHashBurn(txBurn.hash);
        setMessage(txBurn.message);

        try {
          const attestationSearch = await getAttestation(txBurn.messageHash);
          setAttestation(attestationSearch.attestation);
        } catch (error) {
          console.error(error);
        }
        setIsSearching(false);
      }
    })();
  }, [txBurn]);

  async function toggleMetamask() {
    if (!address) {
      getMetamaskAccount();
    } else {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.destroy();
      setAddress("");
    }
  }

  async function getMetamaskAccount() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const _walletAddress = await signer.getAddress();
    await provider.send("wallet_switchEthereumChain", [
      { chainId: "0xaa36a7" },
    ]);
    setAddress(shortenString(_walletAddress));

    const balance = await provider.getBalance(_walletAddress);
    const convertedBalance = ethers.formatEther(balance);
    setBalance(convertedBalance);
  }

  async function mint(event: any) {
    event.preventDefault();
    const provider = new ethers.BrowserProvider(window.ethereum);
    await mintReceiveMessage(message, attestation, await provider.getSigner());
  }

  return (
    <>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Info currency={Currency.ETH} value={balance} address={address} />
        <div className="action">
          <div className="align-center">
            <div className="font-bold text-gray-90 mb-4">
              2. Mint USDC on Ethereum
            </div>
          </div>
          <form className="space-y-6" onSubmit={mint}>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Burn tx hash
              </label>
              <div className="mt-2">
                <input
                  value={txHashBurn}
                  onChange={(e) => setTxHashBurn(e.target.value)}
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="string"
                className="block text-sm font-medium text-gray-900"
              >
                Attestation hash - status
              </label>

              <div className="mt-2 flex items-center">
                {isSearching && <SpinLoading />}
                <input
                  value={attestation}
                  onChange={(e) => setTxHashBurn(e.target.value)}
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <ButtonAction active={!!address} title="Mint" />
            </div>
          </form>
        </div>
        <button
          className="mt-2 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={toggleMetamask}
        >
          {address ? "Disconnect Metamask" : "Connect Metamask"}
        </button>
      </div>
    </>
  );
}
