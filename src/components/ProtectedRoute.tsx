import { Navigate } from "react-router-dom";
import { useUserStore } from "../hooks/useUserStore";
import { HomePageSkeleton } from "./skeleton";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUserStore();

  if (loading) {
    return <HomePageSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
