import api from "../api/client";

// POST /api/auth/login  -> { token, type, email, role, idUtilisateur }
export async function login(email, motDePasse) {
  const { data } = await api.post("/auth/login", { email, motDePasse });
  return data;
}

// POST /api/auth/register -> { token, type, email, role, idUtilisateur }
export async function register({ nom, prenom, email, motDePasse }) {
  const { data } = await api.post("/auth/register", {
    nom,
    prenom,
    email,
    motDePasse,
  });
  return data;
}
