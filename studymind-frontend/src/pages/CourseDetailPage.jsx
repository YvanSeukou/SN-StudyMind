import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Upload,
  FileText,
  Sparkles,
  ListChecks,
  Download,
  ArrowLeft,
  Loader2,
  Pencil,
  Trash2,
  Check,
  X,
  GraduationCap,
} from "lucide-react";
import {
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../services/courseService";
import {
  getDocumentsByCourse,
  uploadDocument,
  downloadDocument,
  deleteDocument,
} from "../services/documentService";
import {
  generateAndSaveQuiz,
  getQuizzesByCourse,
  deleteQuiz,
  DIFFICULTES,
} from "../services/quizService";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [course, setCourse] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyDoc, setBusyDoc] = useState(null);
  const [quizDifficulte, setQuizDifficulte] = useState("MOYEN");
  const [error, setError] = useState("");

  // Édition du cours
  const [editing, setEditing] = useState(false);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [savingCourse, setSavingCourse] = useState(false);

  async function loadDocs() {
    const docs = await getDocumentsByCourse(id);
    setDocuments(docs);
  }

  async function loadQuizzes() {
    const list = await getQuizzesByCourse(id);
    setQuizzes(list);
  }

  useEffect(() => {
    async function load() {
      try {
        const c = await getCourseById(id);
        setCourse(c);
        setTitre(c.titre || "");
        setDescription(c.description || "");
        await loadDocs();
        await loadQuizzes();
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSaveCourse(e) {
    e.preventDefault();
    setError("");
    setSavingCourse(true);
    try {
      const updated = await updateCourse(id, {
        idCours: course.idCours,
        titre,
        description,
        idUtilisateur: course.idUtilisateur,
      });
      setCourse(updated);
      setEditing(false);
      toast.success("Cours modifié.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSavingCourse(false);
    }
  }

  async function handleDeleteCourse() {
    if (!window.confirm("Supprimer ce cours et tout son contenu ?")) return;
    try {
      await deleteCourse(id);
      toast.success("Cours supprimé.");
      navigate("/courses");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      await uploadDocument(id, file);
      await loadDocs();
      toast.success("Document ajouté.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleGenerateQuiz(idDocument) {
    setError("");
    setBusyDoc(idDocument);
    try {
      const quiz = await generateAndSaveQuiz(idDocument, quizDifficulte);
      toast.success("Quiz généré.");
      navigate(`/quizzes/${quiz.idQuiz}`);
    } catch (err) {
      setError(
        "La génération du quiz a échoué. Vérifie qu'Ollama est bien lancé. (" +
          err.message +
          ")"
      );
      toast.error("Échec de la génération du quiz.");
    } finally {
      setBusyDoc(null);
    }
  }

  async function handleDeleteQuiz(idQuiz) {
    if (!window.confirm("Supprimer ce quiz ?")) return;
    setError("");
    try {
      await deleteQuiz(idQuiz);
      await loadQuizzes();
      toast.success("Quiz supprimé.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  }

  async function handleDeleteDocument(idDocument) {
    if (!window.confirm("Supprimer ce document ?")) return;
    setError("");
    try {
      await deleteDocument(idDocument);
      await loadDocs();
      toast.success("Document supprimé.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  }

  if (loading) return <div className="text-slate-400">Chargement…</div>;

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  return (
    <div>
      <Link
        to="/courses"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={15} />
        Retour aux cours
      </Link>

      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {editing ? (
        <form
          onSubmit={handleSaveCourse}
          className="mb-6 rounded-xl bg-white p-5 ring-1 ring-slate-200"
        >
          <div className="mb-3">
            <label className="mb-1 block text-sm text-slate-600">Titre</label>
            <input
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className={inputClass}
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
              className={inputClass}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={savingCourse}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              <Check size={16} />
              {savingCourse ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setTitre(course.titre || "");
                setDescription(course.description || "");
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600"
            >
              <X size={16} />
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-medium text-slate-900">
              {course?.titre}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {course?.description || "Aucune description"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/courses/${id}/evaluation`}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <GraduationCap size={15} />
              Évaluation progressive
            </Link>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              <Pencil size={15} />
              Modifier
            </button>
            <button
              onClick={handleDeleteCourse}
              className="flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
            >
              <Trash2 size={15} />
              Supprimer
            </button>
          </div>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-medium text-slate-900">Documents</h2>
        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">
          {uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {uploading ? "Envoi…" : "Ajouter un document"}
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Aucun document. Ajoute un fichier (PDF, Word, texte…) pour générer des
          résumés et des quiz.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {documents.map((doc) => (
            <div
              key={doc.idDocument}
              className="rounded-xl bg-white p-4 ring-1 ring-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <FileText size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-slate-800">
                    {doc.nomFichier}
                  </div>
                  <div className="text-xs text-slate-400">{doc.typeFichier}</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to={`/summaries/${doc.idDocument}`}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700 transition hover:bg-indigo-100"
                >
                  <Sparkles size={15} />
                  Résumé IA
                </Link>
                <select
                  value={quizDifficulte}
                  onChange={(e) => setQuizDifficulte(e.target.value)}
                  disabled={busyDoc === doc.idDocument}
                  className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-600 outline-none focus:border-indigo-400"
                  title="Niveau de difficulté du quiz"
                >
                  {DIFFICULTES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleGenerateQuiz(doc.idDocument)}
                  disabled={busyDoc === doc.idDocument}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
                >
                  {busyDoc === doc.idDocument ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <ListChecks size={15} />
                  )}
                  {busyDoc === doc.idDocument ? "Génération…" : "Générer un quiz"}
                </button>
                <button
                  onClick={() =>
                    downloadDocument(doc.idDocument, doc.nomFichier)
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-50"
                >
                  <Download size={15} />
                  Télécharger
                </button>
                <button
                  onClick={() => handleDeleteDocument(doc.idDocument)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-rose-500 transition hover:bg-rose-50"
                >
                  <Trash2 size={15} />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section Quiz du cours */}
      <div className="mt-8 mb-3 flex items-center justify-between">
        <h2 className="font-medium text-slate-900">Quiz du cours</h2>
        {quizzes.length > 0 && (
          <Link
            to={`/courses/${id}/evaluation`}
            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline"
          >
            <GraduationCap size={15} />
            Évaluation progressive
          </Link>
        )}
      </div>

      {quizzes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          Aucun quiz. Génère un quiz depuis un document ci-dessus.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.idQuiz}
              className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ListChecks size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-slate-800">
                  {quiz.titre || "Quiz"}
                </div>
                <div className="text-xs text-slate-400">
                  {quiz.difficulte || "MOYEN"}
                </div>
              </div>
              <Link
                to={`/quizzes/${quiz.idQuiz}`}
                className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700 transition hover:bg-indigo-100"
              >
                Faire le quiz
              </Link>
              <button
                onClick={() => handleDeleteQuiz(quiz.idQuiz)}
                className="flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-sm text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 size={15} />
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
