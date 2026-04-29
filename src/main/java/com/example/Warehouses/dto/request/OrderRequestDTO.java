package com.example.Warehouses.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {
    private Long customerId;
    private Long warehouseId;
    private List<OrderItemRequestDTO> items;
}
