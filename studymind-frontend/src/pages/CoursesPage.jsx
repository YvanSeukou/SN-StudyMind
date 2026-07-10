import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getCoursesByUser,
  createCourse,
} from "../services/courseService";
import { CourseCard } from "../components/Cards";
import { useToast } from "../context/ToastContext";

export default function CoursesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const data = await getCoursesByUser(user.idUtilisateur);
      setCourses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [user.idUtilisateur]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await createCourse(user.idUtilisateur, { titre, description });
      setTitre("");
      setDescription("");
      setShowForm(false);
      await load();
      toast.success("Cours créé avec succès.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-medium text-slate-900">Mes cours</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Annuler" : "Nouveau cours"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 rounded-xl bg-white p-5 ring-1 ring-slate-200"
        >
          {error && (
            <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}
          <div className="mb-3">
            <label className="mb-1 block text-sm text-slate-600">Titre</label>
            <input
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex : Algèbre linéaire"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-slate-600">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Création…" : "Créer le cours"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-slate-400">Chargement…</div>
      ) : courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Aucun cours. Crée ton premier cours pour commencer.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {courses.map((c) => (
            <CourseCard key={c.idCours} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
