import { z } from "zod";
import { currencyValues } from "../config/currency";
export { currencyOptions } from "../config/currency";

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
