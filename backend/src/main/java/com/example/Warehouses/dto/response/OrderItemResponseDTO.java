package com.example.Warehouses.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponseDTO {
    private Long productId;
    private String productName;

    private Long quantity;
    private BigDecimal unitPrice;
    private BigDecimal subTotal;
    private Long warehouseId;
    private String warehouseName;
}
