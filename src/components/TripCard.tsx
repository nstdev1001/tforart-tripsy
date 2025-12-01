import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  Edit,
  MapPin,
  MoreHorizontal,
  Trash2,
  User,
} from "lucide-react";
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
    <Card
      shadow="md"
      padding="lg"
      radius="lg"
      withBorder
      className="hover:shadow-xl transition-shadow duration-300"
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Badge
            leftSection={<MapPin size={14} />}
            variant="light"
            color="blue"
            size="lg"
          >
            Chuyến đi
          </Badge>
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
      </Card.Section>

      <Stack gap="md" mt="md">
        <div>
          <Text fw={600} size="xl" lineClamp={2}>
            {trip.name}
          </Text>
        </div>

        <Group gap="xs">
          <Calendar size={16} className="text-gray-500" />
          <Text size="sm" c="dimmed">
            Bắt đầu: {format(trip.startDate, "dd/MM/yyyy", { locale: vi })}
          </Text>
        </Group>

        {/* Thông tin người tạo */}
        <Group gap="xs" className="border-t pt-3">
          <Tooltip label={trip.creatorName || "Người tạo"} position="bottom">
            <Group gap="xs">
              {trip.creatorPhoto ? (
                <Avatar src={trip.creatorPhoto} size="sm" radius="xl" />
              ) : (
                <Avatar size="sm" radius="xl" color="blue">
                  <User size={16} />
                </Avatar>
              )}
              <div>
                <Text size="xs" c="dimmed">
                  Người tạo
                </Text>
                <Text size="sm" fw={500} lineClamp={1}>
                  {trip.creatorName || "Không rõ"}
                </Text>
              </div>
            </Group>
          </Tooltip>
        </Group>

        <Button variant="light" fullWidth mt="xs" className="hover:bg-blue-50">
          Xem chi tiết
        </Button>
      </Stack>
    </Card>
  );
};
