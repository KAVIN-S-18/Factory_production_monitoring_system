package com.project.factory.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.factory.model.Supplier;
import com.project.factory.model.SupplierMaterial;
import com.project.factory.repository.SupplierRepository;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepo;

    public SupplierService(SupplierRepository supplierRepo) {
        this.supplierRepo = supplierRepo;
    }

    /* =====================================================
       FETCH SUPPLIERS
       ===================================================== */
    public List<Supplier> getAllSuppliers() {
        return supplierRepo.findAll();
    }

    /* =====================================================
       CREATE SUPPLIER (WITH MATERIALS)
       ===================================================== */
    @Transactional
    public Supplier createSupplier(Supplier supplier) {

        supplier.setStatus(
            supplier.getStatus() == null ? "ACTIVE" : supplier.getStatus()
        );

        return supplierRepo.save(supplier);
    }

    /* =====================================================
       UPDATE SUPPLIER (BASIC FIELDS ONLY)
       ===================================================== */
    @Transactional
    public Supplier updateSupplier(Long id, Supplier updated) {

        Supplier existing = supplierRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Supplier not found"));

        existing.setName(updated.getName());
        existing.setRating(updated.getRating());
        existing.setStatus(updated.getStatus());

        return supplierRepo.save(existing);
    }

    /* =====================================================
       ADD MATERIAL TO EXISTING SUPPLIER
       ===================================================== */
    @Transactional
    public Supplier addMaterial(Long supplierId, SupplierMaterial material) {

        Supplier supplier = supplierRepo.findById(supplierId)
            .orElseThrow(() -> new RuntimeException("Supplier not found"));

        supplier.getMaterials().add(material);

        return supplierRepo.save(supplier);
    }

    /* =====================================================
       DELETE SUPPLIER
       ===================================================== */
    public void deleteSupplier(Long id) {
        supplierRepo.deleteById(id);
    }
}
