import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.number().min(0, "Số tiền không hợp lệ"),
  currency: z.string().min(1, "Vui lòng chọn loại tiền tệ"),
  description: z.string().min(1, "Nội dung không được để trống"),
  paidBy: z.string().min(1, "Vui lòng chọn người chi tiêu"),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
