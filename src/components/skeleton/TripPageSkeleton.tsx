import { Card, Container, Group, Paper, Skeleton, Stack } from "@mantine/core";

// Skeleton for ParticipantCard
const ParticipantCardSkeleton = () => (
  <Paper shadow="sm" radius="lg" p="md" withBorder>
    <Group justify="space-between" align="center">
      <Group>
        <Skeleton height={48} width={48} radius="xl" />
        <Stack gap={4}>
          <Skeleton height={18} width={100} radius="sm" />
          <Skeleton height={14} width={80} radius="sm" />
        </Stack>
      </Group>
      <Skeleton height={24} width={24} radius="sm" />
    </Group>
  </Paper>
);

export const TripPageSkeleton = () => (
  <div className="min-h-screen pb-8">
    {/* Header Section Skeleton */}
    <div className="bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600 pb-16 pt-4 rounded-b-4xl">
      <Container size="sm">
        <Stack gap="md">
          {/* Navigation */}
          <Group justify="space-between">
            <Skeleton height={40} width={40} radius="sm" />
            <Skeleton height={40} width={40} radius="sm" />
          </Group>

          {/* Trip Name */}
          <Skeleton height={32} width="60%" radius="sm" />
        </Stack>
      </Container>
    </div>

    {/* Total Card Skeleton */}
    <Container size="sm" className="-mt-12">
      <Card shadow="xl" radius="xl" p="lg" className="bg-white">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Skeleton height={16} width={100} radius="sm" />
            <Skeleton height={36} width={180} radius="sm" />
            <Skeleton height={14} width={120} radius="sm" />
            <Skeleton height={32} width={150} radius="xl" mt={8} />
          </Stack>
          <Skeleton height={56} width={56} radius="xl" />
        </Group>
      </Card>
    </Container>

    {/* Content Section Skeleton */}
    <Container size="sm" className="mt-6">
      <Stack gap="md">
        {[...Array(3)].map((_, index) => (
          <ParticipantCardSkeleton key={index} />
        ))}
        <Skeleton height={36} width={160} radius="sm" mx="auto" />
      </Stack>
    </Container>
  </div>
);
