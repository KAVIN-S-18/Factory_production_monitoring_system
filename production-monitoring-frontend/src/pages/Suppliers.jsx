import { useState } from "react";
import { useSuppliers } from "../context/SupplierContext";

const PAGE_SIZE = 5;
const gradeLabel = (g) => ["A", "B", "C"][g - 1] || g;

function Suppliers() {
  const {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addMaterialToSupplier,
    removeMaterialFromSupplier,
  } = useSuppliers();

  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState("ACTIVE");

  /* ================= ADD SUPPLIER MATERIAL STATES ================= */
  const [newMaterials, setNewMaterials] = useState([]);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialGrade, setNewMaterialGrade] = useState(1);
  /* =============================================================== */

  /* ---------- STATUS FILTER ---------- */
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ---------- PAGINATION ---------- */
  const [page, setPage] = useState(0);

  /* ---------- MATERIAL MODAL (EDIT SUPPLIER) ---------- */
  const [materialModal, setMaterialModal] = useState(false);
  const [materialName, setMaterialName] = useState("");
  const [materialGrade, setMaterialGrade] = useState(1);

  const openAddSupplier = () => {
    setEditingSupplier(null);
    setName("");
    setRating(5);
    setStatus("ACTIVE");

    setNewMaterials([]);
    setNewMaterialName("");
    setNewMaterialGrade(1);

    setShowForm(true);
  };

  const openEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setName(supplier.name);
    setRating(supplier.rating);
    setStatus(supplier.status);
    setShowForm(true);
  };

  /* ================= SAVE SUPPLIER ================= */
  const saveSupplier = () => {
    if (!name) {
      alert("Supplier name required");
      return;
    }

    const payload = {
      name,
      rating: Number(rating),
      status,
    };

    // ✅ INCLUDE MATERIALS ONLY WHEN CREATING SUPPLIER
    if (!editingSupplier) {
      payload.materials = Array.isArray(newMaterials)
        ? [...newMaterials]
        : [];
    }

    if (editingSupplier) {
      updateSupplier({ ...payload, id: editingSupplier.id });
    } else {
      addSupplier(payload);
    }

    setShowForm(false);
  };
  /* ================================================= */

  const openAddMaterial = (supplier) => {
    setEditingSupplier(supplier);
    setMaterialName("");
    setMaterialGrade(1);
    setMaterialModal(true);
  };

  const saveMaterialToSupplier = async () => {
    if (!materialName) {
      alert("Material name required");
      return;
    }

    await addMaterialToSupplier(
      editingSupplier.id,
      materialName,
      Number(materialGrade)
    );

    setMaterialModal(false);
  };

  /* ================= ADD MATERIAL TO NEW SUPPLIER ================= */
  const addMaterialToNewSupplier = () => {
    if (!newMaterialName) {
      alert("Material name required");
      return;
    }

    setNewMaterials((prev) => [
      ...prev,
      {
        materialName: newMaterialName,
        grade: Number(newMaterialGrade),
      },
    ]);

    setNewMaterialName("");
    setNewMaterialGrade(1);
  };

  const removeNewMaterial = (index) => {
    setNewMaterials(newMaterials.filter((_, i) => i !== index));
  };
  /* =============================================================== */

  /* ================= SAFE DATA ================= */
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];

  const filteredSuppliers =
    statusFilter === "ALL"
      ? safeSuppliers
      : safeSuppliers.filter((s) => s.status === statusFilter);

  const start = page * PAGE_SIZE;
  const pagedSuppliers = filteredSuppliers.slice(
    start,
    start + PAGE_SIZE
  );
  /* ================================================= */

  return (
    <div>
      <h2>Suppliers</h2>

      <button style={styles.primaryBtn} onClick={openAddSupplier}>
        + Add Supplier
      </button>

      {/* ================= SUPPLIER TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Materials</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pagedSuppliers.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.status}</td>
              <td>{s.rating} ⭐</td>
              <td>
                {Array.isArray(s.materials) &&
                  s.materials.map((m) => (
                    <span key={m.id} style={styles.tag}>
                      {m.materialName} (Grade {gradeLabel(m.grade)})
                    </span>
                  ))}
                <button
                  style={styles.addMiniBtn}
                  onClick={() => openAddMaterial(s)}
                >
                  + Add
                </button>
              </td>
              <td style={{ textAlign: "center" }}>
                <button
                  style={styles.editBtn}
                  onClick={() => openEditSupplier(s)}
                >
                  Edit
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteSupplier(s.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= ADD / EDIT SUPPLIER MODAL ================= */}
      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</h3>

            <label>Name</label>
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Rating</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />

            <label>Status</label>
            <select
              style={styles.input}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            {/* ===== ADD MATERIALS (CREATE) ===== */}
            {!editingSupplier && (
              <>
                <label>Add Materials</label>

                <input
                  style={styles.input}
                  placeholder="Material Name"
                  value={newMaterialName}
                  onChange={(e) => setNewMaterialName(e.target.value)}
                />

                <select
                  style={styles.input}
                  value={newMaterialGrade}
                  onChange={(e) => setNewMaterialGrade(e.target.value)}
                >
                  <option value={1}>Grade A</option>
                  <option value={2}>Grade B</option>
                  <option value={3}>Grade C</option>
                </select>

                <button
                  style={styles.addMiniBtn}
                  onClick={addMaterialToNewSupplier}
                >
                  + Add Material
                </button>

                <div style={styles.tagBox}>
                  {newMaterials.map((m, i) => (
                    <span key={i} style={styles.tag}>
                      {m.materialName} (Grade {gradeLabel(m.grade)})
                      <span
                        style={styles.remove}
                        onClick={() => removeNewMaterial(i)}
                      >
                        ✕
                      </span>
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* ===== EDIT MATERIALS ===== */}
            {editingSupplier && (
              <>
                <label>Materials</label>
                <div style={styles.tagBox}>
                  {editingSupplier.materials.map((m) => (
                    <span key={m.id} style={styles.tag}>
                      {m.materialName} (Grade {gradeLabel(m.grade)})
                      <span
                        style={styles.remove}
                        onClick={() =>
                          removeMaterialFromSupplier(
                            editingSupplier.id,
                            m.id
                          )
                        }
                      >
                        ✕
                      </span>
                    </span>
                  ))}
                </div>
              </>
            )}

            <div style={styles.modalActions}>
              <button
                style={styles.secondaryBtn}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                style={styles.primaryBtn}
                onClick={saveSupplier}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD MATERIAL MODAL ================= */}
      {materialModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Add Material</h3>

            <input
              style={styles.input}
              placeholder="Material Name"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
            />

            <select
              style={styles.input}
              value={materialGrade}
              onChange={(e) => setMaterialGrade(e.target.value)}
            >
              <option value={1}>Grade A</option>
              <option value={2}>Grade B</option>
              <option value={3}>Grade C</option>
            </select>

            <div style={styles.modalActions}>
              <button
                style={styles.secondaryBtn}
                onClick={() => setMaterialModal(false)}
              >
                Cancel
              </button>
              <button
                style={styles.primaryBtn}
                onClick={saveMaterialToSupplier}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "2px solid #334155",
    marginTop: "20px",
  },
  primaryBtn: {
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "12px",
  },
  secondaryBtn: {
    padding: "10px 16px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  editBtn: {
    marginRight: "6px",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #2563eb",
    background: "#eff6ff",
  },
  deleteBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #991b1b",
    background: "#fee2e2",
    color: "#991b1b",
  },
  addMiniBtn: {
    marginLeft: "6px",
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px dashed #2563eb",
    background: "#eff6ff",
    cursor: "pointer",
  },
  tagBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "10px",
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 8px",
    borderRadius: "6px",
    background: "#f1f5f9",
  },
  remove: {
    cursor: "pointer",
    color: "#991b1b",
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    width: "420px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #94a3b8",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
};

export default Suppliers;
