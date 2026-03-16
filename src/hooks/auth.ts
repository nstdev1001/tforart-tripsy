import { notifications } from "@mantine/notifications";
import type { User } from "firebase/auth";
import {
  FacebookAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, facebookProvider, googleProvider } from "../config/firebase";

const POPUP_CLOSED_ERRORS = [
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
];
const isPopupClosedError = (error: unknown): boolean =>
  error instanceof Error &&
  "code" in error &&
  POPUP_CLOSED_ERRORS.includes((error as { code: string }).code);

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: unknown) {
      if (isPopupClosedError(error)) return null;
      notifications.show({
        title: "Lỗi đăng nhập",
        message: error instanceof Error ? error.message : "Lỗi không xác định",
        color: "red",
      });
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      if (accessToken && result.user.photoURL?.includes("graph.facebook.com")) {
        const photoURL = `${result.user.photoURL}?type=large&access_token=${accessToken}`;
        await updateProfile(result.user, { photoURL });
      }
      return result.user;
    } catch (error: unknown) {
      if (isPopupClosedError(error)) return null;
      notifications.show({
        title: "Lỗi đăng nhập",
        message: error instanceof Error ? error.message : "Lỗi không xác định",
        color: "red",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: unknown) {
      notifications.show({
        title: "Lỗi đăng xuất",
        message: error instanceof Error ? error.message : "Lỗi không xác định",
        color: "red",
      });
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
  };
};
