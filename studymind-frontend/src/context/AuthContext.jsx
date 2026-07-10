import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au démarrage, on relit l'utilisateur stocké (s'il est connecté).
  useEffect(() => {
    const stored = localStorage.getItem("studymind_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("studymind_user");
      }
    }
    setLoading(false);
  }, []);

  // Sauvegarde token + infos utilisateur après login/register.
  function persist(data) {
    const u = {
      idUtilisateur: data.idUtilisateur,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem("studymind_token", data.token);
    localStorage.setItem("studymind_user", JSON.stringify(u));
    setUser(u);
  }

  async function login(email, motDePasse) {
    const data = await authService.login(email, motDePasse);
    persist(data);
  }

  async function register(form) {
    const data = await authService.register(form);
    persist(data);
  }

  function logout() {
    localStorage.removeItem("studymind_token");
    localStorage.removeItem("studymind_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAuth: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
