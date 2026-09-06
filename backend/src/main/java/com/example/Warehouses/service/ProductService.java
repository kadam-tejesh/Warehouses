package com.example.Warehouses.service;

import com.example.Warehouses.dto.request.ProductRequestDTO;
import com.example.Warehouses.dto.response.ProductResponseDTO;
import com.example.Warehouses.entity.Product;
import com.example.Warehouses.repository.ProductRepository;
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
public class ProductService {


    private final ProductRepository productRepository;
    @Autowired
    public ProductService(ProductRepository productRepository){
        this.productRepository=productRepository;
    }
    public ResponseEntity<ProductResponseDTO> createOrUpdateProduct(ProductRequestDTO product){
        try {
            Product p = productRepository.findBySku(product.getSku());
            ProductResponseDTO responseDTO = new ProductResponseDTO();
            if (p == null) {
                p = new Product();
                p.setSku(product.getSku());
                p.setName(product.getName());
                p.setDescription(product.getDescription());
                p.setPrice(product.getPrice());
                p.setActive(product.isActive());
                p.setWeight(product.getWeight());
                p.setCreatedAt(LocalDateTime.now());
                p.setUpdatedAt(LocalDateTime.now());
                productRepository.save(p);

            } else {
                p.setSku(product.getSku());
                p.setName(product.getName());
                p.setDescription(product.getDescription());
                p.setPrice(product.getPrice());
                p.setActive(product.isActive());
                p.setWeight(product.getWeight());
                p.setUpdatedAt(LocalDateTime.now());
                productRepository.save(p);
            }
            responseDTO.setId(p.getId());
            responseDTO.setSku(p.getSku());
            responseDTO.setName(p.getName());
            responseDTO.setDescription(p.getDescription());
            responseDTO.setPrice(p.getPrice());
            responseDTO.setWeight(p.getWeight());
            responseDTO.setActive(p.isActive());
            return new ResponseEntity<>(responseDTO,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new ProductResponseDTO(), HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<List<ProductResponseDTO>> getProducts(){
        try {
            List<Product> products = productRepository.findAll();
            List<ProductResponseDTO> list = new ArrayList<>();
            for (Product p : products) {
                ProductResponseDTO responseDTO = new ProductResponseDTO();
                responseDTO.setId(p.getId());
                responseDTO.setSku(p.getSku());
                responseDTO.setName(p.getName());
                responseDTO.setDescription(p.getDescription());
                responseDTO.setPrice(p.getPrice());
                responseDTO.setWeight(p.getWeight());
                responseDTO.setActive(p.isActive());
                list.add(responseDTO);
            }
            return new ResponseEntity<>(list,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<List<Product>> getAllProducts(){
        try {
            return new ResponseEntity<>(productRepository.findAll(),HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<ProductResponseDTO> deleteProducts(Long id){
        try {
            Product p = productRepository.deleteById(id);
            ProductResponseDTO responseDTO = new ProductResponseDTO();
            responseDTO.setId(p.getId());
            responseDTO.setSku(p.getSku());
            responseDTO.setName(p.getName());
            responseDTO.setDescription(p.getDescription());
            responseDTO.setPrice(p.getPrice());
            responseDTO.setWeight(p.getWeight());
            responseDTO.setActive(p.isActive());
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new ProductResponseDTO(), HttpStatus.EXPECTATION_FAILED);
    }

    public ResponseEntity<ProductResponseDTO> getProduct(Long id){
        try{
            Product p=productRepository.findById(id);
            ProductResponseDTO responseDTO = new ProductResponseDTO();
            responseDTO.setId(p.getId());
            responseDTO.setSku(p.getSku());
            responseDTO.setName(p.getName());
            responseDTO.setDescription(p.getDescription());
            responseDTO.setPrice(p.getPrice());
            responseDTO.setWeight(p.getWeight());
            responseDTO.setActive(p.isActive());
            return new ResponseEntity<>(responseDTO,HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ProductResponseDTO(),HttpStatus.EXPECTATION_FAILED);
    }
}
