package com.project.factory.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.factory.model.Material;
import com.project.factory.service.MaterialService;

@RestController
@RequestMapping("/api/materials")
//@CrossOrigin(origins = "http://localhost:5173")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    /* =====================================================
       GET ALL MATERIALS (Materials.jsx)
       ===================================================== */
    @GetMapping
    public List<Material> getAllMaterials() {
        return materialService.getAllMaterials();
    }

    /* =====================================================
       ADD / UPDATE MATERIAL STOCK
       ===================================================== */
    @PostMapping
    public Material addMaterial(@RequestBody Material material) {
        return materialService.addOrUpdateMaterial(material);
    }
}
