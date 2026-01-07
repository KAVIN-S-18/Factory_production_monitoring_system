import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../services/api";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =====================================================
     FETCH ALERTS FROM BACKEND
     ===================================================== */
  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/alerts");

      // Backend already sorts by time desc
      setAlerts(res.data);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =====================================================
     LOAD ALERTS ON APP START
     ===================================================== */
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  /* =====================================================
     CLEAR ALL ALERTS (BACKEND)
     ===================================================== */
  const clearAlerts = async () => {
    try {
      await api.delete("/alerts");
      setAlerts([]);
    } catch (err) {
      console.error("Failed to clear alerts", err);
    }
  };

  /* =====================================================
     RESOLVE ONE ALERT
     ===================================================== */
  const resolveAlert = async (alertId) => {
    try {
      await api.put(`/alerts/${alertId}/resolve`);

      // remove alert locally
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));

      // 🔥 FORCE machine refresh
      window.dispatchEvent(new Event("refresh-machines"));
    } catch (err) {
      console.error("Failed to resolve alert", err);
    }
  };

  /* =====================================================
     REFRESH ALERTS MANUALLY (OPTIONAL)
     ===================================================== */
  const refreshAlerts = () => {
    fetchAlerts();
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        loading,
        refreshAlerts,
        clearAlerts,
        resolveAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export const useAlerts = () => useContext(AlertContext);
