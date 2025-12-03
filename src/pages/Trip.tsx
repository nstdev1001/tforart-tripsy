import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Menu,
  Paper,
  RingProgress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
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
import { ShareTripModal } from "../components/ShareTripModal";
import { useCurrency } from "../hooks/useCurrency";
import {
  useDeleteExpense,
  useDeleteTrip,
  useExpenses,
  useTrip,
} from "../hooks/useTrips";
import type { Expense } from "../types/trip";

// Màu sắc cho từng participant
const COLORS = [
  { bg: "bg-blue-100", ring: "blue", icon: "bg-blue-500" },
  { bg: "bg-orange-100", ring: "orange", icon: "bg-orange-500" },
  { bg: "bg-green-100", ring: "green", icon: "bg-green-500" },
  { bg: "bg-purple-100", ring: "violet", icon: "bg-purple-500" },
  { bg: "bg-pink-100", ring: "pink", icon: "bg-pink-500" },
  { bg: "bg-cyan-100", ring: "cyan", icon: "bg-cyan-500" },
  { bg: "bg-yellow-100", ring: "yellow", icon: "bg-yellow-500" },
  { bg: "bg-red-100", ring: "red", icon: "bg-red-500" },
];

const TripPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { data: trip, isLoading: tripLoading } = useTrip(tripId);
  const { data: expenses, isLoading: expensesLoading } = useExpenses(tripId);
  const deleteExpense = useDeleteExpense();
  const deleteTrip = useDeleteTrip();
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

  return (
    <div className="min-h-screen pb-8">
      <Container size="sm" className="py-4">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={24} />
            </ActionIcon>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="subtle" size="lg">
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
          <Title order={2} className="text-gray-800">
            {trip.name}
          </Title>

          {/* Total Card */}
          <Card
            shadow="xl"
            radius="xl"
            p="lg"
            className="bg-gradient-to-r from-blue-500 to-blue-600"
          >
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Text size="sm" className="text-blue-100">
                  Tổng chi tiêu
                </Text>
                <Title order={1} className="text-white">
                  {formatCurrency(totalExpense)}
                </Title>
                <Text size="xs" className="text-blue-200">
                  {format(trip.startDate, "dd/MM/yyyy", { locale: vi })}
                </Text>
              </Stack>
              <ActionIcon
                size={56}
                radius="xl"
                className="bg-white/20 hover:bg-white/30"
                onClick={() => setExpenseModalOpened(true)}
              >
                <Plus size={28} className="text-white" />
              </ActionIcon>
            </Group>
          </Card>

          {/* Participants List */}
          <Stack gap="md">
            {trip.participants?.map((participant, index) => {
              const colorSet = COLORS[index % COLORS.length];
              const participantExpenses = getParticipantExpenses(
                participant.id
              );
              const isExpanded = expandedParticipant === participant.id;
              const percentage =
                totalExpense > 0
                  ? Math.round((participant.totalSpent / totalExpense) * 100)
                  : 0;

              return (
                <Card
                  key={participant.id}
                  shadow="sm"
                  radius="lg"
                  p="md"
                  className={`${colorSet.bg} cursor-pointer transition-all duration-200 hover:shadow-md`}
                  onClick={() => handleToggleExpenseDetail(participant.id)}
                >
                  <Group justify="space-between" align="center" wrap="nowrap">
                    {/* Left: Avatar + Info */}
                    <Group gap="md" wrap="nowrap">
                      <RingProgress
                        size={56}
                        thickness={4}
                        roundCaps
                        sections={[{ value: percentage, color: colorSet.ring }]}
                        label={
                          participant.photoURL ? (
                            <Avatar
                              src={participant.photoURL}
                              size={44}
                              radius="xl"
                              className="mx-auto"
                            />
                          ) : (
                            <Avatar
                              size={44}
                              radius="xl"
                              className={`mx-auto ${colorSet.icon} text-white`}
                            >
                              {participant.name.charAt(0).toUpperCase()}
                            </Avatar>
                          )
                        }
                      />
                      <Stack gap={2}>
                        <Text fw={600} size="sm" className="text-gray-800">
                          {participant.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {participantExpenses.length} khoản chi
                        </Text>
                      </Stack>
                    </Group>

                    {/* Right: Amount + Expand Icon */}
                    <Group gap="xs" wrap="nowrap">
                      <Stack gap={0} align="flex-end">
                        <Text fw={700} size="md" className="text-gray-800">
                          {formatCurrency(participant.totalSpent)}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {percentage}% tổng
                        </Text>
                      </Stack>
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        {isExpanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </ActionIcon>
                    </Group>
                  </Group>

                  {/* Expanded Expenses */}
                  {isExpanded && (
                    <Stack
                      gap="xs"
                      mt="md"
                      className="pt-3 border-t border-gray-200/50"
                    >
                      {participantExpenses.length > 0 ? (
                        participantExpenses.map((expense) => (
                          <Paper
                            key={expense.id}
                            p="sm"
                            radius="md"
                            className="bg-white/70"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Group justify="space-between">
                              <Stack gap={0}>
                                <Text size="sm" fw={500}>
                                  {expense.description}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {format(
                                    expense.createdAt,
                                    "dd/MM/yyyy HH:mm",
                                    { locale: vi }
                                  )}
                                </Text>
                              </Stack>
                              <Group gap="xs">
                                <Text size="sm" fw={600} c="green">
                                  {formatCurrency(expense.amount)}
                                </Text>
                                <ActionIcon
                                  variant="subtle"
                                  color="red"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteExpense(expense);
                                  }}
                                >
                                  <Trash2 size={14} />
                                </ActionIcon>
                              </Group>
                            </Group>
                          </Paper>
                        ))
                      ) : (
                        <Text size="sm" c="dimmed" ta="center" py="xs">
                          Chưa có chi tiêu nào
                        </Text>
                      )}
                    </Stack>
                  )}
                </Card>
              );
            })}
          </Stack>

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
