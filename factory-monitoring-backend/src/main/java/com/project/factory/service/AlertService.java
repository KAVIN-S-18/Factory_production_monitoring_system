package com.project.factory.service;

import com.project.factory.model.Alert;
import com.project.factory.model.Machine;
import com.project.factory.model.MachineStatus;
import com.project.factory.repository.AlertRepository;
import com.project.factory.repository.MachineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final MachineRepository machineRepository;

    public AlertService(
            AlertRepository alertRepository,
            MachineRepository machineRepository
    ) {
        this.alertRepository = alertRepository;
        this.machineRepository = machineRepository;
    }

    /* =====================================================
       ADD ALERT (UPDATED – USES machineId)
       ===================================================== */
    public void addAlert(
            String type,
            String severity,
            Long machineId,
            String machineName,
            String message
    ) {
        // Prevent duplicate maintenance alerts per machine
        if ("MAINTENANCE".equals(type)) {
            boolean exists =
                    alertRepository.existsByTypeAndMachineAndResolvedFalse(
                            type, machineName
                    );
            if (exists) return;
        }

        Alert alert = new Alert();
        alert.setType(type);
        alert.setSeverity(severity);
        alert.setMachineId(machineId);   // ✅ IMPORTANT
        alert.setMachine(machineName);
        alert.setMessage(message);

        alertRepository.save(alert);
    }

    /* =====================================================
       GET ACTIVE ALERTS (UNCHANGED)
       ===================================================== */
    @Transactional(readOnly = true)
    public List<Alert> getActiveAlerts() {
        return alertRepository.findByResolvedFalseOrderByTimeDesc();
    }

    /* =====================================================
       RESOLVE ALERT (FULLY WORKING)
       ===================================================== */
    @Transactional
    public void resolveAlert(Long alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        Machine machine = machineRepository.findById(alert.getMachineId())
                .orElseThrow(() -> new RuntimeException("Machine not found"));

        // 🟠 MAINTENANCE RESOLVE
        if ("MAINTENANCE".equals(alert.getType())) {
            LocalDate today = LocalDate.now();
            machine.setLastMaintenanceDate(today);
            machine.setNextMaintenanceDue(today.plusMonths(3));
        }

        // 🔴 MACHINE FAILURE RESOLVE (UNFAIL)
        if ("MACHINE_FAILURE".equals(alert.getType())) {
            machine.setStatus(MachineStatus.AVAILABLE);
        }

        machineRepository.save(machine);

        alert.setResolved(true);
        alertRepository.save(alert);
    }

    /* =====================================================
       CLEAR ALL ALERTS (UNCHANGED)
       ===================================================== */
    @Transactional
    public void clearAll() {
        alertRepository.deleteAll();
    }
}
