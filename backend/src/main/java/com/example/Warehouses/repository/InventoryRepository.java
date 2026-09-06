package com.example.Warehouses.repository;

import com.example.Warehouses.entity.Inventory;
import com.example.Warehouses.entity.Product;
import com.example.Warehouses.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory,Long>{
    Inventory findByProductAndWarehouse(Product product, Warehouse warehouse);
    List<Inventory> findByProduct(Product product);
    List<Inventory> findByWarehouse(Warehouse warehouse);
    Inventory findByProductIdAndWarehouseId(Long productId, Long warehouseId);
    Optional<Inventory> findById(Long id);
    void deleteById(Long id);
}
