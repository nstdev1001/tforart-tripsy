import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Menu,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ChevronLeft,
  MoreVertical,
  Plus,
  Share2,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { AddParticipantModal } from "../components/AddParticipantModal";
import { ParticipantCard } from "../components/ParticipantCard";
import { ShareTripModal } from "../components/ShareTripModal";
import { useCurrency } from "../hooks/useCurrency";
import {
  useDeleteTrip,
  useRemoveParticipant,
  useTrip,
} from "../hooks/useTrips";
import type { Expense } from "../types/trip";
import { useDeleteExpense, useExpenses } from "../hooks/useExpense";
import { useAuth } from "../hooks/auth";

const TripPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
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
    modals.openConfirmModal({
      title: "Xóa chuyến đi",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa chuyến đi "{trip?.name}"? Tất cả dữ liệu sẽ
          bị mất.
        </Text>
      ),
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (tripId) {
          deleteTrip.mutate(tripId, {
            onSuccess: () => navigate("/"),
          });
        }
      },
    });
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

  return (
    <div className="min-h-screen pb-8">
      {/* Header Section với background xanh */}
      <div className="bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600 pb-16 pt-4 rounded-b-4xl">
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
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon
                    variant="transparent"
                    c="white"
                    size="lg"
                    className="text-white hover:bg-white/20"
                  >
                    <MoreVertical size={24} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<Share2 size={16} />}
                    onClick={() => setShareModalOpened(true)}
                  >
                    Chia sẻ
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<UserPlus size={16} />}
                    onClick={() => setParticipantModalOpened(true)}
                  >
                    Thêm thành viên
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<Trash2 size={16} />}
                    onClick={handleDeleteTrip}
                  >
                    Xóa chuyến đi
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            {/* Trip Name */}
            <Title order={2} className="text-white">
              {trip.name}
            </Title>
          </Stack>
        </Container>
      </div>

      <Container size="sm" className="-mt-12">
        <Card shadow="xl" radius="xl" p="lg" className="bg-white">
          <Group justify="space-between" align="center">
            <Stack gap={4}>
              <Text size="sm" c="dimmed">
                Tổng chi tiêu
              </Text>
              <Title
                order={1}
                className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600"
              >
                {formatCurrency(totalExpense)}
              </Title>
              <Text size="xs" c="dimmed">
                {format(trip.startDate, "dd/MM/yyyy", { locale: vi })}
              </Text>
            </Stack>
            <ActionIcon
              size={56}
              radius="xl"
              className="bg-linear-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all"
              onClick={() => setExpenseModalOpened(true)}
            >
              <Plus size={28} className="text-white" />
            </ActionIcon>
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
              onToggle={() => handleToggleExpenseDetail(participant.id)}
              onDeleteExpense={handleDeleteExpense}
              onDeleteParticipant={handleDeleteParticipant}
            />
          ))}

          {/* Add Participant Button */}
          <Button
            variant="subtle"
            leftSection={<UserPlus size={18} />}
            onClick={() => setParticipantModalOpened(true)}
            className="text-gray-600"
          >
            Thêm thành viên
          </Button>
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
    </div>
  );
};

export default TripPage;
