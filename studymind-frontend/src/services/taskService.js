import api from "../api/client";

// Valeurs d'enum attendues par le back (à utiliser dans les <select>)
export const PRIORITES = ["FAIBLE", "MOYENNE", "ELEVEE"];
export const STATUTS = ["A_FAIRE", "EN_COURS", "TERMINEE"];

// GET /api/tasks/user/{idUtilisateur}
export async function getTasksByUser(idUtilisateur) {
  const { data } = await api.get(`/tasks/user/${idUtilisateur}`);
  return data;
}

// POST /api/tasks/user/{idUtilisateur}
// body: { titre, description, dateLimite "yyyy-MM-dd", priorite, statut, idCours }
export async function createTask(idUtilisateur, payload) {
  const { data } = await api.post(`/tasks/user/${idUtilisateur}`, payload);
  return data;
}

// PUT /api/tasks/{id}
export async function updateTask(id, payload) {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data;
}

// DELETE /api/tasks/{id}
export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
}
