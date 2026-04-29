package com.example.Warehouses.controller;

import com.example.Warehouses.dto.request.LoginRequestDTO;
import com.example.Warehouses.dto.request.RegisterRequestDTO;
import com.example.Warehouses.dto.response.UserResponseDTO;
import com.example.Warehouses.entity.User;
import com.example.Warehouses.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    @Autowired
    private AuthService authService;
    @PostMapping(path="/auth/register",consumes={"application/json"})
    public UserResponseDTO getRegisterRequestDTO(@RequestBody RegisterRequestDTO u){
         return authService.registerUser(u);
    }

    @PostMapping(path="/auth/login",consumes={"application/json"})
    public String getUserResponseDTO(@RequestBody LoginRequestDTO login){
        return authService.getUserResponseDTO(login);
    }
}
