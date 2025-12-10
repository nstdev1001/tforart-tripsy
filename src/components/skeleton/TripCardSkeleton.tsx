import { Group, Paper, Skeleton, Stack } from "@mantine/core";

export const TripCardSkeleton = () => (
  <Paper shadow="md" radius="lg" p="lg" withBorder>
    <Stack gap="md">
      <Group justify="space-between">
        <Skeleton height={24} width={100} radius="xl" />
        <Skeleton height={24} width={24} radius="sm" />
      </Group>
      <Skeleton height={28} width="80%" radius="sm" />
      <Skeleton height={24} width={120} radius="sm" />
      <Group gap="xs">
        <Skeleton height={16} width={16} radius="sm" />
        <Skeleton height={16} width={100} radius="sm" />
      </Group>
      <Group gap="xs">
        <Skeleton height={16} width={16} radius="sm" />
        <Skeleton height={16} width={80} radius="sm" />
      </Group>
      <Group gap="xs" className="border-t pt-3">
        <Skeleton height={32} width={32} radius="xl" />
        <Stack gap={4}>
          <Skeleton height={12} width={60} radius="sm" />
          <Skeleton height={14} width={80} radius="sm" />
        </Stack>
      </Group>
      <Skeleton height={36} width="100%" radius="md" />
    </Stack>
  </Paper>
);
