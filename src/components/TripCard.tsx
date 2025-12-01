import { ActionIcon, Button, Card, Group, Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useDeleteTrip } from "../hooks/useTrips";
import type { Trip } from "../types/trip";

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
}

export const TripCard = ({ trip, onEdit }: TripCardProps) => {
  const deleteTrip = useDeleteTrip();

  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Xóa chuyến đi",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa chuyến đi "{trip.name}"? Hành động này không
          thể hoàn tác.
        </Text>
      ),
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (trip.id) {
          deleteTrip.mutate(trip.id);
        }
      },
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="lg">
          {trip.name}
        </Text>
        <Menu shadow="md" width={150}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <MoreHorizontal size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<Edit size={14} />}
              onClick={() => onEdit(trip)}
            >
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item
              leftSection={<Trash2 size={14} />}
              color="red"
              onClick={handleDelete}
            >
              Xóa
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Group gap="xs" mb="md">
        <Calendar size={16} />
        <Text size="sm" c="dimmed">
          {format(trip.startDate, "dd/MM/yyyy", { locale: vi })}
        </Text>
      </Group>

      <Button variant="light" fullWidth mt="md">
        Xem chi tiết
      </Button>
    </Card>
  );
};
