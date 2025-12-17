import { useMemo } from "react";
import type { Participant } from "../types/trip";
import { useAuth } from "./auth";

export const useIsParticipant = (participants?: Participant[]): boolean => {
  const { user } = useAuth();

  return useMemo(() => {
    if (!participants || !user) return false;
    return participants.some((p) => p.userId === user.uid && p.isParticipant);
  }, [participants, user]);
};
