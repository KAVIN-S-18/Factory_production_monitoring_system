package com.project.factory.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.factory.model.Supplier;
import com.project.factory.model.SupplierMaterial;
import com.project.factory.service.SupplierService;

@RestController
@RequestMapping("/api/suppliers")
//@CrossOrigin(origins = "http://localhost:5173")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    @PostMapping
    public Supplier createSupplier(@RequestBody Supplier supplier) {
        return supplierService.createSupplier(supplier);
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(
            @PathVariable Long id,
            @RequestBody Supplier supplier
    ) {
        return supplierService.updateSupplier(id, supplier);
    }

    @PostMapping("/{id}/materials")
    public Supplier addMaterial(
            @PathVariable Long id,
            @RequestBody SupplierMaterial material
    ) {
        return supplierService.addMaterial(id, material);
    }

    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
    }
}
