import api from "../api/client";

// GET /api/profile -> profil de l'utilisateur connecte
export async function getProfile() {
  const { data } = await api.get("/profile");
  return data;
}

// PUT /api/profile -> met a jour nom, prenom et (optionnel) mot de passe
export async function updateProfile(payload) {
  const { data } = await api.put("/profile", payload);
  return data;
}
