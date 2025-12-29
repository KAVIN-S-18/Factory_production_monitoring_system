import { useMachines } from "../../context/MachineContext";
import { useProductionLogs } from "../../context/ProductionLogContext";
import { useAlerts } from "../../context/AlertContext";
import { useMaterials } from "../../context/MaterialContext";
import { useSuppliers } from "../../context/SupplierContext";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ProductionCharts() {
  const { machines } = useMachines();
  const { logs } = useProductionLogs();
  const { alerts } = useAlerts(); // ✅ SINGLE SOURCE OF TRUTH
  const { materials } = useMaterials();
  const { suppliers } = useSuppliers();

  /* ================= MACHINE STATUS ================= */
  const running = machines.filter(
    (m) => m.status === "RUNNING"
  ).length;

  const available = machines.filter(
    (m) => m.status === "AVAILABLE"
  ).length;

  const paused = machines.filter(
    (m) => m.status === "PAUSED"
  ).length;

  const error = machines.filter(
    (m) => m.status === "ERROR"
  ).length;

  const machinePieData = [
    { name: "Running", value: running },
    { name: "Available", value: available },
    { name: "Paused", value: paused },
    { name: "Error", value: error },
  ];

  /* ================= PRODUCTION DATA ================= */
  const runningProduction = logs.filter(
    (l) => l.status === "RUNNING"
  ).length;

  const totalProductionRuns = logs.length;

  const productionBarData = [
    { name: "Running Production", value: runningProduction },
    { name: "Total Production Runs", value: totalProductionRuns },
  ];

  /* ================= MATERIAL STOCK ================= */
  const materialBarData = materials.map((m) => ({
    name: m.name,
    stock: m.stock,
  }));

  /* ================= SUPPLIER STATUS ================= */
  const activeSuppliers = suppliers.filter(
    (s) => s.status === "ACTIVE"
  ).length;

  const inactiveSuppliers = suppliers.filter(
    (s) => s.status === "INACTIVE"
  ).length;

  const supplierRingData = [
    { name: "Active", value: activeSuppliers },
    { name: "Inactive", value: inactiveSuppliers },
  ];

  /* ================= ALERTS (NO CREATION HERE) ================= */
  const recentAlerts = alerts.slice(0, 5);

  return (
    <div style={styles.grid}>
      {/* ================= LEFT: CHARTS ================= */}
      <div style={styles.charts}>
        {/* Machine Status */}
        <div style={styles.card}>
          <h3>Machine Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={machinePieData}
                dataKey="value"
                outerRadius={80}
              >
                <Cell fill="#22c55e" />
                <Cell fill="#0ea5e9" />
                <Cell fill="#facc15" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Production Overview */}
        <div style={styles.card}>
          <h3>Production Overview</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={productionBarData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Material Stock */}
        <div style={styles.card}>
          <h3>Material Stock</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={materialBarData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Supplier Status */}
        <div style={styles.card}>
          <h3>Suppliers Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={supplierRingData}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
              >
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= RIGHT: ALERTS ================= */}
      <div style={styles.alerts}>
        <h3>Recent Alerts</h3>

        {recentAlerts.length === 0 ? (
          <p>No alerts</p>
        ) : (
          recentAlerts.map((a) => (
            <div
              key={a.id}
              style={{
                ...styles.alertItem,
                borderLeft:
                  a.type === "MAINTENANCE"
                    ? "4px solid #f59e0b"
                    : "4px solid #ef4444",
              }}
            >
              <strong>{a.machine}</strong>
              <div>{a.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "3fr 1fr",
    gap: "20px",
    marginTop: "20px",
  },
  charts: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  alerts: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  alertItem: {
    padding: "10px",
    background: "#f8fafc",
    borderRadius: "8px",
    marginBottom: "8px",
  },
};

export default ProductionCharts;
