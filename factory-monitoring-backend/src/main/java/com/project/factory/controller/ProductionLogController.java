package com.project.factory.controller;

import com.project.factory.model.ProductionLog;
import com.project.factory.service.ProductionLogService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/production-logs")
//@CrossOrigin
public class ProductionLogController {

    private final ProductionLogService service;

    public ProductionLogController(ProductionLogService service) {
        this.service = service;
    }

    /* =============================
       REPORTS API
       ============================= */
    @GetMapping("/reports")
    public List<ProductionLog> getReports(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to
    ) {
        return service.getCompletedLogs(from, to);
    }
}
