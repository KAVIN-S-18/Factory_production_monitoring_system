import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../services/api";

const LoginLogContext = createContext();

export function LoginLogProvider({ children }) {
  const [loginLogs, setLoginLogs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  /* =====================================================
     FETCH LOGS FROM BACKEND (DB → FRONTEND)
     ===================================================== */
  const fetchLoginLogs = useCallback(async () => {
    try {
      const res = await api.get("/login-logs");

      const logs = res.data.map((l) => ({
        id: l.id,
        username: l.username,
        role: l.role,

        // ✅ Convert UTC → local safely
        loginTime: l.loginTime
          ? new Date(l.loginTime + "Z").toLocaleString()
          : null,

        logoutTime: l.logoutTime
          ? new Date(l.logoutTime + "Z").toLocaleString()
          : null,
      }));

      setLoginLogs(logs);
      setLoaded(true);
    } catch (err) {
      // ❌ silence first-load noise
      if (loaded) {
        console.error("Failed to fetch login logs", err);
      }
    }
  }, [loaded]);

  /* =====================================================
     INITIAL LOAD + AUTO REFRESH (MULTI-BROWSER SYNC)
     ===================================================== */
  useEffect(() => {
    fetchLoginLogs();

    // 🔁 auto-refresh every 5 seconds
    const interval = setInterval(fetchLoginLogs, 5000);

    return () => clearInterval(interval);
  }, [fetchLoginLogs]);

  return (
    <LoginLogContext.Provider
      value={{
        loginLogs,
        fetchLoginLogs, // exposed if needed
      }}
    >
      {children}
    </LoginLogContext.Provider>
  );
}

export const useLoginLogs = () => useContext(LoginLogContext);
