package com.project.factory.service;

import com.project.factory.model.*;
import com.project.factory.repository.ProductionLogRepository;
import com.project.factory.model.Batch;
import com.project.factory.model.BatchStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductionLogService {

    private final ProductionLogRepository repository;

    public ProductionLogService(ProductionLogRepository repository) {
        this.repository = repository;
    }

    /* =====================================================
       CREATE PRODUCTION LOG FROM BATCH (ON COMPLETE / FAIL)
       ===================================================== */
    public void createFromBatch(Batch batch) {

        // Safety check (avoid duplicate logs)
        if (batch.getActualStartTime() == null) return;

        ProductionLog log = new ProductionLog();
        log.setBatch(batch);

        log.setProductName(batch.getProductName());
        log.setProducedQty(batch.getFinalProductQty());

        log.setMachine(batch.getMachine());
        log.setOperator(batch.getOperator());

        log.setStartTime(batch.getActualStartTime());
        log.setEndTime(batch.getActualEndTime());

        log.setShift(resolveShift(batch.getActualStartTime()));

        log.setStatus(
                batch.getStatus() == BatchStatus.COMPLETED
                        ? ProductionStatus.COMPLETED
                        : ProductionStatus.FAILED
        );

        repository.save(log);
    }

    /* =============================
       REPORTS
       ============================= */
    public List<ProductionLog> getCompletedLogs(
            LocalDate from,
            LocalDate to
    ) {
        if (from != null && to != null) {
            return repository.findByStatusAndStartTimeBetween(
                    ProductionStatus.COMPLETED,
                    from.atStartOfDay(),
                    to.atTime(23, 59, 59)
            );
        }
        return repository.findByStatus(ProductionStatus.COMPLETED);
    }

    /* =============================
       SHIFT RESOLUTION
       ============================= */
    private Shift resolveShift(LocalDateTime time) {
        int hour = time.getHour();
        if (hour >= 6 && hour < 14) return Shift.MORNING;
        if (hour >= 14 && hour < 22) return Shift.EVENING;
        return Shift.NIGHT;
    }
}
