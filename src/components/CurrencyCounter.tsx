import { memo, useState } from "react";
import CountUp from "react-countup";
import { useCurrency } from "../hooks";

interface CurrencyCounterProps {
  amount: number;
  currency?: string;
  duration?: number;
}

const CurrencyCounterComponent = ({
  amount,
  currency = "VND",
  duration = 1,
}: CurrencyCounterProps) => {
  const { formatCurrency } = useCurrency();
  const [prevAmount, setPrevAmount] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(amount);

  if (amount !== currentAmount) {
    setPrevAmount(currentAmount);
    setCurrentAmount(amount);
  }

  const formatCurrencyValue = (value: number): string => {
    return formatCurrency(value, currency);
  };

  return (
    <CountUp
      start={prevAmount}
      end={amount}
      duration={duration}
      formattingFn={formatCurrencyValue}
    />
  );
};

export const CurrencyCounter = memo(CurrencyCounterComponent);
