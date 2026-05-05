import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.coerce
    .number()
    .int("Số tiền phải là số nguyên")
    .min(1, "Số tiền phải lớn hơn 0")
    .max(1e9, "Số tiền quá lớn"),
  currency: z.string().min(1, "Vui lòng chọn loại tiền tệ"),
  description: z.string().min(1, "Nội dung không được để trống"),
  paidBy: z.string().min(1, "Vui lòng chọn người chi tiêu"),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
