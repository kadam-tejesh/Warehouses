package com.example.Warehouses.dto.request;

import lombok.Data;

@Data
public class CustomerRequestDTO {
    private String name;
    private String email;
    private String phoneNo;
    private String addressLine;
    private String city;
    private String state;
    private String pinCode;
    private Double latitude;
    private Double longitude;
}
