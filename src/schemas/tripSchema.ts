import z from "zod";

export const tripSchema = z.object({
  name: z.string().min(1, "Tên chuyến đi không được để trống"),
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
    }
  ),
});
