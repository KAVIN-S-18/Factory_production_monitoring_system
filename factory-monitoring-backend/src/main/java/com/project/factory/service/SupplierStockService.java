package com.project.factory.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.factory.model.*;
import com.project.factory.repository.*;

@Service
public class SupplierStockService {

    private final SupplierRepository supplierRepo;
    private final MaterialRepository materialRepo;
    private final SupplierStockLogRepository logRepo;

    public SupplierStockService(
            SupplierRepository supplierRepo,
            MaterialRepository materialRepo,
            SupplierStockLogRepository logRepo
    ) {
        this.supplierRepo = supplierRepo;
        this.materialRepo = materialRepo;
        this.logRepo = logRepo;
    }

    /* =====================================================
       ADD STOCK VIA SUPPLIER (CORE LOGIC)
       ===================================================== */
    @Transactional
    public void addStock(
            Long supplierId,
            String materialName,
            Integer grade,
            String location,
            Integer quantity
    ) {

        // 1️⃣ Validate supplier
        Supplier supplier = supplierRepo.findById(supplierId)
            .orElseThrow(() -> new RuntimeException("Supplier not found"));

        // 2️⃣ Validate supplier capability
        boolean allowed = supplier.getMaterials().stream()
            .anyMatch(m ->
                m.getMaterialName().equalsIgnoreCase(materialName)
                && m.getGrade().equals(grade)
            );

        if (!allowed) {
            throw new RuntimeException(
                "Supplier not allowed to supply this material"
            );
        }

        // 3️⃣ Upsert material
        Material material = materialRepo
            .findByNameIgnoreCaseAndGradeAndLocation(
                materialName, grade, location
            )
            .map(existing -> {
                existing.setStock(existing.getStock() + quantity);
                return existing;
            })
            .orElseGet(() -> {
                Material m = new Material();
                m.setName(materialName);
                m.setGrade(grade);
                m.setLocation(location);
                m.setStock(quantity);
                return m;
            });

        materialRepo.save(material);

        // 4️⃣ Log supplier stock entry
        SupplierStockLog log = new SupplierStockLog();
        log.setSupplierId(supplier.getId());
        log.setSupplierName(supplier.getName());
        log.setMaterialName(materialName);
        log.setGrade(grade);
        log.setLocation(location);
        log.setQuantity(quantity);
        log.setCreatedAt(LocalDateTime.now());

        logRepo.save(log);
    }
}
