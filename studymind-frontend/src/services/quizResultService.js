import api from "../api/client";

// POST /api/quiz-results/user/{idUtilisateur}/quiz/{idQuiz}?score=..&total=..
export async function saveQuizResult(idUtilisateur, idQuiz, score, total) {
  const { data } = await api.post(
    `/quiz-results/user/${idUtilisateur}/quiz/${idQuiz}`,
    null,
    { params: { score, total } }
  );
  return data;
}

// GET /api/quiz-results/user/{idUtilisateur} -> historique
export async function getQuizResults(idUtilisateur) {
  const { data } = await api.get(`/quiz-results/user/${idUtilisateur}`);
  return data;
}

// GET /api/quiz-results/user/{idUtilisateur}/average -> { scoreMoyen, nombreQuiz }
export async function getQuizAverage(idUtilisateur) {
  const { data } = await api.get(`/quiz-results/user/${idUtilisateur}/average`);
  return data;
}
