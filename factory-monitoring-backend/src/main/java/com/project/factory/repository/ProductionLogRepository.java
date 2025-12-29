package com.project.factory.repository;

import com.project.factory.model.ProductionLog;
import com.project.factory.model.ProductionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ProductionLogRepository
        extends JpaRepository<ProductionLog, Long> {

    List<ProductionLog> findByStatus(ProductionStatus status);

    List<ProductionLog> findByStatusAndStartTimeBetween(
            ProductionStatus status,
            LocalDateTime from,
            LocalDateTime to
    );
}
