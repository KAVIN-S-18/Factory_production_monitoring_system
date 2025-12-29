import { createContext, useContext, useEffect, useState } from "react";

const ProductionLogContext = createContext();

const API_BASE = "http://localhost:8081/api/production-logs";

export function ProductionLogProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =============================
     FETCH COMPLETED LOGS
     ============================= */
  const fetchReports = async (from, to) => {
    setLoading(true);

    let url = `${API_BASE}/reports`;
    const params = [];

    if (from) params.push(`from=${from}`);
    if (to) params.push(`to=${to}`);

    if (params.length) {
      url += `?${params.join("&")}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch production logs", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <ProductionLogContext.Provider
      value={{
        logs,
        loading,
        fetchReports,
      }}
    >
      {children}
    </ProductionLogContext.Provider>
  );
}

export function useProductionLogs() {
  return useContext(ProductionLogContext);
}
