import {
  ActionIcon,
  Collapse,
  Group,
  Loader,
  Paper,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import type { Expense } from "../../../types/trip";

interface ParticipantExpensesCollapseProps {
  isExpanded: boolean;
  isLoadingExpenses: boolean | undefined;
  expenses: Expense[];
  isEndTrip: boolean | undefined;
  onDeleteExpense: (expense: Expense) => void;
  deleteExpenseLoading: boolean;
  formatCurrency: (amount: number, currency?: string) => string;
}

export const ParticipantExpensesCollapse = ({
  isExpanded,
  isLoadingExpenses,
  expenses,
  isEndTrip,
  onDeleteExpense,
  deleteExpenseLoading,
  formatCurrency,
}: ParticipantExpensesCollapseProps) => {
  return (
    <Collapse in={isExpanded} transitionDuration={200}>
      {isLoadingExpenses ? (
        <Stack gap="xs" mt="md">
          <Skeleton height={16} width={120} radius="sm" />
          <Skeleton height={64} radius="md" />
          <Skeleton height={64} radius="md" />
        </Stack>
      ) : expenses.length > 0 ? (
        <Stack gap="xs" mt="md">
          <Text size="sm" fw={500} c="dimmed">
            Chi tiết ({expenses.length} khoản)
          </Text>
          {expenses.map((expense) => (
            <Paper
              key={expense.id}
              p="sm"
              radius="sm"
              className="bg-gray-50"
              onClick={(e) => e.stopPropagation()}
            >
              <Group justify="space-between">
                <div className="max-w-[150px] md:max-w-[400px]">
                  <Text size="sm" fw={500}>
                    {expense.description}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {format(expense.createdAt, "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                    <br />
                    {expense.addExpenseBy &&
                      expense.addExpenseBy !== expense.paidBy && (
                        <Text span c="dimmed">
                          Thêm bởi: {expense.addExpenseByName}
                        </Text>
                      )}
                  </Text>
                </div>
                <Group gap="xs">
                  <Stack gap={2} align="flex-end">
                    {expense.mainCurrency !== "VND" &&
                      typeof expense.originalAmount === "number" && (
                        <Text size="xs" c="dimmed">
                          {formatCurrency(
                            expense.originalAmount,
                            expense.mainCurrency,
                          )}
                        </Text>
                      )}
                    <Text size="sm" fw={600} c="green">
                      {formatCurrency(expense.amount)}
                    </Text>
                  </Stack>
                  {!isEndTrip && (
                    <Tooltip label="Xóa">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteExpense(expense);
                        }}
                      >
                        {deleteExpenseLoading ? (
                          <Loader size="xs" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Text size="sm" c="dimmed" ta="center" py="sm">
          Chưa có chi tiêu nào
        </Text>
      )}
    </Collapse>
  );
};
