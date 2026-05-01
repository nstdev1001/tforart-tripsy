import { notifications } from "@mantine/notifications";
import type { User, UserCredential } from "firebase/auth";
import {
  FacebookAuthProvider,
  signOut as firebaseSignOut,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, facebookProvider, googleProvider } from "../config/firebase";

const POPUP_CLOSED_ERRORS = [
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
];

// Helper kiểm tra lỗi popup một cách an toàn
type AuthError = { code?: string; message?: string };

const isPopupClosedError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;
  const code = (error as AuthError).code;
  return !!code && POPUP_CLOSED_ERRORS.includes(code);
};

const shouldUseRedirect = (): boolean => {
  const ua = navigator.userAgent;
  return /FBAN|FBAV|Instagram|Line|Zalo|Twitter|TikTok|WebView|wv/i.test(ua);
};

// Hàm helper để nâng cấp ảnh Facebook tránh trùng lặp code
const upgradeFacebookPhoto = async (result: UserCredential) => {
  const credential = FacebookAuthProvider.credentialFromResult(result);
  const accessToken = credential?.accessToken;

  if (accessToken && result.user.photoURL?.includes("graph.facebook.com")) {
    const photoURL = `${result.user.photoURL}?type=large&access_token=${accessToken}`;
    await updateProfile(result.user, { photoURL });
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Đưa onAuthStateChanged ra ngoài để đảm bảo luôn có hàm unsubscribe đồng bộ
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Xử lý Redirect Result riêng biệt
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.providerId === FacebookAuthProvider.PROVIDER_ID) {
          await upgradeFacebookPhoto(result);
        }
      } catch (error: unknown) {
        const message =
          error && typeof error === "object"
            ? (error as AuthError).message
            : undefined;
        notifications.show({
          title: "Lỗi đăng nhập",
          message: message || "Lỗi không xác định",
          color: "red",
        });
      }
    };

    void handleRedirect();

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      if (shouldUseRedirect()) {
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: unknown) {
      const message =
        error && typeof error === "object"
          ? (error as AuthError).message
          : undefined;
      if (isPopupClosedError(error)) return null;
      notifications.show({
        title: "Lỗi đăng nhập",
        message: message || "Lỗi không xác định",
        color: "red",
      });
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      if (shouldUseRedirect()) {
        await signInWithRedirect(auth, facebookProvider);
        return null;
      }
      const result = await signInWithPopup(auth, facebookProvider);
      await upgradeFacebookPhoto(result);
      return result.user;
    } catch (error: unknown) {
      const message =
        error && typeof error === "object"
          ? (error as AuthError).message
          : undefined;
      if (isPopupClosedError(error)) return null;
      notifications.show({
        title: "Lỗi đăng nhập",
        message: message || "Lỗi không xác định",
        color: "red",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: unknown) {
      const message =
        error && typeof error === "object"
          ? (error as AuthError).message
          : undefined;
      notifications.show({
        title: "Lỗi đăng xuất",
        message: message || "Lỗi không xác định",
        color: "red",
      });
      throw error;
    }
  };

  return { user, loading, signInWithGoogle, signInWithFacebook, signOut };
};
