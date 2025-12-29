package com.project.factory.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.factory.model.Material;
import com.project.factory.repository.MaterialRepository;

@Service
public class MaterialService {

    private final MaterialRepository materialRepo;

    public MaterialService(MaterialRepository materialRepo) {
        this.materialRepo = materialRepo;
    }

    /* =====================================================
       FETCH ALL MATERIALS
       ===================================================== */
    public List<Material> getAllMaterials() {
        return materialRepo.findAll();
    }

    /* =====================================================
       ADD OR UPDATE MATERIAL (STOCK INCREMENT)
       ===================================================== */
    @Transactional
    public Material addOrUpdateMaterial(Material input) {

        return materialRepo
            .findByNameIgnoreCaseAndGradeAndLocation(
                input.getName(),
                input.getGrade(),
                input.getLocation()
            )
            .map(existing -> {
                existing.setStock(
                    existing.getStock() + input.getStock()
                );
                return materialRepo.save(existing);
            })
            .orElseGet(() -> {
                input.setStock(input.getStock());
                return materialRepo.save(input);
            });
    }
}
