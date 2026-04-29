package com.example.Warehouses.dto.request;

import lombok.Data;

@Data
public class OrderItemRequestDTO {
    private Long productId;
    private Long quantity;
}
