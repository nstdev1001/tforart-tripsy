import { ActionIcon, Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  Edit,
  MoreHorizontal,
  MoreVertical,
  Share2,
  Trash2,
  UserPlus,
} from "lucide-react";

interface TripMenuProps {
  tripName: string;
  isEnded?: boolean;
  isParticipant?: boolean;
  variant?: "card" | "page";
  onEdit?: () => void;
  onShare?: () => void;
  onAddParticipant?: () => void;
  onDelete: () => void;
}

export const TripMenu = ({
  tripName,
  isEnded = false,
  isParticipant = false,
  variant = "card",
  onEdit,
  onShare,
  onAddParticipant,
  onDelete,
}: TripMenuProps) => {
  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Xóa chuyến đi",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa chuyến đi "{tripName}"? Hành động này không
          thể hoàn tác.
        </Text>
      ),
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: onDelete,
    });
  };

  const isPageVariant = variant === "page";
  const IconComponent = isPageVariant ? MoreVertical : MoreHorizontal;

  return (
    <Menu shadow="md" width={isPageVariant ? 200 : 150}>
      <Menu.Target>
        <ActionIcon
          variant={isPageVariant ? "transparent" : "subtle"}
          color={isPageVariant ? "white" : "gray"}
          size={isPageVariant ? "lg" : "md"}
          className={isPageVariant ? "text-white hover:bg-white/20" : ""}
        >
          <IconComponent size={isPageVariant ? 24 : 16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {!isEnded && onEdit && (
          <Menu.Item leftSection={<Edit size={14} />} onClick={onEdit}>
            Chỉnh sửa
          </Menu.Item>
        )}
        {!isEnded && onShare && (
          <Menu.Item
            leftSection={<Share2 size={14} />}
            onClick={onShare}
            disabled={isParticipant}
          >
            Chia sẻ
          </Menu.Item>
        )}
        {!isEnded && onAddParticipant && (
          <Menu.Item
            leftSection={<UserPlus size={14} />}
            onClick={onAddParticipant}
          >
            Thêm thành viên
          </Menu.Item>
        )}
        {!isEnded && <Menu.Divider />}
        <Menu.Item
          leftSection={<Trash2 size={14} />}
          color="red"
          onClick={handleDelete}
          disabled={isParticipant}
        >
          Xóa
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
