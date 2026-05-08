import { z } from "zod";

export const tripCategoryValues = [
  "Du lịch",
  "Ăn uống",
  "Công việc",
  "Khác",
] as const;

export const tripCategoryOptions = tripCategoryValues.map((value) => ({
  value,
  label: value,
}));

export const currencyOptions = [
  { value: "VND", label: "VND (₫) - Việt Nam" },
  { value: "JPY", label: "JPY (¥) - Nhật Bản" },
  { value: "KRW", label: "KRW (₩) - Hàn Quốc" },
  { value: "CNY", label: "CNY (¥) - Trung Quốc" },
  { value: "TWD", label: "TWD (NT$) - Đài Loan" },
  { value: "THB", label: "THB (฿) - Thái Lan" },
  { value: "SGD", label: "SGD (S$) - Singapore" },
  { value: "GBP", label: "GBP (£) - Anh" },
  { value: "EUR", label: "EUR (€) - Pháp/Châu Âu" },
  { value: "USD", label: "USD ($) - Mỹ" },
  { value: "RUB", label: "RUB (₽) - Nga" },
] as const;

const currencyValues = [
  "VND",
  "JPY",
  "KRW",
  "CNY",
  "TWD",
  "THB",
  "SGD",
  "GBP",
  "EUR",
  "USD",
  "RUB",
] as const;

export const tripSchema = z.object({
  name: z
    .string()
    .min(1, "Tên hoạt động không được để trống")
    .max(100, "Tên hoạt động không được quá 100 ký tự"),
  category: z.enum(tripCategoryValues, {
    error: "Vui lòng chọn phân loại",
  }),
  mainCurrency: z
    .enum(currencyValues, {
      error: "Vui lòng chọn loại tiền tệ",
    })
    .default("VND"),
  startDate: z.coerce.date(),
});

export type TripFormValues = z.infer<typeof tripSchema>;
