package com.project.factory.controller;

import com.project.factory.model.Machine;
import com.project.factory.model.MachineStatus;
import com.project.factory.service.MachineService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/machines")
// @CrossOrigin(origins = "*")
public class MachineController {

    private final MachineService machineService;

    public MachineController(MachineService machineService) {
        this.machineService = machineService;
    }

    /* ================= GET ALL MACHINES ================= */

    @GetMapping
    public List<Machine> getAllMachines() {
        return machineService.getAllMachines();
    }

    /* ================= GET MACHINE BY ID ================= */

    @GetMapping("/{id}")
    public Machine getMachine(@PathVariable Long id) {
        return machineService.getMachine(id);
    }

    /* ================= CREATE MACHINE ================= */

    @PostMapping
    public Machine createMachine(@RequestBody Machine machine) {
        return machineService.createMachine(machine);
    }

    /* ================= UPDATE MACHINE DETAILS ================= */

    @PutMapping("/{id}")
    public Machine updateMachine(
            @PathVariable Long id,
            @RequestBody Machine updated
    ) {
        return machineService.updateMachine(id, updated);
    }

    /* ================= UPDATE MACHINE STATUS ================= */

    @PutMapping("/{id}/status/{status}")
    public Machine updateStatus(
            @PathVariable Long id,
            @PathVariable MachineStatus status
    ) {
        return machineService.updateStatus(id, status);
    }

    /* ================= DELETE MACHINE ================= */

    @DeleteMapping("/{id}")
    public void deleteMachine(@PathVariable Long id) {
        machineService.deleteMachine(id);
    }
}
