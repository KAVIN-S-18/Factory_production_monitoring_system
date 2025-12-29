package com.project.factory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ================= ALERT INFO ================= */

    @Column(nullable = false)
    private String type;          // MAINTENANCE, MACHINE_FAILURE

    @Column(nullable = false)
    private String severity;      // HIGH, MEDIUM, LOW

    /* ================= MACHINE INFO ================= */

    @Column(name = "machine_id", nullable = false)
    private Long machineId;       // ✅ REQUIRED (used for backend logic)

    @Column(nullable = false)
    private String machine;       // Machine name (for UI display)

    @Column(nullable = false)
    private String message;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime time;

    @Column(nullable = false)
    private boolean resolved = false;

    /* ================= LIFECYCLE ================= */

    @PrePersist
    public void onCreate() {
        this.time = LocalDateTime.now();
    }

    /* ================= GETTERS ================= */

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getSeverity() {
        return severity;
    }

    public Long getMachineId() {
        return machineId;
    }

    public String getMachine() {
        return machine;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public boolean isResolved() {
        return resolved;
    }

    /* ================= SETTERS ================= */

    public void setId(Long id) {
        this.id = id;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public void setMachineId(Long machineId) {
        this.machineId = machineId;
    }

    public void setMachine(String machine) {
        this.machine = machine;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setResolved(boolean resolved) {
        this.resolved = resolved;
    }
}
