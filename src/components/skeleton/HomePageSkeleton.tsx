import {
  Container,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
} from "@mantine/core";
import { TripCardSkeleton } from "./TripCardSkeleton";

export const HomePageSkeleton = () => (
  <div className="min-h-screen from-blue-50 via-white to-purple-50">
    <Container size="lg" className="py-8">
      <Stack gap="lg">
        {/* Header Card Skeleton */}
        <Paper shadow="lg" radius="xl" p="xs">
          <Group justify="space-between">
            <Group>
              <Skeleton height={48} width={48} radius="xl" />
              <Stack gap={4}>
                <Skeleton height={24} width={180} radius="sm" />
                <Skeleton height={14} width={150} radius="sm" />
              </Stack>
            </Group>
            <Skeleton height={36} width={100} radius="md" />
          </Group>
        </Paper>

        {/* Title and Action Skeleton */}
        <Group justify="space-between" align="center">
          <Skeleton height={32} width={120} radius="sm" />
          <Skeleton height={32} width={150} radius="md" />
        </Group>

        {/* Trip count Skeleton */}
        <Skeleton height={20} width={150} radius="sm" />

        {/* Trip Cards Grid Skeleton */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {[...Array(6)].map((_, index) => (
            <TripCardSkeleton key={index} />
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  </div>
);
