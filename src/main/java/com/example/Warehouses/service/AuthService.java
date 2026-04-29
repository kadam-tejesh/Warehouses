package com.example.Warehouses.service;

import com.example.Warehouses.dto.request.LoginRequestDTO;
import com.example.Warehouses.dto.request.RegisterRequestDTO;
import com.example.Warehouses.dto.response.UserResponseDTO;
import com.example.Warehouses.entity.User;
import com.example.Warehouses.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.print.attribute.DateTimeSyntax;
import java.util.Date;
import java.time.LocalDateTime;
@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTService service;
    @Autowired
    private AuthenticationManager manager;
    public UserResponseDTO registerUser(RegisterRequestDTO u){
        User user;
         user=userRepository.findByEmail(u.getEmail());
        UserResponseDTO userResponseDTO=new UserResponseDTO();
         if(user==null) {
             user=new User();
             user.setUsername(u.getUsername());
             user.setEmail(u.getEmail());
             user.setRole(u.getRole());
             System.out.println(u.getPassword());
             user.setPassword(passwordEncoder.encode(u.getPassword()));
             System.out.println(user.getPassword());
             user.setIsActive(true);
             user.setCreatedAt(LocalDateTime.now());
             user.setUpdatedAt(LocalDateTime.now());
             userRepository.save(user);
             userResponseDTO.setId(user.getId());
             userResponseDTO.setUsername(user.getUsername());
             userResponseDTO.setEmail(user.getEmail());
             userResponseDTO.setRole(user.getRole());
             userResponseDTO.setIsActive(user.getIsActive());
         }
         else{
             user.setUpdatedAt(LocalDateTime.now());
             userRepository.save(user);
             userResponseDTO.setId(user.getId());
             userResponseDTO.setUsername(user.getUsername());
             userResponseDTO.setEmail(user.getEmail());
             userResponseDTO.setRole(user.getRole());
             userResponseDTO.setIsActive(user.getIsActive());

         }
        return userResponseDTO;
    }
    public String getUserResponseDTO(LoginRequestDTO login){
        try {
            Authentication authentication = manager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            login.getEmail(),
                            login.getPassword()
                    )
            );

            if(authentication.isAuthenticated()){
                return service.generateToken(login.getEmail());
            }
            User dbUser = userRepository.findByEmail(login.getEmail());

            System.out.println("RAW: " + login.getPassword());
            System.out.println("DB: " + dbUser.getPassword());
            System.out.println("MATCH: " + passwordEncoder.matches(
                    login.getPassword(),
                    dbUser.getPassword()
            ));

        } catch (Exception e) {
            e.getStackTrace();
        }

        return "fail";
    }
}
