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
        where("tripId", "==", tripId),
      );

      const querySnapshot = await getDocs(q);

      const expenses = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const expense: Record<string, any> = {
          id: doc.id,
          tripId: data.tripId || "",
          amount: data.amount || 0,
          mainCurrency: data.mainCurrency || "VND",
          description: data.description || "",
          paidBy: data.paidBy,
          paidByName: data.paidByName,
          addExpenseBy: data.addExpenseBy ?? null,
          addExpenseByName: data.addExpenseByName ?? null,
          createdAt: parseDate(data.createdAt),
        };

        if (data.mainCurrency !== "VND") {
          if (data.originalAmount !== undefined)
            expense.originalAmount = data.originalAmount;
          if (data.exchangeRate !== undefined)
            expense.exchangeRate = data.exchangeRate;
        }

        return expense as Expense;
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
      throw new Error("Không thể thêm chi tiêu vào hoạt động mẫu");
    }

    const now = new Date();
    const expenseDoc: Record<string, any> = {
      tripId: expenseData.tripId,
      amount: expenseData.amount,
      mainCurrency: expenseData.mainCurrency || "VND",
      description: expenseData.description,
      paidBy: expenseData.paidBy,
      paidByName: expenseData.paidByName,
      addExpenseBy: expenseData.addExpenseBy,
      addExpenseByName: expenseData.addExpenseByName,
      createdAt: Timestamp.fromDate(now),
    };

    if (expenseData.mainCurrency !== "VND") {
      if (
        expenseData.originalAmount !== undefined &&
        expenseData.originalAmount !== null
      ) {
        expenseDoc.originalAmount = expenseData.originalAmount;
      }
      if (
        expenseData.exchangeRate !== undefined &&
        expenseData.exchangeRate !== null
      ) {
        expenseDoc.exchangeRate = expenseData.exchangeRate;
      }
    }

    const docRef = await addDoc(
      collection(db, EXPENSES_COLLECTION),
      expenseDoc,
    );

    const tripRef = doc(db, TRIPS_COLLECTION, expenseData.tripId);

    // 1. Đọc dữ liệu Trip trước
    const tripSnap = await getDoc(tripRef);
    if (!tripSnap.exists()) {
      throw new Error("Trip not found");
    }

    // 2. Chuẩn bị biến đổi participants
    const tripData = tripSnap.data();
    const participants = tripData.participants || [];
    const updatedParticipants = participants.map((p: any) => {
      if (p.userId === expenseData.paidBy) {
        const updated: Record<string, any> = {
          ...p,
          totalSpent: (p.totalSpent || 0) + expenseData.amount,
        };
        if (
          expenseData.mainCurrency !== "VND" &&
          typeof expenseData.originalAmount === "number"
        ) {
          updated.totalOriginalSpent =
            (p.totalOriginalSpent || 0) + expenseData.originalAmount;
        }
        return updated;
      }
      return p;
    });

    // 3. Chuẩn bị object update toàn bộ (Gộp cả tính tổng và danh sách)
    const tripUpdates: Record<string, any> = {
      totalExpense: increment(expenseData.amount),
      participants: updatedParticipants,
      updatedAt: Timestamp.fromDate(now),
    };

    if (
      expenseData.mainCurrency !== "VND" &&
      typeof expenseData.originalAmount === "number"
    ) {
      tripUpdates.totalOriginalExpense = increment(expenseData.originalAmount);
    }

    // 4. Gọi 1 lần Write duy nhất
    await updateDoc(tripRef, tripUpdates);

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
    paidBy: string,
    originalAmount?: number,
  ): Promise<void> {
    if (isDemoExpense(expenseId) || isDemoTrip(tripId)) {
      throw new Error("Không thể xóa chi tiêu của hoạt động mẫu");
    }

    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await deleteDoc(expenseRef);

    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    const tripUpdates: Record<string, any> = {
      totalExpense: increment(-amount),
      updatedAt: Timestamp.fromDate(new Date()),
    };

    if (typeof originalAmount === "number") {
      tripUpdates.totalOriginalExpense = increment(-originalAmount);
    }

    await updateDoc(tripRef, tripUpdates);

    const tripSnap = await getDoc(tripRef);
    if (tripSnap.exists()) {
      const tripData = tripSnap.data();
      const participants = tripData.participants || [];
      const updatedParticipants = participants.map((p: any) => {
        if (p.userId === paidBy) {
          const updated: Record<string, any> = {
            ...p,
            totalSpent: Math.max(0, (p.totalSpent || 0) - amount),
          };
          if (typeof originalAmount === "number") {
            updated.totalOriginalSpent = Math.max(
              0,
              (p.totalOriginalSpent || 0) - originalAmount,
            );
          } else if (p.totalOriginalSpent !== undefined) {
            updated.totalOriginalSpent = p.totalOriginalSpent;
          }
          return updated;
        }
        return p;
      });

      await updateDoc(tripRef, { participants: updatedParticipants });
    }
  },
};
