import {
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useCurrency } from "../hooks/useCurrency";
import { useEndTrip } from "../hooks/useTrips";
import { useTripSettlement } from "../hooks/useTripSettlement";
import type { Participant } from "../types/trip";

interface TripSummaryModalProps {
  opened: boolean;
  onClose: () => void;
  tripId: string;
  participants: Participant[];
  totalExpense: number;
  isEnded?: boolean;
}

export const TripSummaryModal = ({
  opened,
  onClose,
  tripId,
  participants,
  totalExpense,
  isEnded = false,
}: TripSummaryModalProps) => {
  const { formatCurrency } = useCurrency();
  const endTrip = useEndTrip();
  const { averagePerPerson, mainSpender, settlements, getParticipantBalance } =
    useTripSettlement(participants, totalExpense);

  const handleEndTrip = () => {
    modals.openConfirmModal({
      title: "Kết thúc chuyến đi",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn kết thúc chuyến đi? Sau khi kết thúc, bạn vẫn có
          thể xem thông tin nhưng không thể thêm chi tiêu mới.
        </Text>
      ),
      labels: { confirm: "Kết thúc", cancel: "Hủy" },
      confirmProps: { color: "green" },
      onConfirm: () => {
        endTrip.mutate(tripId, {
          onSuccess: () => onClose(),
        });
      },
      centered: true,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={600} size="lg">
          Tổng kết chuyến đi
        </Text>
      }
      size="md"
      centered
    >
      <Stack gap="lg">
        <Paper
          p="md"
          radius="md"
          className="bg-linear-to-br from-blue-50 to-indigo-50"
        >
          <Stack gap="xs" align="center">
            <Text size="sm" c="dimmed">
              Tổng chi tiêu
            </Text>
            <Title
              order={2}
              className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600"
            >
              {formatCurrency(totalExpense)}
            </Title>
            <Divider my="xs" w="100%" />
            <Group gap="xs">
              <Text size="sm" c="dark" fw={600}>
                Cái giá phải trả:
              </Text>
              <Text size="md" fw={600} c="blue">
                {formatCurrency(Math.round(averagePerPerson))}/người
              </Text>
            </Group>
          </Stack>
        </Paper>

        {/* Chi tiết chi tiêu mỗi người */}
        <Stack gap="xs">
          <Text fw={500} size="sm" c="dimmed">
            Chi tiêu của mỗi người
          </Text>
          {participants.map((p) => {
            const diff = getParticipantBalance(p.id);
            const isOver = diff > 0;
            const isUnder = diff < 0;

            return (
              <Group key={p.id} justify="space-between" px="xs">
                <Group gap="xs">
                  <Text size="sm">{p.name}</Text>
                  {p.id === mainSpender?.id && (
                    <Badge size="xs" variant="light" color="blue">
                      Chi tiêu chính
                    </Badge>
                  )}
                </Group>
                <Group gap="xs">
                  <Text size="sm" fw={500}>
                    {formatCurrency(p.totalSpent)}
                  </Text>
                  {isOver && (
                    <Text size="xs" c="green">
                      (+{formatCurrency(Math.round(diff))})
                    </Text>
                  )}
                  {isUnder && (
                    <Text size="xs" c="red">
                      ({formatCurrency(Math.round(diff))})
                    </Text>
                  )}
                </Group>
              </Group>
            );
          })}
        </Stack>

        <Divider />

        {/* Thanh toán chi tiết */}
        <Stack gap="xs">
          <Text fw={500} size="sm" c="dimmed">
            Thanh toán
          </Text>
          {settlements.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              Không có khoản thanh toán nào
            </Text>
          ) : (
            settlements.map((settlement, index) => (
              <Paper
                key={index}
                p="sm"
                radius="md"
                withBorder
                className="border-gray-200"
              >
                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    <Text size="sm" fw={500}>
                      {settlement.from.name}
                    </Text>
                    <ArrowRight size={16} className="text-gray-400" />
                    <Text size="sm" fw={500}>
                      {settlement.to.name}
                    </Text>
                  </Group>
                  <Badge color="red" variant="light" size="lg">
                    {formatCurrency(settlement.amount)}
                  </Badge>
                </Group>
              </Paper>
            ))
          )}
        </Stack>

        {/* Nút kết thúc chuyến đi */}
        {!isEnded && (
          <>
            <Divider />
            <Button
              fullWidth
              color="green"
              leftSection={<CheckCircle size={18} />}
              onClick={handleEndTrip}
              loading={endTrip.isPending}
            >
              Kết thúc chuyến đi
            </Button>
          </>
        )}

        {isEnded && (
          <Badge color="gray" size="lg" variant="light" className="self-center">
            Chuyến đi đã kết thúc
          </Badge>
        )}
      </Stack>
    </Modal>
  );
};
