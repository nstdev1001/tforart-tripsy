import CountUp from "react-countup";
import { useCurrency } from "../hooks";

export const CurrencyCounter = ({
  amount,
  currency = "VND",
  duration = 1.5,
}: {
  amount: number;
  currency?: string;
  duration?: number;
}) => {
  const { formatCurrency } = useCurrency();

  const formatCurrencyValue = (value: number): string => {
    return formatCurrency(value, currency);
  };

  return (
    <CountUp
      start={0}
      end={amount}
      duration={duration}
      preserveValue
      formattingFn={formatCurrencyValue}
    />
  );
};
