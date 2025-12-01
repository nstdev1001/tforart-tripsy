/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { CreateTripData, Trip } from "../types/trip";

const TRIPS_COLLECTION = "trips";

export const tripService = {
  // Tạo mới chuyến đi
  async createTrip(tripData: CreateTripData): Promise<Trip> {
    const now = new Date();
    const docRef = await addDoc(collection(db, TRIPS_COLLECTION), {
      ...tripData,
      startDate: Timestamp.fromDate(tripData.startDate),
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });

    return {
      id: docRef.id,
      ...tripData,
      createdAt: now,
      updatedAt: now,
    };
  },

  // Lấy danh sách chuyến đi của user
  async getTrips(userId: string): Promise<Trip[]> {
    const q = query(
      collection(db, TRIPS_COLLECTION),
      where("creator", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        creator: data.creator,
        startDate: data.startDate.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });
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
