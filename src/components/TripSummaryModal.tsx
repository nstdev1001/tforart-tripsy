import {
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useCurrency } from "../hooks/useCurrency";
import { useEndTrip } from "../hooks/useTrips";
import { useTripSettlement } from "../hooks/useTripSettlement";
import { useVibrate } from "../hooks/useVibrate";
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
  const { vibrateSuccess, vibrateLong } = useVibrate();
  const { colorScheme } = useMantineColorScheme();
  const endTrip = useEndTrip();
  const { averagePerPerson, mainSpender, settlements, getParticipantBalance } =
    useTripSettlement(participants, totalExpense);
  const participantRowClassName =
    colorScheme === "dark"
      ? "flex flex-col justify-between rounded-md border border-gray-800 p-2 md:flex-row md:items-center"
      : "flex flex-col justify-between rounded-md border border-gray-200 p-2 md:flex-row md:items-center";
  const settlementCardClassName =
    colorScheme === "dark"
      ? "rounded-lg bg-gray-800 p-2 shadow-black/30"
      : "rounded-lg bg-gray-100 p-2 shadow-md";

  const handleEndTrip = () => {
    vibrateLong();
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
          onSuccess: () => {
            vibrateSuccess();
            onClose();
          },
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
        <div
          // p="md"
          // radius="md"
          className="p-3 rounded-xl bg-linear-to-br from-blue-50 to-indigo-200 shadow-lg"
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
        </div>

        <Stack gap="xs">
          <Text fw={500} size="sm" c="dimmed">
            Chi tiêu của mỗi người
          </Text>
          {participants.map((p) => {
            const diff = getParticipantBalance(p.id);
            const isOver = diff > 0;
            const isUnder = diff < 0;

            return (
              <div key={p.id} className={participantRowClassName}>
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
                      (Thừa {formatCurrency(Math.round(diff))})
                    </Text>
                  )}
                  {isUnder && (
                    <Text size="xs" c="red">
                      (Thiếu {formatCurrency(Math.round(Math.abs(diff)))})
                    </Text>
                  )}
                </Group>
              </div>
            );
          })}
        </Stack>

        <Divider />

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
              <div key={index} className={settlementCardClassName}>
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
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
                </div>
              </div>
            ))
          )}
        </Stack>

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
