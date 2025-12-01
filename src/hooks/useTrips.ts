import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tripService } from "../services/tripServices";
import type { CreateTripData } from "../types/trip";

export const useTrips = (userId?: string) => {
  return useQuery({
    queryKey: ["trips", userId],
    queryFn: () => tripService.getTrips(userId!),
    enabled: !!userId,
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tripService.createTrip,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trips", variables.creator] });
      notifications.show({
        title: "Thành công",
        message: "Tạo chuyến đi mới thành công!",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Lỗi",
        message: "Không thể tạo chuyến đi. Vui lòng thử lại!",
        color: "red",
      });
      console.error("Error creating trip:", error);
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      updates,
    }: {
      tripId: string;
      updates: Partial<CreateTripData>;
    }) => tripService.updateTrip(tripId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      notifications.show({
        title: "Thành công",
        message: "Cập nhật chuyến đi thành công!",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Lỗi",
        message: "Không thể cập nhật chuyến đi!",
        color: "red",
      });
      console.error("Error updating trip:", error);
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tripService.deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      notifications.show({
        title: "Thành công",
        message: "Xóa chuyến đi thành công!",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Lỗi",
        message: "Không thể xóa chuyến đi!",
        color: "red",
      });
      console.error("Error deleting trip:", error);
    },
  });
};
