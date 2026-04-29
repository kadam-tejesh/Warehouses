package com.example.Warehouses.dto.request;

import lombok.Data;

@Data
public class RouteRequestDTO {
    private Long sourceWarehouseId;
    private Long destinationWarehouseId;
    private Double distance;
    private Integer averageTime;
}
