import {
  Button,
  Container,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Vibrate } from "lucide-react";
import { useVibrate } from "../hooks/useVibrate";

export const TestVibrate = () => {
  const {
    vibrate,
    vibrateShort,
    vibrateMedium,
    vibrateLong,
    vibrateDouble,
    vibrateSuccess,
  } = useVibrate();

  const vibrationButtons = [
    {
      label: "Short (30ms)",
      description: "Rung ngắn",
      action: vibrateShort,
      color: "blue",
    },
    {
      label: "Medium (50ms)",
      description: "Rung vừa",
      action: vibrateMedium,
      color: "cyan",
    },
    {
      label: "Long (100ms)",
      description: "Rung dài",
      action: vibrateLong,
      color: "teal",
    },
    {
      label: "Double (30-50-30)",
      description: "Rung đôi",
      action: vibrateDouble,
      color: "violet",
    },
    {
      label: "Success (50-30-100)",
      description: "Rung thành công",
      action: vibrateSuccess,
      color: "green",
    },
    {
      label: "Custom 200ms",
      description: "Rung 200ms",
      action: () => vibrate(200),
      color: "orange",
    },
    {
      label: "Custom 500ms",
      description: "Rung 500ms",
      action: () => vibrate(500),
      color: "red",
    },
    {
      label: "Pattern [100, 50, 100, 50, 100]",
      description: "Rung theo mẫu",
      action: () => vibrate([100, 50, 100, 50, 100]),
      color: "pink",
    },
    {
      label: "SOS Pattern",
      description: "Rung SOS",
      action: () =>
        vibrate([
          100, 50, 100, 50, 100, 150, 200, 50, 200, 50, 200, 150, 100, 50, 100,
          50, 100,
        ]),
      color: "grape",
    },
  ];

  return (
    <Container size="md" className="py-8">
      <Stack gap="lg">
        <Paper shadow="lg" radius="xl" p="xl">
          <Stack gap="md" align="center">
            <Vibrate size={48} />
            <Title order={1}>Test Vibration</Title>
            <Text c="dimmed" ta="center">
              Nhấn vào các nút bên dưới để test các kiểu rung khác nhau.
              <br />
              <Text size="sm" c="yellow" component="span">
                ⚠️ Lưu ý: Vibration API chỉ hoạt động trên thiết bị di động có
                hỗ trợ.
              </Text>
            </Text>
          </Stack>
        </Paper>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {vibrationButtons.map((btn, index) => (
            <Paper key={index} shadow="md" radius="lg" p="md">
              <Stack gap="xs">
                <Text fw={600}>{btn.description}</Text>
                <Button
                  leftSection={<Vibrate size={18} />}
                  color={btn.color}
                  fullWidth
                  onClick={btn.action}
                >
                  {btn.label}
                </Button>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>

        <Paper shadow="md" radius="lg" p="md">
          <Stack gap="xs">
            <Text fw={600}>Stop Vibration</Text>
            <Button
              variant="outline"
              color="gray"
              fullWidth
              onClick={() => vibrate(0)}
            >
              Dừng rung
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default TestVibrate;
