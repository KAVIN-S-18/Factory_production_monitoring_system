import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useLoginLogs } from "./LoginLogContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { addLoginLog, closeLoginLog } = useLoginLogs();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     RESTORE SESSION
     ===================================================== */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /* =====================================================
     LOGIN (BACKEND INTEGRATED)
     ===================================================== */
  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      const loggedUser = res.data;

      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      // ✅ FRONTEND LOG (kept)
      addLoginLog({
        username: loggedUser.username,
        role: loggedUser.role,
        loginTime: new Date().toLocaleString(),
      });

      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  /* =====================================================
     LOGOUT (BACKEND + FRONTEND)
     ===================================================== */
  const logout = async () => {
    try {
      if (user?.username) {
        // ✅ BACKEND LOGOUT (DB UPDATE)
        await api.post("/auth/logout", null, {
          params: { username: user.username },
        });
      }
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      // ✅ FRONTEND CLEANUP (ALWAYS)
      closeLoginLog();
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
