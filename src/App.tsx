import { useState } from "react";
import "./App.css";
import Burn from "./components/burn/burn";
import Mint from "./components/mint/mint";
import { ITxBurn } from "./utils/types";

function App() {
  const [txBurn, setTxBurn] = useState<ITxBurn>();

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
        <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">
          Bridge USDC from Noble to Ethereum
        </h2>
        <div className="flex mt-10">
          <Burn txBurnDone={setTxBurn}/>
          <Mint txBurn={txBurn}/>
        </div>
      </div>
    </>
  );
}

export default App;
