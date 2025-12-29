import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const MaterialContext = createContext();

export function MaterialProvider({ children }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOAD MATERIALS FROM BACKEND
     ===================================================== */
  const fetchMaterials = async () => {
    try {
      const res = await api.get("/materials");
      setMaterials(res.data);
    } catch (err) {
      console.error("Failed to load materials", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  /* =====================================================
     ADD STOCK VIA SUPPLIER (BACKEND)
     replaces addMaterial + addSupplierLog
     ===================================================== */
  const addStockViaSupplier = async ({
    supplierId,
    materialName,
    grade,
    location,
    quantity,
  }) => {
    try {
      await api.post("/supplier-stock", {
        supplierId,
        materialName,
        grade,
        location,
        quantity,
      });

      // refresh materials after stock update
      await fetchMaterials();
    } catch (err) {
      console.error("Failed to add stock via supplier", err);
      alert("Failed to add stock");
    }
  };

  /* =====================================================
     DEDUCT MATERIAL (USED BY BatchContext)
     (still local for now – backend later)
     ===================================================== */
  const deductMaterial = (materialId, quantity) => {
    quantity = Number(quantity);

    const material = materials.find((m) => m.id === materialId);
    if (!material || material.stock < quantity) {
      return false;
    }

    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? { ...m, stock: m.stock - quantity }
          : m
      )
    );

    return true;
  };

  /* =====================================================
     RESTORE MATERIAL (LOCAL SAFETY)
     ===================================================== */
  const restoreMaterial = (materialId, quantity) => {
    quantity = Number(quantity);
    if (!quantity || quantity <= 0) return;

    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? { ...m, stock: m.stock + quantity }
          : m
      )
    );
  };

  /* =====================================================
     READ-ONLY UPDATE (ADMIN UI)
     ===================================================== */
  const updateMaterial = (updated) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
  };

  /* =====================================================
     DELETE MATERIAL (ADMIN ONLY – LOCAL)
     ===================================================== */
  const deleteMaterial = (id) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <MaterialContext.Provider
      value={{
        materials,
        loading,
        fetchMaterials,
        addStockViaSupplier, // ✅ NEW
        deductMaterial,
        restoreMaterial,
        updateMaterial,
        deleteMaterial,
      }}
    >
      {children}
    </MaterialContext.Provider>
  );
}

export const useMaterials = () => useContext(MaterialContext);
