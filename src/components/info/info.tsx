import SpinLoading from "../spin-loading/spin-loading";

type InfoProps = {
  currency: Currency;
  value: string;
  address: string;
};

export enum Currency {
  ETH = "ETH",
  USDC = "USDC",
}

export default function Info({ currency, value, address }: InfoProps) {
  if (!address) {
    return;
  }
  return (
    <div className="flex justify-between text-sm font-medium text-gray-900 mb-1">
      <div>{address}</div>
      {value ? (
        <div>
          {value} {currency}
        </div>
      ) : (
        <SpinLoading />
      )}
    </div>
  );
}
