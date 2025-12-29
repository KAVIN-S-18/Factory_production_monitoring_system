package com.project.factory.model;

import jakarta.persistence.*;

@Entity
@Table(
    name = "supplier_materials",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"supplier_id", "material_name", "grade"}
        )
    }
)
public class SupplierMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "material_name", nullable = false)
    private String materialName;

    @Column(nullable = false)
    private Integer grade;

    /* ================= GETTERS ================= */

    public Long getId() {
        return id;
    }

    public String getMaterialName() {
        return materialName;
    }

    public Integer getGrade() {
        return grade;
    }

    /* ================= SETTERS ================= */

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    public void setGrade(Integer grade) {
        this.grade = grade;
    }
}
