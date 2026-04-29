package com.example.Warehouses.service;

import com.example.Warehouses.dto.request.InventoryRequestDTO;
import com.example.Warehouses.dto.response.InventoryResponseDTO;
import com.example.Warehouses.entity.Inventory;
import com.example.Warehouses.entity.Product;
import com.example.Warehouses.entity.Warehouse;
import com.example.Warehouses.repository.InventoryRepository;
import com.example.Warehouses.repository.ProductRepository;
import com.example.Warehouses.repository.WareHouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class InventoryService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private WareHouseRepository wareHouseRepository;
    @Autowired
    private InventoryRepository inventoryRepository;
    public ResponseEntity<InventoryResponseDTO> addOrUpdateInventory(InventoryRequestDTO inventory){
        try {
            Product product = productRepository.findById(inventory.getProductId());
            Warehouse warehouse = wareHouseRepository.findById(inventory.getWarehouseId());
            Inventory inventory1 = inventoryRepository.findByProductAndWarehouse(product, warehouse);
            InventoryResponseDTO response = new InventoryResponseDTO();
            if (inventory1 == null) {
                inventory1 = new Inventory();
                inventory1.setProduct(product);
                inventory1.setWarehouse(warehouse);
                inventory1.setQuantity(inventory.getQuantity());
                inventory1.setReservedQuantity(0);
                inventory1.setLastUpdated(LocalDateTime.now());
                warehouse.setCurrentLoad(inventory.getQuantity());
            } else {
                inventory1.setQuantity(inventory1.getQuantity() + inventory.getQuantity());
                inventory1.setLastUpdated(LocalDateTime.now());
                warehouse.setCurrentLoad(inventory1.getQuantity() + inventory.getQuantity());
            }
            inventoryRepository.save(inventory1);
            wareHouseRepository.save(warehouse);

            response.setId(inventory1.getId());
            response.setProductId(product.getId());
            response.setProductName(product.getName());
            response.setWarehouseId(warehouse.getId());
            response.setWarehouseName(warehouse.getName());
            response.setQuantity(inventory1.getQuantity());
            response.setReversedQuantity(inventory1.getReservedQuantity());
            response.setLastUpdated(inventory1.getLastUpdated());
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new InventoryResponseDTO(),HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<List<InventoryResponseDTO>> getInventories(){
        try {
            List<Inventory> inventoryList = inventoryRepository.findAll();
            List<InventoryResponseDTO> list = new ArrayList<>();
            for (Inventory i : inventoryList) {
                InventoryResponseDTO response = new InventoryResponseDTO();
                Product product = productRepository.findById(i.getProduct().getId());
                Warehouse warehouse = wareHouseRepository.findById(i.getWarehouse().getId());
                response.setId(i.getId());
                response.setProductId(product.getId());
                response.setProductName(product.getName());
                response.setWarehouseId(warehouse.getId());
                response.setWarehouseName(warehouse.getName());
                response.setQuantity(i.getQuantity());
                response.setReversedQuantity(i.getReservedQuantity());
                response.setLastUpdated(i.getLastUpdated());
                list.add(response);
            }
            return new ResponseEntity<>(list,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<List<InventoryResponseDTO>> getByProductId(Long id){
        try {
            Product product = productRepository.findById(id);
            List<Inventory> inventoryList = inventoryRepository.findByProduct(product);
            if (inventoryList == null) {
                throw new RuntimeException("inventory not found");
            }
            List<InventoryResponseDTO> responseDTOS = new ArrayList<>();
            for (Inventory i : inventoryList) {
                InventoryResponseDTO response = new InventoryResponseDTO();
                Warehouse warehouse = wareHouseRepository.findById(i.getWarehouse().getId());
                response.setId(i.getId());
                response.setProductId(product.getId());
                response.setProductName(product.getName());
                response.setWarehouseId(warehouse.getId());
                response.setWarehouseName(warehouse.getName());
                response.setQuantity(i.getQuantity());
                response.setReversedQuantity(i.getReservedQuantity());
                response.setLastUpdated(i.getLastUpdated());
                responseDTOS.add(response);
            }
            return new ResponseEntity<>(responseDTOS,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<List<InventoryResponseDTO>> getByWarehouseId(Long id){
        try {
            Warehouse warehouse = wareHouseRepository.findById(id);
            List<Inventory> inventoryList = inventoryRepository.findByWarehouse(warehouse);
            if (inventoryList == null) {
                throw new RuntimeException("inventory not found");
            }
            List<InventoryResponseDTO> l = new ArrayList<>();
            for (Inventory i : inventoryList) {
                InventoryResponseDTO response = new InventoryResponseDTO();
                Product product = productRepository.findById(i.getProduct().getId());
                response.setId(i.getId());
                response.setProductId(product.getId());
                response.setProductName(product.getName());
                response.setWarehouseId(warehouse.getId());
                response.setWarehouseName(warehouse.getName());
                response.setQuantity(i.getQuantity());
                response.setReversedQuantity(i.getReservedQuantity());
                response.setLastUpdated(i.getLastUpdated());
                l.add(response);
            }
            return new ResponseEntity<>(l,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<InventoryResponseDTO> getByProductAndWarehouse(Long pid,Long wid){
        try {
            Inventory i = inventoryRepository.findByProductIdAndWarehouseId(pid, wid);
            InventoryResponseDTO response = new InventoryResponseDTO();
            response.setId(i.getId());
            response.setProductId(i.getProduct().getId());
            response.setProductName(i.getProduct().getName());
            response.setWarehouseId(i.getWarehouse().getId());
            response.setWarehouseName(i.getWarehouse().getName());
            response.setQuantity(i.getQuantity());
            response.setReversedQuantity(i.getReservedQuantity());
            response.setLastUpdated(i.getLastUpdated());
            return new ResponseEntity<>(response,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new InventoryResponseDTO(),HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<InventoryResponseDTO> deleteInventory(Long id){
        try {
            Inventory i = inventoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Inventory not found"));
            InventoryResponseDTO response = new InventoryResponseDTO();
            if (i != null) {

                response.setId(i.getId());
                response.setProductId(i.getProduct().getId());
                response.setProductName(i.getProduct().getName());
                response.setWarehouseId(i.getWarehouse().getId());
                response.setWarehouseName(i.getWarehouse().getName());
                response.setQuantity(i.getQuantity());
                response.setReversedQuantity(i.getReservedQuantity());
                response.setLastUpdated(i.getLastUpdated());
                inventoryRepository.deleteById(id);
            }
            return new ResponseEntity<>(response,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new InventoryResponseDTO(),HttpStatus.EXPECTATION_FAILED);
    }
}
