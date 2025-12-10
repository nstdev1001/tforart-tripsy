import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import { HomePageSkeleton } from "./skeleton";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <HomePageSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
