import { Badge } from "@mantine/core";
import { Briefcase, MapPin, Tag, Utensils } from "lucide-react";
import type { TripCategory } from "../types/trip";

interface CategoryBadgeProps {
  category: TripCategory;
  isEnded?: boolean;
  size?: "sm" | "md" | "lg";
}

export const CategoryBadge = ({
  category,
  isEnded,
  size = "lg",
}: CategoryBadgeProps) => {
  const categoryConfig = (() => {
    switch (category) {
      case "Ăn uống":
        return {
          label: "Ăn uống",
          icon: <Utensils size={14} />,
          color: "orange",
        } as const;
      case "Công việc":
        return {
          label: "Công việc",
          icon: <Briefcase size={14} />,
          color: "teal",
        } as const;
      case "Khác":
        return {
          label: "Khác",
          icon: <Tag size={14} />,
          color: "gray",
        } as const;
      default:
        return {
          label: "Du lịch",
          icon: <MapPin size={14} />,
          color: "blue",
        } as const;
    }
  })();

  return (
    <Badge
      leftSection={categoryConfig.icon}
      variant="light"
      color={isEnded ? "gray" : categoryConfig.color}
      size={size}
    >
      {categoryConfig.label}
    </Badge>
  );
};
