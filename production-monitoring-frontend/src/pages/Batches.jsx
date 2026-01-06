import { useState, useEffect } from "react";
import { useMachines } from "../context/MachineContext";
import { useMaterials } from "../context/MaterialContext";
import { useBatches } from "../context/BatchContext";
import { useUsers } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 5;

function Batches() {
  /* ================= CONTEXTS ================= */
  const { machines, MACHINE_STATUS } = useMachines();
  const { materials } = useMaterials();
  const {
    batches,
    addBatch,
    updateBatch,
    deleteBatch,
    hasActiveBatch,
  } = useBatches();
  const { users } = useUsers();
  const { user } = useAuth();

  /* ================= DERIVED DATA ================= */
  const operators = users.filter(
    (u) => u.role === "OPERATOR" && u.active
  );

  /* ================= UI STATE ================= */
  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  /* ================= FORM STATE ================= */
  const [productName, setProductName] = useState("");
  const [finalProductQty, setFinalProductQty] = useState("");
  const [machineId, setMachineId] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [estimatedStartTime, setEstimatedStartTime] = useState("");
  const [estimatedEndTime, setEstimatedEndTime] = useState("");

  /* ================= MULTI MATERIAL ================= */
  const [materialsUsed, setMaterialsUsed] = useState([
    { materialId: "", quantity: "" },
  ]);

  /* ================= FILTER / PAGINATION ================= */
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [machineFilter, setMachineFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  /* =====================================================
     🔒 FIX-1: FORCE CLOSE MODAL ON UNMOUNT
     ===================================================== */
  useEffect(() => {
    return () => {
      setShowForm(false);
      setEditingBatch(null);
    };
  }, []);

  /* =====================================================
     🔒 FIX-2: CLOSE MODAL ON ROLE CHANGE
     ===================================================== */
  useEffect(() => {
    if (user?.role !== "ADMIN" && user?.role !== "SUPERVISOR") {
      setShowForm(false);
      setEditingBatch(null);
    }
  }, [user]);

  /* =====================================================
     AUTO-CLOSE EDIT MODAL IF STATUS CHANGES
     ===================================================== */
  useEffect(() => {
    if (!editingBatch) return;

    const liveBatch = batches.find(
      (b) => b.id === editingBatch.id
    );

    if (!liveBatch || liveBatch.status !== "SCHEDULED") {
      setShowForm(false);
      setEditingBatch(null);
    }
  }, [batches, editingBatch]);

  /* =====================================================
     RESET PAGE ON FILTER CHANGE (UI ONLY)
     ===================================================== */
  useEffect(() => {
    setPage(1);
  }, [statusFilter, machineFilter, fromDate, toDate]);

  /* =====================================================
     OPEN CREATE MODAL
     ===================================================== */
  const openCreate = () => {
    setEditingBatch(null);
    setProductName("");
    setFinalProductQty("");
    setMachineId("");
    setOperatorId("");
    setEstimatedStartTime("");
    setEstimatedEndTime("");
    setMaterialsUsed([{ materialId: "", quantity: "" }]);
    setShowForm(true);
  };

  /* =====================================================
     OPEN EDIT MODAL (SCHEDULED ONLY)
     ===================================================== */
  const openEdit = (batch) => {
    if (batch.status !== "SCHEDULED") return;

    setEditingBatch(batch);
    setProductName(batch.productName);
    setFinalProductQty(batch.finalProductQty);
    setMachineId(batch.machine.id);
    setOperatorId(batch.operator.id);
    setEstimatedStartTime(batch.estimatedStartTime);
    setEstimatedEndTime(batch.estimatedEndTime);
    setMaterialsUsed(
      batch.materials.map((m) => ({
        materialId: m.material.id,
        quantity: m.quantity,
      }))
    );
    setShowForm(true);
  };

  /* =====================================================
     DELETE BATCH (SCHEDULED ONLY)
     ===================================================== */
  const handleDelete = (batch) => {
    if (batch.status !== "SCHEDULED") return;

    if (
      !window.confirm(
        `Delete batch "${batch.productName}"?\nThis cannot be undone.`
      )
    )
      return;

    deleteBatch(batch.id);
    setPage(1);
  };

  /* =====================================================
     SAVE BATCH (CREATE / UPDATE)
     ===================================================== */
  const saveBatch = () => {
    const machine = machines.find(
      (m) => m.id === Number(machineId)
    );
    const operator = operators.find(
      (o) => o.id === Number(operatorId)
    );

    if (!productName || !finalProductQty || !machine || !operator) {
      alert("All fields required");
      return;
    }

    if (
      !editingBatch &&
      machine.status !== MACHINE_STATUS.AVAILABLE
    ) {
      alert(`Machine "${machine.name}" is not AVAILABLE`);
      return;
    }

    if (
      new Date(estimatedEndTime) <=
      new Date(estimatedStartTime)
    ) {
      alert("End time must be after start time");
      return;
    }

    const preparedMaterials = materialsUsed.map((row) => ({
      materialId: Number(row.materialId),
      quantity: Number(row.quantity),
    }));

    if (editingBatch) {
      updateBatch({
        id: editingBatch.id,
        productName,
        finalProductQty: Number(finalProductQty),
        materialsUsed: preparedMaterials,
        operatorId: operator.id,
        estimatedStartTime,
        estimatedEndTime,
      });
    } else {
      if (hasActiveBatch(machine.name)) {
        alert("Machine already has active batch");
        return;
      }

      addBatch({
        productName,
        finalProductQty: Number(finalProductQty),
        machineId: machine.id,
        operatorId: operator.id,
        materialsUsed: preparedMaterials,
        estimatedStartTime,
        estimatedEndTime,
      });
    }

    setShowForm(false);
    setEditingBatch(null);
  };

  /* =====================================================
     FILTER + PAGINATION (LOGIC UNCHANGED, UI-DRIVEN)
     ===================================================== */
  const filteredBatches = batches.filter((b) => {
    if (statusFilter !== "ALL" && b.status !== statusFilter)
      return false;

    if (
      machineFilter !== "ALL" &&
      b.machine?.id !== Number(machineFilter)
    )
      return false;

    if (fromDate && new Date(b.estimatedStartTime) < new Date(fromDate))
      return false;

    if (toDate && new Date(b.estimatedEndTime) > new Date(toDate))
      return false;

    return true;
  });

  const paginatedBatches = filteredBatches.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* =====================================================
     RENDER
     ===================================================== */
  return (
    <div>
      <h2>Batches</h2>

      <button style={styles.primaryBtn} onClick={openCreate}>
        + New Batch
      </button>

      {/* ================= FILTER BAR (UI ADDITION) ================= */}
      <div style={styles.filterBar}>
        <select
          style={styles.filterInput}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="RUNNING">Running</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>

        <select
          style={styles.filterInput}
          value={machineFilter}
          onChange={(e) => setMachineFilter(e.target.value)}
        >
          <option value="ALL">All Machines</option>
          {machines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          style={styles.filterInput}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          style={styles.filterInput}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {/* ================= MODAL (UNCHANGED) ================= */}
      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>{editingBatch ? "Edit Batch" : "Create Batch"}</h3>

            <div style={styles.field}>
              <label>Product Name</label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label>Final Product Quantity</label>
              <input
                type="number"
                value={finalProductQty}
                onChange={(e) =>
                  setFinalProductQty(e.target.value)
                }
              />
            </div>

            <div style={styles.field}>
              <label>Machine</label>
              <select
                value={machineId}
                onChange={(e) =>
                  setMachineId(e.target.value)
                }
                disabled={!!editingBatch}
              >
                <option value="">Select Machine</option>
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.status})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label>Assign Operator</label>
              <select
                value={operatorId}
                onChange={(e) =>
                  setOperatorId(e.target.value)
                }
              >
                <option value="">Select Operator</option>
                {operators.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.username}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label>Estimated Start Time</label>
              <input
                type="datetime-local"
                value={estimatedStartTime}
                onChange={(e) =>
                  setEstimatedStartTime(e.target.value)
                }
              />
            </div>

            <div style={styles.field}>
              <label>Estimated End Time</label>
              <input
                type="datetime-local"
                value={estimatedEndTime}
                onChange={(e) =>
                  setEstimatedEndTime(e.target.value)
                }
              />
            </div>

            <h4>Materials Used</h4>
            {materialsUsed.map((row, index) => (
              <div
                key={index}
                style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
              >
                <select
                  value={row.materialId}
                  onChange={(e) => {
                    const copy = [...materialsUsed];
                    copy[index].materialId = e.target.value;
                    setMaterialsUsed(copy);
                  }}
                >
                  <option value="">Select Material</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Stock: {m.stock})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Qty"
                  value={row.quantity}
                  onChange={(e) => {
                    const copy = [...materialsUsed];
                    copy[index].quantity = e.target.value;
                    setMaterialsUsed(copy);
                  }}
                />

                <button
                  onClick={() =>
                    setMaterialsUsed((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  ❌
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setMaterialsUsed((prev) => [
                  ...prev,
                  { materialId: "", quantity: "" },
                ])
              }
            >
              + Add Material
            </button>

            <div style={styles.modalActions}>
              <button
                style={styles.secondaryBtn}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                style={styles.primaryBtn}
                onClick={saveBatch}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <h3 style={{ marginTop: "30px" }}>All Batches</h3>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Machine</th>
              <th>Final Qty</th>
              <th>Status</th>
              <th>Est. Start</th>
              <th>Est. End</th>
              <th>Operator</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBatches.map((b) => {
              const disabled = b.status !== "SCHEDULED";

              return (
                <tr key={b.id}>
                  <td>{b.productName}</td>
                  <td>{b.machine?.name}</td>
                  <td>{b.finalProductQty}</td>
                  <td>
                    <span style={styles.statusBadge(b.status)}>
                      {b.status}
                    </span>
                  </td>
                  <td>{b.estimatedStartTime}</td>
                  <td>{b.estimatedEndTime}</td>
                  <td>{b.operator?.username}</td>
                  <td style={{ display: "flex", gap: "6px" }}>
                    <button
                      disabled={disabled}
                      style={
                        disabled
                          ? styles.editBtnDisabled
                          : styles.editBtn
                      }
                      onClick={() => openEdit(b)}
                    >
                      ✏ Edit
                    </button>
                    <button
                      disabled={disabled}
                      style={
                        disabled
                          ? styles.deleteBtnDisabled
                          : styles.deleteBtn
                      }
                      onClick={() => handleDelete(b)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div style={styles.pagination}>
        <button
          style={styles.pageBtn}
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span style={styles.pageInfo}>
          Page {page} of{" "}
          {Math.ceil(filteredBatches.length / PAGE_SIZE) || 1}
        </span>
        <button
          style={styles.pageBtn}
          disabled={page * PAGE_SIZE >= filteredBatches.length}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES (UI ONLY – COMPACT TABLE) ================= */
const styles = {
  primaryBtn: {
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  secondaryBtn: {
    padding: "10px 16px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  /* ---------- FILTERS ---------- */
  filterBar: {
    marginTop: "14px",
    marginBottom: "16px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  filterInput: {
    padding: "7px 10px",
    borderRadius: "8px",
    border: "1px solid #cbd5f5",
    fontSize: "12.5px",
  },

  /* ---------- TABLE ---------- */
  tableWrap: {
    background: "#fff",
    borderRadius: "12px",
    overflowX: "auto",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",

    scrollbarWidth: "none",       // Firefox
    msOverflowStyle: "none",  
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12.5px", // ⬅ smaller base font
  },

  th: {
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: "700",
    textAlign: "left",
    color: "#334155",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "7px 10px",
    fontSize: "12.5px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
    lineHeight: "1.4",
  },

  statusBadge: (status) => ({
    padding: "2px 8px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#fff",
    background:
      status === "COMPLETED"
        ? "#22c55e"
        : status === "FAILED"
        ? "#ef4444"
        : status === "RUNNING"
        ? "#f97316"
        : "#3b82f6",
  }),

  /* ---------- PAGINATION ---------- */
  pagination: {
    marginTop: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
  },

  pageBtn: {
    padding: "5px 10px",
    borderRadius: "6px",
    border: "1px solid #cbd5f5",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  pageInfo: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#475569",
  },

  /* ---------- ACTION BUTTONS ---------- */
  editBtn: {
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #2563eb",
    background: "#eff6ff",
    fontSize: "11.5px",
    cursor: "pointer",
  },

  editBtnDisabled: {
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    background: "#f1f5f9",
    color: "#94a3b8",
    cursor: "not-allowed",
    opacity: 0.7,
    fontSize: "11.5px",
  },

  deleteBtn: {
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #991b1b",
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: "11.5px",
    cursor: "pointer",
  },

  deleteBtnDisabled: {
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    background: "#f1f5f9",
    color: "#94a3b8",
    cursor: "not-allowed",
    opacity: 0.7,
    fontSize: "11.5px",
  },

  /* ---------- MODAL ---------- */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#fff",
    padding: "24px",
    borderRadius: "14px",
    width: "520px",
    maxHeight: "90vh",
    overflowY: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "12px",
    fontSize: "13px",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
};

export default Batches;
