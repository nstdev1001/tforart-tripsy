import {
  Avatar,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { LogOut, Plus } from "lucide-react";
import { useState } from "react";
import { EditTripModal } from "../../components/EditTripModal";
import SimpleFooter from "../../components/SimpleFooter";
import { TripCardSkeleton } from "../../components/Skeleton";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTrips } from "../../hooks/useTrips";
import { useUserStore } from "../../hooks/useUserStore";
import type { Trip } from "../../types/trip";
import { CreateTripModal } from "./_components/CreateTripModal";
import { TripCard } from "./_components/TripCard";
export const HomePage = () => {
  const { user, signOut } = useUserStore();
  const isMobile = useIsMobile();
  const { data: trips, isPending: tripsLoading, error } = useTrips(user?.uid);
  const [createModalOpened, setCreateModalOpened] = useState(false);
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

  return (
    <div className="min-h-screen from-blue-50 via-white to-purple-50">
      <Container size="lg" className="py-8">
        <Stack gap="lg">
          <Paper
            shadow="lg"
            radius="xl"
            p="xs"
            className="from-blue-500 to-purple-600"
          >
            <Group justify="space-between">
              <Group>
                <Avatar
                  src={user?.photoURL}
                  size="lg"
                  radius="xl"
                  className="border-4 border-white"
                />
                <div>
                  <div className="inline-flex items-start gap-2">
                    {isMobile ? (
                      <Text size="sm" fw={700} className="text-white">
                        Hi, {user?.displayName}
                      </Text>
                    ) : (
                      <Text size="lg" fw={700} className="text-white">
                        Hi, {user?.displayName}!
                      </Text>
                    )}
                    <span
                      aria-hidden="true"
                      className="text-xl leading-none"
                      title="Vẫy tay"
                    >
                      👋
                    </span>
                  </div>
                  <Text size="sm" fw={300} className="text-blue-100">
                    {user?.email}
                  </Text>
                </div>
              </Group>
              <Group gap="xs">
                <ThemeToggle />
                <Button
                  leftSection={<LogOut size={18} />}
                  variant="transparent"
                  color="red"
                  onClick={signOut}
                >
                  Đăng xuất
                </Button>
              </Group>
            </Group>
          </Paper>

          <Group justify="space-between" align="center">
            <Group>
              <Title order={2} className="text-white">
                Hoạt động của tôi
              </Title>
            </Group>
            <Button
              size="xs"
              onClick={() => setCreateModalOpened(true)}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              {isMobile ? (
                <Plus size={20} />
              ) : (
                <div className="inline-flex items-center gap-2">
                  <Plus size={20} /> Tạo hoạt động mới
                </div>
              )}
            </Button>
          </Group>

          {tripsLoading && (
            <>
              <Skeleton height={20} width={150} radius="sm" />
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {[...Array(6)].map((_, index) => (
                  <TripCardSkeleton key={index} />
                ))}
              </SimpleGrid>
            </>
          )}

          {error && (
            <Paper
              shadow="md"
              radius="lg"
              p="xl"
              className="bg-red-50 border-2 border-red-200"
            >
              <Text c="red" fw={500}>
                ❌ Có lỗi xảy ra khi tải danh sách hoạt động. Vui lòng thử lại!
              </Text>
            </Paper>
          )}

          {trips && trips.length === 0 && !tripsLoading && (
            <Paper shadow="xl" radius="lg" p="xl" className="text-center">
              <Stack align="center" gap="lg">
                <div className="text-6xl">✈️</div>
                <div>
                  <Title order={2} mb="xs">
                    Chưa có hoạt động nào
                  </Title>
                  <Text size="lg" c="dimmed">
                    Hãy bắt đầu lên kế hoạch cho hoạt động đầu tiên của bạn!
                  </Text>
                </div>
                <Button
                  leftSection={<Plus size={20} />}
                  size="lg"
                  onClick={() => setCreateModalOpened(true)}
                >
                  Tạo hoạt động đầu tiên
                </Button>
              </Stack>
            </Paper>
          )}

          {trips && trips.length > 0 && (
            <>
              <p className="text-white">Tổng số hoạt động: {trips.length}</p>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} onEdit={handleEditTrip} />
                ))}
              </SimpleGrid>
            </>
          )}
        </Stack>
        <SimpleFooter />
      </Container>

      <CreateTripModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
      />

      <EditTripModal
        opened={editModalOpened}
        onClose={handleCloseEditModal}
        trip={editingTrip}
      />
    </div>
  );
};
