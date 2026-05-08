import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { tripService } from "../services";
import type { Participant } from "../types/trip";
import { useUserStore } from "./useUserStore";

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

export const useCheckIsParticipant = (
  participants?: Participant[],
): boolean => {
  const { user } = useUserStore();

  return useMemo(() => {
    if (!participants || !user) return false;
    return participants.some((p) => p.userId === user.uid && p.isParticipant);
  }, [participants, user]);
};
