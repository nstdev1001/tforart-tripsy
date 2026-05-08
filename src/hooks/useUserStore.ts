import type { User } from "firebase/auth";
import { useContext, createContext } from "react";

interface UserContextValue {
  user: User | null;
  loading: boolean;
  signOut?: () => Promise<void>;
}
export const UserContext = createContext<UserContextValue | undefined>(
  undefined,
);

export const useUserStore = (): UserContextValue => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserStore must be used within a UserProvider");
  }
  return context;
};
