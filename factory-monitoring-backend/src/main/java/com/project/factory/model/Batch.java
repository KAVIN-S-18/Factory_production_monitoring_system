package com.project.factory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "batches")
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "final_product_qty", nullable = false)
    private Integer finalProductQty;

    /* ================= MACHINE ================= */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    /* ================= OPERATOR ================= */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_id", nullable = false)
    private User operator;

    /* ================= STATUS ================= */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BatchStatus status;

    /* ================= TIME ================= */
    @Column(name = "estimated_start_time")
    private LocalDateTime estimatedStartTime;

    @Column(name = "estimated_end_time")
    private LocalDateTime estimatedEndTime;

    @Column(name = "actual_start_time")
    private LocalDateTime actualStartTime;

    @Column(name = "actual_end_time")
    private LocalDateTime actualEndTime;

    /* ================= FAILURE ================= */
    @Column(name = "failure_reason")
    private String failureReason;

    /* ================= MATERIALS ================= */
    @OneToMany(
        mappedBy = "batch",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )	
    @JsonManagedReference
    private List<BatchMaterial> materials;

    /* ================= AUDIT ================= */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /* ================= GETTERS & SETTERS ================= */

    public Long getId() { return id; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Integer getFinalProductQty() { return finalProductQty; }
    public void setFinalProductQty(Integer finalProductQty) {
        this.finalProductQty = finalProductQty;
    }

    public Machine getMachine() { return machine; }
    public void setMachine(Machine machine) { this.machine = machine; }

    public User getOperator() { return operator; }
    public void setOperator(User operator) { this.operator = operator; }

    public BatchStatus getStatus() { return status; }
    public void setStatus(BatchStatus status) { this.status = status; }

    public LocalDateTime getEstimatedStartTime() { return estimatedStartTime; }
    public void setEstimatedStartTime(LocalDateTime t) { this.estimatedStartTime = t; }

    public LocalDateTime getEstimatedEndTime() { return estimatedEndTime; }
    public void setEstimatedEndTime(LocalDateTime t) { this.estimatedEndTime = t; }

    public LocalDateTime getActualStartTime() { return actualStartTime; }
    public void setActualStartTime(LocalDateTime t) { this.actualStartTime = t; }

    public LocalDateTime getActualEndTime() { return actualEndTime; }
    public void setActualEndTime(LocalDateTime t) { this.actualEndTime = t; }
    
    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }
    
    public List<BatchMaterial> getMaterials() {
        return materials;
    }

    public void setMaterials(List<BatchMaterial> materials) {
        this.materials = materials;
    }


}
