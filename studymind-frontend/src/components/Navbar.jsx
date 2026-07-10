import { useNavigate, Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.email?.slice(0, 2)?.toUpperCase() || "??";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="flex items-center justify-end gap-3 border-b border-slate-200 bg-white px-6 py-3">
      <Link
        to="/profile"
        className="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-slate-50"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-medium text-indigo-700">
          {initials}
        </div>
        <span className="hidden text-sm text-slate-600 sm:block">
          {user?.email}
        </span>
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
      >
        <LogOut size={15} />
        Déconnexion
      </button>
    </header>
  );
}
