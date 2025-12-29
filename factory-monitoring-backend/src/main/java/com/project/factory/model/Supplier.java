package com.project.factory.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String status; // ACTIVE / INACTIVE

    private Double rating;

    /* =====================================================
       UNIDIRECTIONAL RELATIONSHIP (OWNING SIDE)
       ===================================================== */
    @OneToMany(
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @JoinColumn(name = "supplier_id") // FK stored in supplier_materials
    private List<SupplierMaterial> materials = new ArrayList<>();

    /* ================= GETTERS ================= */

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getStatus() {
        return status;
    }

    public Double getRating() {
        return rating;
    }

    public List<SupplierMaterial> getMaterials() {
        return materials;
    }

    /* ================= SETTERS ================= */

    public void setName(String name) {
        this.name = name;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public void setMaterials(List<SupplierMaterial> materials) {
        this.materials.clear();
        if (materials != null) {
            this.materials.addAll(materials);
        }
    }
}
