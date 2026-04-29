package com.example.Warehouses.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InventoryResponseDTO {
    private Long id;

    private Long productId;
    private String productName;

    private Long warehouseId;
    private String warehouseName;

    private Integer quantity;
    private Integer reversedQuantity;
    private LocalDateTime lastUpdated;
}
