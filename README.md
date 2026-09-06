# Warehouse Management System

A full-stack Warehouse Management System built with **Java Spring Boot** and **React TypeScript**. The application provides warehouse, inventory, product, customer, order, and route management with JWT-based authentication and intelligent warehouse selection using **Dijkstra's shortest-path algorithm**.

## 🚀 Live Deployment

* **Frontend:** Vercel
* **Backend:** Render

The React frontend communicates with the Spring Boot backend through REST APIs.

## 🛠️ Tech Stack

### Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* REST APIs
* Maven
* MySQL

### Frontend

* React
* TypeScript
* Vite
* HTML
* CSS
* JavaScript

### Algorithms & Concepts

* Dijkstra's Shortest Path Algorithm
* Graph Data Structures
* Priority Queue
* CRUD Operations
* Layered Architecture
* Transaction Management
* Role-Based Authorization

### Deployment

* Render — Backend
* Vercel — Frontend

---

# ✨ Features

## 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* BCrypt password hashing
* Stateless authentication using Spring Security
* Role-based authorization
* Protected REST API endpoints
* Role-based access for administrative and management operations

## 🏢 Warehouse Management

The warehouse module provides functionality to:

* Create warehouses
* View warehouse information
* Update warehouse details
* Delete warehouses
* Track warehouse load
* Manage warehouse-related information

## 📦 Product Management

The product module supports:

* Product creation
* Product retrieval
* Product updates
* Product deletion
* Product information management
* Product and inventory association

## 📊 Inventory Management

The inventory module manages stock across multiple warehouses.

Features include:

* Track product quantities
* Associate products with warehouses
* Check available inventory
* Update stock after order fulfillment
* Maintain warehouse inventory levels

## 👥 Customer Management

The customer module provides:

* Customer creation
* Customer retrieval
* Customer information updates
* Customer deletion
* Customer management for order processing

# 🛒 Order Management

The order management system handles the complete order fulfillment workflow.

When an order is placed, the backend:

1. Receives the order request.
2. Identifies the requested products and quantities.
3. Checks inventory availability.
4. Determines suitable warehouses.
5. Calculates warehouse proximity.
6. Allocates available inventory.
7. Updates inventory quantities.
8. Updates warehouse load.
9. Creates order items.
10. Calculates the order subtotal and total.
11. Persists the order information.

This allows the system to automatically determine suitable warehouses for fulfilling customer orders.

# 🗺️ Intelligent Warehouse Routing

One of the core backend features is the implementation of **Dijkstra's Shortest Path Algorithm** for warehouse routing.

Warehouses and their routes are represented as a weighted graph.

* Warehouses represent graph vertices.
* Routes represent graph edges.
* Route distance represents edge weight.

The routing service calculates the shortest distance between warehouses and uses the calculated distances to rank warehouses for order fulfillment.

### Routing Workflow

```text
Warehouse Network
       ↓
Build Weighted Graph
       ↓
Dijkstra's Algorithm
       ↓
Calculate Shortest Distances
       ↓
Rank Warehouses by Distance
       ↓
Inventory Availability Check
       ↓
Warehouse Selection
```

This combines **graph algorithms with inventory management and order fulfillment logic**.

# 🏗️ Backend Architecture

The Spring Boot backend follows a layered architecture that separates application responsibilities.

```text
Client
  ↓
Controller Layer
  ↓
Service Layer
  ↓
Repository Layer
  ↓
MySQL Database
```

### Controller Layer

The controller layer handles HTTP requests and exposes REST APIs for different modules such as:

* Authentication
* Warehouses
* Products
* Inventory
* Customers
* Orders
* Routes

### Service Layer

The service layer contains the application's core business logic.

Responsibilities include:

* Order processing
* Inventory allocation
* Warehouse selection
* Route calculation
* Product management
* Warehouse management
* Customer management

### Repository Layer

Spring Data JPA repositories are used to interact with the MySQL database and perform persistence operations.

### Entity Layer

JPA entities represent the application's database tables and relationships.

### DTO Layer

Data Transfer Objects are used for structured communication between the frontend and backend while separating API request/response models from persistence entities.

# 🔒 Security Architecture

The application uses **Spring Security and JWT** for authentication and authorization.

The authentication flow is:

```text
User
 ↓
Login
 ↓
Authentication
 ↓
JWT Token Generated
 ↓
Client
 ↓
Protected API Request
 ↓
JWT Authentication Filter
 ↓
Spring Security
 ↓
Authorized Endpoint
```

