package com.project.factory.controller;

import com.project.factory.model.Alert;
import com.project.factory.service.AlertService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    /* ================= GET ALL ACTIVE ALERTS ================= */

    @GetMapping
    public List<Alert> getAlerts() {
        return alertService.getActiveAlerts();
    }

    /* ================= RESOLVE ALERT ================= */

    @PutMapping("/{id}/resolve")
    public void resolve(@PathVariable Long id) {
        alertService.resolveAlert(id);
    }

    /* ================= CLEAR ALL ALERTS ================= */

    @DeleteMapping
    public void clearAll() {
        alertService.clearAll();
    }
}
