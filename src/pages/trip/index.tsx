import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ChevronLeft,
  ClipboardList,
  NotebookPen,
  Plus,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CurrencyCounter } from "../../components/CurrencyCounter";
import { EditTripModal } from "../../components/EditTripModal";
import { ShareTripModal } from "../../components/ShareTripModal";
import { TripPageSkeleton } from "../../components/Skeleton";
import { TripMenu } from "../../components/TripMenu";
import {
  useGetExpenses,
  useTrip,
  useTripActions,
  useUserStore,
  useVibrate,
} from "../../hooks";
import type { Trip } from "../../types/trip";
import {
  AddExpenseModal,
  AddParticipantModal,
  ParticipantCard,
  TripNotesModal,
  TripSummaryModal,
} from "./_components";

const TripPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { vibrateShort, vibrateMedium, vibrateDouble } = useVibrate();
  const { user } = useUserStore();
  const { colorScheme } = useMantineColorScheme();
  const { data: trip, isPending: tripLoading } = useTrip(tripId);
  const { isPending: expensesLoading } = useGetExpenses(tripId);

  const {
    expandedParticipant,
    handleToggleExpenseDetail,
    getParticipantExpenses,
    handleDeleteExpense,
    handleDeleteParticipant,
    handleDeleteTrip,
    deleteExpenseLoading,
  } = useTripActions(tripId);

  const [expenseModalOpened, setExpenseModalOpened] = useState(false);
  const [participantModalOpened, setParticipantModalOpened] = useState(false);
  const [shareModalOpened, setShareModalOpened] = useState(false);
  const [summaryModalOpened, setSummaryModalOpened] = useState(false);
  const [notesModalOpened, setNotesModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setEditModalOpened(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpened(false);
    setEditingTrip(null);
  };

  const handleOpenExpenseModal = () => {
    vibrateDouble();
    setExpenseModalOpened(true);
  };

  if (tripLoading) {
    return <TripPageSkeleton />;
  }

  if (!trip) {
    return (
      <div className="min-h-screen">
        <Container size="sm" className="py-8">
          <Paper shadow="md" radius="lg" p="xl" className="text-center">
            <Stack align="center" gap="md">
              <Text size="xl">😢</Text>
              <Title order={3}>Không tìm thấy hoạt động</Title>
              <Button onClick={() => navigate("/")}>Quay về trang chủ</Button>
            </Stack>
          </Paper>
        </Container>
      </div>
    );
  }

  const maxSpent = Math.max(
    ...(trip.participants?.map((p) => p.totalSpent) || [1]),
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
            <Group justify="space-between">
              <ActionIcon
                variant="transparent"
                c="white"
                size="lg"
                onClick={() => {
                  vibrateShort();
                  navigate("/");
                }}
              >
                <ChevronLeft size={24} />
              </ActionIcon>

              <TripMenu
                tripName={trip.name}
                isEnded={isEnded}
                variant="page"
                onEdit={() => handleEditTrip(trip)}
                onShare={() => setShareModalOpened(true)}
                onAddParticipant={() => setParticipantModalOpened(true)}
                onDelete={handleDeleteTrip}
              />
            </Group>

            <Title order={2} className="text-white">
              {trip.name}
            </Title>
            {isEnded && (
              <Badge color="dark" variant="filled" size="sm">
                Đã kết thúc
              </Badge>
            )}
          </Stack>
        </Container>
      </div>

      <Container size="sm" className="-mt-12">
        <Card shadow="xl" radius="xl" p="lg">
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Text size="sm" c="dimmed">
                Tổng chi tiêu
              </Text>
              <Stack gap={2} align="start">
                {/* foreign currency (optional) */}
                {trip.mainCurrency !== "VND" && (
                  <Title
                    order={2}
                    className={`text-transparent bg-clip-text ${
                      isEnded
                        ? "bg-linear-to-r from-gray-500 to-gray-600"
                        : colorScheme === "dark"
                          ? "bg-linear-to-r from-orange-400 to-orange-500"
                          : "bg-linear-to-r from-orange-500 to-orange-600"
                    }`}
                  >
                    <CurrencyCounter
                      amount={trip.totalOriginalExpense ?? 0}
                      currency={trip.mainCurrency}
                    />
                  </Title>
                )}

                {/* local currency (default) */}
                <Title
                  order={1}
                  className={`text-transparent bg-clip-text ${
                    isEnded
                      ? "bg-linear-to-r from-gray-500 to-gray-600"
                      : colorScheme === "dark"
                        ? "bg-linear-to-r from-blue-400 to-cyan-400"
                        : "bg-linear-to-r from-blue-600 to-indigo-600"
                  }`}
                >
                  <CurrencyCounter amount={trip.totalExpense || 0} />
                </Title>
              </Stack>

              <Text size="xs" c="dimmed">
                {format(trip.startDate, "dd/MM/yyyy", { locale: vi })}
                {trip.endDate && (
                  <> - {format(trip.endDate, "dd/MM/yyyy", { locale: vi })}</>
                )}
              </Text>
            </Stack>
            <Stack>
              {!isEnded && (
                <ActionIcon
                  size={56}
                  radius="xl"
                  className="bg-linear-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all active:scale-95"
                  onClick={handleOpenExpenseModal}
                >
                  <Plus size={28} className="text-white" />
                </ActionIcon>
              )}
            </Stack>
            <div className="flex w-full justify-between mt-2">
              <Button
                variant="light"
                size="xs"
                radius="xl"
                leftSection={<ClipboardList size={14} />}
                onClick={() => {
                  vibrateMedium();
                  setSummaryModalOpened(true);
                }}
              >
                TỔNG KẾT HOẠT ĐỘNG
              </Button>
              <Button
                variant="light"
                size="xs"
                radius="xl"
                color="yellow"
                leftSection={<NotebookPen size={14} />}
                onClick={() => {
                  vibrateMedium();
                  setNotesModalOpened(true);
                }}
              >
                Ghi chú
              </Button>
            </div>
          </Group>
        </Card>
      </Container>

      <Container size="sm" className="mt-6">
        <Stack gap="md">
          {trip.participants?.map((participant) => (
            <ParticipantCard
              key={participant.id}
              creatorId={trip.creator}
              participant={participant}
              expenses={getParticipantExpenses(participant.id)}
              maxSpent={maxSpent}
              mainCurrency={trip.mainCurrency}
              isExpanded={expandedParticipant === participant.id}
              currentUser={user ?? undefined}
              isEndTrip={isEnded}
              isLoadingExpenses={expensesLoading}
              onToggle={() => handleToggleExpenseDetail(participant.id)}
              onDeleteExpense={handleDeleteExpense}
              onDeleteParticipant={handleDeleteParticipant}
              deleteExpenseLoading={deleteExpenseLoading}
            />
          ))}

          {!isEnded && (
            <Button
              variant="transparent"
              color="white"
              leftSection={<UserPlus size={18} />}
              onClick={() => setParticipantModalOpened(true)}
            >
              Thêm thành viên
            </Button>
          )}
        </Stack>
      </Container>

      <AddExpenseModal
        opened={expenseModalOpened}
        onClose={() => setExpenseModalOpened(false)}
        tripId={tripId || ""}
        participants={trip.participants || []}
        mainCurrency={trip.mainCurrency}
      />

      <AddParticipantModal
        opened={participantModalOpened}
        onClose={() => setParticipantModalOpened(false)}
        tripId={tripId || ""}
      />

      <EditTripModal
        opened={editModalOpened}
        onClose={handleCloseEditModal}
        trip={editingTrip}
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
        totalExpense={trip.totalExpense || 0}
        totalOriginalExpense={trip.totalOriginalExpense || 0}
        mainCurrency={trip.mainCurrency}
        isEnded={isEnded}
      />

      <TripNotesModal
        opened={notesModalOpened}
        onClose={() => setNotesModalOpened(false)}
        tripId={tripId || ""}
        initialNotes={trip.notes || ""}
      />
    </div>
  );
};

export default TripPage;
