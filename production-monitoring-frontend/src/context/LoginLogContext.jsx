import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const LoginLogContext = createContext();

export function LoginLogProvider({ children }) {
  const [loginLogs, setLoginLogs] = useState([]);

  /* =====================================================
     FETCH LOGS FROM BACKEND (DB → FRONTEND)
     ===================================================== */
  const fetchLoginLogs = async () => {
    try {
      const res = await api.get("/login-logs");

      // Normalize backend data to frontend format
      const logs = res.data.map((l) => ({
        id: l.id,
        username: l.username,
        role: l.role,
        loginTime: new Date(l.loginTime).toLocaleString(),
        logoutTime: l.logoutTime
          ? new Date(l.logoutTime).toLocaleString()
          : null,
      }));

      setLoginLogs(logs);
    } catch (err) {
      console.error("Failed to fetch login logs", err);
    }
  };

  /* =====================================================
     LOAD LOGS ON APP START
     ===================================================== */
  useEffect(() => {
    fetchLoginLogs();
  }, []);

  /* =====================================================
     KEEP EXISTING FUNCTIONS (NOT REMOVED)
     ===================================================== */

  const addLoginLog = (log) => {
    setLoginLogs((prev) => [
      {
        id: Date.now(),
        ...log,
        logoutTime: null,
      },
      ...prev,
    ]);
  };

  const closeLoginLog = () => {
    setLoginLogs((prev) =>
      prev.map((l, i) =>
        i === 0 ? { ...l, logoutTime: new Date().toLocaleString() } : l
      )
    );
  };

  return (
    <LoginLogContext.Provider
      value={{
        loginLogs,
        addLoginLog,
        closeLoginLog,
        fetchLoginLogs, // ✅ exposed if needed later
      }}
    >
      {children}
    </LoginLogContext.Provider>
  );
}

export const useLoginLogs = () => useContext(LoginLogContext);
