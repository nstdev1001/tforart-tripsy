import { ActionIcon, Group, Paper, Text, Tooltip } from "@mantine/core";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { useVibrate } from "../hooks/useVibrate";
import type { Expense } from "../types/trip";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

interface ExpenseCardProps {
  expense: Expense;
  onDelete: (expense: Expense) => void;
}

export const ExpenseCard = ({ expense, onDelete }: ExpenseCardProps) => {
  const { vibrateShort } = useVibrate();
  return (
    <Paper
      radius="md"
      p="md"
      withBorder
      className="hover:shadow-md transition-shadow"
    >
      <Group justify="space-between">
        <div>
          <Text fw={500}>{expense.description}</Text>
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              {expense.paidByName}
            </Text>
            <Text size="xs" c="dimmed">
              •{" "}
              {format(expense.createdAt, "dd/MM/yyyy HH:mm", {
                locale: vi,
              })}
            </Text>
          </Group>
        </div>
        <Group gap="sm">
          <Text fw={600} c="green">
            {formatCurrency(expense.amount)}
          </Text>
          <Tooltip label="Xóa chi tiêu">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => {
                vibrateShort();
                onDelete(expense);
              }}
            >
              <Trash2 size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
};
