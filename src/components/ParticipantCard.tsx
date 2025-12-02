import {
  ActionIcon,
  Avatar,
  Collapse,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import type { Expense, Participant } from "../types/trip";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

interface ParticipantCardProps {
  participant: Participant;
  expenses: Expense[];
  maxSpent: number;
  isExpanded: boolean;
  onToggle: () => void;
  onDeleteExpense: (expense: Expense) => void;
}

export const ParticipantCard = ({
  participant,
  expenses,
  maxSpent,
  isExpanded,
  onToggle,
  onDeleteExpense,
}: ParticipantCardProps) => {
  return (
    <Paper
      radius="md"
      p="md"
      shadow="md"
      withBorder
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300"
      onClick={onToggle}
    >
      <Group justify="space-between" mb="xs">
        <Group>
          {participant.photoURL ? (
            <Avatar src={participant.photoURL} size="md" radius="xl" />
          ) : (
            <Avatar size="md" radius="xl" color="blue">
              {participant.name.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <div>
            <Text fw={500}>{participant.name}</Text>
            <Text size="sm" c="dimmed">
              {formatCurrency(participant.totalSpent)}
            </Text>
          </div>
        </Group>
        <ActionIcon variant="subtle" color="gray">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </ActionIcon>
      </Group>

      <Progress
        value={maxSpent > 0 ? (participant.totalSpent / maxSpent) * 100 : 0}
        color="blue"
        size="sm"
        radius="xl"
      />

      {/* Collapse chi tiết chi tiêu */}
      <Collapse in={isExpanded} transitionDuration={200}>
        {expenses.length > 0 ? (
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
                  <div>
                    <Text size="sm" fw={500}>
                      {expense.description}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {format(expense.createdAt, "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </Text>
                  </div>
                  <Group gap="xs">
                    <Text size="sm" fw={600} c="green">
                      {formatCurrency(expense.amount)}
                    </Text>
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
                        <Trash2 size={14} />
                      </ActionIcon>
                    </Tooltip>
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
    </Paper>
  );
};
