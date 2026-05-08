import { useMemo, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { UserContext } from "../hooks/useUserStore";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading, signOut } = useAuth();
  const value = useMemo(
    () => ({ user, loading, signOut }),
    [user, loading, signOut],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
