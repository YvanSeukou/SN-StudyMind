import { useEffect, useState } from "react";
import { User, Check } from "lucide-react";
import { getProfile, updateProfile } from "../services/profileService";
import { useToast } from "../context/ToastContext";

export default function ProfilePage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const p = await getProfile();
        setNom(p.nom || "");
        setPrenom(p.prenom || "");
        setEmail(p.email || "");
        setRole(p.role || "");
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (motDePasse && motDePasse !== confirmation) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setSaving(true);
    try {
      const payload = { nom, prenom };
      if (motDePasse) payload.motDePasse = motDePasse;
      await updateProfile(payload);
      setMotDePasse("");
      setConfirmation("");
      setSuccess("Profil mis a jour avec succes.");
      toast.success("Profil mis à jour.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  if (loading) return <div className="text-slate-400">Chargement…</div>;

  return (
    <div className="max-w-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <User size={22} />
        </div>
        <div>
          <h1 className="text-xl font-medium text-slate-900">Mon profil</h1>
          <p className="text-sm text-slate-500">
            Modifie tes informations personnelles.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <Check size={16} />
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-6 ring-1 ring-slate-200"
      >
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Prénom</label>
            <input
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Nom</label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-slate-600">Email</label>
          <input
            value={email}
            disabled
            className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-400`}
          />
          <p className="mt-1 text-xs text-slate-400">
            L'email ne peut pas être modifié ici (il identifie ta session).
          </p>
        </div>

        {role && (
          <div className="mb-6">
            <label className="mb-1 block text-sm text-slate-600">Rôle</label>
            <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-sm text-slate-600">
              {role}
            </span>
          </div>
        )}

        <div className="mb-4 border-t border-slate-100 pt-4">
          <p className="mb-3 text-sm font-medium text-slate-700">
            Changer de mot de passe (optionnel)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Confirmer
              </label>
              <input
                type="password"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
