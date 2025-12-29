package com.project.factory.controller;

import com.project.factory.model.Batch;
import com.project.factory.service.BatchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
@CrossOrigin(origins = "*")
public class BatchController {

    private final BatchService batchService;

    public BatchController(BatchService batchService) {
        this.batchService = batchService;
    }

    /* ================= GET ALL BATCHES ================= */

    @GetMapping
    public List<Batch> getAllBatches() {
        return batchService.getAllBatches();
    }

    /* ================= GET BATCH BY ID ================= */

    @GetMapping("/{id}")
    public Batch getBatch(@PathVariable Long id) {
        return batchService.getBatch(id);
    }

    /* ================= CREATE BATCH ================= */

    @PostMapping
    public Batch createBatch(@RequestBody Batch batch) {
        return batchService.createBatch(batch);
    }

    /* ================= START / RESUME ================= */

    @PutMapping("/{id}/start")
    public void startBatch(@PathVariable Long id) {
        batchService.startBatch(id);
    }

    /* ================= PAUSE ================= */

    @PutMapping("/{id}/pause")
    public void pauseBatch(@PathVariable Long id) {
        batchService.pauseBatch(id);
    }

    /* ================= COMPLETE ================= */

    @PutMapping("/{id}/complete")
    public void completeBatch(@PathVariable Long id) {
        batchService.completeBatch(id);
    }

    /* ================= FAIL ================= */

    @PutMapping("/{id}/fail")
    public void failBatch(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {
        batchService.failBatch(id, reason);
    }
    
    @PutMapping("/{id}")
    public Batch updateBatch(@PathVariable Long id, @RequestBody Batch batch) {
        return batchService.updateBatch(id, batch);
    }


}
