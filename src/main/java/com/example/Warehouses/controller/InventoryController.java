package com.example.Warehouses.controller;

import com.example.Warehouses.dto.request.InventoryRequestDTO;
import com.example.Warehouses.dto.response.InventoryResponseDTO;
import com.example.Warehouses.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {
    @Autowired
    private InventoryService inventoryService;

    @PostMapping(path="/add/inventory",consumes={"application/json"})
    public ResponseEntity<InventoryResponseDTO> addOrUpdateInventory(@RequestBody InventoryRequestDTO inventory){
        return inventoryService.addOrUpdateInventory(inventory);
    }

    @GetMapping(path="/get/inventory",produces={"application/json"})
    public ResponseEntity<List<InventoryResponseDTO>> getInventories(){
        return inventoryService.getInventories();
    }
    @GetMapping(path="/get/inventory/product{id}",produces ={"application/json"})
    public ResponseEntity<List<InventoryResponseDTO>> getByProductId(@PathVariable Long id){
        return inventoryService.getByProductId(id);
    }
    @GetMapping(path="/get/inventory/warehouse{id}",produces ={"application/json"})
    public ResponseEntity<List<InventoryResponseDTO>> getByWarehouseId(@PathVariable Long id){
        return inventoryService.getByWarehouseId(id);
    }
    @GetMapping(path="/get/inventory/p{pid}/w{wid}",produces = {"application/json"})
    public ResponseEntity<InventoryResponseDTO> getByProductAndWarehouse(@PathVariable Long pid,@PathVariable Long wid){
        return inventoryService.getByProductAndWarehouse(pid,wid);
    }
    @DeleteMapping(path="/delete/inventory/{id}",produces = {"application/json"})
    public ResponseEntity<InventoryResponseDTO> deleteInventory(@PathVariable Long id){
        return inventoryService.deleteInventory(id);
    }
}
