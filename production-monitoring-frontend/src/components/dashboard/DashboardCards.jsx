import { useMachines } from "../../context/MachineContext";
import { useBatches } from "../../context/BatchContext";
import { useMaterials } from "../../context/MaterialContext";
import { useSuppliers } from "../../context/SupplierContext";

/* ---------- HELPER ---------- */
const isDue = (date) => new Date() >= new Date(date);

function DashboardCards() {
  const { machines } = useMachines();
  const { batches } = useBatches();
  const { materials } = useMaterials();
  const { suppliers } = useSuppliers(); // ✅ NOW FROM DB

  const totalMachines = machines.length;

  const runningMachines = machines.filter(
    (m) => m.status === "RUNNING"
  ).length;

  const availableMachines = machines.filter(
    (m) => m.status === "AVAILABLE"
  ).length;

  const pausedMachines = machines.filter(
    (m) => m.status === "PAUSED"
  ).length;

  const errorMachines = machines.filter(
    (m) => m.status === "ERROR"
  ).length;

  /* ✅ MAINTENANCE DUE COUNT */
  const maintenanceDueMachines = machines.filter(
    (m) => isDue(m.nextMaintenanceDue)
  ).length;

  const activeBatches = batches.filter(
    (b) => b.status === "IN_PROGRESS"
  ).length;

  return (
    <div style={styles.grid}>
      <Card
        title="Total Machines"
        value={totalMachines}
        color="#2563eb"
      />

      <Card
        title="Running Machines"
        value={runningMachines}
        color="#16a34a"
      />

      <Card
        title="Available Machines"
        value={availableMachines}
        color="#0ea5e9"
      />

      <Card
        title="Paused Machines"
        value={pausedMachines}
        color="#facc15"
      />

      <Card
        title="Error Machines"
        value={errorMachines}
        color="#dc2626"
      />

      {/* ✅ MAINTENANCE CARD */}
      <Card
        title="Maintenance Due"
        value={maintenanceDueMachines}
        color="#f97316"
      />

      <Card
        title="Materials"
        value={materials.length}
        color="#0d9488"
      />

      <Card
        title="Active Batches"
        value={activeBatches}
        color="#f59e0b"
      />

      {/* ✅ NOW DYNAMIC FROM DB */}
      <Card
        title="Suppliers"
        value={suppliers.length}
        color="#7c3aed"
      />
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div
      style={{
        ...styles.card,
        borderLeft: `6px solid ${color}`,
      }}
    >
      <div style={styles.title}>{title}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "14px",
    color: "#475569",
  },
  value: {
    fontSize: "28px",
    fontWeight: "700",
    marginTop: "8px",
  },
};

export default DashboardCards;
