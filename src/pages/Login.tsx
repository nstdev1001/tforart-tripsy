import { Button, Container, Paper, Stack, Text, Title } from "@mantine/core";
import { LogIn } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";

export const Login = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 bg-red-50">
      <Container size={420}>
        <Paper
          withBorder
          shadow="xl"
          p={40}
          radius="lg"
          className="backdrop-blur-sm bg-white/80"
        >
          <Stack gap="lg">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                <span className="text-3xl">✈️</span>
              </div>
              <Title order={2} className="text-gray-800 font-bold">
                Chào mừng đến Tripsy
              </Title>
              <Text c="dimmed" size="sm" className="text-gray-600">
                Lập kế hoạch du lịch thông minh cùng AI
              </Text>
            </div>

            <Button
              leftSection={<LogIn size={20} />}
              variant="default"
              size="compact-xl"
              fullWidth
              onClick={handleGoogleSignIn}
              loading={loading}
              className="hover:shadow-lg transition-all duration-300 border-gray-300 hover:border-blue-400 "
            >
              Đăng nhập với Google
            </Button>

            <Text size="xs" c="dimmed" className="text-center text-gray-500">
              Bằng cách đăng nhập, bạn đồng ý với{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Điều khoản dịch vụ
              </span>{" "}
              và{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Chính sách bảo mật
              </span>{" "}
              của chúng tôi
            </Text>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
};
