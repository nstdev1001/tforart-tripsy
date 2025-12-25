import {
  Avatar,
  Button,
  Container,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { LogOut, Plus } from "lucide-react";
import { useState } from "react";
import hiGif from "../assets/hi.gif";
import { CreateTripModal } from "../components/CreateTripModal";
import { EditTripModal } from "../components/EditTripModal";
import SimpleFooter from "../components/SimpleFooter";
import { ThemeToggle } from "../components/ThemeToggle";
import { TripCard } from "../components/TripCard";
import { TripCardSkeleton } from "../components/skeleton";
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
    <div className="min-h-screen from-blue-50 via-white to-purple-50">
      <Container size="lg" className="py-8">
        <Stack gap="lg">
          {/* Header Card */}
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
                    <Text size="xl" fw={700} className="text-white">
                      Hi, {user?.displayName}!
                    </Text>
                    <Image src={hiGif} alt="Waving Hand" w="1.8em" h="1.8em" />
                  </div>
                  <Text size="sm" className="text-blue-100">
                    {user?.email}
                  </Text>
                </div>
              </Group>
              <Group gap="xs">
                <ThemeToggle />
                <Button
                  leftSection={<LogOut size={18} />}
                  variant="white"
                  color="red"
                  onClick={signOut}
                >
                  Đăng xuất
                </Button>
              </Group>
            </Group>
          </Paper>

          {/* Title and Action */}
          <Group justify="space-between" align="center">
            <Group>
              <Title order={1} className="text-white">
                My trips
              </Title>
            </Group>
            <Button
              leftSection={<Plus size={20} />}
              size="xs"
              onClick={() => setCreateModalOpened(true)}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              Tạo chuyến đi mới
            </Button>
          </Group>

          {/* Loading State - Skeleton */}
          {isLoading && (
            <>
              <Skeleton height={20} width={150} radius="sm" />
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {[...Array(6)].map((_, index) => (
                  <TripCardSkeleton key={index} />
                ))}
              </SimpleGrid>
            </>
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
              <p className="text-white">Tổng số chuyến đi: {trips.length}</p>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} onEdit={handleEditTrip} />
                ))}
              </SimpleGrid>
            </>
          )}
        </Stack>
        {/* Footer */}
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
