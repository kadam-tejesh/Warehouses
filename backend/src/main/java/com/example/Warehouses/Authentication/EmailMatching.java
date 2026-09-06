package com.example.Warehouses.Authentication;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class EmailMatching {
    public String emailMatching(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null ||
                !authentication.isAuthenticated()){
            throw new RuntimeException("user credentials not found");
        }
        return authentication.getName();
    }
}
