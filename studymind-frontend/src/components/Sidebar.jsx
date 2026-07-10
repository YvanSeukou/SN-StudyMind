import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, BookOpen, FileText, CheckSquare, Shield, Brain } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/courses", label: "Mes cours", icon: BookOpen },
  { to: "/tasks", label: "Mes tâches", icon: CheckSquare },
  { to: "/documents", label: "Documents", icon: FileText },
];

export default function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-slate-200 bg-white px-3 py-5 lg:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Brain size={18} />
        </div>
        <span className="text-[15px] font-medium text-slate-900">
          StudyMind
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        {user?.role === "ADMIN" && (
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`
            }
          >
            <Shield size={17} />
            Administration
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
