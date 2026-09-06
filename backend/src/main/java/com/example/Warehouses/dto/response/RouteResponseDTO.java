package com.example.Warehouses.dto.response;

import lombok.Data;

@Data
public class RouteResponseDTO {

    private Long id;

    private Long sourceWarehouseId;
    private String sourceWarehouseName;

    private Long destinationWarehouseId;
    private String destinationWarehouseName;

    private Double distance;
    private Integer averageTime;
}
