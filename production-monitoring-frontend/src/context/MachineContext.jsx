import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const MachineContext = createContext();

/* =========================
   MACHINE STATUS CONSTANTS
   ========================= */
export const MACHINE_STATUS = {
  AVAILABLE: "AVAILABLE",
  RUNNING: "RUNNING",
  PAUSED: "PAUSED",
  ERROR: "ERROR",
};

export function MachineProvider({ children }) {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD MACHINES (ON START)
     ========================= */
  useEffect(() => {
    fetchMachines();

    const refresh = () => fetchMachines();
    window.addEventListener("refresh-machines", refresh);

    return () => {
      window.removeEventListener("refresh-machines", refresh);
    };
  }, []);

  const fetchMachines = async () => {
    setLoading(true);
    try {
      const res = await api.get("/machines");
      setMachines(res.data);
    } catch (err) {
      console.error("Failed to load machines", err);
    } finally {
      setLoading(false);
      window.dispatchEvent(new Event("refresh-alerts"));
    }
  };

  /* =========================
     ADD MACHINE
     ========================= */
  const addMachine = async (machine) => {
    try {
      const res = await api.post("/machines", machine);
      setMachines((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Add machine failed", err);
    }
  };

  /* =========================
     UPDATE MACHINE
     ========================= */
  const updateMachine = async (updated) => {
    try {
      // 1️⃣ Update core fields
      await api.put(`/machines/${updated.id}`, updated);

      // 2️⃣ If status changed → call status API
      if (updated.status) {
        await api.put(`/machines/${updated.id}/status/${updated.status}`);
      }

      fetchMachines();
    } catch (err) {
      console.error("Update machine failed", err);
    }
  };

  /* =========================
     DELETE MACHINE
     ========================= */
  const deleteMachine = async (id) => {
    try {
      await api.delete(`/machines/${id}`);
      setMachines((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Delete machine failed", err);
    }
  };

  /* =========================
     UPDATE MACHINE STATUS
     ========================= */
  const updateMachineStatus = async (id, status) => {
    try {
      const res = await api.put(`/machines/${id}/status/${status}`);
      const updated = res.data;

      setMachines((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
      );
    } catch (err) {
      console.error("Update status failed", err);
    }
  };

  /* =========================
     STATUS HELPERS (UNCHANGED)
     ========================= */
  const isMachineAvailable = (machineId) => {
    const machine = machines.find((m) => m.id === machineId);
    return machine?.status === MACHINE_STATUS.AVAILABLE;
  };

  const setMachineRunning = (id) =>
    updateMachineStatus(id, MACHINE_STATUS.RUNNING);

  const setMachinePaused = (id) =>
    updateMachineStatus(id, MACHINE_STATUS.PAUSED);

  const setMachineAvailable = (id) =>
    updateMachineStatus(id, MACHINE_STATUS.AVAILABLE);

  const setMachineError = (id) =>
    updateMachineStatus(id, MACHINE_STATUS.ERROR);

  return (
    <MachineContext.Provider
      value={{
        machines,
        loading,

        addMachine,
        updateMachine,
        deleteMachine,
        updateMachineStatus,

        MACHINE_STATUS,
        isMachineAvailable,
        setMachineRunning,
        setMachinePaused,
        setMachineAvailable,
        setMachineError,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
}

export const useMachines = () => useContext(MachineContext);
