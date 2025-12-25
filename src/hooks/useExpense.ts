import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseService } from "../services";
import type { CreateExpenseData } from "../types/trip";

export const useExpenses = (tripId?: string) => {
  return useQuery({
    queryKey: ["expenses", tripId],
    queryFn: () => expenseService.getExpenses(tripId!),
    enabled: !!tripId,
  });
};

export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseData: CreateExpenseData) =>
      expenseService.addExpense(expenseData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trip", variables.tripId] });
      queryClient.invalidateQueries({
        queryKey: ["expenses", variables.tripId],
      });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
    onError: (error) => {
      notifications.show({
        title: "Lỗi",
        message: "Không thể thêm chi tiêu!",
        color: "red",
      });
      console.error("Error adding expense:", error);
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expenseId,
      tripId,
      amount,
      paidBy,
    }: {
      expenseId: string;
      tripId: string;
      amount: number;
      paidBy: string;
    }) => expenseService.deleteExpense(expenseId, tripId, amount, paidBy),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trip", variables.tripId] });
      queryClient.invalidateQueries({
        queryKey: ["expenses", variables.tripId],
      });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
    onError: (error) => {
      notifications.show({
        title: "Lỗi",
        message: "Không thể xóa chi tiêu!",
        color: "red",
      });
      console.error("Error deleting expense:", error);
    },
  });
};
