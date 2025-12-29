package com.project.factory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "production_logs")
public class ProductionLog {

    /* ================= PRIMARY KEY ================= */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ================= BATCH ================= */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    /* ================= SNAPSHOT DATA ================= */
    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "produced_qty", nullable = false)
    private Integer producedQty;

    /* ================= MACHINE ================= */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    /* ================= OPERATOR ================= */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_id", nullable = false)
    private User operator;

    /* ================= TIMING ================= */
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    /* ================= STATUS ================= */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Shift shift;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductionStatus status;

    /* ================= AUDIT ================= */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /* ================= LIFECYCLE ================= */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /* ================= GETTERS ================= */

    public Long getId() {
        return id;
    }

    public Batch getBatch() {
        return batch;
    }

    public String getProductName() {
        return productName;
    }

    public Integer getProducedQty() {
        return producedQty;
    }

    public Machine getMachine() {
        return machine;
    }

    public User getOperator() {
        return operator;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public Shift getShift() {
        return shift;
    }

    public ProductionStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    /* ================= SETTERS ================= */

    public void setId(Long id) {
        this.id = id;
    }

    public void setBatch(Batch batch) {
        this.batch = batch;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setProducedQty(Integer producedQty) {
        this.producedQty = producedQty;
    }

    public void setMachine(Machine machine) {
        this.machine = machine;
    }

    public void setOperator(User operator) {
        this.operator = operator;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }

    public void setStatus(ProductionStatus status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
