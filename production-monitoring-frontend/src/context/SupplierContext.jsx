import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const SupplierContext = createContext();

export function SupplierProvider({ children }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOAD SUPPLIERS
     ===================================================== */
  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error("Failed to load suppliers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  /* =====================================================
     ADD SUPPLIER
     ===================================================== */
  const addSupplier = async (supplier) => {
    try {
      await api.post("/suppliers", supplier);
      await fetchSuppliers();
    } catch (err) {
      console.error("Failed to add supplier", err);
      alert("Failed to add supplier");
    }
  };

  /* =====================================================
     UPDATE SUPPLIER (BASIC FIELDS ONLY)
     ===================================================== */
  const updateSupplier = async (updatedSupplier) => {
    try {
      const payload = {
        name: updatedSupplier.name,
        rating: updatedSupplier.rating,
        status: updatedSupplier.status,
      };

      await api.put(
        `/suppliers/${updatedSupplier.id}`,
        payload
      );

      await fetchSuppliers();
    } catch (err) {
      console.error("Failed to update supplier", err);
      alert("Failed to update supplier");
    }
  };

  /* =====================================================
     ADD MATERIAL TO SUPPLIER
     ===================================================== */
  const addMaterialToSupplier = async (
    supplierId,
    materialName,
    grade
  ) => {
    try {
      await api.post(
        `/suppliers/${supplierId}/materials`,
        { materialName, grade }
      );
      await fetchSuppliers();
    } catch (err) {
      console.error("Failed to add material", err);
      alert("Failed to add material to supplier");
    }
  };

  const removeMaterialFromSupplier = async (
    supplierId,
    materialId
  ) => {
    try {
      await api.delete(
        `/suppliers/${supplierId}/materials/${materialId}`
      );
      await fetchSuppliers();
    } catch (err) {
      console.error("Failed to remove material", err);
      alert("Failed to remove material");
    }
  };

  /* =====================================================
     DELETE SUPPLIER
     ===================================================== */
  const deleteSupplier = async (id) => {
    try {
      await api.delete(`/suppliers/${id}`);
      await fetchSuppliers();
    } catch (err) {
      console.error("Failed to delete supplier", err);
      alert(
        "Cannot delete supplier with existing stock activity"
      );
    }
  };

  return (
    <SupplierContext.Provider
      value={{
        suppliers,
        loading,
        fetchSuppliers,
        addSupplier,
        updateSupplier,
        addMaterialToSupplier,
        removeMaterialFromSupplier,
        deleteSupplier,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
}

export const useSuppliers = () => useContext(SupplierContext);
