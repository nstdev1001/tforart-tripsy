import {
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import { useAcceptInvite, useInvite } from "../hooks/useInvite";

const JoinTrip = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: invite, isLoading: inviteLoading, error } = useInvite(inviteId);
  const acceptInvite = useAcceptInvite();
  const [isJoining, setIsJoining] = useState(false);

  // Nếu chưa đăng nhập, redirect đến login với redirect URL
  useEffect(() => {
    if (!authLoading && !user) {
      const redirectUrl = `/invite/${inviteId}`;
      navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [user, authLoading, inviteId, navigate]);

  const handleJoinTrip = async () => {
    if (!inviteId) return;

    setIsJoining(true);
    try {
      const trip = await acceptInvite.mutateAsync(inviteId);
      navigate(`/trip/${trip.id}`);
    } catch (error) {
      console.error("Error joining trip:", error);
      setIsJoining(false);
    }
  };

  // Loading states
  if (authLoading || inviteLoading) {
    return (
      <div className="min-h-screen">
        <Container size="sm" className="py-16">
          <Center>
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text c="dimmed">Đang tải thông tin...</Text>
            </Stack>
          </Center>
        </Container>
      </div>
    );
  }

  // Error states
  if (error || !invite) {
    return (
      <div className="min-h-screen">
        <Container size="sm" className="py-16">
          <Card shadow="lg" radius="lg" p="xl" className="text-center">
            <Stack align="center" gap="md">
              <Text size="4xl">😢</Text>
              <Title order={3}>Link mời không hợp lệ</Title>
              <Text c="dimmed">
                Link mời có thể đã hết hạn hoặc không tồn tại.
              </Text>
              <Button onClick={() => navigate("/")}>Về trang chủ</Button>
            </Stack>
          </Card>
        </Container>
      </div>
    );
  }

  // Check if invite expired
  const isExpired = new Date() > invite.expiresAt;

  if (isExpired) {
    return (
      <div className="min-h-screen">
        <Container size="sm" className="py-16">
          <Card shadow="lg" radius="lg" p="xl" className="text-center">
            <Stack align="center" gap="md">
              <Text size="4xl">⏰</Text>
              <Title order={3}>Link mời đã hết hạn</Title>
              <Text c="dimmed">
                Vui lòng yêu cầu chủ chuyến đi tạo link mời mới.
              </Text>
              <Button onClick={() => navigate("/")}>Về trang chủ</Button>
            </Stack>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Container size="sm" className="py-16">
        <Card shadow="lg" radius="lg" p="xl">
          <Stack align="center" gap="lg">
            <div className="text-center">
              <Text size="4xl" mb="md">
                ✈️
              </Text>
              <Title order={2} mb="xs">
                Bạn được mời tham gia chuyến đi
              </Title>
            </div>

            <Card
              withBorder
              radius="md"
              p="lg"
              className="w-full bg-linear-to-r from-blue-50 to-purple-50"
            >
              <Stack gap="sm">
                <Group gap="xs">
                  <MapPin size={18} className="text-blue-600" />
                  <Text fw={600} size="lg">
                    {invite.tripName}
                  </Text>
                </Group>

                <Group gap="xs">
                  <User size={16} className="text-gray-500" />
                  <Text size="sm" c="dimmed">
                    Được mời bởi: {invite.invitedByName}
                  </Text>
                </Group>

                <Group gap="xs">
                  <Calendar size={16} className="text-gray-500" />
                  <Text size="sm" c="dimmed">
                    Link hết hạn:{" "}
                    {format(invite.expiresAt, "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </Text>
                </Group>
              </Stack>
            </Card>

            <Stack gap="sm" className="w-full">
              <Button
                size="lg"
                fullWidth
                onClick={handleJoinTrip}
                loading={isJoining}
              >
                Tham gia chuyến đi
              </Button>

              <Button variant="subtle" fullWidth onClick={() => navigate("/")}>
                Quay về trang chủ
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </div>
  );
};

export default JoinTrip;
