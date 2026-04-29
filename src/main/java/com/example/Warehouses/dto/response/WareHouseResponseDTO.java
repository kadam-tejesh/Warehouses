package com.example.Warehouses.dto.response;

import lombok.Data;

@Data
public class WareHouseResponseDTO {
    private String name;
    private String code;
    private Double longitude;
    private Double latitude;
    private Integer capacity;
    private String status;
    private Integer currentLoad;
}
