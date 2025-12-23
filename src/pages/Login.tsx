import {
  Button,
  Card,
  Container,
  Divider,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SimpleFooter from "../components/SimpleFooter";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../hooks/auth";
import { useColorScheme } from "../hooks/useColorScheme";

export const Login = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { resolvedColorScheme } = useColorScheme();

  useEffect(() => {
    if (user) {
      navigate(redirectUrl);
    }
  }, [user, navigate, redirectUrl]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logoSrc =
    resolvedColorScheme === "dark" ? "/logo_white.svg" : "/logo.svg";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Container size="xs" className="w-full">
        <Card
          shadow="xl"
          radius="xl"
          p="md"
          className="backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20"
        >
          <Stack align="center" gap="xl">
            <div className="flex flex-col gap-1">
              <Image src={logoSrc} alt="Tripsy Logo" />
              <Text size="sm" ta="center" c="grey" fw={300}>
                Nền tảng quản lý chi tiêu nhóm
                <br /> cho chuyến đi của bạn
              </Text>
            </div>
            <Divider
              w="100%"
              label="Đăng nhập để tiếp tục"
              labelPosition="center"
            />

            {/* Google Login Button */}
            <Button
              onClick={handleLogin}
              loading={loading}
              size="lg"
              radius="xl"
              fullWidth
              variant="default"
              className="border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md"
              leftSection={<GoogleIcon />}
            >
              <Text fw={500}>Đăng nhập với Google</Text>
            </Button>

            {/* Terms */}
            <Text size="xs" c="dimmed" ta="center">
              Bằng việc đăng nhập, bạn đồng ý với{" "}
              <Text
                component="span"
                c="blue"
                className="cursor-pointer hover:underline"
              >
                Điều khoản sử dụng
              </Text>{" "}
              và{" "}
              <Text
                component="span"
                c="blue"
                className="cursor-pointer hover:underline"
              >
                Chính sách bảo mật
              </Text>
            </Text>
            <ThemeToggle variant="menu" />
          </Stack>
        </Card>

        {/* Footer */}
        <SimpleFooter />
      </Container>
    </div>
  );
};

// Google Icon Component
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24"
    height="24"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);
