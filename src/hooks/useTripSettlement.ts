import type { Participant, Settlement } from "../types/trip";

interface TripSettlementResult {
  averagePerPerson: number;
  mainSpender: Participant | null;
  settlements: Settlement[];
  getParticipantBalance: (participantId: string) => number;
}

export const useTripSettlement = (
  participants: Participant[],
  totalExpense: number
): TripSettlementResult => {
  const participantCount = participants.length;

  const averagePerPerson =
    participantCount > 0 ? totalExpense / participantCount : 0;

  const mainSpender =
    participants.length > 0
      ? participants.reduce(
          (max, p) => (p.totalSpent > max.totalSpent ? p : max),
          participants[0]
        )
      : null;

  const getParticipantBalance = (participantId: string): number => {
    const participant = participants.find((p) => p.id === participantId);
    if (!participant) return 0;
    return participant.totalSpent - averagePerPerson;
  };

  const calculateSettlements = (): Settlement[] => {
    if (participantCount === 0 || !mainSpender) return [];

    const balances = participants.map((p) => ({
      participant: p,
      balance: p.totalSpent - averagePerPerson,
    }));

    const debtors = balances
      .filter((b) => b.balance < 0)
      .sort((a, b) => a.balance - b.balance);

    const otherCreditors = balances
      .filter((b) => b.balance > 0 && b.participant.id !== mainSpender.id)
      .sort((a, b) => b.balance - a.balance);

    const settlements: Settlement[] = [];

    for (const debtor of debtors) {
      const amount = Math.abs(debtor.balance);
      if (amount > 0) {
        settlements.push({
          from: debtor.participant,
          to: mainSpender,
          amount: Math.round(amount),
        });
      }
    }

    for (const creditor of otherCreditors) {
      const amount = creditor.balance;
      if (amount > 0) {
        settlements.push({
          from: mainSpender,
          to: creditor.participant,
          amount: Math.round(amount),
        });
      }
    }

    return settlements;
  };

  return {
    averagePerPerson,
    mainSpender,
    settlements: calculateSettlements(),
    getParticipantBalance,
  };
};
