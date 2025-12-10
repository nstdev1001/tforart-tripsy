import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Expense } from "../types/trip";
import { useCurrency } from "./useCurrency";
import { useDeleteExpense, useExpenses } from "./useExpense";
import { useDeleteTrip, useRemoveParticipant } from "./useTrips";

export const useTripActions = (tripId?: string) => {
  const navigate = useNavigate();
  const { data: expenses } = useExpenses(tripId);
  const deleteExpense = useDeleteExpense();
  const deleteTrip = useDeleteTrip();
  const deleteParticipant = useRemoveParticipant();
  const { formatCurrency } = useCurrency();

  const [expandedParticipant, setExpandedParticipant] = useState<string | null>(
    null
  );

  const handleToggleExpenseDetail = (participantId: string) => {
    setExpandedParticipant((prev) =>
      prev === participantId ? null : participantId
    );
  };

  const getParticipantExpenses = (participantId: string): Expense[] => {
    return (
      expenses?.filter((expense) => expense.paidBy === participantId) || []
    );
  };

  const handleDeleteExpense = (expense: Expense) => {
    modals.openConfirmModal({
      title: "Xóa chi tiêu",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa chi tiêu "{expense.description}" (
          {formatCurrency(expense.amount)})?
        </Text>
      ),
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (expense.id && tripId) {
          deleteExpense.mutate({
            expenseId: expense.id,
            tripId,
            amount: expense.amount,
            paidBy: expense.paidBy,
          });
        }
      },
    });
  };

  const handleDeleteParticipant = (participantId: string) => {
    modals.openConfirmModal({
      title: "Xóa thành viên",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa thành viên này? Tất cả chi tiêu liên quan sẽ
          bị mất.
        </Text>
      ),
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (tripId) {
          deleteParticipant.mutate({ tripId, participantId });
        }
      },
    });
  };

  const handleDeleteTrip = () => {
    if (tripId) {
      deleteTrip.mutate(tripId, {
        onSuccess: () => navigate("/"),
      });
    }
  };

  return {
    expandedParticipant,
    handleToggleExpenseDetail,
    getParticipantExpenses,
    handleDeleteExpense,
    handleDeleteParticipant,
    handleDeleteTrip,
  };
};
