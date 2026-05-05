const MIN_SUGGESTION_INPUT = 0;
const MAX_SUGGESTION_INPUT = 10000;

export const getAmountSuggestions = (
  amount: number | null | undefined,
): number[] => {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return [];
  }

  if (!Number.isInteger(amount)) {
    return [];
  }

  if (amount <= MIN_SUGGESTION_INPUT || amount >= MAX_SUGGESTION_INPUT) {
    return [];
  }

  const absolute = Math.abs(amount);
  const digits = absolute === 0 ? 1 : Math.floor(Math.log10(absolute)) + 1;
  const startPower = Math.max(0, 5 - digits);

  return [0, 1, 2].map((i) => amount * 10 ** (startPower + i));
};

export const formatSuggestedAmount = (value: number): string =>
  new Intl.NumberFormat("en-US").format(value);
