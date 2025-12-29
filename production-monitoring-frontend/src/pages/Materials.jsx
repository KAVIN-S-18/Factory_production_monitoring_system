import { useState, useMemo } from "react";
import { useMaterials } from "../context/MaterialContext";
import { useSuppliers } from "../context/SupplierContext";

const gradeLabel = (g) => ["A", "B", "C"][g - 1] || g;

const LOCATIONS = [
  "Main Warehouse",
  "Cold Storage",
  "Secondary Warehouse",
];

const PAGE_SIZE = 5;

function Materials() {
    
  const { materials, loading, addStockViaSupplier } = useMaterials();
  const { suppliers } = useSuppliers();
  const [showForm, setShowForm] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [supplierMaterial, setSupplierMaterial] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- FILTER STATE ---------- */
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");

  /* ---------- PAGINATION ---------- */
  const [page, setPage] = useState(1);

  const activeSuppliers = suppliers.filter(
    (s) => s.status === "ACTIVE"
  );

  const selectedSupplier = activeSuppliers.find(
    (s) => s.id === Number(supplierId)
  );

  /* ---------- ADD STOCK (BACKEND) ---------- */
  const handleAddStock = async () => {
    if (!supplierId || !supplierMaterial || !quantity || !location) {
      alert("All fields required");
      return;
    }

    const [materialName, grade] = supplierMaterial.split("|");

    try {
      setSubmitting(true);

      await addStockViaSupplier({
        supplierId: Number(supplierId),
        materialName,
        grade: Number(grade),
        location,
        quantity: Number(quantity),
      });

      setSupplierId("");
      setSupplierMaterial("");
      setQuantity("");
      setLocation("");
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- FILTERED MATERIALS ---------- */
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      if (gradeFilter !== "ALL" && m.grade !== Number(gradeFilter))
        return false;
      if (locationFilter !== "ALL" && m.location !== locationFilter)
        return false;
      return true;
    });
  }, [materials, gradeFilter, locationFilter]);

  /* ---------- PAGINATED ---------- */
  const totalPages = Math.ceil(
    filteredMaterials.length / PAGE_SIZE
  );

  const paginatedMaterials = filteredMaterials.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const onFilterChange = () => setPage(1);

  if (loading) {
    return <p>Loading materials...</p>;
  }

  return (
    <div>
      <h2>Material Inventory</h2>

      <button
        style={styles.primaryBtn}
        onClick={() => setShowForm(true)}
      >
        + Add Materials
      </button>

      {/* ================= FILTER BAR ================= */}
      <div style={styles.filterBar}>
        <select
          style={styles.filterInput}
          value={gradeFilter}
          onChange={(e) => {
            setGradeFilter(e.target.value);
            onFilterChange();
          }}
        >
          <option value="ALL">All Grades</option>
          <option value="1">Grade A</option>
          <option value="2">Grade B</option>
          <option value="3">Grade C</option>
        </select>

        <select
          style={styles.filterInput}
          value={locationFilter}
          onChange={(e) => {
            setLocationFilter(e.target.value);
            onFilterChange();
          }}
        >
          <option value="ALL">All Locations</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* ================= ADD MODAL ================= */}
      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Add Material via Supplier</h3>

            <select
              style={styles.input}
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              <option value="">Select Supplier</option>
              {activeSuppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              style={styles.input}
              value={supplierMaterial}
              onChange={(e) =>
                setSupplierMaterial(e.target.value)
              }
              disabled={!selectedSupplier}
            >
              <option value="">Select Material</option>
              {selectedSupplier?.materials?.map((m, i) => (
                <option
                  key={i}
                  value={`${m.materialName}|${m.grade}`}
                >
                  {m.materialName} (Grade {gradeLabel(m.grade)})
                </option>
              ))}
            </select>

            <select
              style={styles.input}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select Storage Location</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <input
              style={styles.input}
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <div style={styles.modalActions}>
              <button
                style={styles.secondaryBtn}
                onClick={() => setShowForm(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                style={styles.primaryBtn}
                onClick={handleAddStock}
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add Stock"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MATERIAL TABLE ================= */}
<div style={styles.tableWrap}>
  <table style={styles.table}>
    <thead>
      <tr>
        <th style={styles.th}>Name</th>
        <th style={styles.th}>Grade</th>
        <th style={styles.th}>Location</th>
        <th style={styles.th}>Stock</th>
      </tr>
    </thead>
    <tbody>
      {paginatedMaterials.length === 0 ? (
        <tr>
          <td colSpan="4" style={{ textAlign: "center", padding: "14px" }}>
            No materials found
          </td>
        </tr>
      ) : (
        paginatedMaterials.map((m) => (
          <tr key={m.id}>
            <td style={styles.td}>{m.name}</td>
            <td style={styles.td}>Grade {gradeLabel(m.grade)}</td>
            <td style={styles.td}>{m.location}</td>
            <td style={styles.td}>{m.stock}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


      {/* ================= PAGINATION ================= */}
      <div style={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          ◀ Previous
        </button>

        <span>
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES (MATERIALS – FINAL POLISH) ================= */
const styles = {
  /* ---------- PRIMARY BUTTON ---------- */
  primaryBtn: {
    padding: "9px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "12px",
    fontWeight: "600",
    fontSize: "14px",
  },

  secondaryBtn: {
    padding: "9px 16px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    minWidth: "110px", // ⬅ same width as primary
  },

  /* ---------- FILTER BAR ---------- */
  filterBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "14px",
    flexWrap: "wrap",
  },

  filterInput: {
    padding: "7px 10px",
    borderRadius: "8px",
    border: "1px solid #cbd5f5",
    fontSize: "12.5px",
    background: "#fff",
  },

  /* ---------- TABLE WRAPPER ---------- */
  tableWrap: {
    background: "#ffffff",
    borderRadius: "5px", // ⬅ reduced radius
    overflowX: "auto",
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
  },

  /* ---------- TABLE ---------- */
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12.5px",
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
    //borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
    lineHeight: "1.4",
  },

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

/* ---------- MODAL CONTAINER ---------- */
modal: {
  background: "#ffffff",
  padding: "28px",
  borderRadius: "14px",
  width: "460px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
},

/* ---------- FORM FIELD (if used anywhere) ---------- */
field: {
  display: "flex",
  flexDirection: "column",
  fontSize: "13px",
  marginBottom: "16px",
},

/* ---------- INPUT (TEXT / NUMBER) ---------- */
input: {
  width: "100%",
  height: "38px",
  padding: "11px 12px",
  borderRadius: "8px",
  border: "1px solid #cbd5f5",
  fontSize: "13px",
  boxSizing: "border-box",
  marginBottom: "14px",   // ✅ spacing between rows
},

/* ---------- SELECT (DROPDOWNS) ---------- */
select: {
  width: "100%",
  height: "38px",
  padding: "11px 12px",
  borderRadius: "8px",
  border: "1px solid #cbd5f5",
  fontSize: "13px",
  boxSizing: "border-box",
  marginBottom: "14px",   // ✅ spacing between rows
  background: "#fff",
},

/* ---------- MODAL ACTIONS (FOOTER) ---------- */
modalActions: {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "20px",
  paddingTop: "14px",
  borderTop: "1px solid #e5e7eb",
},
};


export default Materials;
