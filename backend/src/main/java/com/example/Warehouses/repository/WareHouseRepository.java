package com.example.Warehouses.repository;

import com.example.Warehouses.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface WareHouseRepository extends JpaRepository<Warehouse,Integer> {
    Warehouse findByCode(String code);
    Warehouse findById(Long id);
    void deleteById(Long id);
}
