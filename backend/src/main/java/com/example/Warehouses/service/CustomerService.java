package com.example.Warehouses.service;

import com.example.Warehouses.dto.request.CustomerRequestDTO;
import com.example.Warehouses.dto.response.CustomerResponseDTO;
import com.example.Warehouses.entity.Customer;
import com.example.Warehouses.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    @Autowired
    public CustomerService(CustomerRepository customerRepository){
        this.customerRepository=customerRepository;
    }

    public ResponseEntity<List<CustomerResponseDTO>> getCustomers(){
        try {
            List<Customer> customerList = customerRepository.findAll();
            List<CustomerResponseDTO> list = new ArrayList<>();
            for (Customer c : customerList) {
                CustomerResponseDTO response =customerResponseDTO(c);
                list.add(response);
            }
            return new ResponseEntity<>(list,HttpStatus.OK);
        }
        catch(Exception e){
                e.getStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<CustomerResponseDTO> addCustomer(CustomerRequestDTO customer) {
        try {
            Customer c = new Customer();
            c.setName(customer.getName());
            c.setEmail(customer.getEmail());
            c.setCity(customer.getCity());
            c.setLatitude(customer.getLatitude());
            c.setLongitude(customer.getLongitude());
            c.setState(customer.getState());
            c.setAddressLine(customer.getAddressLine());
            c.setPhoneNo(customer.getPhoneNo());
            c.setPinCode(customer.getPinCode());
            customerRepository.save(c);
            CustomerResponseDTO responseDTO = customerResponseDTO(c);

            return new ResponseEntity<>(responseDTO,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new CustomerResponseDTO(), HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<CustomerResponseDTO> getCustomerById(Long id){
        try {
            Customer c = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("customer not found"));
            CustomerResponseDTO response = customerResponseDTO(c);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new CustomerResponseDTO(), HttpStatus.EXPECTATION_FAILED);
    }
    public ResponseEntity<CustomerResponseDTO> updateCustomerById(Long id,CustomerRequestDTO customer){
        try {
            Optional<Customer> optional = customerRepository.findById(id);

            if(optional.isEmpty()){
                return new ResponseEntity<>(new CustomerResponseDTO(),HttpStatus.NOT_FOUND);
            }

            Customer c = optional.get();

            // update safely
            if(customer.getName() != null) c.setName(customer.getName());
            if(customer.getEmail() != null) c.setEmail(customer.getEmail());
            if(customer.getCity() != null) c.setCity(customer.getCity());
            if(customer.getLatitude() != null) c.setLatitude(customer.getLatitude());
            if(customer.getLongitude() != null) c.setLongitude(customer.getLongitude());
            if(customer.getState() != null) c.setState(customer.getState());
            if(customer.getAddressLine() != null) c.setAddressLine(customer.getAddressLine());
            if(customer.getPhoneNo() != null) c.setPhoneNo(customer.getPhoneNo());
            if(customer.getPinCode() != null) c.setPinCode(customer.getPinCode());

            customerRepository.save(c);

            CustomerResponseDTO response = customerResponseDTO(c);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>(new CustomerResponseDTO(), HttpStatus.EXPECTATION_FAILED);

    }
    public ResponseEntity<String> deleteCustomerById(Long id){
        try {
            customerRepository.deleteById(id);
            return new ResponseEntity<>("Success",HttpStatus.OK);
        }
        catch(Exception e){
            e.getStackTrace();
        }
        return new ResponseEntity<>("Failure", HttpStatus.EXPECTATION_FAILED);

    }
    private CustomerResponseDTO customerResponseDTO(Customer customer){
        CustomerResponseDTO responseDTO = new CustomerResponseDTO();
        responseDTO.setId(customer.getId());
        responseDTO.setName(customer.getName());
        responseDTO.setEmail(customer.getEmail());
        responseDTO.setCity(customer.getCity());
        responseDTO.setLatitude(customer.getLatitude());
        responseDTO.setLongitude(customer.getLongitude());
        responseDTO.setState(customer.getState());
        responseDTO.setAddressLine(customer.getAddressLine());
        responseDTO.setPhoneNo(customer.getPhoneNo());
        responseDTO.setPinCode(customer.getPinCode());
        return responseDTO;
    }



}
