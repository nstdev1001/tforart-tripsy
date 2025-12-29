import { Group, Loader, Modal, Paper, Text, Textarea } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { Check, NotebookPen } from "lucide-react";
import { useState } from "react";
import { useColorScheme } from "../hooks/useColorScheme";
import { useUpdateTripNotes } from "../hooks/useTrips";

interface TripNotesModalProps {
  opened: boolean;
  onClose: () => void;
  tripId: string;
  initialNotes: string;
}

const NotesContent = ({
  tripId,
  initialNotes,
}: {
  tripId: string;
  initialNotes: string;
}) => {
  const { resolvedColorScheme } = useColorScheme();
  const isDark = resolvedColorScheme === "dark";
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const updateNotes = useUpdateTripNotes();

  // Debounced save function - waits 1 second after user stops typing
  const debouncedSave = useDebouncedCallback((value: string) => {
    setIsSaving(true);
    updateNotes.mutate(
      { tripId, notes: value },
      {
        onSuccess: () => {
          setIsSaving(false);
          setIsSaved(true);
          // Hide saved indicator after 2 seconds
          setTimeout(() => setIsSaved(false), 2000);
        },
        onError: () => {
          setIsSaving(false);
        },
      }
    );
  }, 1000);

  const handleChange = (value: string) => {
    setNotes(value);
    setIsSaved(false);
    debouncedSave(value);
  };

  return (
    <>
      <Paper
        p="md"
        radius="lg"
        style={{
          background: isDark
            ? "linear-gradient(to bottom right, #854d0e, #a16207)"
            : "linear-gradient(to bottom right, #fef9c3, #fef08a)",
        }}
      >
        <Textarea
          placeholder="Nhập ghi chú cho chuyến đi..."
          value={notes}
          onChange={(e) => handleChange(e.currentTarget.value)}
          minRows={10}
          maxRows={18}
          autosize
          variant="unstyled"
        />
      </Paper>
      <Group justify="space-between" mt="sm" px="xs">
        <Group gap="xs" h={20}>
          {isSaving && (
            <Group gap={6}>
              <Loader size={12} color="yellow" />
              <Text size="xs" c="dimmed">
                Đang lưu...
              </Text>
            </Group>
          )}
          {isSaved && !isSaving && (
            <Group gap={6}>
              <Check size={14} className="text-green-500" />
              <Text size="xs" c="green">
                Đã lưu
              </Text>
            </Group>
          )}
        </Group>
      </Group>
    </>
  );
};

export const TripNotesModal = ({
  opened,
  onClose,
  tripId,
  initialNotes,
}: TripNotesModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <NotebookPen size={20} className="text-amber-500" />
          <Text fw={600} size="lg">
            Ghi chú chuyến đi
          </Text>
        </Group>
      }
      size="md"
      centered
    >
      {/* Key = tripId để không remount khi notes thay đổi */}
      <NotesContent key={tripId} tripId={tripId} initialNotes={initialNotes} />
    </Modal>
  );
};
