package com.project.factory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.factory.model.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
