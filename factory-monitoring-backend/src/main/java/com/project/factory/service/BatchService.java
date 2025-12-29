package com.project.factory.service;

import com.project.factory.model.*;
import com.project.factory.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BatchService {

    private final BatchRepository batchRepository;
    private final MachineRepository machineRepository;
    private final MaterialRepository materialRepository;
    private final MachineService machineService;
    private final ProductionLogService productionLogService; // ✅ ADDED

    public BatchService(
            BatchRepository batchRepository,
            MachineRepository machineRepository,
            MaterialRepository materialRepository,
            MachineService machineService,
            ProductionLogService productionLogService // ✅ ADDED
    ) {
        this.batchRepository = batchRepository;
        this.machineRepository = machineRepository;
        this.materialRepository = materialRepository;
        this.machineService = machineService;
        this.productionLogService = productionLogService; // ✅ ADDED
    }

    /* =====================================================
       CREATE BATCH
       ===================================================== */

    @Transactional
    public Batch createBatch(Batch batch) {

        Machine machine = machineRepository.findById(
                batch.getMachine().getId()
        ).orElseThrow(() -> new RuntimeException("Machine not found"));

        if (machine.getStatus() != MachineStatus.AVAILABLE) {
            throw new RuntimeException("Machine not AVAILABLE");
        }

        List<Batch> active =
                batchRepository.findByMachineAndStatusIn(
                        machine,
                        List.of(BatchStatus.IN_PROGRESS, BatchStatus.PAUSED)
                );

        if (!active.isEmpty()) {
            throw new RuntimeException("Machine already has active batch");
        }

        if (batch.getMaterials() != null) {
            for (BatchMaterial bm : batch.getMaterials()) {

                Material material = materialRepository.findById(
                        bm.getMaterial().getId()
                ).orElseThrow(() -> new RuntimeException("Material not found"));

                if (material.getStock() < bm.getQuantity()) {
                    throw new RuntimeException(
                            "Insufficient stock for material: " + material.getName()
                    );
                }

                material.setStock(material.getStock() - bm.getQuantity());
                materialRepository.save(material);

                bm.setBatch(batch);
                bm.setMaterial(material);
            }
        }

        batch.setStatus(BatchStatus.SCHEDULED);
        return batchRepository.save(batch);
    }

    /* =====================================================
       UPDATE BATCH
       ===================================================== */

    @Transactional
    public Batch updateBatch(Long batchId, Batch updated) {

        Batch existing = getBatch(batchId);

        if (existing.getStatus() != BatchStatus.SCHEDULED) {
            throw new RuntimeException("Only SCHEDULED batches can be edited");
        }

        existing.setProductName(updated.getProductName());
        existing.setFinalProductQty(updated.getFinalProductQty());
        existing.setEstimatedStartTime(updated.getEstimatedStartTime());
        existing.setEstimatedEndTime(updated.getEstimatedEndTime());

        if (existing.getMaterials() != null) {
            for (BatchMaterial oldBm : existing.getMaterials()) {
                Material material = oldBm.getMaterial();
                material.setStock(material.getStock() + oldBm.getQuantity());
                materialRepository.save(material);
            }
        }

        existing.getMaterials().clear();

        if (updated.getMaterials() != null) {
            for (BatchMaterial newBm : updated.getMaterials()) {

                Material material = materialRepository.findById(
                        newBm.getMaterial().getId()
                ).orElseThrow(() -> new RuntimeException("Material not found"));

                if (material.getStock() < newBm.getQuantity()) {
                    throw new RuntimeException(
                            "Insufficient stock for material: " + material.getName()
                    );
                }

                material.setStock(material.getStock() - newBm.getQuantity());
                materialRepository.save(material);

                BatchMaterial bm = new BatchMaterial();
                bm.setBatch(existing);
                bm.setMaterial(material);
                bm.setQuantity(newBm.getQuantity());

                existing.getMaterials().add(bm);
            }
        }

        return batchRepository.save(existing);
    }

    /* =====================================================
       START / RESUME
       ===================================================== */

    @Transactional
    public void startBatch(Long batchId) {
        Batch batch = getBatch(batchId);

        if (batch.getStatus() != BatchStatus.SCHEDULED &&
            batch.getStatus() != BatchStatus.PAUSED) {
            throw new RuntimeException("Batch cannot be started");
        }

        if (batch.getActualStartTime() == null) {
            batch.setActualStartTime(LocalDateTime.now());
        }

        batch.setStatus(BatchStatus.IN_PROGRESS);
        batchRepository.save(batch);

        machineService.markRunning(batch.getMachine().getId());
    }

    /* =====================================================
       PAUSE
       ===================================================== */

    @Transactional
    public void pauseBatch(Long batchId) {
        Batch batch = getBatch(batchId);

        if (batch.getStatus() != BatchStatus.IN_PROGRESS) {
            throw new RuntimeException("Batch not running");
        }

        batch.setStatus(BatchStatus.PAUSED);
        batchRepository.save(batch);

        machineService.markPaused(batch.getMachine().getId());
    }

    /* =====================================================
       COMPLETE (✅ PRODUCTION LOG CREATED HERE)
       ===================================================== */

    @Transactional
    public void completeBatch(Long batchId) {
        Batch batch = getBatch(batchId);

        if (batch.getStatus() != BatchStatus.IN_PROGRESS) {
            throw new RuntimeException("Batch not running");
        }

        batch.setStatus(BatchStatus.COMPLETED);
        batch.setActualEndTime(LocalDateTime.now());

        // ✅ CREATE PRODUCTION LOG
        productionLogService.createFromBatch(batch);

        batchRepository.save(batch);
        machineService.markAvailable(batch.getMachine().getId());
    }

    /* =====================================================
       FAIL (RESTORE MATERIAL + PRODUCTION LOG)
       ===================================================== */

    @Transactional
    public void failBatch(Long batchId, String reason) {
        Batch batch = getBatch(batchId);

        if (batch.getStatus() != BatchStatus.IN_PROGRESS &&
            batch.getStatus() != BatchStatus.PAUSED) {
            throw new RuntimeException("Batch cannot fail");
        }

        if (batch.getMaterials() != null) {
            for (BatchMaterial bm : batch.getMaterials()) {
                Material material = bm.getMaterial();
                material.setStock(material.getStock() + bm.getQuantity());
                materialRepository.save(material);
            }
        }

        batch.setStatus(BatchStatus.FAILED);
        batch.setFailureReason(reason);
        batch.setActualEndTime(LocalDateTime.now());

        // ✅ CREATE PRODUCTION LOG
        productionLogService.createFromBatch(batch);

        batchRepository.save(batch);
        machineService.markError(batch.getMachine().getId());
    }

    /* =====================================================
       HELPERS
       ===================================================== */

    public Batch getBatch(Long id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
    }

    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }
}
