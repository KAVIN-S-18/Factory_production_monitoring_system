import { useState, useMemo } from "react";
import { useBatches } from "../context/BatchContext";
import { useProductionLogs } from "../context/ProductionLogContext";
import { useAuth } from "../context/AuthContext";

/* ================= STATUS PRIORITY ================= */
const STATUS_ORDER = {
  SCHEDULED: 1,
  IN_PROGRESS: 2,
  PAUSED: 3,
  FAILED: 4,
  COMPLETED: 5,
};

const STATUS_LABELS = [
  "ALL",
  "SCHEDULED",
  "IN_PROGRESS",
  "PAUSED",
  "FAILED",
  "COMPLETED",
];

function OperatorDashboard() {
  /* ================= CONTEXTS ================= */

  const {
    batches,
    startBatch,
    pauseBatch,
    completeBatch,
    failBatch,
  } = useBatches();

  const {
    logs,
    addLog,
    pauseProduction,
    resumeProduction,
    completeProduction,
    failProduction,
  } = useProductionLogs();

  const { user } = useAuth();

  /* ================= AUTH ================= */

  if (!user || user.role !== "OPERATOR") {
    return <p>Unauthorized</p>;
  }

  /* ================= UI STATE ================= */

  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* =====================================================
     ASSIGNED + FILTERED + SORTED BATCHES
     ===================================================== */
  const visibleBatches = useMemo(() => {
    let list = batches.filter(
      (b) => b.operator?.id === user.id
    );

    if (statusFilter !== "ALL") {
      list = list.filter(
        (b) => b.status === statusFilter
      );
    }

    return [...list].sort(
      (a, b) =>
        (STATUS_ORDER[a.status] || 99) -
        (STATUS_ORDER[b.status] || 99)
    );
  }, [batches, user.id, statusFilter]);

  /* =====================================================
     HELPERS
     ===================================================== */

  const getLogForBatch = (batchId) =>
    logs.find(
      (l) =>
        l.batchId === batchId &&
        (l.status === "RUNNING" || l.status === "PAUSED")
    );

  /* =====================================================
     ACTION HANDLERS
     ===================================================== */

  const handleStart = (batch) => {
    startBatch(batch.id);

    const existingLog = logs.find(
      (l) => l.batchId === batch.id
    );

    if (!existingLog) {
      addLog({
        batchId: batch.id,
        productName: batch.productName,
        finalProductQty: Number(batch.finalProductQty),
        machine: {
          id: batch.machine.id,
          name: batch.machine.name,
          status: batch.machine.status,
        },
        operatorId: user.id,
        operatorName: user.username,
      });
    } else {
      resumeProduction(existingLog.id);
    }
  };

  const handlePause = (batch) => {
    const log = getLogForBatch(batch.id);
    if (log) pauseProduction(log.id);
    pauseBatch(batch.id);
  };

  const handleComplete = (batch) => {
    const log = getLogForBatch(batch.id);
    if (log) completeProduction(log.id);
    completeBatch(batch.id);
  };

  const handleFail = (batch) => {
    const log = getLogForBatch(batch.id);
    if (log) failProduction(log.id);
    failBatch(batch.id);
  };

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div>
      <h2>Assigned Batches</h2>
      <h4>Welcome, {user.username}</h4>

      {/* ================= FILTER BUTTONS ================= */}
      <div style={styles.filterBar}>
        {STATUS_LABELS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={
              statusFilter === status
                ? styles.filterBtnActive
                : styles.filterBtn
            }
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {visibleBatches.length === 0 ? (
        <p style={{ marginTop: "20px" }}>
          No batches found
        </p>
      ) : (
        <div style={styles.grid}>
          {visibleBatches.map((b) => {
            const expanded = expandedBatchId === b.id;

            return (
              <div key={b.id} style={styles.card}>
                {/* ---------- CARD HEADER ---------- */}
                <div
                  style={styles.cardHeader}
                  onClick={() =>
                    setExpandedBatchId(
                      expanded ? null : b.id
                    )
                  }
                >
                  <div>
                    <strong>{b.productName}</strong>
                    <div style={styles.sub}>
                      Machine: {b.machine?.name}
                    </div>
                  </div>

                  <span
                    style={{
                      ...styles.status,
                      background:
                        b.status === "SCHEDULED"
                          ? "#6366f1"
                          : b.status === "IN_PROGRESS"
                          ? "#22c55e"
                          : b.status === "PAUSED"
                          ? "#facc15"
                          : b.status === "FAILED"
                          ? "#ef4444"
                          : "#94a3b8",
                    }}
                  >
                    {b.status}
                  </span>
                </div>

                {/* ---------- EXPANDED DETAILS ---------- */}
                {expanded && (
                  <div style={styles.details}>
                    <div style={styles.row}>
                      <span>Estimated Start</span>
                      <strong>{b.estimatedStartTime}</strong>
                    </div>

                    <div style={styles.row}>
                      <span>Estimated End</span>
                      <strong>{b.estimatedEndTime}</strong>
                    </div>

                    <div style={styles.row}>
                      <span>Final Qty</span>
                      <strong>{b.finalProductQty}</strong>
                    </div>

                    {/* ---------- MATERIALS ---------- */}
                    <div style={{ marginTop: "10px" }}>
                      <strong>Materials Used</strong>
                      <ul style={styles.materialList}>
                        {b.materials?.map((m) => (
                          <li key={m.id}>
                            {m.material.name} →{" "}
                            <strong>{m.quantity}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* ---------- ACTIONS ---------- */}
                    <div style={styles.actions}>
                      {b.status === "SCHEDULED" && (
                        <button
                          style={styles.startBtn}
                          onClick={() => handleStart(b)}
                        >
                          ▶ Start
                        </button>
                      )}

                      {b.status === "IN_PROGRESS" && (
                        <>
                          <button
                            style={styles.pauseBtn}
                            onClick={() => handlePause(b)}
                          >
                            ⏸ Pause
                          </button>
                          <button
                            style={styles.endBtn}
                            onClick={() => handleComplete(b)}
                          >
                            ✔ Complete
                          </button>
                          <button
                            style={styles.failBtn}
                            onClick={() => handleFail(b)}
                          >
                            ✖ Fail
                          </button>
                        </>
                      )}

                      {b.status === "PAUSED" && (
                        <>
                          <button
                            style={styles.startBtn}
                            onClick={() => handleStart(b)}
                          >
                            ▶ Resume
                          </button>
                          <button
                            style={styles.failBtn}
                            onClick={() => handleFail(b)}
                          >
                            ✖ Fail
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  filterBar: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "6px 12px",
    borderRadius: "999px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: "12px",
  },
  filterBtnActive: {
    padding: "6px 12px",
    borderRadius: "999px",
    border: "1px solid #2563eb",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
  },
  grid: {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "20px",
},

  card: {
    background: "#ffffff",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    overflow: "hidden",
    cursor: "pointer",
  },
  cardHeader: {
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sub: {
    fontSize: "13px",
    color: "#475569",
  },
  status: {
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  details: {
    padding: "16px",
    borderTop: "1px solid #e5e7eb",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
    fontSize: "14px",
  },
  materialList: {
    marginTop: "6px",
    paddingLeft: "18px",
  },
  actions: {
    marginTop: "14px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  startBtn: {
    padding: "6px 10px",
    background: "#dcfce7",
    border: "1px solid #166534",
    borderRadius: "6px",
    cursor: "pointer",
  },
  pauseBtn: {
    padding: "6px 10px",
    background: "#fef9c3",
    border: "1px solid #854d0e",
    borderRadius: "6px",
    cursor: "pointer",
  },
  endBtn: {
    padding: "6px 10px",
    background: "#dbeafe",
    border: "1px solid #1d4ed8",
    borderRadius: "6px",
    cursor: "pointer",
  },
  failBtn: {
    padding: "6px 10px",
    background: "#fee2e2",
    border: "1px solid #991b1b",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default OperatorDashboard;
