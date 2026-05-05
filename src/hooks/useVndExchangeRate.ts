import { useEffect, useState } from "react";
import { exchangeRateService } from "../services";

export const useVndExchangeRate = (baseCurrency: string | undefined) => {
  const [vndRate, setVndRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadRate = async () => {
      if (!baseCurrency || baseCurrency === "VND") {
        if (isActive) {
          setVndRate(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);

      try {
        const conversion =
          await exchangeRateService.getLatestRates(baseCurrency);
        if (isActive) {
          setVndRate(conversion.conversion_rates["VND"] ?? null);
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
        if (isActive) {
          setVndRate(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadRate();

    return () => {
      isActive = false;
    };
  }, [baseCurrency]);

  return { vndRate, isLoading };
};
