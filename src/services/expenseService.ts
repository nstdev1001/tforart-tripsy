/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { getDemoExpenses, isDemoExpense, isDemoTrip } from "../data/demoData";
import type { CreateExpenseData, Expense } from "../types/trip";
import { parseDate } from "./helpers";

const TRIPS_COLLECTION = "trips";
const EXPENSES_COLLECTION = "expenses";

export const expenseService = {
  async getExpenses(tripId: string): Promise<Expense[]> {
    // Return demo expenses for demo trip
    if (isDemoTrip(tripId)) {
      return getDemoExpenses(tripId);
    }

    try {
      const q = query(
        collection(db, EXPENSES_COLLECTION),
        where("tripId", "==", tripId)
      );

      const querySnapshot = await getDocs(q);

      const expenses = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          tripId: data.tripId || "",
          amount: data.amount || 0,
          description: data.description || "",
          paidBy: data.paidBy || "",
          paidByName: data.paidByName || "Unknown",
          createdAt: parseDate(data.createdAt),
        };
      });

      expenses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return expenses;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  },

  async addExpense(expenseData: CreateExpenseData): Promise<Expense> {
    if (isDemoTrip(expenseData.tripId)) {
      throw new Error("Không thể thêm chi tiêu vào chuyến đi mẫu");
    }

    const now = new Date();
    const expenseDoc = {
      tripId: expenseData.tripId,
      amount: expenseData.amount,
      description: expenseData.description,
      paidBy: expenseData.paidBy,
      paidByName: expenseData.paidByName,
      createdAt: Timestamp.fromDate(now),
    };

    const docRef = await addDoc(
      collection(db, EXPENSES_COLLECTION),
      expenseDoc
    );

    const tripRef = doc(db, TRIPS_COLLECTION, expenseData.tripId);
    await updateDoc(tripRef, {
      totalExpense: increment(expenseData.amount),
      updatedAt: Timestamp.fromDate(now),
    });

    const tripSnap = await getDoc(tripRef);
    if (tripSnap.exists()) {
      const tripData = tripSnap.data();
      const participants = tripData.participants || [];
      const updatedParticipants = participants.map((p: any) => {
        if (p.userId === expenseData.paidBy) {
          return { ...p, totalSpent: (p.totalSpent || 0) + expenseData.amount };
        }
        return p;
      });

      await updateDoc(tripRef, { participants: updatedParticipants });
    }

    return {
      id: docRef.id,
      ...expenseData,
      createdAt: now,
    };
  },

  async deleteExpense(
    expenseId: string,
    tripId: string,
    amount: number,
    paidBy: string
  ): Promise<void> {
    if (isDemoExpense(expenseId) || isDemoTrip(tripId)) {
      throw new Error("Không thể xóa chi tiêu của chuyến đi mẫu");
    }

    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await deleteDoc(expenseRef);

    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    await updateDoc(tripRef, {
      totalExpense: increment(-amount),
      updatedAt: Timestamp.fromDate(new Date()),
    });

    const tripSnap = await getDoc(tripRef);
    if (tripSnap.exists()) {
      const tripData = tripSnap.data();
      const participants = tripData.participants || [];
      const updatedParticipants = participants.map((p: any) => {
        if (p.userId === paidBy) {
          return {
            ...p,
            totalSpent: Math.max(0, (p.totalSpent || 0) - amount),
          };
        }
        return p;
      });

      await updateDoc(tripRef, { participants: updatedParticipants });
    }
  },
};
