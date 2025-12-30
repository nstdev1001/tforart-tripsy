import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  CheckCircle,
  MapPin,
  Share2,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../hooks/useCurrency";
import { useIsParticipant } from "../hooks/useIsParticipant";
import { useDeleteTrip } from "../hooks/useTrips";
import { useVibrate } from "../hooks/useVibrate";
import type { Trip } from "../types/trip";
import { ShareTripModal } from "./ShareTripModal";
import { TripMenu } from "./TripMenu";

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
}

export const TripCard = ({ trip, onEdit }: TripCardProps) => {
  const { formatCurrency } = useCurrency();
  const { vibrateMedium } = useVibrate();
  const deleteTrip = useDeleteTrip();
  const navigate = useNavigate();
  const [shareModalOpened, setShareModalOpened] = useState(false);
  const isParticipant = useIsParticipant(trip.participants);

  const isEnded = trip.isEnded || false;

  const handleDelete = () => {
    if (trip.id) {
      deleteTrip.mutate(trip.id);
    }
  };

  return (
    <>
      <Card
        shadow="md"
        padding="lg"
        radius="lg"
        withBorder
        className={`hover:shadow-xl transition-shadow duration-300 ${
          isEnded ? "opacity-70 bg-gray-50" : ""
        }`}
      >
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Group gap="xs">
              <Badge
                leftSection={<MapPin size={14} />}
                variant="light"
                color={isEnded ? "gray" : "blue"}
                size="lg"
              >
                Chuyến đi
              </Badge>
              {isEnded && (
                <Badge
                  leftSection={<CheckCircle size={12} />}
                  variant="filled"
                  color="gray"
                  size="sm"
                >
                  Đã kết thúc
                </Badge>
              )}
            </Group>
            <Group gap="xs">
              {!isEnded && !isParticipant && (
                <Tooltip label="Chia sẻ">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => setShareModalOpened(true)}
                  >
                    <Share2 size={16} />
                  </ActionIcon>
                </Tooltip>
              )}
              <TripMenu
                tripName={trip.name}
                isEnded={isEnded}
                variant="card"
                onEdit={() => onEdit(trip)}
                onShare={() => setShareModalOpened(true)}
                onDelete={handleDelete}
                isParticipant={isParticipant}
              />
            </Group>
          </Group>
        </Card.Section>

        <Stack gap="md" mt="md">
          <div>
            <Text
              fw={600}
              size="xl"
              lineClamp={2}
              c={isEnded ? "dimmed" : undefined}
            >
              {trip.name}
            </Text>
            <Text fw={700} size="lg" c={isEnded ? "gray" : "green"} mt="xs">
              {formatCurrency(trip.totalExpense || 0)}
            </Text>
          </div>

          <Group gap="xs">
            <Calendar size={16} className="text-gray-500" />
            <Text size="sm" c="dimmed">
              {format(trip.startDate, "dd/MM/yyyy", { locale: vi })}
              {trip.endDate && (
                <> - {format(trip.endDate, "dd/MM/yyyy", { locale: vi })}</>
              )}
            </Text>
          </Group>

          <Group gap="xs">
            <Users size={16} className="text-gray-500" />
            <Text size="sm" c="dimmed">
              {trip.participants?.length || 1} thành viên
            </Text>
          </Group>

          {/* Creator info */}
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

          <Button
            variant="light"
            fullWidth
            mt="xs"
            color={isEnded ? "gray" : "blue"}
            className={isEnded ? "" : "hover:bg-blue-50"}
            onClick={() => {
              vibrateMedium();
              navigate(`/trip/${trip.id}`);
            }}
          >
            Xem chi tiết
          </Button>
        </Stack>
      </Card>

      <ShareTripModal
        opened={shareModalOpened}
        onClose={() => setShareModalOpened(false)}
        tripId={trip.id || ""}
        tripName={trip.name}
      />
    </>
  );
};
