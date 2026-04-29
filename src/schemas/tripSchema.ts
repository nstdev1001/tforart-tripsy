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

export const tripSchema = z.object({
  name: z.string().min(1, "Tên chuyến đi không được để trống"),
  category: z.enum(tripCategoryValues, {
    error: "Vui lòng chọn phân loại",
  }),
  startDate: z.coerce.date().refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    {
      message: "Ngày bắt đầu phải từ hôm nay trở đi",
    },
  ),
});

export type TripFormValues = z.infer<typeof tripSchema>;
