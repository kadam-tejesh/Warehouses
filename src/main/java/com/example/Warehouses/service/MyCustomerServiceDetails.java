package com.example.Warehouses.service;

import com.example.Warehouses.entity.MyUserPrinciples;
import com.example.Warehouses.entity.User;
import com.example.Warehouses.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyCustomerServiceDetails implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u=userRepository.findByEmail(email);
        if(u==null)
            throw new UsernameNotFoundException("user not found");

        return new MyUserPrinciples(u);
    }
}
