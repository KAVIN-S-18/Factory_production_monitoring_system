import { useEffect, useState } from "react";

const PAGE_SIZE = 5;
const API_BASE = "http://localhost:8081/api/production-logs";

function Reports() {
  /* ---------- DATA ---------- */
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------- INPUT STATES ---------- */
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ---------- APPLIED FILTER STATES ---------- */
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  /* ---------- PAGINATION ---------- */
  const [page, setPage] = useState(0);

  /* =========================
     FETCH REPORTS FROM BACKEND
     ========================= */
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
      setPage(0);
    } catch (err) {
      console.error("Failed to load production reports", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    fetchReports();
  }, []);

  /* ---------- APPLY FILTER ---------- */
  const applyFilter = () => {
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
    fetchReports(fromDate, toDate);
  };

  /* ---------- PAGINATION ---------- */
  const startIndex = page * PAGE_SIZE;
  const pagedLogs = logs.slice(startIndex, startIndex + PAGE_SIZE);

  const hasPrev = page > 0;
  const hasNext = startIndex + PAGE_SIZE < logs.length;

  /* ---------- TOTAL PRODUCED ---------- */
  const totalProduced = logs.reduce(
    (sum, l) => sum + (Number(l.producedQty) || 0),
    0
  );

  return (
    <div>
      <h2>Production Reports</h2>

      {/* ================= FILTER ================= */}
      <div style={styles.filterBox}>
        <div style={styles.field}>
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={styles.input}
          />
        </div>

        <button style={styles.applyBtn} onClick={applyFilter}>
          Apply Filter
        </button>
      </div>

      {loading && <p>Loading reports...</p>}

      <h3>Total Produced: {totalProduced}</h3>

      {/* ================= TABLE ================= */}
      {pagedLogs.length === 0 && !loading ? (
        <p>No completed production</p>
      ) : (
        <>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Machine</th>
                  <th style={styles.th}>Quantity</th>
                  <th style={styles.th}>Start</th>
                  <th style={styles.th}>End</th>
                  <th style={styles.th}>Shift</th>
                </tr>
              </thead>
              <tbody>
                {pagedLogs.map((l) => (
                  <tr key={l.id}>
                    <td style={styles.td}>{l.productName}</td>
                    <td style={styles.td}>{l.machine?.name || "-"}</td>
                    <td style={styles.td}>{l.producedQty}</td>
                    <td style={styles.td}>
                      {l.startTime
                        ? new Date(l.startTime).toLocaleString()
                        : "-"}
                    </td>
                    <td style={styles.td}>
                      {l.endTime
                        ? new Date(l.endTime).toLocaleString()
                        : "-"}
                    </td>
                    <td style={styles.td}>{l.shift}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION ================= */}
          <div style={styles.pagination}>
            <button
              style={styles.pageBtn}
              disabled={!hasPrev}
              onClick={() => setPage((p) => p - 1)}
            >
              ◀ Prev
            </button>

            <span style={styles.pageInfo}>
              Page {page + 1} / {Math.ceil(logs.length / PAGE_SIZE) || 1}
            </span>

            <button
              style={styles.pageBtn}
              disabled={!hasNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= STYLES (MATCH BATCH TABLE) ================= */
const styles = {
  /* ---------- FILTER ---------- */
  filterBox: {
    display: "flex",
    gap: "14px",
    marginBottom: "20px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "13px",
  },
  input: {
    height: "36px",
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #cbd5f5",
    fontSize: "13px",
  },
  applyBtn: {
    height: "36px",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "600",
    fontSize: "13px",
  },

  /* ---------- TABLE ---------- */
  tableWrap: {
    background: "#ffffff",
    borderRadius: "5px",
    overflowX: "auto",
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
    marginTop: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse", // ✅ flat table
    fontSize: "12.5px",
  },
  th: {
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: "700",
    textAlign: "left",
    background: "#f8fafc",
    color: "#334155",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "8px 10px",
    fontSize: "12.5px",
    color: "#334155",
    //borderBottom: "1px solid #f1f5f9",
    lineHeight: "18px",
  },

  /* ---------- PAGINATION ---------- */
  pagination: {
    marginTop: "14px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
  },
  pageBtn: {
    height: "30px",
    padding: "4px 10px",
    borderRadius: "6px",
    border: "1px solid #cbd5f5",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: "11.5px",
    fontWeight: "600",
  },
  pageInfo: {
    fontSize: "11.5px",
    fontWeight: "600",
    color: "#475569",
  },
};

export default Reports;
