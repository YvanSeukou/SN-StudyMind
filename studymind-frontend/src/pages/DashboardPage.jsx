import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  ListChecks,
  CheckCircle2,
  Sparkles,
  Plus,
  Circle,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getCoursesByUser } from "../services/courseService";
import { getTasksByUser } from "../services/taskService";
import { getDocumentsByCourse } from "../services/documentService";
import { getQuizzesByCourse } from "../services/quizService";
import { getQuizAverage } from "../services/quizResultService";
import { StatCard, CourseCard } from "../components/Cards";

const priorityColor = {
  ELEVEE: "text-rose-500",
  MOYENNE: "text-orange-500",
  FAIBLE: "text-emerald-500",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [docCount, setDocCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [scoreMoyen, setScoreMoyen] = useState(null);
  const [nbPassages, setNbPassages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [c, t] = await Promise.all([
          getCoursesByUser(user.idUtilisateur),
          getTasksByUser(user.idUtilisateur),
        ]);
        const coursesArr = Array.isArray(c) ? c : [];
        setCourses(coursesArr);
        setTasks(Array.isArray(t) ? t : []);

        // Statistiques calculees en direct : documents et quiz de tous les cours.
        let docs = 0;
        let quizzes = 0;
        await Promise.all(
          coursesArr.map(async (course) => {
            try {
              const [d, q] = await Promise.all([
                getDocumentsByCourse(course.idCours),
                getQuizzesByCourse(course.idCours),
              ]);
              docs += Array.isArray(d) ? d.length : 0;
              quizzes += Array.isArray(q) ? q.length : 0;
            } catch {
              /* on ignore un cours qui echoue */
            }
          })
        );
        setDocCount(docs);
        setQuizCount(quizzes);

        // Score moyen aux quiz (persiste en base).
        try {
          const avg = await getQuizAverage(user.idUtilisateur);
          setScoreMoyen(avg?.nombreQuiz > 0 ? avg.scoreMoyen : null);
          setNbPassages(avg?.nombreQuiz || 0);
        } catch {
          setScoreMoyen(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.idUtilisateur]);

  const pendingTasks = tasks.filter((t) => t.statut !== "TERMINEE");
  const doneTasks = tasks.filter((t) => t.statut === "TERMINEE");
  const progression =
    tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

  if (loading) {
    return <div className="text-slate-400">Chargement…</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-medium text-slate-900">Bonjour</h1>
          <p className="mt-1 text-sm text-slate-500">
            Voici un aperçu de ton travail aujourd'hui.
          </p>
        </div>
        <Link
          to="/courses"
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <Plus size={16} />
          Nouveau cours
        </Link>
      </div>

      {/* Statistiques */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={BookOpen} label="Cours" value={courses.length} />
        <StatCard icon={FileText} label="Documents" value={docCount} />
        <StatCard icon={ListChecks} label="Quiz" value={quizCount} />
        <StatCard
          icon={CheckCircle2}
          label="Tâches terminées"
          value={`${doneTasks.length}/${tasks.length}`}
        />
      </div>

      {/* Progression globale (basée sur les tâches terminées) */}
      <div className="mb-6 rounded-xl bg-white p-5 ring-1 ring-slate-200">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700">
            <TrendingUp size={17} className="text-indigo-600" />
            <span className="text-sm font-medium">Progression globale</span>
          </div>
          <span className="text-sm font-medium text-indigo-600">
            {progression}%
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${progression}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Basée sur tes tâches terminées ({doneTasks.length} sur {tasks.length}).
        </p>
        {scoreMoyen !== null && (
          <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-sm">
            <span className="text-slate-500">Score moyen aux quiz :</span>
            <span className="font-medium text-indigo-600">{scoreMoyen}%</span>
            <span className="text-xs text-slate-400">
              ({nbPassages} passage{nbPassages > 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium text-slate-900">Cours récents</h2>
            <Link to="/courses" className="text-xs text-indigo-600">
              Voir tout
            </Link>
          </div>
          {courses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {courses.slice(0, 4).map((c) => (
                <CourseCard key={c.idCours} course={c} />
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-5">
          <div>
            <h2 className="mb-3 font-medium text-slate-900">Tâches à venir</h2>
            <div className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
              {pendingTasks.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-slate-400">
                  Aucune tâche en attente.
                </p>
              ) : (
                pendingTasks.slice(0, 5).map((t, i) => (
                  <div
                    key={t.idTache}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      i > 0 ? "border-t border-slate-100" : ""
                    }`}
                  >
                    <Circle
                      size={15}
                      className={priorityColor[t.priorite] || "text-slate-400"}
                      fill="currentColor"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-slate-800">
                        {t.titre}
                      </div>
                      <div className="text-xs text-slate-400">
                        {t.dateLimite || "Sans échéance"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl bg-indigo-50 p-4">
            <div className="mb-1.5 flex items-center gap-2 text-indigo-700">
              <Sparkles size={18} />
              <span className="font-medium">Assistant IA</span>
            </div>
            <p className="mb-3 text-xs text-indigo-700/80">
              Génère un résumé ou un quiz à partir d'un document.
            </p>
            <Link
              to="/documents"
              className="block rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Aller aux documents
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="mb-1 font-medium text-slate-700">Aucun cours pour l'instant</p>
      <p className="mb-4 text-sm text-slate-500">
        Crée ton premier cours pour commencer.
      </p>
      <Link
        to="/courses"
        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white"
      >
        <Plus size={16} />
        Créer un cours
      </Link>
    </div>
  );
}
