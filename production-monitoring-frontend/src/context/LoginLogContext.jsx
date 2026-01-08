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
        loginTime: new Date(l.loginTime).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
        logoutTime: l.logoutTime
          ? new Date(l.logoutTime).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })
          : null,
      }));

      setLoginLogs(logs);
    } catch (err) {
      console.error("Failed to fetch login logs", err);
    }
  }, []);

  /* =====================================================
     LOAD LOGS ON APP START
     ===================================================== */
  useEffect(() => {
    fetchLoginLogs();
  }, [fetchLoginLogs]);

  /* =====================================================
     TEMP FRONTEND LOGIN LOG (UNTIL BACKEND SUPPORTS IT)
     ===================================================== */
  const addLoginLog = (log) => {
    setLoginLogs((prev) => [
      {
        id: `temp-${Date.now()}`,
        ...log,
        logoutTime: null,
      },
      ...prev,
    ]);
  };

  /* =====================================================
     TEMP FRONTEND LOGOUT
     ===================================================== */
  const closeLoginLog = () => {
    setLoginLogs((prev) => {
      if (prev.length === 0) return prev;

      const [latest, ...rest] = prev;

      return [
        {
          ...latest,
          logoutTime: new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        },
        ...rest,
      ];
    });
  };

  return (
    <LoginLogContext.Provider
      value={{
        loginLogs,
        addLoginLog,
        closeLoginLog,
        fetchLoginLogs,
      }}
    >
      {children}
    </LoginLogContext.Provider>
  );
}

export const useLoginLogs = () => useContext(LoginLogContext);
