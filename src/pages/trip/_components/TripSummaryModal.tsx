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
import { TransparentTabs } from "../../../components/TransparentTabs";
import {
  useCheckIsParticipant,
  useCurrency,
  useEndTrip,
  useTripSettlement,
  useTripSettlementOriginal,
  useVibrate,
} from "../../../hooks";
import type { Participant } from "../../../types/trip";

interface TripSummaryModalProps {
  opened: boolean;
  onClose: () => void;
  tripId: string;
  participants: Participant[];
  totalExpense: number;
  totalOriginalExpense: number | undefined;
  mainCurrency: string;
  isEnded?: boolean;
}

const VND_CURRENCY = "VND";

export const TripSummaryModal = ({
  opened,
  onClose,
  tripId,
  participants,
  totalExpense,
  totalOriginalExpense,
  mainCurrency,
  isEnded = false,
}: TripSummaryModalProps) => {
  const { formatCurrency } = useCurrency();
  const { vibrateSuccess, vibrateLong } = useVibrate();
  const { colorScheme } = useMantineColorScheme();
  const isParticipant = useCheckIsParticipant(participants);
  const endTrip = useEndTrip(isParticipant);
  const localSettlement = useTripSettlement(participants, totalExpense);
  const originalSettlement = useTripSettlementOriginal(
    participants,
    totalOriginalExpense ?? 0,
  );
  const showForeignCurrency = mainCurrency !== VND_CURRENCY;
  const participantRowClassName =
    colorScheme === "dark"
      ? "flex flex-col justify-between rounded-md border border-gray-700 p-2 md:flex-row md:items-center"
      : "flex flex-col justify-between rounded-md border border-gray-200 p-2 md:flex-row md:items-center";
  const settlementCardClassName =
    colorScheme === "dark"
      ? "rounded-lg bg-gray-800 p-2 shadow-md"
      : "rounded-lg bg-gray-100 p-2 shadow-md";
  const formatAmount = (amount: number, currency: string) =>
    currency === VND_CURRENCY
      ? formatCurrency(amount)
      : formatCurrency(amount, currency);
  const getParticipantSpent = (participant: Participant, currency: string) =>
    currency === VND_CURRENCY
      ? participant.totalSpent
      : (participant.totalOriginalSpent ?? 0);
  const renderSummaryPanel = (config: {
    currency: string;
    total: number;
    accentClassName: string;
    averageColor: string;
    settlement: typeof localSettlement;
  }) => {
    const { currency, total, accentClassName, averageColor, settlement } =
      config;

    return (
      <Stack gap="lg">
        <div className="p-3 rounded-xl bg-linear-to-br from-blue-50 to-indigo-200 shadow-lg">
          <Stack gap="xs" align="center">
            <Text size="sm" c="dimmed">
              Tổng chi tiêu
            </Text>
            <Title
              order={3}
              className={`text-transparent bg-clip-text ${accentClassName}`}
            >
              {formatAmount(total, currency)}
            </Title>
            <Divider my="xs" w="100%" color="gray" />
            <Group gap="xs">
              <Text size="sm" c="dark" fw={600}>
                Cái giá phải trả:
              </Text>
              <Text size="md" fw={600} c={averageColor}>
                {formatAmount(
                  Math.round(settlement.averagePerPerson),
                  currency,
                )}
                /người
              </Text>
            </Group>
          </Stack>
        </div>

        <Stack gap="xs">
          <Text fw={500} size="sm" c="dimmed">
            Chi tiêu của mỗi người
          </Text>
          {participants.map((p) => {
            const diff = settlement.getParticipantBalance(p.id);
            const isOver = diff > 0;
            const isUnder = diff < 0;
            const participantTotal = getParticipantSpent(p, currency);

            return (
              <div key={p.id} className={participantRowClassName}>
                <Group gap="xs">
                  <Text size="sm">{p.name}</Text>
                  {p.id === settlement.mainSpender?.id && (
                    <Badge size="xs" variant="light" color="blue">
                      Chi tiêu chính
                    </Badge>
                  )}
                </Group>
                <Group gap="xs">
                  <Text size="sm" fw={500}>
                    {formatAmount(participantTotal, currency)}
                  </Text>
                  {isOver && (
                    <Text size="xs" c="green">
                      (Thừa {formatAmount(Math.round(diff), currency)})
                    </Text>
                  )}
                  {isUnder && (
                    <Text size="xs" c="red">
                      (Thiếu{" "}
                      {formatAmount(Math.round(Math.abs(diff)), currency)})
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
          {settlement.settlements.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              Không có khoản thanh toán nào
            </Text>
          ) : (
            settlement.settlements.map((item, index) => (
              <div key={index} className={settlementCardClassName}>
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <Group gap="xs">
                    <Text size="sm" fw={500}>
                      {item.from.name}
                    </Text>
                    <ArrowRight size={16} className="text-gray-400" />
                    <Text size="sm" fw={500}>
                      {item.to.name}
                    </Text>
                  </Group>
                  <Badge color="red" variant="light" size="lg">
                    {formatAmount(item.amount, currency)}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </Stack>
      </Stack>
    );
  };

  const handleEndTrip = () => {
    vibrateLong();

    if (isParticipant) {
      const modalId = modals.open({
        title: "Kết thúc hoạt động",
        children: (
          <Stack gap="sm">
            <Text size="sm">Bạn không có quyền kết thúc hoạt động.</Text>
            <Group justify="flex-end">
              <Button onClick={() => modals.close(modalId)}>OK</Button>
            </Group>
          </Stack>
        ),
        centered: true,
      });

      return;
    }

    modals.openConfirmModal({
      title: "Kết thúc hoạt động",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn kết thúc hoạt động? Sau khi kết thúc, bạn vẫn có
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
          Tổng kết hoạt động
        </Text>
      }
      size="lg"
      centered
    >
      <Stack gap="lg">
        {showForeignCurrency ? (
          <TransparentTabs
            defaultValue="foreign"
            tabs={[
              {
                value: "foreign",
                label: mainCurrency,
                content: renderSummaryPanel({
                  currency: mainCurrency,
                  total: totalOriginalExpense ?? 0,
                  accentClassName:
                    "bg-linear-to-r from-orange-500 to-orange-600",
                  averageColor: "orange",
                  settlement: originalSettlement,
                }),
              },
              {
                value: "vnd",
                label: "VND",
                content: renderSummaryPanel({
                  currency: VND_CURRENCY,
                  total: totalExpense,
                  accentClassName: "bg-linear-to-r from-blue-600 to-indigo-600",
                  averageColor: "blue",
                  settlement: localSettlement,
                }),
              },
            ]}
          />
        ) : (
          renderSummaryPanel({
            currency: VND_CURRENCY,
            total: totalExpense,
            accentClassName: "bg-linear-to-r from-blue-600 to-indigo-600",
            averageColor: "blue",
            settlement: localSettlement,
          })
        )}

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
              Kết thúc hoạt động
            </Button>
          </>
        )}

        {isEnded && (
          <Badge color="gray" size="lg" variant="light" className="self-center">
            Hoạt động đã kết thúc
          </Badge>
        )}
      </Stack>
    </Modal>
  );
};
