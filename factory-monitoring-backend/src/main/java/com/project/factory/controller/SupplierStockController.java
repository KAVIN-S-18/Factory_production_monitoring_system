package com.project.factory.controller;

import org.springframework.web.bind.annotation.*;

import com.project.factory.service.SupplierStockService;

@RestController
@RequestMapping("/api/supplier-stock")
//@CrossOrigin(origins = "http://localhost:5173")
public class SupplierStockController {

    private final SupplierStockService stockService;

    public SupplierStockController(SupplierStockService stockService) {
        this.stockService = stockService;
    }

    /* =====================================================
       ADD STOCK VIA SUPPLIER (Materials.jsx modal)
       ===================================================== */
    @PostMapping
    public void addStock(@RequestBody StockRequest req) {

        stockService.addStock(
            req.getSupplierId(),
            req.getMaterialName(),
            req.getGrade(),
            req.getLocation(),
            req.getQuantity()
        );
    }

    /* ===== DTO ===== */
    static class StockRequest {
        private Long supplierId;
        private String materialName;
        private Integer grade;
        private String location;
        private Integer quantity;

        public Long getSupplierId() { return supplierId; }
        public String getMaterialName() { return materialName; }
        public Integer getGrade() { return grade; }
        public String getLocation() { return location; }
        public Integer getQuantity() { return quantity; }
    }
}
