package com.example.Warehouses.dto.request;

import lombok.Data;

@Data
public class WarehouseRequestDTO {
    private String name;
    private String code;
    private Double longitude;
    private Double latitude;
    private Integer capacity;
    private String status;
    private Integer currentLoad;
}
