package com.example.Warehouses.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="warehouses")
@Data
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique=true)
    private String code;
    private Double longitude;
    private Double latitude;
    private Integer capacity;
    private Integer currentLoad=0;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @OneToMany(mappedBy="warehouse")
    @JsonIgnore
    private List<Inventory> inventoryList;
    @OneToMany(mappedBy="sourceWarehouse")
    @JsonIgnore
    private List<Route> sourceRouteList;
    @OneToMany(mappedBy="destinationWarehouse")
    @JsonIgnore
    private List<Route> destinationRouteList;


}
