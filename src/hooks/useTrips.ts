import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tripService } from "../services";
import type { CreateTripData } from "../types/trip";

export const useTrips = (userId?: string) => {
  return useQuery({
    queryKey: ["trips", userId],
    queryFn: () => tripService.getTrips(userId!),
    enabled: !!userId,
  });
};

export const useTrip = (tripId?: string) => {
  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => tripService.getTripById(tripId!),
    enabled: !!tripId,
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["trip", variables.tripId] });
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

export const useAddParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      participant,
    }: {
      tripId: string;
      participant: { name: string; userId?: string; photoURL?: string };
    }) => tripService.addParticipant(tripId, participant),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trip", variables.tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      notifications.show({
        title: "Thành công",
        message: "Thêm thành viên thành công!",
        color: "green",
      });
    },
    onError: (error: Error) => {
      const message =
        error.message === "Thành viên với tên này đã tồn tại"
          ? error.message
          : "Không thể thêm thành viên!";
      notifications.show({
        title: "Lỗi",
        message,
        color: "red",
      });
      console.error("Error adding participant:", error);
    },
  });
};

export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tripId,
      participantId,
    }: {
      tripId: string;
      participantId: string;
    }) => tripService.removeParticipant(tripId, participantId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trip", variables.tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({
        queryKey: ["expenses", variables.tripId],
      });
      notifications.show({
        title: "Thành công",
        message: "Xóa thành viên thành công!",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Lỗi",
        message: "Không thể xóa thành viên!",
        color: "red",
      });
      console.error("Error removing participant:", error);
    },
  });
};
