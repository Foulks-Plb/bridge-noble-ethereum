type InfoProps = {
  currency: Currency;
  value: number;
  address: string;
};

export enum Currency {
  ETH = "ETH",
  USDC = "USDC",
}

export default function Info({ currency, value, address }: InfoProps) {
  return (
    <div className="flex justify-between text-sm font-medium text-gray-900 mb-1">
      <div>{address}</div>
      <div>
        {value} {currency}
      </div>
    </div>
  );
}
