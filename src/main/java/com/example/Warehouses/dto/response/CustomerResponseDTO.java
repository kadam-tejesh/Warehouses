package com.example.Warehouses.dto.response;

import lombok.Data;

@Data
public class CustomerResponseDTO {
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
