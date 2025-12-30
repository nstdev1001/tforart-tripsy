import {
  Anchor,
  Button,
  Group,
  Loader,
  Modal,
  Paper,
  Text,
  Textarea,
} from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { Check, NotebookPen } from "lucide-react";
import { Fragment, useState } from "react";
import { useColorScheme } from "../hooks/useColorScheme";
import { useUpdateTripNotes } from "../hooks/useTrips";
import { formatPhoneForLink, parseTextWithLinks } from "../services/helpers";

interface TripNotesModalProps {
  opened: boolean;
  onClose: () => void;
  tripId: string;
  initialNotes: string;
  isEnded?: boolean;
}

/**
 * Component to render text with clickable URLs and phone numbers
 */
const LinkifyText = ({
  text,
  onLinkClick,
}: {
  text: string;
  onLinkClick?: () => void;
}) => {
  const parts = parseTextWithLinks(text);

  if (parts.length === 0) return null;

  const handleAnchorClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent onClick (handleViewClick)
    onLinkClick?.();
  };

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === "url") {
          return (
            <Anchor
              key={index}
              href={part.value}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              className="break-all"
              onClick={handleAnchorClick}
            >
              {part.value}
            </Anchor>
          );
        }

        if (part.type === "phone") {
          return (
            <Anchor
              key={index}
              href={`tel:${formatPhoneForLink(part.value)}`}
              size="sm"
              onClick={handleAnchorClick}
            >
              {part.value}
            </Anchor>
          );
        }

        if (part.type === "email") {
          return (
            <Anchor
              key={index}
              href={`mailto:${part.value}`}
              size="sm"
              onClick={handleAnchorClick}
            >
              {part.value}
            </Anchor>
          );
        }

        // Handle text with newlines
        return (
          <Fragment key={index}>
            {part.value.split("\n").map((line, lineIndex, arr) => (
              <Fragment key={lineIndex}>
                {line}
                {lineIndex < arr.length - 1 && <br />}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </>
  );
};

const NotesContent = ({
  tripId,
  initialNotes,
  isEnded = false,
}: {
  tripId: string;
  initialNotes: string;
  isEnded?: boolean;
}) => {
  const { resolvedColorScheme } = useColorScheme();
  const isDark = resolvedColorScheme === "dark";
  const [notes, setNotes] = useState(initialNotes);
  // Start in edit mode if no notes, but never edit mode if trip ended
  const [isEditing, setIsEditing] = useState(!initialNotes && !isEnded);
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

  const handleViewClick = () => {
    if (!isEnded) {
      setIsEditing(true);
    }
  };

  const handleDone = () => {
    if (notes.trim()) {
      setIsEditing(false);
    }
  };

  return (
    <>
      <Paper
        p="md"
        radius="lg"
        className={`${
          isDark
            ? "bg-linear-to-br from-gray-700 to-gray-800"
            : "bg-linear-to-br from-yellow-100 to-yellow-200"
        } ${
          isEditing
            ? "cursor-text"
            : isEnded
            ? "cursor-default"
            : "cursor-pointer"
        } ${!isEditing ? "min-h-[200px]" : ""}`}
        onClick={!isEditing && !isEnded ? handleViewClick : undefined}
      >
        {isEditing ? (
          <Textarea
            placeholder="Nhập ghi chú cho chuyến đi..."
            value={notes}
            onChange={(e) => handleChange(e.currentTarget.value)}
            minRows={10}
            maxRows={18}
            autosize
            variant="unstyled"
            autoFocus
          />
        ) : (
          <Text size="sm" className="whitespace-pre-wrap min-h-[180px]">
            <LinkifyText text={notes} />
          </Text>
        )}
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
        {isEditing && notes.trim() && (
          <Button
            size="xs"
            variant="light"
            onClick={handleDone}
            disabled={isSaving}
          >
            Cập nhật
          </Button>
        )}
      </Group>
    </>
  );
};

export const TripNotesModal = ({
  opened,
  onClose,
  tripId,
  initialNotes,
  isEnded = false,
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
      <NotesContent
        key={tripId}
        tripId={tripId}
        initialNotes={initialNotes}
        isEnded={isEnded}
      />
    </Modal>
  );
};
