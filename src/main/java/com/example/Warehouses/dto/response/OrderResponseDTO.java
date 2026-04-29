package com.example.Warehouses.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDTO {
    private Long orderId;
    private String orderNo;

    private Long customerId;
    private String customerName;



    private BigDecimal totalAmount;
    private String status;

    private LocalDateTime createdAt;

    private List<OrderItemResponseDTO> items;
}
