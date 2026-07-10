import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, RotateCcw } from "lucide-react";
import { getQuizById } from "../services/quizService";
import { saveQuizResult } from "../services/quizResultService";
import { useAuth } from "../context/AuthContext";

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // idQuestion -> index de l'option choisie
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getQuizById(quizId);
        setQuiz(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [quizId]);

  if (loading) return <div className="text-slate-400">Chargement…</div>;
  if (error)
    return (
      <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
        {error}
      </div>
    );
  if (!quiz) return null;

  const questions = quiz.questions || [];

  // Normalise un texte pour comparer (minuscules, sans accents ni ponctuation).
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

  // Si bonneReponse vaut "A"/"B"/"C"/"D" (éventuellement "A)", "(B)"...),
  // renvoie l'index correspondant (A=0, B=1...), sinon -1.
  function letterToIndex(s) {
    const m = (s || "").trim().match(/^[([]?\s*([A-Da-d])\b/);
    return m ? m[1].toUpperCase().charCodeAt(0) - 65 : -1;
  }

  // Détermine l'index de la bonne option pour une question donnée.
  function correctIndex(q, options) {
    // 1) Le back a marqué une option comme correcte.
    const flagged = options.findIndex((o) => o.estCorrecte === true);
    if (flagged !== -1) return flagged;

    const br = q.bonneReponse;
    if (!br) return -1;

    // 2) Correspondance de texte exacte avec une option.
    const byText = options.findIndex((o) => norm(o.contenu) === norm(br));
    if (byText !== -1) return byText;

    // 3) La bonne réponse est une lettre -> position de l'option.
    const li = letterToIndex(br);
    if (li !== -1 && li < options.length) return li;

    // 4) Dernier recours : la bonne réponse contient le texte de l'option.
    const byContains = options.findIndex(
      (o) => norm(o.contenu) && norm(br).includes(norm(o.contenu))
    );
    return byContains;
  }

  function select(idQuestion, index) {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [idQuestion]: index }));
  }

  // Calcul du score.
  const score = questions.reduce((acc, q) => {
    const options = getOptions(q);
    const ci = correctIndex(q, options);
    return acc + (answers[q.idQuestion] === ci && ci !== -1 ? 1 : 0);
  }, 0);

  // Construit la liste d'options (avec repli si le back n'en renvoie pas).
  function getOptions(q) {
    if (q.reponses && q.reponses.length > 0) return q.reponses;
    if (q.bonneReponse)
      return [{ idReponse: "b", contenu: q.bonneReponse, estCorrecte: true }];
    return [];
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
    setSaved(false);
  }

  // Valide le quiz ET enregistre le score en base (persistance).
  async function handleSubmit() {
    setSubmitted(true);
    if (saved || !user) return;
    try {
      await saveQuizResult(user.idUtilisateur, quizId, score, questions.length);
      setSaved(true);
    } catch (e) {
      // L'enregistrement du score ne doit pas bloquer l'affichage du resultat.
      console.error("Enregistrement du score impossible :", e.message);
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

      <div className="mb-6">
        <h1 className="text-xl font-medium text-slate-900">
          {quiz.titre || "Quiz"}
        </h1>
        {quiz.difficulte && (
          <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {quiz.difficulte}
          </span>
        )}
      </div>

      {submitted && (
        <div className="mb-6 rounded-xl bg-indigo-50 p-4 text-indigo-800">
          Score : <span className="font-medium">{score}</span> /{" "}
          {questions.length}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {questions.map((q, qi) => {
          const options = getOptions(q);
          const ci = correctIndex(q, options);
          const chosen = answers[q.idQuestion];

          return (
            <div
              key={q.idQuestion}
              className="rounded-xl bg-white p-5 ring-1 ring-slate-200"
            >
              <p className="mb-3 font-medium text-slate-800">
                {qi + 1}. {q.libelle}
              </p>
              <div className="flex flex-col gap-2">
                {options.map((opt, oi) => {
                  const selected = chosen === oi;
                  const correct = oi === ci;
                  let cls =
                    "flex items-center justify-between rounded-lg border px-3 py-2 text-sm cursor-pointer transition ";
                  if (!submitted) {
                    cls += selected
                      ? "border-indigo-400 bg-indigo-50 text-indigo-800"
                      : "border-slate-200 hover:bg-slate-50";
                  } else if (correct) {
                    cls += "border-emerald-300 bg-emerald-50 text-emerald-800";
                  } else if (selected && !correct) {
                    cls += "border-rose-300 bg-rose-50 text-rose-800";
                  } else {
                    cls += "border-slate-200 text-slate-500";
                  }
                  return (
                    <div
                      key={opt.idReponse ?? oi}
                      className={cls}
                      onClick={() => select(q.idQuestion, oi)}
                    >
                      <span>
                        <span className="mr-2 font-medium text-slate-400">
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        {opt.contenu}
                      </span>
                      {submitted && correct && <Check size={16} />}
                      {submitted && selected && !correct && <X size={16} />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Valider mes réponses
          </button>
        ) : (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            <RotateCcw size={15} />
            Recommencer
          </button>
        )}
      </div>
    </div>
  );
}
