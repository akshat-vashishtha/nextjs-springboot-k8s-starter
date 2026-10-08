# User Service (Spring Boot & MongoDB)

A Spring Boot 3.3 RESTful service providing complete CRUD capabilities for `User` entities with MongoDB persistence, Java 21 records, and clean architecture.

---

## Tech Stack
- **Java 21 (LTS)**
- **Spring Boot 3.3.4**
- **Spring Data MongoDB**
- **Jakarta Bean Validation**
- **Maven**
- **Docker**

---

## Quick Start

### 1. Prerequisites
- Java 21+
- Local MongoDB running on `localhost:27017` (database: `user_db`)

### 2. Run Locally
```bash
mvn spring-boot:run
```
The service will start on `http://localhost:8080`.

> **Note on Data Seeding:**  
> On startup, `DataSeeder` automatically inserts 20 diverse users if the `users` collection is empty.

---

## API Endpoints & cURL Requests

### 1. Get All Users
Fetches the complete list of users stored in the database.

```bash
curl -X GET http://localhost:8080/api/v1/users
```

---

### 2. Get User by ID
Fetches a single user by MongoDB ObjectId.

```bash
curl -X GET http://localhost:8080/api/v1/users/<USER_ID>
```

**Example:**
```bash
curl -X GET http://localhost:8080/api/v1/users/67038e8a1b2c3d4e5f6a7b8c
```

---

### 3. Create User
Creates a new user. Status defaults to `ACTIVE`.

- **Valid Roles:** `ADMIN`, `USER`, `MANAGER`

```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bruce Wayne",
    "email": "bruce.wayne@waynecorp.com",
    "role": "ADMIN"
  }'
```

---

### 4. Update User
Updates an existing user's details (`name`, `role`, `status`).

- **Valid Roles:** `ADMIN`, `USER`, `MANAGER`
- **Valid Statuses:** `ACTIVE`, `INACTIVE`, `SUSPENDED`

```bash
curl -X PUT http://localhost:8080/api/v1/users/<USER_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bruce Wayne (Updated)",
    "role": "ADMIN",
    "status": "ACTIVE"
  }'
```

**Example:**
```bash
curl -X PUT http://localhost:8080/api/v1/users/67038e8a1b2c3d4e5f6a7b8c \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bruce Wayne (Updated)",
    "role": "ADMIN",
    "status": "ACTIVE"
  }'
```

---

### 5. Delete User
Deletes a user by their MongoDB ObjectId.

```bash
curl -X DELETE http://localhost:8080/api/v1/users/<USER_ID>
```

**Example:**
```bash
curl -X DELETE http://localhost:8080/api/v1/users/67038e8a1b2c3d4e5f6a7b8c
```

---

## Error Handling Format

All error responses return a standardized payload:

```json
{
  "timestamp": "2026-10-07T07:45:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for one or more fields",
  "path": "/api/v1/users",
  "fieldErrors": {
    "email": "Email must be a valid email address",
    "name": "Name is required"
  }
}
```

---

## Build Docker Image

```bash
docker build -t user-service:latest .
docker run -p 8080:8080 --network host user-service:latest
```
