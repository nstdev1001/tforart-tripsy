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
import { LogOut, Plus } from "lucide-react";
import { useState } from "react";
import { CreateTripModal } from "../components/CreateTripModal";
import { TripCard } from "../components/TripCard";
import { useAuth } from "../hooks/auth";
import { useTrips } from "../hooks/useTrips";
import type { Trip } from "../types/trip";

export const Home = () => {
  const { user, signOut } = useAuth();
  const { data: trips, isLoading, error } = useTrips(user?.uid);
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    // TODO: Implement edit modal
  };

  return (
    <div className="min-h-screen">
      <Container size="lg" className="p-5 flex flex-col gap-5">
        <Paper shadow="md" radius="lg" p="md">
          <Group justify="space-between" mb="lg">
            <Group className="flex">
              <Avatar src={user?.photoURL} size="md" radius="xl" />
              <div>
                <Title order={3}>Xin chào, {user?.displayName}!</Title>
                <Text size="sm" c="dimmed">
                  {user?.email}
                </Text>
              </div>
            </Group>
            <Button
              leftSection={<LogOut size={18} />}
              variant="light"
              color="red"
              onClick={signOut}
            >
              Đăng xuất
            </Button>
          </Group>
        </Paper>

        <Group justify="space-between" align="center">
          <Title order={1}>My trips</Title>
          <Button
            leftSection={<Plus size={18} />}
            onClick={() => setCreateModalOpened(true)}
          >
            Tạo chuyến đi mới
          </Button>
        </Group>

        {isLoading && (
          <Center>
            <Loader size="lg" />
          </Center>
        )}

        {error && (
          <Paper shadow="md" radius="lg" p="md">
            <Text c="red">Có lỗi xảy ra khi tải danh sách chuyến đi</Text>
          </Paper>
        )}

        {trips && trips.length === 0 && (
          <Paper shadow="md" radius="lg" p="xl">
            <Stack align="center" gap="md">
              <Text size="lg" c="dimmed">
                Bạn chưa có chuyến đi nào
              </Text>
              <Button
                leftSection={<Plus size={18} />}
                onClick={() => setCreateModalOpened(true)}
              >
                Tạo chuyến đi đầu tiên
              </Button>
            </Stack>
          </Paper>
        )}

        {trips && trips.length > 0 && (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onEdit={handleEditTrip} />
            ))}
          </SimpleGrid>
        )}
      </Container>

      <CreateTripModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
      />
    </div>
  );
};
