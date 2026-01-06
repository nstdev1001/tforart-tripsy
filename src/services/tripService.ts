/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { DEMO_TRIP, getDemoTripById, isDemoTrip } from "../data/demoData";
import type { CreateTripData, Trip } from "../types/trip";
import { parseDate } from "./helpers";

const TRIPS_COLLECTION = "trips";
const EXPENSES_COLLECTION = "expenses";

export const tripService = {
  async createTrip(tripData: CreateTripData): Promise<Trip> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const now = new Date();
    const tripDoc = {
      name: tripData.name,
      creator: tripData.creator,
      creatorName: currentUser.displayName || "Unknown",
      creatorPhoto: currentUser.photoURL || "",
      participants: [
        {
          id: currentUser.uid,
          userId: currentUser.uid,
          name: currentUser.displayName || "Unknown",
          photoURL: currentUser.photoURL || "",
          totalSpent: 0,
        },
      ],
      totalExpense: 0,
      startDate: Timestamp.fromDate(tripData.startDate),
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    };

    const docRef = await addDoc(collection(db, TRIPS_COLLECTION), tripDoc);

    return {
      id: docRef.id,
      name: tripData.name,
      creator: tripData.creator,
      creatorName: currentUser.displayName || "Unknown",
      creatorPhoto: currentUser.photoURL || "",
      participants: tripDoc.participants,
      totalExpense: 0,
      startDate: tripData.startDate,
      createdAt: now,
      updatedAt: now,
    };
  },

  async getTripById(tripId: string): Promise<Trip | null> {
    // Check if it's a demo trip first
    const demoTrip = getDemoTripById(tripId);
    if (demoTrip) {
      return demoTrip;
    }

    try {
      const tripRef = doc(db, TRIPS_COLLECTION, tripId);
      const tripSnap = await getDoc(tripRef);

      if (!tripSnap.exists()) {
        return null;
      }

      const data = tripSnap.data();

      return {
        id: tripSnap.id,
        name: data.name || "",
        creator: data.creator || "",
        creatorName: data.creatorName || "Unknown",
        creatorPhoto: data.creatorPhoto || "",
        participants: data.participants || [],
        totalExpense: data.totalExpense || 0,
        startDate: parseDate(data.startDate),
        endDate: data.endDate ? parseDate(data.endDate) : undefined,
        isEnded: data.isEnded || false,
        notes: data.notes || "",
        createdAt: parseDate(data.createdAt),
        updatedAt: parseDate(data.updatedAt),
      };
    } catch (error) {
      console.error("Error fetching trip:", error);
      throw error;
    }
  },

  async getTrips(userId: string): Promise<Trip[]> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return [];
      }

      const allTripsQuery = query(collection(db, TRIPS_COLLECTION));
      const querySnapshot = await getDocs(allTripsQuery);

      const trips = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            creator: data.creator || "",
            creatorName: data.creatorName || "Unknown",
            creatorPhoto: data.creatorPhoto || "",
            participants: data.participants || [],
            totalExpense: data.totalExpense || 0,
            startDate: parseDate(data.startDate),
            endDate: data.endDate ? parseDate(data.endDate) : undefined,
            isEnded: data.isEnded || false,
            notes: data.notes || "",
            createdAt: parseDate(data.createdAt),
            updatedAt: parseDate(data.updatedAt),
          };
        })
        .filter((trip) => {
          if (trip.creator === userId) return true;
          return trip.participants.some((p: any) => p.userId === userId);
        });

      trips.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Add demo trip at the end of the list
      return [...trips, DEMO_TRIP];
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw error;
    }
  },

  async updateTrip(
    tripId: string,
    updates: Partial<CreateTripData>
  ): Promise<void> {
    if (isDemoTrip(tripId)) {
      throw new Error("Không thể chỉnh sửa chuyến đi mẫu");
    }

    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date()),
    };

    if (updates.startDate) {
      updateData.startDate = Timestamp.fromDate(updates.startDate);
    }

    await updateDoc(tripRef, updateData);
  },

  async deleteTrip(tripId: string): Promise<void> {
    if (isDemoTrip(tripId)) {
      throw new Error("Không thể xóa chuyến đi mẫu");
    }

    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    await deleteDoc(tripRef);
  },

  async addParticipant(
    tripId: string,
    participant: { name: string; userId?: string; photoURL?: string }
  ): Promise<void> {
    if (isDemoTrip(tripId)) {
      throw new Error("Không thể thêm thành viên vào chuyến đi mẫu");
    }

    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    const tripSnap = await getDoc(tripRef);

    if (!tripSnap.exists()) {
      throw new Error("Trip not found");
    }

    const tripData = tripSnap.data();
    const participants = tripData.participants || [];

    const isDuplicate = participants.some(
      (p: any) => p.name.toLowerCase() === participant.name.toLowerCase()
    );

    if (isDuplicate) {
      throw new Error("Thành viên với tên này đã tồn tại");
    }

    const newParticipant = {
      id: participant.userId || `guest_${Date.now()}`,
      userId: participant.userId || `guest_${Date.now()}`,
      name: participant.name,
      photoURL: participant.photoURL || "",
      totalSpent: 0,
    };

    await updateDoc(tripRef, {
      participants: [...participants, newParticipant],
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },

  async removeParticipant(
    tripId: string,
    participantId: string
  ): Promise<void> {
    if (isDemoTrip(tripId)) {
      throw new Error("Không thể xóa thành viên khỏi chuyến đi mẫu");
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    if (participantId === currentUser.uid) {
      throw new Error("Không thể xóa chính bạn khỏi chuyến đi");
    }

    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    const tripSnap = await getDoc(tripRef);

    if (!tripSnap.exists()) {
      throw new Error("Trip not found");
    }

    const tripData = tripSnap.data();
    const participants = tripData.participants || [];

    const participantToRemove = participants.find(
      (p: any) => p.id === participantId
    );

    if (!participantToRemove) {
      throw new Error("Participant not found");
    }

    const expensesQuery = query(
      collection(db, EXPENSES_COLLECTION),
      where("tripId", "==", tripId),
      where("paidBy", "==", participantId)
    );
    const expensesSnapshot = await getDocs(expensesQuery);

    const deletePromises = expensesSnapshot.docs.map((expenseDoc) =>
      deleteDoc(doc(db, EXPENSES_COLLECTION, expenseDoc.id))
    );
    await Promise.all(deletePromises);

    const updatedParticipants = participants.filter(
      (p: any) => p.id !== participantId
    );

    const newTotalExpense = Math.max(
      0,
      (tripData.totalExpense || 0) - (participantToRemove.totalSpent || 0)
    );

    await updateDoc(tripRef, {
      participants: updatedParticipants,
      totalExpense: newTotalExpense,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },

  async endTrip(tripId: string): Promise<void> {
    if (isDemoTrip(tripId)) {
      throw new Error("Không thể kết thúc chuyến đi mẫu");
    }

    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    await updateDoc(tripRef, {
      isEnded: true,
      endDate: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },

  async updateTripNotes(tripId: string, notes: string): Promise<void> {
    if (isDemoTrip(tripId)) {
      throw new Error("Không thể chỉnh sửa ghi chú chuyến đi mẫu");
    }

    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    await updateDoc(tripRef, {
      notes,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },
};
