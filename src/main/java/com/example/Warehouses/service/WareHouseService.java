package com.example.Warehouses.service;

import com.example.Warehouses.dto.request.WarehouseRequestDTO;
import com.example.Warehouses.dto.response.WareHouseResponseDTO;
import com.example.Warehouses.entity.Warehouse;
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
public class WareHouseService {

    @Autowired
    private WareHouseRepository wareHouseRepository;
    public ResponseEntity<WareHouseResponseDTO> createWarehouse(WarehouseRequestDTO h){
        try {
            Warehouse w = wareHouseRepository.findByCode(h.getCode());
            WareHouseResponseDTO responseDTO = new WareHouseResponseDTO();
            if (w == null) {
                w = new Warehouse();
                w.setName(h.getName());
                w.setCode(h.getCode());
                w.setLongitude(h.getLongitude());
                w.setLatitude(h.getLatitude());
                w.setCapacity(h.getCapacity());
                w.setStatus(h.getStatus());
                w.setCurrentLoad(h.getCurrentLoad());
                w.setCreatedAt(LocalDateTime.now());
                w.setUpdatedAt(LocalDateTime.now());
                wareHouseRepository.save(w);

                responseDTO.setName(h.getName());
                responseDTO.setCode(h.getCode());
                responseDTO.setLongitude(h.getLongitude());
                responseDTO.setLatitude(h.getLatitude());
                responseDTO.setCapacity(h.getCapacity());
                responseDTO.setStatus(h.getStatus());
                responseDTO.setCurrentLoad(h.getCurrentLoad());

            } else {
                w.setName(h.getName());
                w.setCode(h.getCode());
                w.setLongitude(h.getLongitude());
                w.setLatitude(h.getLatitude());
                w.setCapacity(h.getCapacity());
                w.setStatus(h.getStatus());
                w.setCurrentLoad(h.getCurrentLoad());
                w.setUpdatedAt(LocalDateTime.now());
                wareHouseRepository.save(w);
                responseDTO.setName(h.getName());
                responseDTO.setCode(h.getCode());
                responseDTO.setLongitude(h.getLongitude());
                responseDTO.setLatitude(h.getLatitude());
                responseDTO.setCapacity(h.getCapacity());
                responseDTO.setStatus(h.getStatus());
                responseDTO.setCurrentLoad(h.getCurrentLoad());

            }
            return new ResponseEntity<>(responseDTO,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new WareHouseResponseDTO(),HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<List<WareHouseResponseDTO>> getWarehouses(){
        try {
            List<Warehouse> warehouseList = wareHouseRepository.findAll();
            List<WareHouseResponseDTO> l = new ArrayList<>();
            for (Warehouse w : warehouseList) {
                WareHouseResponseDTO responseDTO = new WareHouseResponseDTO();
                responseDTO.setCode(w.getCode());
                responseDTO.setName(w.getName());
                responseDTO.setCapacity(w.getCapacity());
                responseDTO.setLongitude(w.getLongitude());
                responseDTO.setLatitude(w.getLatitude());
                responseDTO.setStatus(w.getStatus());
                responseDTO.setCurrentLoad(w.getCurrentLoad());
                l.add(responseDTO);
            }
            return new ResponseEntity<>(l, HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<WareHouseResponseDTO> getWarehouseById(Long id){
        try {
            Warehouse w = wareHouseRepository.findById(id);
            WareHouseResponseDTO responseDTO = new WareHouseResponseDTO();
            responseDTO.setCode(w.getCode());
            responseDTO.setName(w.getName());
            responseDTO.setCapacity(w.getCapacity());
            responseDTO.setLongitude(w.getLongitude());
            responseDTO.setLatitude(w.getLatitude());
            responseDTO.setStatus(w.getStatus());
            responseDTO.setCurrentLoad(w.getCurrentLoad());
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new WareHouseResponseDTO(),HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<String> deleteWarehouse(Long id){
        try{
            wareHouseRepository.deleteById(id);
            return new ResponseEntity<>("Success",HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>("Failure",HttpStatus.EXPECTATION_FAILED);
    }
}
