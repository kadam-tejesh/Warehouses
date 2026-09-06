# Warehouse Management System

A full-stack Warehouse Management System built with **Java Spring Boot** and **React TypeScript**. The application provides warehouse, inventory, product, customer, order, and route management with JWT-based authentication and intelligent warehouse selection using **Dijkstra's shortest-path algorithm**.

The backend was developed using **Java and Spring Boot**, while the frontend provides a responsive web interface for interacting with the backend REST APIs.

---

## 🚀 Live Application

### Frontend
Deployed on **Vercel**

### Backend
Deployed on **Render**

> The frontend communicates with the Spring Boot backend through REST APIs.

---

## 🛠️ Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- REST APIs
- Maven
- MySQL

### Frontend
- React
- TypeScript
- Vite
- HTML
- CSS
- JavaScript

### Algorithms & Concepts
- Dijkstra's Shortest Path Algorithm
- Graph Data Structures
- Priority Queue
- CRUD Operations
- Layered Architecture
- Transaction Management
- Role-Based Authorization

### Deployment
- Render – Backend
- Vercel – Frontend

---

# ✨ Features

## 🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Password hashing using BCrypt
- Stateless authentication using Spring Security
- Role-based authorization
- Protected backend endpoints
- Different access levels for administrative and management operations

---

## 🏢 Warehouse Management

The system allows authorized users to:

- Create warehouses
- View warehouses
- Update warehouse information
- Delete warehouses
- Monitor warehouse capacity/load
- Manage warehouse-related information

---

## 📦 Product Management

The product module provides:

- Product creation
- Product retrieval
- Product updates
- Product deletion
- Product information management
- Product inventory association

---

## 📊 Inventory Management

The inventory module manages stock available at different warehouses.

Features include:

- Track product quantities
- Associate products with warehouses
- Check available inventory
- Update stock after order fulfillment
- Maintain warehouse inventory levels

---

## 👥 Customer Management

The customer module provides functionality for:

- Customer registration
- Customer information management
- Customer retrieval
- Updating customer details
- Deleting customer records

---

# 🛒 Order Management

The order management system handles the complete order workflow.

When an order is placed, the backend:

1. Receives the order request.
2. Identifies the requested products and quantities.
3. Checks inventory availability.
4. Determines suitable warehouses.
5. Calculates warehouse proximity.
6. Allocates inventory.
7. Updates inventory quantities.
8. Updates warehouse load.
9. Creates order items.
10. Calculates the order subtotal and total.
11. Persists the order information.

This allows the system to automatically determine where products should be fulfilled from.

---

# 🗺️ Intelligent Warehouse Routing

One of the core features of the project is the use of **Dijkstra's Shortest Path Algorithm** for warehouse routing.

Warehouses and their routes are represented as a weighted graph.

- Warehouses → Graph vertices
- Routes → Graph edges
- Route distance → Edge weight

The backend calculates the shortest distance between warehouses and uses this information to determine the most suitable warehouses for order fulfillment.

### Example

```text
Warehouse A
     |
    10
     |
Warehouse B
     |
     5
     |
Warehouse C
