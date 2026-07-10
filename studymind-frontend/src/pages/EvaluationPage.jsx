import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  X,
  Trophy,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { getQuizzesByCourse, getQuizById } from "../services/quizService";

// Seuil de reussite pour debloquer le niveau suivant.
const SEUIL = 0.6;

const NIVEAUX = [
  { key: "FACILE", label: "Facile" },
  { key: "MOYEN", label: "Moyen" },
  { key: "DIFFICILE", label: "Difficile" },
];

function labelNiveau(key) {
  return NIVEAUX.find((n) => n.key === key)?.label || key;
}

function norm(s) {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

function letterToIndex(s) {
  const m = (s || "").trim().match(/^[([]?\s*([A-Da-d])\b/);
  return m ? m[1].toUpperCase().charCodeAt(0) - 65 : -1;
}

function getOptions(q) {
  if (q.reponses && q.reponses.length > 0) return q.reponses;
  if (q.bonneReponse)
    return [{ idReponse: "b", contenu: q.bonneReponse, estCorrecte: true }];
  return [];
}

function correctIndex(q, options) {
  const flagged = options.findIndex((o) => o.estCorrecte === true);
  if (flagged !== -1) return flagged;
  const br = q.bonneReponse;
  if (!br) return -1;
  const byText = options.findIndex((o) => norm(o.contenu) === norm(br));
  if (byText !== -1) return byText;
  const li = letterToIndex(br);
  if (li !== -1 && li < options.length) return li;
  return options.findIndex(
    (o) => norm(o.contenu) && norm(br).includes(norm(o.contenu))
  );
}

// Construit les niveaux a partir des quiz du cours.
function buildLevels(quizzes) {
  const byDiff = { FACILE: [], MOYEN: [], DIFFICILE: [] };
  const all = [];
  for (const quiz of quizzes) {
    const diff = byDiff[quiz.difficulte] ? quiz.difficulte : "MOYEN";
    for (const question of quiz.questions || []) {
      byDiff[diff].push(question);
      all.push(question);
    }
  }
  const nonVides = ["FACILE", "MOYEN", "DIFFICILE"].filter(
    (d) => byDiff[d].length > 0
  );

  // Cas ideal : au moins 2 niveaux distincts existent reellement.
  if (nonVides.length >= 2) {
    return nonVides.map((d) => ({ key: d, questions: byDiff[d] }));
  }

  // Repli : on decoupe toutes les questions en 3 paliers progressifs
  // pour que l'evaluation par niveaux fonctionne quand meme.
  if (all.length === 0) return [];
  const taille = Math.ceil(all.length / 3);
  const chunks = [
    all.slice(0, taille),
    all.slice(taille, taille * 2),
    all.slice(taille * 2),
  ].filter((c) => c.length > 0);
  return chunks.map((c, i) => ({ key: NIVEAUX[i].key, questions: c }));
}

function BackLink({ navigate, id }) {
  return (
    <button
      onClick={() => navigate(`/courses/${id}`)}
      className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
    >
      <ArrowLeft size={15} />
      Retour au cours
    </button>
  );
}

export default function EvaluationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [levelIndex, setLevelIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [levelCorrect, setLevelCorrect] = useState(0);
  const [levelResult, setLevelResult] = useState(null); // null | "passed" | "failed"
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const quizzes = await getQuizzesByCourse(id);
        const full = await Promise.all(
          quizzes.map((q) => getQuizById(q.idQuiz))
        );
        setLevels(buildLevels(full));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="text-slate-400">Chargement...</div>;

  if (error)
    return (
      <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
        {error}
      </div>
    );

  if (levels.length === 0)
    return (
      <div>
        <BackLink navigate={navigate} id={id} />
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Aucune question disponible. Genere d'abord un quiz a partir d'un
          document de ce cours.
        </div>
      </div>
    );

  const level = levels[levelIndex];
  const question = level.questions[qIndex];
  const options = getOptions(question);
  const ci = correctIndex(question, options);
  const totalQ = level.questions.length;

  function choose(oi) {
    if (revealed) return;
    setSelected(oi);
    setRevealed(true);
    if (oi === ci && ci !== -1) setLevelCorrect((c) => c + 1);
  }

  function next() {
    if (qIndex < totalQ - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
      return;
    }
    const pct = levelCorrect / totalQ;
    setLevelResult(pct >= SEUIL ? "passed" : "failed");
  }

  function retryLevel() {
    setQIndex(0);
    setSelected(null);
    setRevealed(false);
    setLevelCorrect(0);
    setLevelResult(null);
  }

  function nextLevel() {
    if (levelIndex < levels.length - 1) {
      setLevelIndex((i) => i + 1);
      retryLevel();
    } else {
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div>
        <BackLink navigate={navigate} id={id} />
        <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500">
            <Trophy size={28} />
          </div>
          <h1 className="mb-1 text-xl font-medium text-slate-900">
            Evaluation terminee !
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            Tu as atteint le niveau{" "}
            <span className="font-medium text-slate-700">
              {labelNiveau(levels[levels.length - 1].key)}
            </span>
            . Bravo !
          </p>
          <button
            onClick={() => navigate(`/courses/${id}`)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Retour au cours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackLink navigate={navigate} id={id} />

      <div className="mb-6 flex items-center gap-2">
        {levels.map((lv, i) => {
          const done = i < levelIndex;
          const current = i === levelIndex;
          return (
            <div key={lv.key} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm ${
                  current
                    ? "bg-indigo-600 text-white"
                    : done
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {done && <Check size={14} />}
                {labelNiveau(lv.key)}
              </div>
              {i < levels.length - 1 && (
                <ChevronRight size={16} className="text-slate-300" />
              )}
            </div>
          );
        })}
      </div>

      {levelResult ? (
        <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200">
          {levelResult === "passed" ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check size={26} />
              </div>
              <h2 className="mb-1 text-lg font-medium text-slate-900">
                Niveau {labelNiveau(level.key)} valide !
              </h2>
              <p className="mb-6 text-sm text-slate-500">
                Score : {levelCorrect}/{totalQ}. Tu debloques le niveau suivant.
              </p>
              <button
                onClick={nextLevel}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                {levelIndex < levels.length - 1
                  ? "Niveau suivant"
                  : "Voir le resultat final"}
              </button>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <X size={26} />
              </div>
              <h2 className="mb-1 text-lg font-medium text-slate-900">
                Niveau non valide
              </h2>
              <p className="mb-6 text-sm text-slate-500">
                Score : {levelCorrect}/{totalQ}. Il faut au moins{" "}
                {Math.ceil(SEUIL * 100)}% pour continuer.
              </p>
              <button
                onClick={retryLevel}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                <RotateCcw size={15} />
                Recommencer le niveau
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="mb-1.5 flex justify-between text-xs text-slate-500">
              <span>Niveau {labelNiveau(level.key)}</span>
              <span>
                Question {qIndex + 1} / {totalQ}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-indigo-600 transition-all"
                style={{ width: `${((qIndex + 1) / totalQ) * 100}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
            <p className="mb-4 font-medium text-slate-800">{question.libelle}</p>
            <div className="flex flex-col gap-2">
              {options.map((opt, oi) => {
                const isSel = selected === oi;
                const isCorrect = oi === ci;
                let cls =
                  "flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition ";
                if (!revealed) {
                  cls += "cursor-pointer border-slate-200 hover:bg-slate-50";
                } else if (isCorrect) {
                  cls += "border-emerald-300 bg-emerald-50 text-emerald-800";
                } else if (isSel) {
                  cls += "border-rose-300 bg-rose-50 text-rose-800";
                } else {
                  cls += "border-slate-200 text-slate-500";
                }
                return (
                  <div
                    key={opt.idReponse ?? oi}
                    className={cls}
                    onClick={() => choose(oi)}
                  >
                    <span>
                      <span className="mr-2 font-medium text-slate-400">
                        {String.fromCharCode(65 + oi)}.
                      </span>
                      {opt.contenu}
                    </span>
                    {revealed && isCorrect && <Check size={16} />}
                    {revealed && isSel && !isCorrect && <X size={16} />}
                  </div>
                );
              })}
            </div>
          </div>

          {revealed && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={next}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                {qIndex < totalQ - 1
                  ? "Question suivante"
                  : "Terminer le niveau"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
