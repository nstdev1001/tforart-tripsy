export interface Participant {
  id: string;
  userId: string;
  name: string;
  photoURL?: string;
  totalSpent: number;
  isParticipant?: boolean;
}

export interface Expense {
  id?: string;
  tripId: string;
  amount: number;
  description: string;
  paidBy: string;
  paidByName: string;
  createdAt: Date;
}

export interface TripInvite {
  id?: string;
  tripId: string;
  tripName: string;
  invitedBy: string;
  invitedByName: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface Trip {
  id?: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  isEnded?: boolean;
  creator: string;
  creatorName?: string;
  creatorPhoto?: string;
  participants: Participant[];
  totalExpense: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTripData {
  name: string;
  startDate: Date;
  creator: string;
  creatorName?: string;
  creatorPhoto?: string;
}

export interface CreateExpenseData {
  tripId: string;
  amount: number;
  description: string;
  paidBy: string;
  paidByName: string;
}

export interface Settlement {
  from: Participant;
  to: Participant;
  amount: number;
}
