import { useLoginLogs } from "../context/LoginLogContext";

function LoginLogs() {
  const { loginLogs } = useLoginLogs();

  return (
    <div>
      <h2 style={styles.title}>User Login Logs</h2>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Login Time</th>
              <th style={styles.th}>Logout Time</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {loginLogs.length === 0 && (
              <tr>
                <td colSpan="5" style={styles.empty}>
                  No login logs found
                </td>
              </tr>
            )}

            {loginLogs.map((l) => {
              const isActive = !l.logoutTime;

              return (
                <tr key={l.id} style={styles.tr}>
                  <td style={styles.td}>{l.username}</td>
                  <td style={styles.td}>
                    <span style={styles.roleBadge(l.role)}>
                      {l.role}
                    </span>
                  </td>
                  <td style={styles.td}>{l.loginTime}</td>
                  <td style={styles.td}>
                    {l.logoutTime || "-"}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={
                        isActive
                          ? styles.activeBadge
                          : styles.inactiveBadge
                      }
                    >
                      {isActive ? "Active" : "Logged out"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  title: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#0f172a",
  },

  tableWrap: {
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },

  th: {
    padding: "12px 14px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#334155",
    fontWeight: "700",
    borderBottom: "2px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  tr: {
    borderBottom: "1px solid #f1f5f9",
  },

  td: {
    padding: "10px 14px",
    color: "#334155",
    whiteSpace: "nowrap",
  },

  empty: {
    padding: "18px",
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
  },

  roleBadge: (role) => ({
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#fff",
    background:
      role === "ADMIN"
        ? "#7c3aed"
        : role === "SUPERVISOR"
        ? "#2563eb"
        : "#16a34a",
  }),

  activeBadge: {
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#065f46",
    background: "#d1fae5",
  },

  inactiveBadge: {
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#991b1b",
    background: "#fee2e2",
  },
};

export default LoginLogs;
