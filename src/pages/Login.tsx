import { Button, Card, Container, Stack, Text, Title } from "@mantine/core";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/auth";

export const Login = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (user && !loading) {
      navigate(redirectUrl);
    }
  }, [user, loading, navigate, redirectUrl]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate(redirectUrl);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Text>Đang tải...</Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <Container size="xs">
        <Card shadow="lg" radius="lg" p="xl" className="text-center">
          <Stack align="center" gap="lg">
            <Text size="4xl">✈️</Text>
            <div>
              <Title order={2} mb="xs">
                Tripsy
              </Title>
              <Text c="dimmed">Quản lý chi tiêu chuyến đi cùng bạn bè</Text>
            </div>

            <Button size="lg" fullWidth onClick={handleLogin}>
              Đăng nhập với Google
            </Button>
          </Stack>
        </Card>
      </Container>
    </div>
  );
};
