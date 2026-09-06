package com.example.Warehouses.controller;

import com.example.Warehouses.dto.request.LoginRequestDTO;
import com.example.Warehouses.dto.request.RegisterRequestDTO;
import com.example.Warehouses.dto.response.UserResponseDTO;
import com.example.Warehouses.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping(path="/auth/register", consumes={"application/json"})
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody RegisterRequestDTO u){
         return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerUser(u));
    }

    @PostMapping(path="/auth/login", consumes={"application/json"})
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequestDTO login){
        return ResponseEntity.ok(authService.getUserResponseDTO(login));
    }
}
