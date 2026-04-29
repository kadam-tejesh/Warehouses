package com.example.Warehouses.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String sku;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal weight;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @OneToMany(mappedBy="product")
    @JsonIgnore
    private List<Inventory> inventoryList;

    @OneToMany(mappedBy="product")
    @JsonIgnore
    private List<OrderItems> orderItemsList;

}
