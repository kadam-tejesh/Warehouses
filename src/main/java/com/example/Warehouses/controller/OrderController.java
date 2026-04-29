package com.example.Warehouses.controller;

import com.example.Warehouses.dto.request.OrderRequestDTO;
import com.example.Warehouses.dto.response.OrderResponseDTO;
import com.example.Warehouses.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    private OrderService orderService;
    @PostMapping(path="/place",consumes={"application/json"})
    public ResponseEntity<OrderResponseDTO> placeOrder(@RequestBody OrderRequestDTO order){
        return orderService.placeOrder(order);
    }
    @GetMapping(path="/get/orders",produces={"application/json"})
    public ResponseEntity<List<OrderResponseDTO>> getOrders(){
        return orderService.getOrders();
    }
    @GetMapping(path="/get/order{id}",produces={"application/json"})
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long id){
        return orderService.getOrderById(id);
    }
    @PutMapping(path="/update/{id}")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long id,@RequestParam String status){
        return orderService.updateOrderStatus(id,status);
    }
    @DeleteMapping(path="/delete/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id){
        return orderService.deleteOrderById(id);
    }
    @GetMapping(path="/customer/{id}")
    public ResponseEntity<List<OrderResponseDTO>> ordersByCustomer(@PathVariable Long id){
        return orderService.ordersByCustomer(id);
    }
    @GetMapping(path="/status",produces={"application/json"})
    public ResponseEntity<List<OrderResponseDTO>> getStatus(@RequestParam String status){
        return orderService.getStatus(status);
    }
}

