import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inviteService } from "../services";
import { notifications } from "@mantine/notifications";

export const useInvite = (inviteId?: string) => {
  return useQuery({
    queryKey: ["invite", inviteId],
    queryFn: () => inviteService.getInvite(inviteId!),
    enabled: !!inviteId,
  });
};

export const useCreateInvite = () => {
  return useMutation({
    mutationFn: (tripId: string) => inviteService.createInvite(tripId),
    onSuccess: () => {
      notifications.show({
        title: "Thành công",
        message: "Tạo link mời thành công!",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Lỗi",
        message: "Không thể tạo link mời!",
        color: "red",
      });
      console.error("Error creating invite:", error);
    },
  });
};

export const useAcceptInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => inviteService.acceptInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      notifications.show({
        title: "Thành công",
        message: "Tham gia chuyến đi thành công!",
        color: "green",
      });
    },
    onError: (error: Error) => {
      let message = "Không thể tham gia chuyến đi!";
      if (error.message === "Invite has expired") {
        message = "Link mời đã hết hạn!";
      } else if (error.message === "Invite not found") {
        message = "Link mời không tồn tại!";
      }
      notifications.show({
        title: "Lỗi",
        message,
        color: "red",
      });
      console.error("Error accepting invite:", error);
    },
  });
};
