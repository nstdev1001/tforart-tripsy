/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import type { CreateTripData, Trip } from "../types/trip";

const TRIPS_COLLECTION = "trips";

export const tripService = {
  // Tạo mới chuyến đi
  async createTrip(tripData: CreateTripData): Promise<Trip> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated");
    }

    const now = new Date();
    console.log("Creating trip with data:", tripData);

    const docRef = await addDoc(collection(db, TRIPS_COLLECTION), {
      name: tripData.name,
      creator: tripData.creator,
      creatorName: tripData.creatorName || currentUser.displayName || "Unknown",
      creatorPhoto: tripData.creatorPhoto || currentUser.photoURL || "",
      startDate: Timestamp.fromDate(tripData.startDate),
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });

    console.log("Trip created with ID:", docRef.id);

    return {
      id: docRef.id,
      name: tripData.name,
      creator: tripData.creator,
      creatorName: tripData.creatorName,
      creatorPhoto: tripData.creatorPhoto,
      startDate: tripData.startDate,
      createdAt: now,
      updatedAt: now,
    };
  },

  // Lấy danh sách chuyến đi của user
  async getTrips(userId: string): Promise<Trip[]> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("No authenticated user");
        return [];
      }

      console.log("Fetching trips for user:", userId);

      const q = query(
        collection(db, TRIPS_COLLECTION),
        where("creator", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      console.log("Query snapshot size:", querySnapshot.size);

      const trips = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          creator: data.creator,
          creatorName: data.creatorName || "Unknown",
          creatorPhoto: data.creatorPhoto || "",
          startDate: data.startDate.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
      });

      trips.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return trips;
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw error;
    }
  },

  // Cập nhật chuyến đi
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

  // Xóa chuyến đi
  async deleteTrip(tripId: string): Promise<void> {
    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    await deleteDoc(tripRef);
  },
};
