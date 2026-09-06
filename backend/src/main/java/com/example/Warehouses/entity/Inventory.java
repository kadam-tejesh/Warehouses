package com.example.Warehouses.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name="inventory")
@Data
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="product_id")
    private Product product;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="warehouse_id")
    private Warehouse warehouse;
    private Integer quantity;
    private Integer reservedQuantity=0;
    @Version
    private Integer version;
    private LocalDateTime lastUpdated;


}
