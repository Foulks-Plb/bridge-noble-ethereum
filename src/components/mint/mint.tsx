import Info, { Currency } from "../info/info";

export default function Mint() {
  return (
    <>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Info  currency={Currency.ETH} value={1} address="0x000"/>
        <div className="action">
          <div className="align-center">
            <div className="font-bold text-gray-90 mb-4">
              2. Mint USDC on Ethereum
            </div>
          </div>
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Burn tx hash
              </label>
              <div className="mt-2">
                <input
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
              <div className="mt-2">
                <input
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="mt-28 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Mint
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
