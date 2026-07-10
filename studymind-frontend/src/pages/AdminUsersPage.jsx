import { useEffect, useState } from "react";
import { Shield, Pencil, Trash2, Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAllUsers, updateUser, deleteUser } from "../services/adminService";
import { useToast } from "../context/ToastContext";

const ROLES = ["ETUDIANT", "ADMIN"];

const COULEUR_ROLE = {
  ADMIN: "bg-indigo-50 text-indigo-700",
  ETUDIANT: "bg-slate-100 text-slate-600",
};

export default function AdminUsersPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "ETUDIANT",
    motDePasse: "",
  });
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(u) {
    setEditingId(u.idUtilisateur);
    setForm({
      nom: u.nom || "",
      prenom: u.prenom || "",
      email: u.email || "",
      role: u.role || "ETUDIANT",
      motDePasse: "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(id) {
    setError("");
    setSaving(true);
    try {
      const payload = {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        role: form.role,
      };
      // On n'envoie le mot de passe que s'il a ete saisi (reinitialisation).
      if (form.motDePasse) payload.motDePasse = form.motDePasse;

      await updateUser(id, payload);
      setEditingId(null);
      await load();
      toast.success("Utilisateur mis à jour.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(u) {
    if (u.idUtilisateur === user.idUtilisateur) {
      setError("Tu ne peux pas supprimer ton propre compte administrateur.");
      return;
    }
    if (!window.confirm(`Supprimer l'utilisateur ${u.email} ?`)) return;
    setError("");
    try {
      await deleteUser(u.idUtilisateur);
      await load();
      toast.success("Utilisateur supprimé.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Shield size={22} />
        </div>
        <div>
          <h1 className="text-xl font-medium text-slate-900">
            Administration — Utilisateurs
          </h1>
          <p className="text-sm text-slate-500">
            Gère les comptes et les rôles des utilisateurs.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-400">Chargement…</div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Aucun utilisateur.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                <th className="px-4 py-3 font-medium">Prénom</th>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Rôle</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isEditing = editingId === u.idUtilisateur;
                const isMe = u.idUtilisateur === user.idUtilisateur;
                return (
                  <tr
                    key={u.idUtilisateur}
                    className="border-b border-slate-50 last:border-0"
                  >
                    {isEditing ? (
                      <>
                        <td className="px-4 py-2">
                          <input
                            value={form.prenom}
                            onChange={(e) => update("prenom", e.target.value)}
                            className={inputClass}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            value={form.nom}
                            onChange={(e) => update("nom", e.target.value)}
                            className={inputClass}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            className={inputClass}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={form.role}
                            onChange={(e) => update("role", e.target.value)}
                            className={inputClass}
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleSave(u.idUtilisateur)}
                              disabled={saving}
                              className="rounded-lg bg-indigo-600 p-1.5 text-white transition hover:bg-indigo-700 disabled:opacity-60"
                              title="Enregistrer"
                            >
                              <Check size={15} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50"
                              title="Annuler"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-slate-700">{u.prenom}</td>
                        <td className="px-4 py-3 text-slate-700">{u.nom}</td>
                        <td className="px-4 py-3 text-slate-500">
                          {u.email}
                          {isMe && (
                            <span className="ml-2 text-xs text-indigo-500">
                              (moi)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-md px-2 py-0.5 text-xs ${
                              COULEUR_ROLE[u.role] || "bg-slate-100"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(u)}
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50"
                              title="Modifier"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(u)}
                              disabled={isMe}
                              className="rounded-lg border border-rose-200 p-1.5 text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                              title={
                                isMe
                                  ? "Impossible de se supprimer soi-même"
                                  : "Supprimer"
                              }
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editingId && (
        <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200">
          <label className="mb-1 block text-sm text-slate-600">
            Réinitialiser le mot de passe (optionnel)
          </label>
          <input
            type="password"
            value={form.motDePasse}
            onChange={(e) => update("motDePasse", e.target.value)}
            placeholder="Laisser vide pour ne pas changer"
            className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          <p className="mt-1 text-xs text-slate-400">
            Si tu saisis un mot de passe, il sera appliqué en cliquant sur
            « Enregistrer » (min. 6 caractères).
          </p>
        </div>
      )}
    </div>
  );
}
