import { notifications } from "@mantine/notifications";
import type { User } from "firebase/auth";
import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, googleProvider } from "../config/firebase";

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
    signOut,
  };
};
