import { Link } from "react-router-dom";

// Palette de couleurs cyclée par matière (effet visuel de la maquette).
const palettes = [
  { bg: "bg-indigo-50", text: "text-indigo-700", bar: "bg-indigo-600" },
  { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-600" },
  { bg: "bg-orange-50", text: "text-orange-700", bar: "bg-orange-600" },
  { bg: "bg-sky-50", text: "text-sky-700", bar: "bg-sky-600" },
  { bg: "bg-rose-50", text: "text-rose-700", bar: "bg-rose-600" },
];

export function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-500">
        {Icon && <Icon size={15} />}
        {label}
      </div>
      <div className="text-2xl font-medium text-slate-900">{value}</div>
    </div>
  );
}

export function CourseCard({ course }) {
  const p = palettes[(course.idCours || 0) % palettes.length];
  const initial = (course.titre || "?").charAt(0).toUpperCase();

  return (
    <Link
      to={`/courses/${course.idCours}`}
      className="block rounded-xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-indigo-300"
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${p.bg} ${p.text} text-lg font-medium`}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium text-slate-900">
            {course.titre}
          </div>
          <div className="truncate text-xs text-slate-500">
            {course.description || "Aucune description"}
          </div>
        </div>
      </div>
    </Link>
  );
}
