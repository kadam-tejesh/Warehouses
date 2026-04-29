package com.example.Warehouses.controller;


import com.example.Warehouses.dto.request.WarehouseRequestDTO;
import com.example.Warehouses.dto.response.WareHouseResponseDTO;
import com.example.Warehouses.service.WareHouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/warehouses")
public class WareHouseController {
    @Autowired
    private WareHouseService wareHouseService;
    @PostMapping(path="/create/warehouse",consumes={"application/json"})
    public ResponseEntity<WareHouseResponseDTO> createWarehouse(@RequestBody WarehouseRequestDTO warehouse){
        return wareHouseService.createWarehouse(warehouse);
    }
   @GetMapping(path="/get/warehouses",produces = {"application/json"})
    public ResponseEntity<List<WareHouseResponseDTO>> getWarehouses(){
        return wareHouseService.getWarehouses();
   }
   @GetMapping(path="/{id}",consumes={"application/json"})
    public ResponseEntity<WareHouseResponseDTO> getWarehouseById(@PathVariable Long id){
        return wareHouseService.getWarehouseById(id);
   }
   @DeleteMapping(path="/delete/{id}")
   public ResponseEntity<String> deleteWarehouse(@PathVariable Long id){
        return wareHouseService.deleteWarehouse(id);
   }

}
