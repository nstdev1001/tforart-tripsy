export const useCurrency = () => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatShortCurrency = (amount: number): string => {
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(1)}B`;
    }
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(0)}K`;
    }
    return `${amount}đ`;
  };

  const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/[^\d]/g, "");
    return parseInt(cleaned, 10) || 0;
  };

  const calculatePercentage = (amount: number, total: number): number => {
    if (total <= 0) return 0;
    return Math.round((amount / total) * 100);
  };

  const calculateAverage = (total: number, numberOfPeople: number): number => {
    if (numberOfPeople <= 0) return 0;
    return Math.round(total / numberOfPeople);
  };

  const calculateBalance = (spent: number, average: number): number => {
    return spent - average;
  };

  return {
    formatCurrency,
    formatShortCurrency,
    parseCurrency,
    calculatePercentage,
    calculateAverage,
    calculateBalance,
  };
};
