package com.example.Warehouses.service;

import com.example.Warehouses.Helper.NodeDistance;
import com.example.Warehouses.dto.request.RouteRequestDTO;
import com.example.Warehouses.dto.response.RouteResponseDTO;
import com.example.Warehouses.entity.Route;
import com.example.Warehouses.entity.Warehouse;
import com.example.Warehouses.repository.RouteRepository;
import com.example.Warehouses.repository.WareHouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class RouteService {
    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private WareHouseRepository wareHouseRepository;
    public List<Warehouse> getWarehouseSortedByDistance(Long startId){
        Map<Long, List<NodeDistance>> graph=new HashMap<>();
        List<Route> routes=routeRepository.findAll();
        for(Route r:routes){
            Long src=r.getSourceWarehouse().getId();
            Long destination=r.getDestinationWarehouse().getId();
            Double distance=r.getDistance();
            graph.putIfAbsent(src,new ArrayList<>());
            graph.get(src).add(new NodeDistance(destination,distance));
            graph.putIfAbsent(destination,new ArrayList<>());
            graph.get(destination).add(new NodeDistance(src,distance));
        }
        Map<Long,Double> distanceMap=runDijkstra(graph,startId);
        List<Warehouse> warehouses=wareHouseRepository.findAll();
        warehouses.sort(Comparator.comparingDouble(
                w -> distanceMap.getOrDefault(w.getId(), Double.MAX_VALUE)));
        return warehouses;
    }
    private Map<Long,Double> runDijkstra(Map<Long,List<NodeDistance>> graph,Long startId){
        Map<Long,Double> distanceMap=new HashMap<>();
        for(Long Node:graph.keySet()){
            distanceMap.put(Node,Double.MAX_VALUE);
        }
        PriorityQueue<NodeDistance> pq=new PriorityQueue<>(Comparator.comparing(NodeDistance::getDistance));
        pq.add(new NodeDistance(startId,0.0));
        distanceMap.put(startId,0.0);
        while(!pq.isEmpty()){
            NodeDistance current=pq.poll();
            Long currentId= current.getWarehouseId();
            if(!graph.containsKey(currentId)) continue;
            for(NodeDistance neighbour:graph.getOrDefault(currentId,new ArrayList<>())){
                Double newDist= distanceMap.get(currentId)+ neighbour.getDistance();
                if(newDist<distanceMap.get(neighbour.getWarehouseId())){
                    distanceMap.put(neighbour.getWarehouseId(),newDist);
                    pq.add(new NodeDistance(neighbour.getWarehouseId(),newDist));
                }
            }
        }
        return distanceMap;
    }
    public ResponseEntity<List<RouteResponseDTO>> getRoutes(){
        try {
            List<Route> routes = routeRepository.findAll();
            List<RouteResponseDTO> routeResponseDTOS = new ArrayList<>();
            for (Route r : routes) {
                RouteResponseDTO response = new RouteResponseDTO();
                response.setId(r.getId());
                response.setDistance(r.getDistance());
                response.setAverageTime(r.getAverageTime());
                response.setSourceWarehouseId(r.getSourceWarehouse().getId());
                response.setDestinationWarehouseId(r.getDestinationWarehouse().getId());
                response.setSourceWarehouseName(r.getSourceWarehouse().getName());
                response.setDestinationWarehouseName(r.getDestinationWarehouse().getName());
                routeResponseDTOS.add(response);
            }
            return new ResponseEntity<>(routeResponseDTOS, HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.EXPECTATION_FAILED);

    }
    public ResponseEntity<RouteResponseDTO> addRoutes(RouteRequestDTO route){
        try {
            Route r = new Route();
            r.setAverageTime(route.getAverageTime());
            r.setDistance(route.getDistance());
            Warehouse destinationWarehouse = wareHouseRepository.findById(route.getDestinationWarehouseId());
            Warehouse sourceWarehouse = wareHouseRepository.findById(route.getSourceWarehouseId());
            r.setDestinationWarehouse(destinationWarehouse);
            r.setSourceWarehouse(sourceWarehouse);
            routeRepository.save(r);
            RouteResponseDTO responseDTO=new RouteResponseDTO();
            responseDTO.setId(r.getId());
            responseDTO.setDistance(r.getDistance());
            responseDTO.setAverageTime(r.getAverageTime());
            responseDTO.setDestinationWarehouseId(destinationWarehouse.getId());
            responseDTO.setDestinationWarehouseName(destinationWarehouse.getName());
            responseDTO.setSourceWarehouseName(sourceWarehouse.getName());
            responseDTO.setSourceWarehouseId(sourceWarehouse.getId());
            return new ResponseEntity<>(responseDTO,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new RouteResponseDTO(),HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<RouteResponseDTO> getRouteById(Long id){
        try {
            Route r = routeRepository.findById(id).orElseThrow(() -> new RuntimeException("route not found"));
            RouteResponseDTO response = new RouteResponseDTO();
            response.setId(r.getId());
            response.setDistance(r.getDistance());
            response.setAverageTime(r.getAverageTime());
            response.setSourceWarehouseId(r.getSourceWarehouse().getId());
            response.setDestinationWarehouseId(r.getDestinationWarehouse().getId());
            response.setSourceWarehouseName(r.getSourceWarehouse().getName());
            response.setDestinationWarehouseName(r.getDestinationWarehouse().getName());
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new RouteResponseDTO(),HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<String> deleteRoute(Long id){
        try{
            routeRepository.deleteById(id);
            return new ResponseEntity<>("success",HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>("failure",HttpStatus.EXPECTATION_FAILED);
    }
}
