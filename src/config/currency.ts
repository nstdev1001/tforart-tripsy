export const currencyMeta = [
  { value: "VND", label: "VND (₫) - Việt Nam", locale: "vi-VN" },
  { value: "JPY", label: "JPY (¥) - Nhật Bản", locale: "ja-JP" },
  { value: "KRW", label: "KRW (₩) - Hàn Quốc", locale: "ko-KR" },
  { value: "CNY", label: "CNY (¥) - Trung Quốc", locale: "zh-CN" },
  { value: "TWD", label: "TWD (NT$) - Đài Loan", locale: "zh-TW" },
  { value: "THB", label: "THB (฿) - Thái Lan", locale: "th-TH" },
  { value: "SGD", label: "SGD (S$) - Singapore", locale: "en-SG" },
  { value: "GBP", label: "GBP (£) - Anh", locale: "en-GB" },
  { value: "EUR", label: "EUR (€) - Pháp/Châu Âu", locale: "fr-FR" },
  { value: "USD", label: "USD ($) - Mỹ", locale: "en-US" },
  { value: "RUB", label: "RUB (₽) - Nga", locale: "ru-RU" },
] as const;

export type CurrencyCode = (typeof currencyMeta)[number]["value"];

export const currencyOptions = currencyMeta.map(({ value, label }) => ({
  value,
  label,
}));

export const currencyValues = currencyMeta.map(
  (currency) => currency.value,
) as [CurrencyCode, ...CurrencyCode[]];

export const currencyLocaleMap = currencyMeta.reduce(
  (acc, { value, locale }) => {
    acc[value] = locale;
    return acc;
  },
  {} as Record<CurrencyCode, string>,
);
