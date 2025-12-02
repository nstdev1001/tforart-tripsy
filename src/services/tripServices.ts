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
import type {
  CreateExpenseData,
  CreateTripData,
  Expense,
  Trip,
  TripInvite,
} from "../types/trip";

const TRIPS_COLLECTION = "trips";
const EXPENSES_COLLECTION = "expenses";
const INVITES_COLLECTION = "invites";

export const tripService = {
  // Tạo mới chuyến đi
  async createTrip(tripData: CreateTripData): Promise<Trip> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated");
    }

    const now = new Date();

    // Tạo participant đầu tiên là người tạo trip
    const creatorParticipant = {
      id: currentUser.uid,
      userId: currentUser.uid,
      name: tripData.creatorName || currentUser.displayName || "Unknown",
      photoURL: tripData.creatorPhoto || currentUser.photoURL || "",
      totalSpent: 0,
    };

    const docRef = await addDoc(collection(db, TRIPS_COLLECTION), {
      name: tripData.name,
      creator: tripData.creator,
      creatorName: tripData.creatorName || currentUser.displayName || "Unknown",
      creatorPhoto: tripData.creatorPhoto || currentUser.photoURL || "",
      participants: [creatorParticipant],
      totalExpense: 0,
      startDate: Timestamp.fromDate(tripData.startDate),
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });

    return {
      id: docRef.id,
      name: tripData.name,
      creator: tripData.creator,
      creatorName: tripData.creatorName,
      creatorPhoto: tripData.creatorPhoto,
      participants: [creatorParticipant],
      totalExpense: 0,
      startDate: tripData.startDate,
      createdAt: now,
      updatedAt: now,
    };
  },

  // Lấy danh sách chuyến đi của user (bao gồm cả trips được mời)
  async getTrips(userId: string): Promise<Trip[]> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return [];
      }

      // Fallback: lấy tất cả trips và filter
      const allTripsQuery = query(collection(db, TRIPS_COLLECTION));
      const querySnapshot = await getDocs(allTripsQuery);

      const trips = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();

          // Kiểm tra và parse date an toàn
          const parseDate = (field: any): Date => {
            if (!field) return new Date();
            if (field.toDate && typeof field.toDate === "function") {
              return field.toDate();
            }
            if (field instanceof Date) return field;
            return new Date(field);
          };

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
          // User là creator
          if (trip.creator === userId) return true;
          // User là participant
          return trip.participants.some((p: any) => p.userId === userId);
        });

      trips.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return trips;
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw error;
    }
  },

  // Lấy chi tiết chuyến đi
  async getTripById(tripId: string): Promise<Trip | null> {
    try {
      const tripRef = doc(db, TRIPS_COLLECTION, tripId);
      const tripSnap = await getDoc(tripRef);

      if (!tripSnap.exists()) {
        return null;
      }

      const data = tripSnap.data();

      // Kiểm tra và parse date an toàn
      const parseDate = (field: any): Date => {
        if (!field) return new Date();
        if (field.toDate && typeof field.toDate === "function") {
          return field.toDate();
        }
        if (field instanceof Date) return field;
        return new Date(field);
      };

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

  // Thêm chi tiêu
  async addExpense(expenseData: CreateExpenseData): Promise<Expense> {
    const now = new Date();

    // Thêm expense vào collection expenses
    const expenseRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
      ...expenseData,
      createdAt: Timestamp.fromDate(now),
    });

    // Cập nhật totalExpense trong trip
    const tripRef = doc(db, TRIPS_COLLECTION, expenseData.tripId);
    const tripSnap = await getDoc(tripRef);

    if (tripSnap.exists()) {
      const tripData = tripSnap.data();
      const newTotalExpense = (tripData.totalExpense || 0) + expenseData.amount;

      // Cập nhật totalSpent của participant
      const participants = tripData.participants || [];
      const updatedParticipants = participants.map((p: any) => {
        if (p.userId === expenseData.paidBy) {
          return {
            ...p,
            totalSpent: (p.totalSpent || 0) + expenseData.amount,
          };
        }
        return p;
      });

      await updateDoc(tripRef, {
        totalExpense: newTotalExpense,
        participants: updatedParticipants,
        updatedAt: Timestamp.fromDate(now),
      });
    }

    return {
      id: expenseRef.id,
      ...expenseData,
      createdAt: now,
    };
  },

  // Lấy danh sách chi tiêu của chuyến đi
  async getExpenses(tripId: string): Promise<Expense[]> {
    try {
      const q = query(
        collection(db, EXPENSES_COLLECTION),
        where("tripId", "==", tripId)
      );

      const querySnapshot = await getDocs(q);

      // Kiểm tra và parse date an toàn
      const parseDate = (field: any): Date => {
        if (!field) return new Date();
        if (field.toDate && typeof field.toDate === "function") {
          return field.toDate();
        }
        if (field instanceof Date) return field;
        return new Date(field);
      };

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

  // Xóa chi tiêu
  async deleteExpense(
    expenseId: string,
    tripId: string,
    amount: number,
    paidBy: string
  ): Promise<void> {
    // Xóa expense
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await deleteDoc(expenseRef);

    // Cập nhật lại totalExpense trong trip
    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    const tripSnap = await getDoc(tripRef);

    if (tripSnap.exists()) {
      const tripData = tripSnap.data();
      const newTotalExpense = Math.max(
        (tripData.totalExpense || 0) - amount,
        0
      );

      // Cập nhật totalSpent của participant
      const participants = tripData.participants || [];
      const updatedParticipants = participants.map((p: any) => {
        if (p.userId === paidBy) {
          return {
            ...p,
            totalSpent: Math.max((p.totalSpent || 0) - amount, 0),
          };
        }
        return p;
      });

      await updateDoc(tripRef, {
        totalExpense: newTotalExpense,
        participants: updatedParticipants,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    }
  },

  // Tạo invite link
  async createInvite(tripId: string): Promise<TripInvite> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated");
    }

    // Lấy thông tin trip
    const trip = await this.getTripById(tripId);
    if (!trip) {
      throw new Error("Trip not found");
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 ngày

    const inviteRef = await addDoc(collection(db, INVITES_COLLECTION), {
      tripId,
      tripName: trip.name,
      invitedBy: currentUser.uid,
      invitedByName: currentUser.displayName || "Unknown",
      createdAt: Timestamp.fromDate(now),
      expiresAt: Timestamp.fromDate(expiresAt),
    });

    return {
      id: inviteRef.id,
      tripId,
      tripName: trip.name,
      invitedBy: currentUser.uid,
      invitedByName: currentUser.displayName || "Unknown",
      createdAt: now,
      expiresAt,
    };
  },

  // Lấy thông tin invite
  async getInvite(inviteId: string): Promise<TripInvite | null> {
    try {
      const inviteRef = doc(db, INVITES_COLLECTION, inviteId);
      const inviteSnap = await getDoc(inviteRef);

      if (!inviteSnap.exists()) {
        return null;
      }

      const data = inviteSnap.data();

      // Kiểm tra và parse date an toàn
      const parseDate = (field: any): Date => {
        if (!field) return new Date();
        if (field.toDate && typeof field.toDate === "function") {
          return field.toDate();
        }
        if (field instanceof Date) return field;
        return new Date(field);
      };

      return {
        id: inviteSnap.id,
        tripId: data.tripId || "",
        tripName: data.tripName || "",
        invitedBy: data.invitedBy || "",
        invitedByName: data.invitedByName || "Unknown",
        createdAt: parseDate(data.createdAt),
        expiresAt: parseDate(data.expiresAt),
      };
    } catch (error) {
      console.error("Error fetching invite:", error);
      throw error;
    }
  },

  // Chấp nhận lời mời và tham gia chuyến đi
  async acceptInvite(inviteId: string): Promise<Trip> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated");
    }

    // Lấy thông tin invite
    const invite = await this.getInvite(inviteId);
    if (!invite) {
      throw new Error("Invite not found");
    }

    // Kiểm tra hết hạn
    if (new Date() > invite.expiresAt) {
      throw new Error("Invite has expired");
    }

    // Lấy thông tin trip
    const tripRef = doc(db, TRIPS_COLLECTION, invite.tripId);
    const tripSnap = await getDoc(tripRef);

    if (!tripSnap.exists()) {
      throw new Error("Trip not found");
    }

    const tripData = tripSnap.data();
    const participants = tripData.participants || [];

    // Kiểm tra xem user đã là participant chưa
    const isAlreadyParticipant = participants.some(
      (p: any) => p.userId === currentUser.uid
    );

    if (!isAlreadyParticipant) {
      // Thêm user vào participants
      const newParticipant = {
        id: currentUser.uid,
        userId: currentUser.uid,
        name: currentUser.displayName || "Unknown",
        photoURL: currentUser.photoURL || "",
        totalSpent: 0,
      };

      await updateDoc(tripRef, {
        participants: [...participants, newParticipant],
        updatedAt: Timestamp.fromDate(new Date()),
      });
    }

    // Trả về trip đã cập nhật
    return (await this.getTripById(invite.tripId))!;
  },

  // Thêm thành viên vào chuyến đi
  async addParticipant(
    tripId: string,
    participant: { name: string; userId?: string; photoURL?: string }
  ): Promise<void> {
    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    const tripSnap = await getDoc(tripRef);

    if (tripSnap.exists()) {
      const tripData = tripSnap.data();
      const participants = tripData.participants || [];

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
    }
  },
};