Passwords are securely hashed using **BCrypt** before being stored.

The backend uses stateless authentication, allowing authenticated requests to be validated using JWT tokens.

# 🗄️ Database

The application uses **MySQL** as the relational database.

**Spring Data JPA** and **Hibernate** are used for:

* Object-relational mapping
* Entity persistence
* CRUD operations
* Database queries
* Entity relationships
* Transaction management

The database manages information related to:

* Users
* Customers
* Products
* Warehouses
* Inventory
* Orders
* Order Items
* Routes

# 📁 Project Structure

```text
Warehouses/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/Warehouses/
│   │   │   │       ├── configuration/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── filter/
│   │   │   │       ├── repository/
│   │   │   │       └── service/
│   │   │   │
│   │   │   └── resources/
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

# 🔄 Application Workflow

The overall system works through the following flow:

```text
                  React Frontend
                       │
                       │ REST API
                       ▼
                Spring Boot Backend
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
     Authentication  Business     Database
       / JWT          Logic        / MySQL
                       │
                       ▼
                 Order Service
                       │
                       ▼
                 Inventory Check
                       │
                       ▼
                 Route Service
                       │
                       ▼
              Dijkstra Algorithm
                       │
                       ▼
              Warehouse Selection
                       │
                       ▼
               Inventory Allocation
                       │
                       ▼
                 Order Creation
```

# ⚙️ Backend Setup

## Prerequisites

Make sure the following are installed:

* Java 21 or later
* Maven
* MySQL
* Git

## Clone the Repository

```bash
git clone https://github.com/kadam-tejesh/Warehouses.git
```

Navigate to the project:

```bash
cd Warehouses
```

## Configure MySQL

Create a MySQL database:

```sql
CREATE DATABASE warehouses;
```

Configure the database connection in:

```text
backend/src/main/resources/application.properties
```

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/warehouses
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Replace the database username and password with your local MySQL credentials.

# ▶️ Run the Backend

Navigate to the backend directory:

```bash
cd backend
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend will start on the configured Spring Boot port.

# ▶️ Run the Frontend

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will display the frontend URL in the terminal.

# 🌐 Deployment

The application uses separate deployment environments for the frontend and backend.

```text
                 Internet
                    │
                    ▼
          ┌──────────────────┐
          │      Vercel      │
          │ React + TypeScript│
          └────────┬─────────┘
                   │
                REST API
                   │
                   ▼
          ┌──────────────────┐
          │      Render      │
          │   Spring Boot    │
          │     Backend      │
          └────────┬─────────┘
                   │
                   ▼
                 MySQL
```

### Frontend Deployment

The React and TypeScript frontend is deployed on **Vercel**.

### Backend Deployment

The Spring Boot REST API is deployed on **Render**.

The frontend communicates with the deployed backend through HTTP REST API requests.

# 🧠 Key Technical Highlights

* Developed a complete **Java Spring Boot REST API backend** for warehouse and inventory management.
* Implemented a layered backend architecture using Controllers, Services, Repositories, Entities, and DTOs.
* Implemented **JWT authentication and role-based authorization** using Spring Security.
* Secured user passwords using **BCrypt hashing**.
* Developed inventory allocation and order fulfillment business logic.
* Implemented **Dijkstra's shortest-path algorithm** for warehouse route optimization.
* Used a weighted graph and **PriorityQueue** for shortest-path processing.
* Integrated warehouse routing with inventory availability and order fulfillment.
* Used **Spring Data JPA and Hibernate** for database persistence.
* Developed a React and TypeScript frontend integrated with the Spring Boot REST APIs.
* Deployed the backend on **Render**.
* Deployed the frontend on **Vercel**.

# 🚀 Future Improvements

Potential future improvements include:

* Real-time inventory updates
* Advanced warehouse load balancing
* Order tracking
* Pagination and filtering for large datasets
* Redis-based caching
* Swagger/OpenAPI API documentation
* Docker containerization
* CI/CD pipeline
* Advanced route optimization considering multiple logistics constraints

# 👨‍💻 Author

**Tejesh K**

Java Backend Developer | Spring Boot | REST APIs | SQL

GitHub:
https://github.com/kadam-tejesh

# 📄 License

This project is developed for educational and portfolio purposes.

