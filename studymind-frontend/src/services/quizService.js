import api from "../api/client";

// Niveaux de difficulte (doivent correspondre a l'enum Difficulty du back)
export const DIFFICULTES = [
  { value: "FACILE", label: "Facile" },
  { value: "MOYEN", label: "Moyen" },
  { value: "DIFFICILE", label: "Difficile" },
];

// GET /api/quizzes/course/{idCours}
export async function getQuizzesByCourse(idCours) {
  const { data } = await api.get(`/quizzes/course/${idCours}`);
  return data;
}

// GET /api/quizzes/{id}  -> quiz avec ses questions/reponses
export async function getQuizById(id) {
  const { data } = await api.get(`/quizzes/${id}`);
  return data;
}

// POST /api/quizzes/generate-save/document/{idDocument}?difficulte=...
// Genere un quiz du niveau choisi via Ollama PUIS le sauvegarde.
export async function generateAndSaveQuiz(idDocument, difficulte = "MOYEN") {
  const { data } = await api.post(
    `/quizzes/generate-save/document/${idDocument}`,
    null,
    { params: { difficulte } }
  );
  return data;
}

// DELETE /api/quizzes/{id}
export async function deleteQuiz(id) {
  await api.delete(`/quizzes/${id}`);
}
