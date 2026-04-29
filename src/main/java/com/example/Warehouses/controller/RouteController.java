package com.example.Warehouses.controller;

import com.example.Warehouses.dto.request.RouteRequestDTO;
import com.example.Warehouses.dto.response.RouteResponseDTO;
import com.example.Warehouses.repository.RouteRepository;
import com.example.Warehouses.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/routes")
public class RouteController {
    @Autowired
    private RouteService routeService;

    @GetMapping(path="/get",produces={"application/json"})
    public ResponseEntity<List<RouteResponseDTO>> getRoutes(){
        return routeService.getRoutes();
    }
    @PostMapping(path="/add",produces = {"application/json"})
    public ResponseEntity<RouteResponseDTO> addRoutes(@RequestBody RouteRequestDTO route){
        return routeService.addRoutes(route);
    }
    @GetMapping(path="/get/{id}",produces={"application/json"})
    public ResponseEntity<RouteResponseDTO> getRouteById(@PathVariable Long id){
        return routeService.getRouteById(id);
    }
    @DeleteMapping(path="/delete/{id}",produces={"application/json"})
    public ResponseEntity<String> deleteRouteById(@PathVariable Long id){
        return routeService.deleteRoute(id);
    }
}
