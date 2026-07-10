import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2, Download, Trash2 } from "lucide-react";
import {
  getSummariesByDocument,
  generateSummary,
  deleteSummary,
  TYPES_RESUME,
} from "../services/summaryService";
import { useToast } from "../context/ToastContext";

// Libellé lisible pour un type d'enum renvoyé par le back.
function labelForType(value) {
  return TYPES_RESUME.find((t) => t.value === value)?.label || value;
}

// Génère et télécharge un fichier .txt à partir du texte du résumé (côté navigateur).
function downloadSummary(summary) {
  const nom = labelForType(summary.typeResume) || "resume";
  const blob = new Blob([summary.contenu || ""], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nom.replace(/\s+/g, "-").toLowerCase()}-${summary.idResume}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function SummaryPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [type, setType] = useState("RESUME_COURT");
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await getSummariesByDocument(documentId);
      setSummaries(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [documentId]);

  async function handleGenerate() {
    setError("");
    setGenerating(true);
    try {
      const summary = await generateSummary(documentId, type);
      setSummaries((prev) => [summary, ...prev]);
      toast.success("Résumé généré.");
    } catch (err) {
      setError(
        "La génération a échoué. Vérifie qu'Ollama est lancé et que le modèle est téléchargé. (" +
          err.message +
          ")"
      );
      toast.error("Échec de la génération du résumé.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer ce résumé ?")) return;
    setError("");
    try {
      await deleteSummary(id);
      setSummaries((prev) => prev.filter((s) => s.idResume !== id));
      toast.success("Résumé supprimé.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={15} />
        Retour
      </button>

      <h1 className="mb-4 text-xl font-medium text-slate-900">Résumés IA</h1>

      {/* Choix du type de résumé + bouton de génération */}
      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200">
        <div className="flex-1">
          <label className="mb-1 block text-sm text-slate-600">
            Type de résumé
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {TYPES_RESUME.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {generating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          {generating ? "Génération…" : "Générer"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-400">Chargement…</div>
      ) : summaries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Aucun résumé pour ce document. Choisis un type puis clique sur « Générer ».
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {summaries.map((s) => (
            <div
              key={s.idResume}
              className="rounded-xl bg-white p-5 ring-1 ring-slate-200"
            >
              <div className="mb-2 flex items-center justify-between">
                {s.typeResume ? (
                  <span className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
                    {labelForType(s.typeResume)}
                  </span>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadSummary(s)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 transition hover:bg-slate-50"
                  >
                    <Download size={14} />
                    Télécharger
                  </button>
                  <button
                    onClick={() => handleDelete(s.idResume)}
                    className="flex items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 py-1 text-xs text-rose-600 transition hover:bg-rose-50"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {s.contenu}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
