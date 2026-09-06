package com.example.Warehouses.controller;

import com.example.Warehouses.dto.request.CustomerRequestDTO;
import com.example.Warehouses.dto.response.CustomerResponseDTO;
import com.example.Warehouses.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
@RestController
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @GetMapping(path="/get/all",produces = {"application/json"})
    public ResponseEntity<List<CustomerResponseDTO>> getCustomers(){
        return customerService.getCustomers();
    }

    @PostMapping(path="/add",consumes={"application/json"})
    public ResponseEntity<CustomerResponseDTO> addCustomers(@RequestBody CustomerRequestDTO customer){
        return customerService.addCustomer(customer);
    }

    @GetMapping(path="/{id}",produces={"application/json"})
    public ResponseEntity<CustomerResponseDTO> getCustomerById(@PathVariable Long id){
        return customerService.getCustomerById(id);
    }
    @PutMapping(path="/update/{id}",produces={"application/json"})
    public ResponseEntity<CustomerResponseDTO> updateCustomerById(@PathVariable Long id, @RequestBody CustomerRequestDTO customer){
        return customerService.updateCustomerById(id,customer);
    }
    @DeleteMapping(path="/delete/{id}",produces = {"application/json"})
    public ResponseEntity<String> deleteCustomerById(@PathVariable Long id){
        return customerService.deleteCustomerById(id);
    }
}
