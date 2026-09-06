package com.example.Warehouses.service;

import com.example.Warehouses.dto.request.LoginRequestDTO;
import com.example.Warehouses.dto.request.RegisterRequestDTO;
import com.example.Warehouses.dto.response.UserResponseDTO;
import com.example.Warehouses.entity.User;
import com.example.Warehouses.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JWTService jwtService;

    private final AuthenticationManager authenticationManager;
    @Autowired
    public AuthService(UserRepository userRepository,PasswordEncoder passwordEncoder,JWTService jwtService, AuthenticationManager authenticationManager){
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
        this.jwtService=jwtService;
        this.authenticationManager=authenticationManager;
    }
    public UserResponseDTO registerUser(RegisterRequestDTO u){
        try {
            if (userRepository.findByEmail(u.getEmail()) != null) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
            }

            User user = new User();
            user.setUsername(u.getUsername());
            user.setEmail(u.getEmail());
            user.setRole(u.getRole());
            user.setPassword(passwordEncoder.encode(u.getPassword()));
            user.setIsActive(true);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            UserResponseDTO userResponseDTO = new UserResponseDTO();
            userResponseDTO.setId(user.getId());
            userResponseDTO.setUsername(user.getUsername());
            userResponseDTO.setEmail(user.getEmail());
            userResponseDTO.setRole(user.getRole());
            userResponseDTO.setIsActive(user.getIsActive());
            return userResponseDTO;
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    public String getUserResponseDTO(LoginRequestDTO login){
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            login.getEmail(),
                            login.getPassword()
                    )
            );

            if(authentication.isAuthenticated()){
                return jwtService.generateToken(login.getEmail());
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }
}
