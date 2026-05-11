import {
  ActionIcon,
  Avatar,
  Group,
  Paper,
  Progress,
  Text,
  Tooltip,
} from "@mantine/core";
import type { User } from "firebase/auth";
import { ChevronDown, ChevronUp, UserMinus } from "lucide-react";
import { ParticipantExpensesCollapse } from ".";
import { useCurrency, useVibrate } from "../../../hooks";
import type { Expense, Participant } from "../../../types/trip";

interface ParticipantCardProps {
  creatorId: string;
  participant: Participant;
  expenses: Expense[];
  mainCurrency: string;
  maxSpent: number;
  isExpanded: boolean;
  isLoadingExpenses?: boolean;
  currentUser?: User | undefined;
  isEndTrip?: boolean;
  onToggle: () => void;
  onDeleteExpense: (expense: Expense) => void;
  onDeleteParticipant: (participantId: string) => void;
  deleteExpenseLoading: boolean;
}

export const ParticipantCard = ({
  creatorId,
  participant,
  expenses,
  mainCurrency,
  maxSpent,
  isExpanded,
  isLoadingExpenses,
  currentUser,
  isEndTrip,
  onToggle,
  onDeleteExpense,
  onDeleteParticipant,
  deleteExpenseLoading,
}: ParticipantCardProps) => {
  const { vibrateShort } = useVibrate();
  const { formatCurrency } = useCurrency();
  const isCurrentUser = participant.userId === currentUser?.uid;
  const isCreator = creatorId === currentUser?.uid;
  const foreignCurrency = mainCurrency !== "VND" ? mainCurrency : undefined;

  return (
    <Paper
      radius="md"
      p="md"
      shadow="md"
      withBorder
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] hover:border-blue-300"
      onClick={() => {
        vibrateShort();
        onToggle();
      }}
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
            <Text fw={500}>
              {participant.name}
              {isCurrentUser && (
                <Text span size="xs" c="dimmed" ml={4}>
                  (Bạn)
                </Text>
              )}
            </Text>
            <Group gap={5} align="center">
              {participant.totalOriginalSpent &&
              participant.totalOriginalSpent > 0 &&
              foreignCurrency ? (
                <>
                  <Text span size="sm" c="orange" fw={600}>
                    {formatCurrency(
                      participant.totalOriginalSpent,
                      foreignCurrency,
                    )}
                  </Text>
                  <Text span fw={100} className="-translate-y-px" c="dimmed">
                    |
                  </Text>
                </>
              ) : null}
              <Text span size="sm" c="teal" fw={600}>
                {formatCurrency(participant.totalSpent)}
              </Text>
            </Group>
          </div>
        </Group>
        <Group gap="xs">
          {!isCurrentUser && !isEndTrip && isCreator && (
            <Tooltip label="Xóa thành viên">
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteParticipant(participant.id);
                }}
              >
                <UserMinus size={16} />
              </ActionIcon>
            </Tooltip>
          )}
          <ActionIcon variant="subtle" color="gray">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </ActionIcon>
        </Group>
      </Group>

      <Progress
        value={maxSpent > 0 ? (participant.totalSpent / maxSpent) * 100 : 0}
        color="blue"
        size="sm"
        radius="xl"
      />

      <ParticipantExpensesCollapse
        isExpanded={isExpanded}
        isLoadingExpenses={isLoadingExpenses}
        expenses={expenses}
        isEndTrip={isEndTrip}
        onDeleteExpense={onDeleteExpense}
        deleteExpenseLoading={deleteExpenseLoading}
        formatCurrency={formatCurrency}
      />
    </Paper>
  );
};
