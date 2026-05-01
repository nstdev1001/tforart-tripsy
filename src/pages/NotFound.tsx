import { Button, Container, Paper, Stack, Text, Title } from "@mantine/core";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen from-blue-50 via-white to-purple-50 flex flex-col">
      <Container size="sm" className="py-20 grow flex flex-col justify-center">
        <Paper
          shadow="xl"
          radius="xl"
          p="xl"
          className="text-center bg-white dark:bg-dark-7 relative overflow-hidden"
        >
          <Stack align="center" gap="xl" className="py-8">
            <div className="text-8xl select-none">🧭</div>
            <Stack gap="xs">
              <Title
                order={1}
                className="text-4xl text-blue-600 dark:text-blue-400"
              >
                404 Not Found
              </Title>
              <Text c="dimmed" size="lg" className="max-w-md">
                Trang bạn đang tìm kiếm không tồn tại.
              </Text>
            </Stack>

            <Button
              size="lg"
              onClick={() => navigate("/")}
              leftSection={<Home size={20} />}
              className="mt-4 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
            >
              Về trang chủ
            </Button>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
};

export default NotFound;
