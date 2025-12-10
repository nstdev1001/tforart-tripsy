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

  // Check if user is already a participant
  const isAlreadyJoined = trip?.participants?.some(
    (p) => p.userId === user?.uid
  );

  // Redirect to login if not authenticated
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

  // Loading states
  if (authLoading || inviteLoading || tripLoading) {
    return (
      <div className="min-h-screen">
        <Container size="sm" className="py-16">
          <Center>
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text c="dimmed">Loading...</Text>
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
              <Title order={3}>Invalid invite link</Title>
              <Text c="dimmed">
                The invite link may have expired or does not exist.
              </Text>
              <Button onClick={() => navigate("/")}>Go to Home</Button>
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
              <Title order={3}>Invite link has expired</Title>
              <Text c="dimmed">
                Please ask the trip owner to create a new invite link.
              </Text>
              <Button onClick={() => navigate("/")}>Go to Home</Button>
            </Stack>
          </Card>
        </Container>
      </div>
    );
  }

  // Already joined - show different UI
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
                  You're already in this trip!
                </Title>
                <Text c="dimmed">
                  You have already joined <br /> "
                  <span className="font-semibold">{invite.tripName}</span>".
                </Text>
              </div>

              <Stack gap="sm" className="w-full">
                <Button size="lg" fullWidth onClick={handleGoToTrip}>
                  Go to Trip
                </Button>

                <Button
                  variant="subtle"
                  fullWidth
                  onClick={() => navigate("/")}
                >
                  Go to Home
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
                You're invited to join a trip
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
                    Invited by: {invite.invitedByName}
                  </Text>
                </Group>

                <Group gap="xs">
                  <Calendar size={16} className="text-gray-500" />
                  <Text size="sm" c="dimmed">
                    Link expires:{" "}
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
                Join Trip
              </Button>

              <Button variant="subtle" fullWidth onClick={() => navigate("/")}>
                Go to Home
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </div>
  );
};

export default JoinTrip;
