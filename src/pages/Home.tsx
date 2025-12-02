import {
  Avatar,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { LogOut, Plane, Plus } from "lucide-react";
import { useState } from "react";
import { CreateTripModal } from "../components/CreateTripModal";
import { EditTripModal } from "../components/EditTripModal";
import { TripCard } from "../components/TripCard";
import { useAuth } from "../hooks/auth";
import { useTrips } from "../hooks/useTrips";
import type { Trip } from "../types/trip";

export const Home = () => {
  const { user, signOut } = useAuth();
  const { data: trips, isLoading, error } = useTrips(user?.uid);
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
    <div className="min-h-screen  from-blue-50 via-white to-purple-50">
      <Container size="lg" className="py-8">
        <Stack gap="lg">
          {/* Header Card */}
          <Paper
            shadow="lg"
            radius="xl"
            p="xl"
            className=" from-blue-500 to-purple-600"
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
                  <Text size="xl" fw={700} className="text-white">
                    Xin chào, {user?.displayName}! 👋
                  </Text>
                  <Text size="sm" className="text-blue-100">
                    {user?.email}
                  </Text>
                </div>
              </Group>
              <Button
                leftSection={<LogOut size={18} />}
                variant="white"
                color="red"
                onClick={signOut}
              >
                Đăng xuất
              </Button>
            </Group>
          </Paper>

          {/* Title and Action */}
          <Group justify="space-between" align="center">
            <Group>
              <Plane size={32} className="text-blue-600" />
              <Title order={1} className="text-gray-800">
                Chuyến đi của tôi
              </Title>
            </Group>
            <Button
              leftSection={<Plus size={20} />}
              size="lg"
              onClick={() => setCreateModalOpened(true)}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              Tạo chuyến đi mới
            </Button>
          </Group>

          {/* Loading State */}
          {isLoading && (
            <Paper shadow="md" radius="lg" p="xl">
              <Center>
                <Stack align="center" gap="md">
                  <Loader size="lg" />
                  <Text c="dimmed">Đang tải danh sách chuyến đi...</Text>
                </Stack>
              </Center>
            </Paper>
          )}

          {/* Error State */}
          {error && (
            <Paper
              shadow="md"
              radius="lg"
              p="xl"
              className="bg-red-50 border-2 border-red-200"
            >
              <Text c="red" fw={500}>
                ❌ Có lỗi xảy ra khi tải danh sách chuyến đi. Vui lòng thử lại!
              </Text>
            </Paper>
          )}

          {/* Empty State */}
          {trips && trips.length === 0 && !isLoading && (
            <Paper shadow="xl" radius="lg" p="xl" className="text-center">
              <Stack align="center" gap="lg">
                <div className="text-6xl">✈️</div>
                <div>
                  <Title order={2} mb="xs">
                    Chưa có chuyến đi nào
                  </Title>
                  <Text size="lg" c="dimmed">
                    Hãy bắt đầu lên kế hoạch cho chuyến du lịch đầu tiên của
                    bạn!
                  </Text>
                </div>
                <Button
                  leftSection={<Plus size={20} />}
                  size="lg"
                  onClick={() => setCreateModalOpened(true)}
                >
                  Tạo chuyến đi đầu tiên
                </Button>
              </Stack>
            </Paper>
          )}

          {/* Trips Grid */}
          {trips && trips.length > 0 && (
            <>
              <Text size="sm" c="dimmed">
                Tổng số chuyến đi: {trips.length}
              </Text>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} onEdit={handleEditTrip} />
                ))}
              </SimpleGrid>
            </>
          )}
        </Stack>
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
