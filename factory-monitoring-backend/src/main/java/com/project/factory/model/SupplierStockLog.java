package com.project.factory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "supplier_stock_logs")
public class SupplierStockLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long supplierId;

    @Column(nullable = false)
    private String supplierName;

    @Column(nullable = false)
    private String materialName;

    @Column(nullable = false)
    private Integer grade;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    /* ===== GETTERS ===== */

    public Long getId() { return id; }

    public Long getSupplierId() { return supplierId; }

    public String getSupplierName() { return supplierName; }

    public String getMaterialName() { return materialName; }

    public Integer getGrade() { return grade; }

    public String getLocation() { return location; }

    public Integer getQuantity() { return quantity; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    /* ===== SETTERS ===== */

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    public void setGrade(Integer grade) {
        this.grade = grade;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
