package com.project.factory.service;

import com.project.factory.model.Machine;
import com.project.factory.model.MachineStatus;
import com.project.factory.repository.MachineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class MachineService {

    private final MachineRepository machineRepository;
    private final AlertService alertService;

    /* ================= CONSTRUCTOR ================= */

    public MachineService(
            MachineRepository machineRepository,
            AlertService alertService
    ) {
        this.machineRepository = machineRepository;
        this.alertService = alertService;
    }

    /* ================= GET ALL MACHINES ================= */

    @Transactional(readOnly = true)
    public List<Machine> getAllMachines() {
        return machineRepository.findAll();
    }

    /* ================= GET MACHINE ================= */

    @Transactional(readOnly = true)
    public Machine getMachine(Long id) {
        return machineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Machine not found"));
    }

    /* ================= CREATE MACHINE ================= */

    @Transactional
    public Machine createMachine(Machine machine) {
        machine.setStatus(MachineStatus.AVAILABLE);

        // Auto-calculate next maintenance if missing
        if (machine.getLastMaintenanceDate() != null) {
            machine.setNextMaintenanceDue(
                    machine.getLastMaintenanceDate().plusMonths(3)
            );
        }

        Machine saved = machineRepository.save(machine);

        // 🔔 MAINTENANCE ALERT CHECK ON CREATE
        checkMaintenanceAlert(saved);

        return saved;
    }

    /* ================= UPDATE MACHINE DETAILS ================= */

    @Transactional
    public Machine updateMachine(Long id, Machine updated) {
        Machine existing = getMachine(id);

        existing.setName(updated.getName());
        existing.setManufactureDate(updated.getManufactureDate());
        existing.setLastMaintenanceDate(updated.getLastMaintenanceDate());

        if (updated.getLastMaintenanceDate() != null) {
            existing.setNextMaintenanceDue(
                    updated.getLastMaintenanceDate().plusMonths(3)
            );
        }

        Machine saved = machineRepository.save(existing);

        // 🔔 MAINTENANCE ALERT CHECK ON UPDATE
        checkMaintenanceAlert(saved);

        return saved;
    }

    /* ================= UPDATE STATUS ================= */

    @Transactional
    public Machine updateStatus(Long machineId, MachineStatus status) {
        Machine machine = getMachine(machineId);
        machine.setStatus(status);

        Machine saved = machineRepository.save(machine);

        // 🔔 MACHINE FAILURE ALERT
        if (status == MachineStatus.ERROR) {
            alertService.addAlert(
                    "MACHINE_FAILURE",
                    "HIGH",
                    machine.getId(),      // ✅ FIX: pass machineId
                    machine.getName(),
                    "Machine failed"
            );
        }

        return saved;
    }

    /* ================= DELETE MACHINE ================= */

    @Transactional
    public void deleteMachine(Long id) {
        machineRepository.deleteById(id);
    }

    /* ================= STATUS SHORTCUTS ================= */

    @Transactional
    public void markAvailable(Long machineId) {
        updateStatus(machineId, MachineStatus.AVAILABLE);
    }

    @Transactional
    public void markRunning(Long machineId) {
        updateStatus(machineId, MachineStatus.RUNNING);
    }

    @Transactional
    public void markPaused(Long machineId) {
        updateStatus(machineId, MachineStatus.PAUSED);
    }

    @Transactional
    public void markError(Long machineId) {
        updateStatus(machineId, MachineStatus.ERROR);
    }

    /* ================= PRIVATE HELPERS ================= */

    private void checkMaintenanceAlert(Machine machine) {
        if (
            machine.getNextMaintenanceDue() != null &&
            !machine.getNextMaintenanceDue().isAfter(LocalDate.now())
        ) {
            alertService.addAlert(
                    "MAINTENANCE",
                    "MEDIUM",
                    machine.getId(),      // ✅ FIX: pass machineId
                    machine.getName(),
                    "Maintenance due"
            );
        }
    }
}
