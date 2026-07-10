import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getCoursesByUser } from "../services/courseService";
import { getDocumentsByCourse } from "../services/documentService";

export default function DocumentsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const courses = await getCoursesByUser(user.idUtilisateur);
        const all = [];
        for (const c of courses) {
          const docs = await getDocumentsByCourse(c.idCours);
          docs.forEach((d) => all.push({ ...d, course: c }));
        }
        setItems(all);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.idUtilisateur]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-medium text-slate-900">Documents</h1>

      {loading ? (
        <div className="text-slate-400">Chargement…</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Aucun document. Ouvre un cours pour en ajouter.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((doc) => (
            <div
              key={doc.idDocument}
              className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <FileText size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-slate-800">
                  {doc.nomFichier}
                </div>
                <Link
                  to={`/courses/${doc.course.idCours}`}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  {doc.course.titre}
                </Link>
              </div>
              <Link
                to={`/summaries/${doc.idDocument}`}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700 transition hover:bg-indigo-100"
              >
                <Sparkles size={15} />
                Résumé
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
