import api from "../api/client";

// Toutes ces routes sont reservees au role ADMIN cote back (/api/users/**).

// GET /api/users
export async function getAllUsers() {
  const { data } = await api.get("/users");
  return data;
}

// PUT /api/users/{id}
// payload : { nom, prenom, email, role, motDePasse? }
// motDePasse est optionnel : ne l'envoyer que pour reinitialiser le mot de passe.
export async function updateUser(id, payload) {
  const { data } = await api.put(`/users/${id}`, payload);
  return data;
}

// DELETE /api/users/{id}
export async function deleteUser(id) {
  await api.delete(`/users/${id}`);
}
