import axios from "axios";

// Crée une instance axios pointant vers ton backend Spring Boot.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Avant chaque requête : on ajoute le token JWT s'il existe.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("studymind_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Après chaque réponse : si le back renvoie 401/403, on déconnecte.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("studymind_token");
      localStorage.removeItem("studymind_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    // On normalise le message d'erreur pour l'afficher facilement.
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data === "string" ? error.response.data : null) ||
      error.message ||
      "Une erreur est survenue";
    return Promise.reject(new Error(message));
  }
);

export default api;
