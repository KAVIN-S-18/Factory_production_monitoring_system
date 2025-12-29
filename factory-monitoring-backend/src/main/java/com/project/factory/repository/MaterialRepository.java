package com.project.factory.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.factory.model.Material;

public interface MaterialRepository
        extends JpaRepository<Material, Long> {

    Optional<Material> findByNameIgnoreCaseAndGradeAndLocation(
            String name,
            Integer grade,
            String location
    );
}
