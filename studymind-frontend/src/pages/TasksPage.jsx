import { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash2, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getTasksByUser,
  createTask,
  updateTask,
  deleteTask,
  PRIORITES,
  STATUTS,
} from "../services/taskService";
import { getCoursesByUser } from "../services/courseService";
import { useToast } from "../context/ToastContext";

const LABEL_PRIORITE = { FAIBLE: "Faible", MOYENNE: "Moyenne", ELEVEE: "Élevée" };
const LABEL_STATUT = {
  A_FAIRE: "À faire",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
};
const COULEUR_PRIORITE = {
  FAIBLE: "bg-emerald-50 text-emerald-700",
  MOYENNE: "bg-orange-50 text-orange-700",
  ELEVEE: "bg-rose-50 text-rose-700",
};
const COULEUR_STATUT = {
  A_FAIRE: "bg-slate-100 text-slate-600",
  EN_COURS: "bg-indigo-50 text-indigo-700",
  TERMINEE: "bg-emerald-50 text-emerald-700",
};

const FORM_VIDE = {
  titre: "",
  description: "",
  dateLimite: "",
  priorite: "MOYENNE",
  statut: "A_FAIRE",
  idCours: "",
};

export default function TasksPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(FORM_VIDE);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const [t, c] = await Promise.all([
        getTasksByUser(user.idUtilisateur),
        getCoursesByUser(user.idUtilisateur),
      ]);
      setTasks(Array.isArray(t) ? t : []);
      setCourses(Array.isArray(c) ? c : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [user.idUtilisateur]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function resetForm() {
    setForm(FORM_VIDE);
    setEditingId(null);
    setShowForm(false);
  }

  // Construit le corps envoyé au back (idCours null si aucun cours choisi).
  function buildPayload(f) {
    return {
      titre: f.titre,
      description: f.description,
      dateLimite: f.dateLimite || null,
      priorite: f.priorite,
      statut: f.statut,
      idCours: f.idCours ? Number(f.idCours) : null,
      idUtilisateur: user.idUtilisateur,
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editingId) {
        await updateTask(editingId, buildPayload(form));
      } else {
        await createTask(user.idUtilisateur, buildPayload(form));
      }
      resetForm();
      await load();
      toast.success(editingId ? "Tâche modifiée." : "Tâche créée.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(task) {
    setForm({
      titre: task.titre || "",
      description: task.description || "",
      dateLimite: task.dateLimite || "",
      priorite: task.priorite || "MOYENNE",
      statut: task.statut || "A_FAIRE",
      idCours: task.idCours ? String(task.idCours) : "",
    });
    setEditingId(task.idTache);
    setShowForm(true);
  }

  async function changeStatut(task, statut) {
    setError("");
    try {
      await updateTask(task.idTache, {
        titre: task.titre,
        description: task.description,
        dateLimite: task.dateLimite || null,
        priorite: task.priorite,
        statut,
        idCours: task.idCours ?? null,
        idUtilisateur: user.idUtilisateur,
      });
      await load();
      toast.success("Statut mis à jour.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Supprimer cette tâche ?")) return;
    setError("");
    try {
      await deleteTask(id);
      await load();
      toast.success("Tâche supprimée.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-medium text-slate-900">Mes tâches</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Annuler" : "Nouvelle tâche"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl bg-white p-5 ring-1 ring-slate-200"
        >
          <div className="mb-3">
            <label className="mb-1 block text-sm text-slate-600">Titre</label>
            <input
              required
              value={form.titre}
              onChange={(e) => update("titre", e.target.value)}
              placeholder="Ex : Réviser le chapitre 4"
              className={inputClass}
            />
          </div>
          <div className="mb-3">
            <label className="mb-1 block text-sm text-slate-600">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Échéance
              </label>
              <input
                type="date"
                value={form.dateLimite}
                onChange={(e) => update("dateLimite", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Priorité
              </label>
              <select
                value={form.priorite}
                onChange={(e) => update("priorite", e.target.value)}
                className={inputClass}
              >
                {PRIORITES.map((p) => (
                  <option key={p} value={p}>
                    {LABEL_PRIORITE[p]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Statut</label>
              <select
                value={form.statut}
                onChange={(e) => update("statut", e.target.value)}
                className={inputClass}
              >
                {STATUTS.map((s) => (
                  <option key={s} value={s}>
                    {LABEL_STATUT[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Cours</label>
              <select
                value={form.idCours}
                onChange={(e) => update("idCours", e.target.value)}
                className={inputClass}
              >
                <option value="">Aucun</option>
                {courses.map((c) => (
                  <option key={c.idCours} value={c.idCours}>
                    {c.titre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving
              ? "Enregistrement…"
              : editingId
              ? "Enregistrer les modifications"
              : "Créer la tâche"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-slate-400">Chargement…</div>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Aucune tâche. Crée ta première tâche pour organiser tes révisions.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => {
            const course = courses.find((c) => c.idCours === task.idCours);
            return (
              <div
                key={task.idTache}
                className="rounded-xl bg-white p-4 ring-1 ring-slate-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-800">
                      {task.titre}
                    </div>
                    {task.description && (
                      <div className="mt-0.5 text-sm text-slate-500">
                        {task.description}
                      </div>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs ${
                          COULEUR_PRIORITE[task.priorite] || "bg-slate-100"
                        }`}
                      >
                        {LABEL_PRIORITE[task.priorite] || task.priorite}
                      </span>
                      {task.dateLimite && (
                        <span className="text-xs text-slate-400">
                          échéance : {task.dateLimite}
                        </span>
                      )}
                      {course && (
                        <span className="text-xs text-indigo-600">
                          {course.titre}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <select
                      value={task.statut}
                      onChange={(e) => changeStatut(task, e.target.value)}
                      className={`rounded-md px-2 py-1 text-xs outline-none ${
                        COULEUR_STATUT[task.statut] || "bg-slate-100"
                      }`}
                    >
                      {STATUTS.map((s) => (
                        <option key={s} value={s}>
                          {LABEL_STATUT[s]}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => startEdit(task)}
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50"
                      title="Modifier"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => remove(task.idTache)}
                      className="rounded-lg border border-rose-200 p-1.5 text-rose-500 transition hover:bg-rose-50"
                      title="Supprimer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
