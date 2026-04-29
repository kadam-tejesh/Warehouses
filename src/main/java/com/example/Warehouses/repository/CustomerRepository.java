package com.example.Warehouses.repository;

import com.example.Warehouses.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer,Long> {
    Optional<Customer> findById(Long id);
    Optional<Customer> findByEmail(String email);
}
