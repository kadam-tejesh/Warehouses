package com.example.Warehouses.dto.request;

import lombok.Data;

@Data
public class InventoryRequestDTO{
    private Long productId;
    private Long warehouseId;
    private Integer quantity;
}
