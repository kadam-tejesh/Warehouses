package com.example.Warehouses.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name="order_items")
@Data
public class OrderItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="order_id")
    private Order order;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="product_id")
    private Product product;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="warehouse_id")
    private Warehouse warehouse;
    private Long quantity;
    private BigDecimal unitPrice;
    private BigDecimal subTotal;

}
