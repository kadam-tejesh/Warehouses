package com.example.Warehouses.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequestDTO {
    // creating or updating the product
    private String sku;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal weight;
    private boolean active;
}
