package com.example.Warehouses.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="routes")
@Data
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="source_warehouse_id")
    private Warehouse sourceWarehouse;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="destination_ware_id")
    private Warehouse destinationWarehouse;
    private Double distance;
    private Integer averageTime;

}

