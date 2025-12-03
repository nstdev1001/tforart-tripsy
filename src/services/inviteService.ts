/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import type { Trip, TripInvite } from "../types/trip";
import { parseDate } from "./helpers";

const TRIPS_COLLECTION = "trips";
const INVITES_COLLECTION = "invites";

export const inviteService = {
  async getInvite(inviteId: string): Promise<TripInvite | null> {
    try {
      const inviteRef = doc(db, INVITES_COLLECTION, inviteId);
      const inviteSnap = await getDoc(inviteRef);

      if (!inviteSnap.exists()) {
        return null;
      }

      const data = inviteSnap.data();

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

  async createInvite(tripId: string): Promise<TripInvite> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    const tripSnap = await getDoc(tripRef);

    if (!tripSnap.exists()) {
      throw new Error("Trip not found");
    }

    const trip = tripSnap.data();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 ngày

    const inviteDoc = {
      tripId,
      tripName: trip.name,
      invitedBy: currentUser.uid,
      invitedByName: currentUser.displayName || "Unknown",
      createdAt: Timestamp.fromDate(now),
      expiresAt: Timestamp.fromDate(expiresAt),
    };

    const docRef = await addDoc(collection(db, INVITES_COLLECTION), inviteDoc);

    return {
      id: docRef.id,
      tripId,
      tripName: trip.name,
      invitedBy: currentUser.uid,
      invitedByName: currentUser.displayName || "Unknown",
      createdAt: now,
      expiresAt,
    };
  },

  async acceptInvite(inviteId: string): Promise<Trip> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const invite = await this.getInvite(inviteId);
    if (!invite) {
      throw new Error("Invite not found");
    }

    if (new Date() > invite.expiresAt) {
      throw new Error("Invite has expired");
    }

    const tripRef = doc(db, TRIPS_COLLECTION, invite.tripId);
    const tripSnap = await getDoc(tripRef);

    if (!tripSnap.exists()) {
      throw new Error("Trip not found");
    }

    const tripData = tripSnap.data();
    const participants = tripData.participants || [];

    const isAlreadyParticipant = participants.some(
      (p: any) => p.userId === currentUser.uid
    );

    if (!isAlreadyParticipant) {
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

    const updatedTripSnap = await getDoc(tripRef);
    const updatedData = updatedTripSnap.data()!;

    return {
      id: updatedTripSnap.id,
      name: updatedData.name || "",
      creator: updatedData.creator || "",
      creatorName: updatedData.creatorName || "Unknown",
      creatorPhoto: updatedData.creatorPhoto || "",
      participants: updatedData.participants || [],
      totalExpense: updatedData.totalExpense || 0,
      startDate: parseDate(updatedData.startDate),
      createdAt: parseDate(updatedData.createdAt),
      updatedAt: parseDate(updatedData.updatedAt),
    };
  },
};
