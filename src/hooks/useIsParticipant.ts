import { useMemo } from "react";
import type { Participant } from "../types/trip";
import { useUserStore } from "./useUserStore";

export const useIsParticipant = (participants?: Participant[]): boolean => {
  const { user } = useUserStore();

  return useMemo(() => {
    if (!participants || !user) return false;
    return participants.some((p) => p.userId === user.uid && p.isParticipant);
  }, [participants, user]);
};
