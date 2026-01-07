import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const ProductionLogContext = createContext();

export function ProductionLogProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =============================
     FETCH COMPLETED LOGS
     ============================= */
  const fetchReports = async (from, to) => {
    setLoading(true);

    try {
      const res = await api.get("/production-logs/reports", {
        params: {
          ...(from && { from }),
          ...(to && { to }),
        },
      });

      setLogs(res.data);
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
