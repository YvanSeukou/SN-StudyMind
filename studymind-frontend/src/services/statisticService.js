import api from "../api/client";

// GET /api/statistics/user/{idUtilisateur}
// Peut renvoyer 404 si aucune statistique n'existe encore : on gère ça en amont.
export async function getStatisticByUser(idUtilisateur) {
  const { data } = await api.get(`/statistics/user/${idUtilisateur}`);
  return data;
}
