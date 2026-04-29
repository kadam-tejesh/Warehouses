package com.example.Warehouses.repository;

import com.example.Warehouses.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface UserRepository extends JpaRepository<User,Integer> {
  User findByEmail(String email);
}
