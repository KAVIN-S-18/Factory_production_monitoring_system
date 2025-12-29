import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAlerts } from "./AlertContext";

const BatchContext = createContext();

export function BatchProvider({ children }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const { addAlert } = useAlerts();

  /* =====================================================
     LOAD BATCHES (BACKEND)
     ===================================================== */
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await api.get("/batches");
      setBatches(res.data);
    } catch (err) {
      console.error("Failed to load batches", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  /* =====================================================
     ADD BATCH (BACKEND AUTHORITATIVE)
     ===================================================== */
  const addBatch = async (batch) => {
    try {
      const payload = {
        productName: batch.productName,
        finalProductQty: batch.finalProductQty,
        machine: { id: batch.machineId },
        operator: { id: batch.operatorId },
        estimatedStartTime: batch.estimatedStartTime,
        estimatedEndTime: batch.estimatedEndTime,
        materials: batch.materialsUsed.map((m) => ({
          material: { id: m.materialId },
          quantity: m.quantity,
        })),
      };

      await api.post("/batches", payload);
      await fetchBatches();
    } catch (err) {
      alert(err.response?.data?.message || "Batch creation failed");
    }
  };

  /* =====================================================
     UPDATE BATCH (SCHEDULED ONLY)
     (re-create pattern – backend enforced)
     ===================================================== */
  const updateBatch = async (updated) => {
    try {
      const payload = {
        productName: updated.productName,
        finalProductQty: updated.finalProductQty,
        operator: { id: updated.operatorId },
        estimatedStartTime: updated.estimatedStartTime,
        estimatedEndTime: updated.estimatedEndTime,
        materials: updated.materialsUsed.map((m) => ({
          material: { id: m.materialId },
          quantity: m.quantity,
        })),
      };

      await api.put(`/batches/${updated.id}`, payload);
      await fetchBatches();
    } catch (err) {
      alert("Batch update failed");
    }
  };

  /* =====================================================
     DELETE BATCH (SCHEDULED ONLY)
     ===================================================== */
  const deleteBatch = async (batchId) => {
    try {
      await api.delete(`/batches/${batchId}`);
      await fetchBatches();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* =====================================================
     START / RESUME
     ===================================================== */
  const startBatch = async (batchId) => {
    try {
      await api.put(`/batches/${batchId}/start`);
      await fetchBatches();
    } catch (err) {
      alert("Failed to start batch");
    }
  };

  /* =====================================================
     PAUSE
     ===================================================== */
  const pauseBatch = async (batchId) => {
    try {
      await api.put(`/batches/${batchId}/pause`);
      await fetchBatches();
    } catch (err) {
      alert("Failed to pause batch");
    }
  };

  /* =====================================================
     COMPLETE
     ===================================================== */
  const completeBatch = async (batchId) => {
    try {
      await api.put(`/batches/${batchId}/complete`);
      await fetchBatches();
    } catch (err) {
      alert("Failed to complete batch");
    }
  };

  /* =====================================================
     FAIL BATCH (OPERATOR / MACHINE)
     ===================================================== */
  const failBatch = async (batchId, reason = "") => {
    try {
      await api.put(`/batches/${batchId}/fail`, null, {
        params: { reason },
      });

      const failed = batches.find((b) => b.id === batchId);
      if (failed) {
        addAlert({
          type: "MACHINE_FAILURE",
          severity: "HIGH",
          machine: failed.machine?.name,
          message: "Machine failed during batch production",
        });
      }

      await fetchBatches();
    } catch (err) {
      alert("Failed to fail batch");
    }
  };

  /* =====================================================
     FAIL BATCH BY MACHINE (REQUIRED BY MachineList)
     ===================================================== */
  const failBatchByMachine = (machineName) => {
    batches.forEach((b) => {
      if (
        b.machine?.name === machineName &&
        (b.status === "IN_PROGRESS" || b.status === "PAUSED")
      ) {
        failBatch(b.id);
      }
    });
  };

  /* =====================================================
     CHECK ACTIVE BATCH (UI HELPER)
     ===================================================== */
  const hasActiveBatch = (machineName) =>
    batches.some(
      (b) =>
        b.machine?.name === machineName &&
        (b.status === "IN_PROGRESS" || b.status === "PAUSED")
    );

  return (
    <BatchContext.Provider
      value={{
        batches,
        loading,

        addBatch,
        updateBatch,
        deleteBatch,
        startBatch,
        pauseBatch,
        completeBatch,
        failBatch,
        failBatchByMachine,
        hasActiveBatch,
      }}
    >
      {children}
    </BatchContext.Provider>
  );
}

export function useBatches() {
  return useContext(BatchContext);
}
