import { Paper, Text } from "@mantine/core";
import { CircleAlert } from "lucide-react";

interface AnnouncementBannerProps {
  message: string;
}

export const AnnouncementBanner = ({ message }: AnnouncementBannerProps) => {
  return (
    <Paper
      shadow="sm"
      radius="md"
      p="sm"
      role="status"
      className="border border-amber-200 bg-amber-50"
    >
      <div className="flex items-start gap-2">
        <CircleAlert
          size={16}
          className="text-amber-500 mt-0.5 shrink-0"
          aria-hidden="true"
        />
        <Text size="sm" className="text-amber-900">
          {message}
        </Text>
      </div>
    </Paper>
  );
};
