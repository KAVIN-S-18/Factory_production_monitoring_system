package com.project.factory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.factory.model.SupplierMaterial;

public interface SupplierMaterialRepository
        extends JpaRepository<SupplierMaterial, Long> {
}
