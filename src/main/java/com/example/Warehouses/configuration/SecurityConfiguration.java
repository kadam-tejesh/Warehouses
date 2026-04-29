package com.example.Warehouses.configuration;

import com.example.Warehouses.filter.JwtFilter;
import com.example.Warehouses.service.MyCustomerServiceDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    @Autowired
    private JwtFilter jwtFilter;
    @Autowired
    private MyCustomerServiceDetails myCustomerServiceDetails;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http){
        http.csrf(customizer-> customizer.disable())
                .authorizeHttpRequests(request-> request.requestMatchers("/auth/login", "/auth/register")
                        .permitAll()
                        .requestMatchers("/products/create/products","/products/get/products","/products/all/products","/products/delete/products/{id}",
                                "/warehouses/create/warehouse","/warehouses/get/warehouses","/warehouses/{id}","/warehouses/delete/{id}",
                                "/inventory/add/inventory","/inventory/get/inventory","/inventory/get/inventory/product{id}","/inventory/get/inventory/warehouse{id}","/inventory/get/inventory/p{pid}/w{wid}","/inventory/delete/inventory/{id}").hasRole("Admin")
                        .requestMatchers("/order/place","/order/get/orders","/order/get/order{id}","/order/update/{id}","/order/delete/{id}","/order/customer/{id}","/order/status",
                                "/customer/get/all","/customer/add","/customer/{id}","/customer/update/{id}","/customer/delete/{id}",
                                "/routes/get","/routes/add","/routes/get/{id}","/routes/delete/{id}").hasAnyRole("Manager","Admin")
                        .anyRequest().authenticated())
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(){
        DaoAuthenticationProvider provider=new DaoAuthenticationProvider(myCustomerServiceDetails);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration){
        return configuration.getAuthenticationManager();
    }
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
