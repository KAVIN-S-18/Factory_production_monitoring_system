import { useAlerts } from "../context/AlertContext";

/* =========================
   STYLE HELPERS
   ========================= */
const getAlertStyle = (type, severity) => {
  if (type === "MACHINE_FAILURE") {
    return {
      borderLeft: "6px solid #dc2626",
      background: "#fee2e2",
    };
  }

  if (type === "MAINTENANCE") {
    return {
      borderLeft: "6px solid #f59e0b",
      background: "#fff7ed",
    };
  }

  return {
    borderLeft: "6px solid #2563eb",
    background: "#eff6ff",
  };
};

function Alerts() {
  const { alerts, clearAlerts, resolveAlert } = useAlerts();

  /* =========================
     SORT: HIGH → LOW priority
     ========================= */
  const sortedAlerts = [...alerts].sort((a, b) => {
    const order = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return (order[b.severity] || 0) - (order[a.severity] || 0);
  });

  return (
    <div>
      <h2>Alerts</h2>

      <button
        onClick={clearAlerts}
        style={{
          marginBottom: "14px",
          padding: "8px 14px",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Clear All
      </button>

      {sortedAlerts.length === 0 ? (
        <p>No alerts</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sortedAlerts.map((alert) => (
            <li
              key={alert.id}
              style={{
                ...getAlertStyle(alert.type, alert.severity),
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            >
              <div style={{ fontWeight: "700", marginBottom: "4px" }}>
                {alert.machine}
              </div>

              <div>{alert.message}</div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#475569",
                  marginTop: "6px",
                }}
              >
                <span style={{ marginRight: "10px" }}>
                  Type: <b>{alert.type}</b>
                </span>
                <span style={{ marginRight: "10px" }}>
                  Severity: <b>{alert.severity}</b>
                </span>
                <span>{alert.time}</span>
              </div>

              {/* ================= RESOLVE BUTTON ================= */}
              <div style={{ marginTop: "10px", textAlign: "right" }}>
                <button
                  onClick={() => resolveAlert(alert.id)}
                  style={{
                    background: "#22c55e",
                    color: "#fff",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Resolve
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Alerts;
