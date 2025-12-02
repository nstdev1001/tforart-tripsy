import {
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  Plus,
  Share2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { AddParticipantModal } from "../components/AddParticipantModal";
import { ExpenseCard } from "../components/ExpenseCard";
import { ParticipantCard } from "../components/ParticipantCard";
import { ShareTripModal } from "../components/ShareTripModal";
import { useDeleteExpense, useExpenses, useTrip } from "../hooks/useTrips";
import type { Expense } from "../types/trip";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const Trip = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { data: trip, isLoading: tripLoading } = useTrip(tripId);
  const { data: expenses, isLoading: expensesLoading } = useExpenses(tripId);
  const deleteExpense = useDeleteExpense();

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

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
        <Container size="lg" className="py-8">
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
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
        <Container size="lg" className="py-8">
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

  const maxSpent = Math.max(
    ...(trip.participants?.map((p) => p.totalSpent) || [1])
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <Container size="lg" className="py-8">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <Button
              variant="subtle"
              leftSection={<ArrowLeft size={18} />}
              onClick={() => navigate("/")}
            >
              Quay lại
            </Button>
            <Button
              variant="light"
              leftSection={<Share2 size={18} />}
              onClick={() => setShareModalOpened(true)}
            >
              Chia sẻ
            </Button>
          </Group>

          {/* Trip Info Card */}
          <Card shadow="lg" radius="xl" p="xl" withBorder>
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <div>
                  <Badge
                    leftSection={<MapPin size={14} />}
                    variant="light"
                    color="blue"
                    size="lg"
                    mb="xs"
                  >
                    Chuyến đi
                  </Badge>
                  <Title order={2}>{trip.name}</Title>
                </div>
                <Group gap="xs">
                  <Calendar size={16} className="text-gray-500" />
                  <Text size="sm" c="dimmed">
                    {format(trip.startDate, "dd/MM/yyyy", { locale: vi })}
                  </Text>
                </Group>
              </Group>

              <Group gap="xs">
                {trip.creatorPhoto ? (
                  <Avatar src={trip.creatorPhoto} size="sm" radius="xl" />
                ) : (
                  <Avatar size="sm" radius="xl" color="blue">
                    <User size={16} />
                  </Avatar>
                )}
                <Text size="sm" c="dimmed">
                  Tạo bởi: {trip.creatorName}
                </Text>
              </Group>

              <Divider />

              <Paper
                radius="lg"
                p="xl"
                className="bg-linear-to-r from-blue-500 to-purple-600 text-center"
              >
                <Text size="sm" className="text-blue-100 mb-2">
                  Tổng chi tiêu
                </Text>
                <Title order={1} className="text-white">
                  {formatCurrency(trip.totalExpense || 0)}
                </Title>
              </Paper>
            </Stack>
          </Card>
          <Button
            leftSection={<Plus size={18} />}
            size="md"
            fullWidth
            onClick={() => setExpenseModalOpened(true)}
          >
            Thêm chi tiêu
          </Button>

          {/* Participants Section */}
          <Card shadow="md" radius="lg" p="lg" withBorder>
            <Group justify="space-between" mb="md">
              <Group>
                <Users size={20} className="text-blue-600" />
                <Title order={4}>
                  Thành viên ({trip.participants?.length || 0})
                </Title>
              </Group>
              <Button
                leftSection={<UserPlus size={16} />}
                variant="light"
                size="sm"
                onClick={() => setParticipantModalOpened(true)}
              >
                Thêm thành viên
              </Button>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {trip.participants?.map((participant) => (
                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                  expenses={getParticipantExpenses(participant.id)}
                  maxSpent={maxSpent}
                  isExpanded={expandedParticipant === participant.id}
                  onToggle={() => handleToggleExpenseDetail(participant.id)}
                  onDeleteExpense={handleDeleteExpense}
                />
              ))}
            </SimpleGrid>
          </Card>

          {/* Expenses Section */}
          <Card shadow="md" radius="lg" p="lg" withBorder>
            <Group justify="space-between" mb="md">
              <Group>
                <DollarSign size={20} className="text-green-600" />
                <Title order={4}>
                  Tất cả chi tiêu ({expenses?.length || 0})
                </Title>
              </Group>
            </Group>

            {expensesLoading ? (
              <Center py="xl">
                <Loader size="md" />
              </Center>
            ) : expenses && expenses.length > 0 ? (
              <Stack gap="sm">
                {expenses.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onDelete={handleDeleteExpense}
                  />
                ))}
              </Stack>
            ) : (
              <Paper radius="md" p="xl" className="text-center bg-gray-50">
                <Stack align="center" gap="md">
                  <Text size="xl">💰</Text>
                  <Text c="dimmed">Chưa có chi tiêu nào</Text>
                  <Button
                    leftSection={<Plus size={16} />}
                    variant="light"
                    onClick={() => setExpenseModalOpened(true)}
                  >
                    Thêm chi tiêu đầu tiên
                  </Button>
                </Stack>
              </Paper>
            )}
          </Card>
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

export default Trip;
