import {
  ActionIcon,
  Button,
  CopyButton,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { useCreateInvite } from "../hooks/useInvite";

interface ShareTripModalProps {
  opened: boolean;
  onClose: () => void;
  tripId: string;
  tripName: string;
}

export const ShareTripModal = ({
  opened,
  onClose,
  tripId,
  tripName,
}: ShareTripModalProps) => {
  const createInvite = useCreateInvite();
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const handleCreateLink = async () => {
    try {
      const invite = await createInvite.mutateAsync(tripId);
      const link = `${window.location.origin}/invite/${invite.id}`;
      setInviteLink(link);
    } catch (error) {
      console.error("Error creating invite:", error);
    }
  };

  const handleClose = () => {
    setInviteLink(null);
    onClose();
  };

  const handleShare = async () => {
    if (inviteLink && navigator.share) {
      try {
        await navigator.share({
          title: `Tham gia chuyến đi: ${tripName}`,
          text: `Bạn được mời tham gia chuyến đi "${tripName}"`,
          url: inviteLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Chia sẻ chuyến đi"
      centered
      size="md"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Tạo link mời để chia sẻ chuyến đi "{tripName}" với bạn bè. Link có
          hiệu lực trong 7 ngày.
        </Text>

        {!inviteLink ? (
          <Button
            leftSection={<Share2 size={16} />}
            onClick={handleCreateLink}
            loading={createInvite.isPending}
            fullWidth
          >
            Tạo link mời
          </Button>
        ) : (
          <Stack gap="sm">
            <TextInput
              value={inviteLink}
              readOnly
              rightSection={
                <CopyButton value={inviteLink} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? "Đã copy" : "Copy link"}
                      position="top"
                    >
                      <ActionIcon
                        color={copied ? "teal" : "gray"}
                        variant="subtle"
                        onClick={copy}
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              }
            />

            <Group grow>
              <CopyButton value={inviteLink} timeout={2000}>
                {({ copied, copy }) => (
                  <Button
                    variant="light"
                    color={copied ? "teal" : "blue"}
                    leftSection={
                      copied ? <Check size={16} /> : <Copy size={16} />
                    }
                    onClick={copy}
                  >
                    {copied ? "Đã copy" : "Copy link"}
                  </Button>
                )}
              </CopyButton>

              {typeof navigator.share !== "undefined" && (
                <Button
                  leftSection={<Share2 size={16} />}
                  onClick={handleShare}
                >
                  Chia sẻ
                </Button>
              )}
            </Group>

            <Button variant="subtle" onClick={handleCreateLink}>
              Tạo link mới
            </Button>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
};
