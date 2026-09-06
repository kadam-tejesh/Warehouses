package com.example.Warehouses.service;

import com.example.Warehouses.Helper.NodeDistance;
import com.example.Warehouses.dto.request.OrderItemRequestDTO;
import com.example.Warehouses.dto.request.OrderRequestDTO;
import com.example.Warehouses.dto.response.OrderItemResponseDTO;
import com.example.Warehouses.dto.response.OrderResponseDTO;
import com.example.Warehouses.entity.*;
import com.example.Warehouses.repository.*;
import org.hibernate.grammars.hql.HqlParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;


@Service
@Transactional
public class OrderService {
   
    private final RouteRepository routeRepository;
    
    private final InventoryRepository inventoryRepository;
    
    private final WareHouseRepository wareHouseRepository;

    private final CustomerRepository customerRepository;
    
    private final RouteService routeService;
   
    private final ProductRepository productRepository;
    
    private final OrderRepository orderRepository;
    
    public OrderService(RouteRepository routeRepository,OrderRepository orderRepository,ProductRepository productRepository
    ,RouteService routeService,CustomerRepository customerRepository,WareHouseRepository wareHouseRepository,InventoryRepository inventoryRepository ){
        this.customerRepository=customerRepository;
        this.orderRepository=orderRepository;
        this.routeService=routeService;
        this.productRepository=productRepository;
        this.inventoryRepository=inventoryRepository;
        this.routeRepository=routeRepository;
        this.wareHouseRepository=wareHouseRepository;
    }

