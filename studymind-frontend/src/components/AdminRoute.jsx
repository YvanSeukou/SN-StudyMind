import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Autorise l'acces uniquement aux utilisateurs de role ADMIN.
// Un etudiant qui tente d'acceder est renvoye vers son tableau de bord.
export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        Chargement…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
