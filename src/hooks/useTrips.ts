import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseService, inviteService, tripService } from "../services";
import type { CreateExpenseData, CreateTripData } from "../types/trip";

// ============ TRIP HOOKS ============

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

// ============ EXPENSE HOOKS ============

export const useExpenses = (tripId?: string) => {
  return useQuery({
    queryKey: ["expenses", tripId],
    queryFn: () => expenseService.getExpenses(tripId!),
    enabled: !!tripId,
  });
};

export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseData: CreateExpenseData) =>
      expenseService.addExpense(expenseData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trip", variables.tripId] });
      queryClient.invalidateQueries({
        queryKey: ["expenses", variables.tripId],
      });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      notifications.show({
        title: "Thành công",
        message: "Thêm chi tiêu thành công!",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Lỗi",
        message: "Không thể thêm chi tiêu!",
        color: "red",
      });
      console.error("Error adding expense:", error);
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expenseId,
      tripId,
      amount,
      paidBy,
    }: {
      expenseId: string;
      tripId: string;
      amount: number;
      paidBy: string;
    }) => expenseService.deleteExpense(expenseId, tripId, amount, paidBy),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trip", variables.tripId] });
      queryClient.invalidateQueries({
        queryKey: ["expenses", variables.tripId],
      });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      notifications.show({
        title: "Thành công",
        message: "Xóa chi tiêu thành công!",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Lỗi",
        message: "Không thể xóa chi tiêu!",
        color: "red",
      });
      console.error("Error deleting expense:", error);
    },
  });
};

// ============ INVITE HOOKS ============

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
