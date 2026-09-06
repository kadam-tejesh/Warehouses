package com.example.Warehouses.repository;

import com.example.Warehouses.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Integer> {
    Product findBySku(String sku);
    Product findById(Long id);
    Product deleteById(Long id);
}
