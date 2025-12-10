import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronLeft, ClipboardList, Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { AddParticipantModal } from "../components/AddParticipantModal";
import { ParticipantCard } from "../components/ParticipantCard";
import { ShareTripModal } from "../components/ShareTripModal";
import { TripMenu } from "../components/TripMenu";
import { TripSummaryModal } from "../components/TripSummaryModal";
import { useAuth } from "../hooks/auth";
import { useCurrency } from "../hooks/useCurrency";
import { useDeleteExpense, useExpenses } from "../hooks/useExpense";
import {
  useDeleteTrip,
  useRemoveParticipant,
  useTrip,
} from "../hooks/useTrips";
import type { Expense } from "../types/trip";

const TripPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: trip, isLoading: tripLoading } = useTrip(tripId);
  const { data: expenses, isLoading: expensesLoading } = useExpenses(tripId);
  const deleteExpense = useDeleteExpense();
  const deleteTrip = useDeleteTrip();
  const deleteParticipant = useRemoveParticipant();
  const { formatCurrency } = useCurrency();

  const [expenseModalOpened, setExpenseModalOpened] = useState(false);
  const [participantModalOpened, setParticipantModalOpened] = useState(false);
  const [shareModalOpened, setShareModalOpened] = useState(false);
  const [summaryModalOpened, setSummaryModalOpened] = useState(false);
  const [expandedParticipant, setExpandedParticipant] = useState<string | null>(
    null
  );

  const handleToggleExpenseDetail = (participantId: string) => {
    setExpandedParticipant((prev) =>
      prev === participantId ? null : participantId
    );
  };

  const getParticipantExpenses = (participantId: string) => {
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

  if (tripLoading || expensesLoading) {
    return (
      <div className="min-h-screen">
        <Container size="sm" className="py-8">
          <Center>
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text c="dimmed">Đang tải thông tin chuyến đi...</Text>
            </Stack>
          </Center>
        </Container>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen">
        <Container size="sm" className="py-8">
          <Paper shadow="md" radius="lg" p="xl" className="text-center">
            <Stack align="center" gap="md">
              <Text size="xl">😢</Text>
              <Title order={3}>Không tìm thấy chuyến đi</Title>
              <Button onClick={() => navigate("/")}>Quay về trang chủ</Button>
            </Stack>
          </Paper>
        </Container>
      </div>
    );
  }

  const totalExpense = trip.totalExpense || 0;
  const maxSpent = Math.max(
    ...(trip.participants?.map((p) => p.totalSpent) || [1])
  );
  const isEnded = trip.isEnded || false;

  return (
    <div className="min-h-screen pb-8">
      <div
        className={`pb-16 pt-4 rounded-b-4xl ${
          isEnded
            ? "bg-linear-to-br from-gray-400 via-gray-500 to-gray-600"
            : "bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600"
        }`}
      >
        <Container size="sm">
          <Stack gap="md">
            {/* Navigation */}
            <Group justify="space-between">
              <ActionIcon
                variant="transparent"
                c="white"
                size="lg"
                onClick={() => navigate("/")}
              >
                <ChevronLeft size={24} />
              </ActionIcon>
              <TripMenu
                tripName={trip.name}
                isEnded={isEnded}
                variant="page"
                onShare={() => setShareModalOpened(true)}
                onAddParticipant={() => setParticipantModalOpened(true)}
                onDelete={handleDeleteTrip}
              />
            </Group>

            {/* Trip Name */}
            <Group gap="xs">
              <Title order={2} className="text-white">
                {trip.name}
              </Title>
              {isEnded && (
                <Badge color="dark" variant="filled" size="sm">
                  Đã kết thúc
                </Badge>
              )}
            </Group>
          </Stack>
        </Container>
      </div>

      <Container size="sm" className="-mt-12">
        <Card shadow="xl" radius="xl" p="lg" className="bg-white">
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Text size="sm" c="dimmed">
                Tổng chi tiêu
              </Text>
              <Title
                order={1}
                className={`text-transparent bg-clip-text ${
                  isEnded
                    ? "bg-linear-to-r from-gray-500 to-gray-600"
                    : "bg-linear-to-r from-blue-600 to-indigo-600"
                }`}
              >
                {formatCurrency(totalExpense)}
              </Title>
              <Text size="xs" c="dimmed">
                {format(trip.startDate, "dd/MM/yyyy", { locale: vi })}
                {trip.endDate && (
                  <> - {format(trip.endDate, "dd/MM/yyyy", { locale: vi })}</>
                )}
              </Text>
              <Button
                variant="light"
                size="xs"
                radius="xl"
                leftSection={<ClipboardList size={14} />}
                className="mt-2"
                onClick={() => setSummaryModalOpened(true)}
              >
                Tổng kết chuyến đi
              </Button>
            </Stack>
            {!isEnded && (
              <ActionIcon
                size={56}
                radius="xl"
                className="bg-linear-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all"
                onClick={() => setExpenseModalOpened(true)}
              >
                <Plus size={28} className="text-white" />
              </ActionIcon>
            )}
          </Group>
        </Card>
      </Container>

      {/* Content Section */}
      <Container size="sm" className="mt-6">
        <Stack gap="md">
          {/* Participants List */}
          {trip.participants?.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              expenses={getParticipantExpenses(participant.id)}
              maxSpent={maxSpent}
              isExpanded={expandedParticipant === participant.id}
              currentUserId={user?.uid}
              isEndTrip={isEnded}
              onToggle={() => handleToggleExpenseDetail(participant.id)}
              onDeleteExpense={handleDeleteExpense}
              onDeleteParticipant={handleDeleteParticipant}
            />
          ))}

          {/* Add Participant Button */}
          {!isEnded && (
            <Button
              variant="subtle"
              leftSection={<UserPlus size={18} />}
              onClick={() => setParticipantModalOpened(true)}
              className="text-gray-600"
            >
              Thêm thành viên
            </Button>
          )}
        </Stack>
      </Container>

      {/* Modals */}
      <AddExpenseModal
        opened={expenseModalOpened}
        onClose={() => setExpenseModalOpened(false)}
        tripId={tripId || ""}
        participants={trip.participants || []}
      />

      <AddParticipantModal
        opened={participantModalOpened}
        onClose={() => setParticipantModalOpened(false)}
        tripId={tripId || ""}
      />

      <ShareTripModal
        opened={shareModalOpened}
        onClose={() => setShareModalOpened(false)}
        tripId={tripId || ""}
        tripName={trip?.name || ""}
      />

      <TripSummaryModal
        opened={summaryModalOpened}
        onClose={() => setSummaryModalOpened(false)}
        tripId={tripId || ""}
        participants={trip.participants || []}
        totalExpense={totalExpense}
        isEnded={isEnded}
      />
    </div>
  );
};

export default TripPage;
