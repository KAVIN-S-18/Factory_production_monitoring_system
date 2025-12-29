import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const AlertContext = createContext();

const API_URL = "http://localhost:8081/api/alerts";

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =====================================================
     FETCH ALERTS FROM BACKEND
     ===================================================== */
  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();

      // Backend already sorts by time desc
      setAlerts(data);
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
      await fetch(API_URL, { method: "DELETE" });
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
    await fetch(`${API_URL}/${alertId}/resolve`, {
      method: "PUT",
    });

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
