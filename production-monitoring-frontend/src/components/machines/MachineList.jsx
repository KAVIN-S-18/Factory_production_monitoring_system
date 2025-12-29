import { useState } from "react";
import { useMachines } from "../../context/MachineContext";
import { useBatches } from "../../context/BatchContext";

/* ---------- HELPERS ---------- */
const addMonths = (dateStr, months) => {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
};

const isDue = (date) => new Date() >= new Date(date);

function MachineList() {
  const {
    machines,
    addMachine,
    updateMachine,
    deleteMachine,
    updateMachineStatus,
  } = useMachines();

  const { failBatchByMachine } = useBatches();

  /* ---------- FILTER STATE ---------- */
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ---------- MODAL STATE ---------- */
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    manufactureDate: "",
    lastMaintenanceDate: "",
  });

  /* ---------- FILTERED MACHINES ---------- */
  const filteredMachines =
    statusFilter === "ALL"
      ? machines
      : machines.filter((m) => m.status === statusFilter);

  /* ---------- SAVE (ADD / EDIT) ---------- */
  const handleSave = () => {
    if (
      !form.name ||
      !form.manufactureDate ||
      !form.lastMaintenanceDate
    ) {
      alert("All fields required");
      return;
    }

    const nextMaintenanceDue = addMonths(
      form.lastMaintenanceDate,
      3
    );

    if (editing) {
      updateMachine({
        ...editing,
        ...form,
        nextMaintenanceDue,
      });
    } else {
      addMachine({
        ...form,
      });
    }

    setShowForm(false);
    setEditing(null);
    setForm({
      name: "",
      manufactureDate: "",
      lastMaintenanceDate: "",
    });
  };

  /* =====================================================
     FAIL MACHINE (BACKEND HANDLES ALERT)
     ===================================================== */
  const failMachine = (m) => {
    updateMachineStatus(m.id, "ERROR");
    failBatchByMachine(m.name);
  };

  /* =====================================================
     UNFAIL MACHINE (BACKEND HANDLES ALERT CLEANUP)
     ===================================================== */
  const unFailMachine = (m) => {
    const today = new Date().toISOString().slice(0, 10);

    updateMachine({
      ...m,
      status: "AVAILABLE",
      lastMaintenanceDate: today,
      nextMaintenanceDue: addMonths(today, 3),
    });
  };

  return (
    <div>
      <h2>Machine Master</h2>

      {/* ---------- TOP ACTIONS ---------- */}
      <div style={styles.topBar}>
        <div style={styles.filters}>
          {["ALL", "AVAILABLE", "RUNNING", "PAUSED", "ERROR"].map(
            (s) => (
              <button
                key={s}
                style={{
                  ...styles.filterBtn,
                  background:
                    statusFilter === s
                      ? "#2563eb"
                      : "#e5e7eb",
                  color:
                    statusFilter === s
                      ? "#fff"
                      : "#1f2937",
                }}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            )
          )}
        </div>

        <button
          style={styles.primaryBtn}
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          + Add Machine
        </button>
      </div>

      {/* ================= CARD GRID ================= */}
      <div style={styles.grid}>
        {filteredMachines.map((m) => {
          const due = isDue(m.nextMaintenanceDue);

          const statusColor =
            m.status === "RUNNING"
              ? "#22c55e"
              : m.status === "ERROR"
              ? "#ef4444"
              : m.status === "PAUSED"
              ? "#facc15"
              : "#0ea5e9";

          return (
            <div key={m.id} style={styles.card}>
              <div style={styles.header}>
                <h3>{m.name}</h3>
                <span
                  style={{
                    ...styles.status,
                    background: statusColor,
                  }}
                >
                  {m.status}
                </span>
              </div>

              <div style={styles.row}>
                <span>🏭 Manufactured</span>
                <strong>{m.manufactureDate}</strong>
              </div>

              <div style={styles.row}>
                <span>🛠 Last Maintenance</span>
                <strong>{m.lastMaintenanceDate}</strong>
              </div>

              <div style={styles.row}>
                <span>📅 Next Due</span>
                <strong>{m.nextMaintenanceDue}</strong>
              </div>

              {due && m.status !== "ERROR" && (
                <div style={styles.warning}>
                  ⚠ Maintenance Due
                </div>
              )}

              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => {
                    setEditing(m);
                    setForm({
                      name: m.name,
                      manufactureDate: m.manufactureDate,
                      lastMaintenanceDate:
                        m.lastMaintenanceDate,
                    });
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteMachine(m.id)}
                >
                  Delete
                </button>

                {m.status === "ERROR" ? (
                  <button
                    style={styles.unfailBtn}
                    onClick={() => unFailMachine(m)}
                  >
                    Unfail
                  </button>
                ) : (
                  <button
                    style={styles.failBtn}
                    onClick={() => failMachine(m)}
                  >
                    Fail
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL ================= */}
      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>
              {editing ? "Edit Machine" : "Add Machine"}
            </h3>

            <label>Machine Name</label>
            <input
              style={styles.input}
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <label>Manufacture Date</label>
            <input
              type="date"
              style={styles.input}
              value={form.manufactureDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  manufactureDate: e.target.value,
                })
              }
            />

            <label>Last Maintenance Date</label>
            <input
              type="date"
              style={styles.input}
              value={form.lastMaintenanceDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  lastMaintenanceDate: e.target.value,
                })
              }
            />

            <div style={styles.modalActions}>
              <button
                style={styles.secondaryBtn}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                style={styles.primaryBtn}
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES (REFINED – PROFESSIONAL) ================= */
const styles = {
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
    flexWrap: "wrap",
    gap: "12px",
  },

  filters: {
    display: "flex",
    gap: "10px",
  },

  filterBtn: {
    padding: "7px 14px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },

  primaryBtn: {
    padding: "9px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  secondaryBtn: {
    padding: "9px 16px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "22px",
  },

  card: {
    background:
      "linear-gradient(135deg, #ffffff, #f8fafc)",
    borderRadius: "18px",
    padding: "18px 20px",
    boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  /* Machine name */
  title: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0f172a",
  },

  status: {
    color: "#fff",
    padding: "5px 14px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.4px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    marginBottom: "6px",
    color: "#334155",
  },

  rowLabel: {
    color: "#64748b",
    fontWeight: "500",
  },

  rowValue: {
    fontWeight: "600",
    color: "#0f172a",
  },

  warning: {
    marginTop: "10px",
    padding: "9px",
    background: "#fff7ed",
    borderRadius: "10px",
    color: "#9a3412",
    fontWeight: "600",
    fontSize: "13px",
    textAlign: "center",
  },

  actions: {
    marginTop: "14px",
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },

  editBtn: {
    background: "#facc15",
    border: "none",
    padding: "7px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },

  failBtn: {
    background: "#f97316",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },

  unfailBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modal: {
  background: "#fff",
  padding: "24px 26px",
  borderRadius: "16px",
  width: "460px",
  boxSizing: "border-box",
},

/* Optional: make form spacing cleaner */
input: {
  width: "100%",
  padding: "11px 12px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #c7d2fe",
  fontSize: "14px",
  boxSizing: "border-box",
},

modalActions: {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "18px",
  paddingTop: "12px",
  borderTop: "1px solid #e5e7eb",
},

};


export default MachineList;
