package com.example.Warehouses.controller;

import com.example.Warehouses.dto.request.ProductRequestDTO;
import com.example.Warehouses.dto.response.ProductResponseDTO;
import com.example.Warehouses.entity.Product;
import com.example.Warehouses.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping(consumes={"application/json"})
    public ResponseEntity<ProductResponseDTO> productRequestDTO(@RequestBody ProductRequestDTO product){
        return productService.createOrUpdateProduct(product);
    }

    @GetMapping(produces={"application/json"})
    public ResponseEntity<List<ProductResponseDTO>> productResponseDTOS(){
        return productService.getProducts();
    }

    @GetMapping(path="/{id}",produces={"application/json"})
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id){
        return productService.getProduct(id);
    }

    @DeleteMapping(path="/{id}")
    public ResponseEntity<ProductResponseDTO> deleteProducts(@PathVariable Long id){
        return productService.deleteProducts(id);
    }


}
