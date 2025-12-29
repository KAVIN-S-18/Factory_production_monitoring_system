package com.project.factory.model;

import jakarta.persistence.*;

@Entity
@Table(
    name = "materials",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "grade", "location"})
    }
)
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer grade;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Integer stock;

    /* ================= GETTERS ================= */

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getGrade() {
        return grade;
    }

    public String getLocation() {
        return location;
    }

    public Integer getStock() {
        return stock;
    }

    /* ================= SETTERS ================= */

    public void setName(String name) {
        this.name = name;
    }

    public void setGrade(Integer grade) {
        this.grade = grade;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
