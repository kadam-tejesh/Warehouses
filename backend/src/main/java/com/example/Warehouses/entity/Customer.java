package com.example.Warehouses.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name="customers")
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    private String phoneNo;
    private String addressLine;
    private String city;
    private String state;
    private String pinCode;
    private Double latitude;
    private Double longitude;
    @OneToMany(mappedBy="customer")
    @JsonIgnore
    private List<Order> orderList;
}