    public ResponseEntity<OrderResponseDTO> placeOrder(OrderRequestDTO order){
        try {
            Customer customer = customerRepository.findById(order.getCustomerId()).orElseThrow(() -> new RuntimeException("Customer not found"));
            if (order.getItems().isEmpty()) {
                throw new RuntimeException("order must contain at least one item to get placed");
            }
            Order order1 = new Order();
            order1.setCustomer(customer);
            order1.setStatus("CREATED");
            order1.setCreatedAt(LocalDateTime.now());
            order1.setUpdatedAt(LocalDateTime.now());
            List<OrderItems> orderItemsList = new ArrayList<>();
            Long startWarehouseId = wareHouseRepository.findAll().get(0).getId();
            BigDecimal totalAmount = BigDecimal.ZERO;
            List<Warehouse> warehouses = routeService.getWarehouseSortedByDistance(startWarehouseId);
            for (OrderItemRequestDTO item : order.getItems()) {
                if (item.getQuantity() <= 0) {
                    throw new RuntimeException("items should be at least one");
                }
                Product product = productRepository.findById(item.getProductId());
                Long remainingQuantity = item.getQuantity();
                for (Warehouse warehouse : warehouses) {
                    if (remainingQuantity == 0)
                        break;
                    Inventory inventory = inventoryRepository.findByProductAndWarehouse(product, warehouse);
                    if (inventory == null) continue;
                    int available = inventory.getQuantity() - inventory.getReservedQuantity();
                    if (available <= 0) continue;
                    int allocate = (int) Math.min(remainingQuantity, available);
                    System.out.println("Warehouse: " + warehouse.getId() +
                            " Available: " + available +
                            " Remaining: " + remainingQuantity);
                    //saving inventory
                    inventory.setQuantity(inventory.getQuantity() - allocate);
                    inventory.setLastUpdated(LocalDateTime.now());
                    inventoryRepository.save(inventory);
                    // updating the warehouse load
                    warehouse.setCurrentLoad(warehouse.getCurrentLoad() + allocate);
                    wareHouseRepository.save(warehouse);
                    // Create order item
                    OrderItems orderItem = new OrderItems();
                    orderItem.setOrder(order1);
                    orderItem.setProduct(product);
                    orderItem.setWarehouse(warehouse);
                    orderItem.setQuantity((long) allocate);
                    orderItem.setUnitPrice(product.getPrice());
                    BigDecimal subTotal = product.getPrice().multiply(BigDecimal.valueOf(allocate));
                    orderItem.setSubTotal(subTotal);
                    orderItemsList.add(orderItem);
                    totalAmount = totalAmount.add(subTotal);
                    remainingQuantity -= allocate;
                }
                if (remainingQuantity > 0) {
                    throw new RuntimeException("insufficient stock for" + product.getName());
                }
            }
            order1.setOrderNo("ORD-" + System.currentTimeMillis());
            order1.setOrderItemsList(orderItemsList);
            order1.setTotalAmount(totalAmount);
            orderRepository.save(order1);
            return new ResponseEntity<>(orderResponseDTO(order1),HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new OrderResponseDTO(),HttpStatus.EXPECTATION_FAILED);
    }
    private OrderResponseDTO orderResponseDTO(Order order){
        OrderResponseDTO responseDTO=new OrderResponseDTO();
        responseDTO.setCustomerName(order.getCustomer().getName());
        responseDTO.setOrderNo(order.getOrderNo());
        responseDTO.setOrderId(order.getId());
        responseDTO.setTotalAmount(order.getTotalAmount());
        responseDTO.setStatus(order.getStatus());
        responseDTO.setCreatedAt(order.getCreatedAt());
        List<OrderItems> orderItemResponseList=order.getOrderItemsList();
        List<OrderItemResponseDTO> orderItemResponseDTOList=new ArrayList<>();
        for(OrderItems items:orderItemResponseList){
            OrderItemResponseDTO itemResponseDTO=new OrderItemResponseDTO();
            itemResponseDTO.setQuantity(items.getQuantity());
            itemResponseDTO.setProductName(items.getProduct().getName());
            itemResponseDTO.setUnitPrice(items.getUnitPrice());
            itemResponseDTO.setSubTotal(items.getSubTotal());
            itemResponseDTO.setProductId(items.getProduct().getId());
            itemResponseDTO.setWarehouseId(items.getWarehouse().getId());
            itemResponseDTO.setWarehouseName(items.getWarehouse().getName());
            orderItemResponseDTOList.add(itemResponseDTO);
        }
        responseDTO.setItems(orderItemResponseDTOList);
        responseDTO.setCustomerId(order.getCustomer().getId());

        return responseDTO;
    }

    public ResponseEntity<List<OrderResponseDTO>> getOrders(){
        try {
            List<Order> orderList = orderRepository.findAll();
            List<OrderResponseDTO> responseDTOList = new ArrayList<>();
            for (Order o : orderList) {
                OrderResponseDTO response = new OrderResponseDTO();
                List<OrderItems> orderItems = o.getOrderItemsList();
                List<OrderItemResponseDTO> orderItemResponseDTOS = new ArrayList<>();
                for (OrderItems items : orderItems) {
                    OrderItemResponseDTO responseDTO = new OrderItemResponseDTO();
                    responseDTO.setProductId(items.getProduct().getId());
                    responseDTO.setQuantity(items.getQuantity());
                    responseDTO.setProductName(items.getProduct().getName());
                    responseDTO.setUnitPrice(items.getUnitPrice());
                    responseDTO.setSubTotal(items.getSubTotal());
                    responseDTO.setWarehouseId(items.getWarehouse().getId());
                    responseDTO.setWarehouseName(items.getWarehouse().getName());
                    orderItemResponseDTOS.add(responseDTO);
                }
                response.setOrderId(o.getId());
                response.setOrderNo(o.getOrderNo());
                response.setStatus(o.getStatus());
                response.setItems(orderItemResponseDTOS);
                response.setCreatedAt(o.getCreatedAt());
                response.setCustomerName(o.getCustomer().getName());
                response.setTotalAmount(o.getTotalAmount());
                response.setCustomerId(o.getCustomer().getId());
                responseDTOList.add(response);

            }
            return new ResponseEntity<>(responseDTOList,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<OrderResponseDTO> getOrderById(Long id){
        try {
            Order o = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("order not found"));
            List<OrderItems> orderItems = o.getOrderItemsList();
            OrderResponseDTO orderResponseDTO = new OrderResponseDTO();
            List<OrderItemResponseDTO> orderItemResponseDTOS = new ArrayList<>();
            for (OrderItems items : orderItems) {
                OrderItemResponseDTO responseDTO = new OrderItemResponseDTO();
                responseDTO.setProductId(items.getProduct().getId());
                responseDTO.setQuantity(items.getQuantity());
                responseDTO.setProductName(items.getProduct().getName());
                responseDTO.setUnitPrice(items.getUnitPrice());
                responseDTO.setSubTotal(items.getSubTotal());
                responseDTO.setWarehouseId(items.getWarehouse().getId());
                responseDTO.setWarehouseName(items.getWarehouse().getName());
                orderItemResponseDTOS.add(responseDTO);
            }
            orderResponseDTO.setCustomerId(o.getCustomer().getId());
            orderResponseDTO.setOrderNo(o.getOrderNo());
            orderResponseDTO.setStatus(o.getStatus());
            orderResponseDTO.setItems(orderItemResponseDTOS);
            orderResponseDTO.setTotalAmount(o.getTotalAmount());
            orderResponseDTO.setCreatedAt(o.getCreatedAt());
            orderResponseDTO.setCustomerName(o.getCustomer().getName());
            orderResponseDTO.setOrderId(o.getId());
            return new ResponseEntity<>(orderResponseDTO,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new OrderResponseDTO(),HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<String> updateOrderStatus(Long id, String status){
        try {
            Order o = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("order not found"));
            o.setStatus(status);
            return new ResponseEntity<>("success", HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>("failure",HttpStatus.OK);
    }
    public ResponseEntity<String> deleteOrderById(Long id){
        try{
            orderRepository.deleteById(id);
            return new ResponseEntity<>("success",HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>("failure", HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<List<OrderResponseDTO>> ordersByCustomer(Long id){
        try {
            Customer c = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("customer not found"));
            List<Order> ordersList = c.getOrderList();
            List<OrderResponseDTO> orderResponseDTOS = new ArrayList<>();
            for (Order o : ordersList) {
                List<OrderItems> orderItem = o.getOrderItemsList();
                List<OrderItemResponseDTO> orderItemResponseDTOS = new ArrayList<>();
                for (OrderItems items : orderItem) {
                    OrderItemResponseDTO itemResponseDTO = new OrderItemResponseDTO();
                    itemResponseDTO.setQuantity(items.getQuantity());
                    itemResponseDTO.setProductName(items.getProduct().getName());
                    itemResponseDTO.setUnitPrice(items.getUnitPrice());
                    itemResponseDTO.setSubTotal(items.getSubTotal());
                    itemResponseDTO.setWarehouseId(items.getWarehouse().getId());
                    itemResponseDTO.setWarehouseName(items.getWarehouse().getName());
                    itemResponseDTO.setProductId(items.getProduct().getId());
                    orderItemResponseDTOS.add(itemResponseDTO);
                }
                OrderResponseDTO responseDTO = new OrderResponseDTO();
                responseDTO.setOrderId(o.getId());
                responseDTO.setOrderNo(o.getOrderNo());
                responseDTO.setCustomerId(o.getCustomer().getId());
                responseDTO.setCustomerName(o.getCustomer().getName());
                responseDTO.setTotalAmount(o.getTotalAmount());
                responseDTO.setStatus(o.getStatus());
                responseDTO.setCreatedAt(o.getCreatedAt());
                responseDTO.setItems(orderItemResponseDTOS);
                orderResponseDTOS.add(responseDTO);
            }
            return new ResponseEntity<>(orderResponseDTOS, HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<List<OrderResponseDTO>> getStatus(String status){
        try {
            List<Order> orderList = orderRepository.findByStatus(status);
            List<OrderResponseDTO> orderResponseDTOS = new ArrayList<>();
            for (Order o : orderList) {
                List<OrderItems> orderItem = o.getOrderItemsList();
                List<OrderItemResponseDTO> orderItemResponseDTOS = new ArrayList<>();
                for (OrderItems items : orderItem) {
                    OrderItemResponseDTO itemResponseDTO = new OrderItemResponseDTO();
                    itemResponseDTO.setQuantity(items.getQuantity());
                    itemResponseDTO.setProductName(items.getProduct().getName());
                    itemResponseDTO.setUnitPrice(items.getUnitPrice());
                    itemResponseDTO.setSubTotal(items.getSubTotal());
                    itemResponseDTO.setWarehouseId(items.getWarehouse().getId());
                    itemResponseDTO.setWarehouseName(items.getWarehouse().getName());
                    itemResponseDTO.setProductId(items.getProduct().getId());
                    orderItemResponseDTOS.add(itemResponseDTO);
                }
                OrderResponseDTO responseDTO = new OrderResponseDTO();
                responseDTO.setOrderId(o.getId());
                responseDTO.setOrderNo(o.getOrderNo());
                responseDTO.setCustomerId(o.getCustomer().getId());
                responseDTO.setCustomerName(o.getCustomer().getName());
                responseDTO.setTotalAmount(o.getTotalAmount());
                responseDTO.setStatus(o.getStatus());
                responseDTO.setCreatedAt(o.getCreatedAt());
                responseDTO.setItems(orderItemResponseDTOS);
                orderResponseDTOS.add(responseDTO);
            }
            return new ResponseEntity<>(orderResponseDTOS, HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.EXPECTATION_FAILED);
    }
}
