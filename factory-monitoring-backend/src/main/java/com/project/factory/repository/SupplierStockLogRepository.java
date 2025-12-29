package com.project.factory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.factory.model.SupplierStockLog;

public interface SupplierStockLogRepository
        extends JpaRepository<SupplierStockLog, Long> {

    boolean existsBySupplierId(Long supplierId);
}
