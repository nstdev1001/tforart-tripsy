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
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import type { CreateTripData, Trip } from "../types/trip";
import { parseDate } from "./helpers";

const TRIPS_COLLECTION = "trips";

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
            createdAt: parseDate(data.createdAt),
            updatedAt: parseDate(data.updatedAt),
          };
        })
        .filter((trip) => {
          if (trip.creator === userId) return true;
          return trip.participants.some((p: any) => p.userId === userId);
        });

      trips.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return trips;
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw error;
    }
  },

  async getTripById(tripId: string): Promise<Trip | null> {
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
        createdAt: parseDate(data.createdAt),
        updatedAt: parseDate(data.updatedAt),
      };
    } catch (error) {
      console.error("Error fetching trip:", error);
      throw error;
    }
  },

  async updateTrip(
    tripId: string,
    updates: Partial<CreateTripData>
  ): Promise<void> {
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
    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    await deleteDoc(tripRef);
  },

  async addParticipant(
    tripId: string,
    participant: { name: string; userId?: string; photoURL?: string }
  ): Promise<void> {
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
};
