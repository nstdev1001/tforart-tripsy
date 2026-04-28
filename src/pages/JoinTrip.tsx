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
import { Calendar, CheckCircle, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import { useAcceptInvite, useInvite } from "../hooks/useInvite";
import { useTrip } from "../hooks/useTrips";

const JoinTrip = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: invite, isLoading: inviteLoading, error } = useInvite(inviteId);
  const { data: trip, isLoading: tripLoading } = useTrip(invite?.tripId);
  const acceptInvite = useAcceptInvite();
  const [isJoining, setIsJoining] = useState(false);

  const isAlreadyJoined = trip?.participants?.some(
    (p) => p.userId === user?.uid,
  );

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

  const handleGoToTrip = () => {
    if (invite?.tripId) {
      navigate(`/trip/${invite.tripId}`);
    }
  };

  if (authLoading || inviteLoading || tripLoading) {
    return (
      <div className="min-h-screen">
        <Container size="sm" className="py-16">
          <Center>
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text c="dimmed">Đang tải...</Text>
            </Stack>
          </Center>
        </Container>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen">
        <Container size="sm" className="py-16">
          <Card shadow="lg" radius="lg" p="xl" className="text-center">
            <Stack align="center" gap="md">
              <Text size="4xl">😢</Text>
              <Title order={3}>Liên kết không hợp lệ</Title>
              <Text c="dimmed">
                Liên kết mời có thể đã hết hạn hoặc không tồn tại.
              </Text>
              <Button onClick={() => navigate("/")}>Về trang chủ</Button>
            </Stack>
          </Card>
        </Container>
      </div>
    );
  }

  const isExpired = new Date() > invite.expiresAt;

  if (isExpired) {
    return (
      <div className="min-h-screen">
        <Container size="sm" className="py-16">
          <Card shadow="lg" radius="lg" p="xl" className="text-center">
            <Stack align="center" gap="md">
              <Text size="4xl">⏰</Text>
              <Title order={3}>Liên kết mời đã hết hạn</Title>
              <Text c="dimmed">
                Vui lòng yêu cầu chủ chuyến đi tạo liên kết mời mới.
              </Text>
              <Button onClick={() => navigate("/")}>Về trang chủ</Button>
            </Stack>
          </Card>
        </Container>
      </div>
    );
  }

  if (isAlreadyJoined) {
    return (
      <div className="min-h-screen">
        <Container size="sm" className="py-16">
          <Card shadow="lg" radius="lg" p="xl">
            <Stack align="center" gap="lg">
              <div className="text-center">
                <CheckCircle
                  size={64}
                  className="text-green-500 mb-4 mx-auto"
                />
                <Title order={2} mb="xs">
                  Bạn đã tham gia chuyến đi này!
                </Title>
                <Text c="dimmed">
                  Bạn đã tham gia chuyến đi <br /> "
                  <span className="font-semibold">{invite.tripName}</span>".
                </Text>
              </div>

              <Stack gap="sm" className="w-full">
                <Button size="lg" fullWidth onClick={handleGoToTrip}>
                  Đi đến chuyến đi
                </Button>

                <Button
                  variant="subtle"
                  fullWidth
                  onClick={() => navigate("/")}
                >
                  Về trang chủ
                </Button>
              </Stack>
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
                    Hết hạn:{" "}
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
                Về trang chủ
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </div>
  );
};

export default JoinTrip;
