import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user, authLoaded } = useAuth();

  // Wait for auth to load before deciding
  if (!authLoaded) return <p className="p-10">Checking session...</p>;

  // Block non-admins
  if (!user?.isAdmin) return <Navigate to="/" replace />;

  return children;
}

