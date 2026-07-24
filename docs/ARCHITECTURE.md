# System Architecture & Security Documentation

The **Smart Employee & Project Management System (SEMP)** is built following enterprise layered architecture patterns.

## 1. System Architecture Overview

```
[ ReactJS Frontend (Vite) ]  <--- HTTP/JSON REST & Bearer Token --->  [ Spring Boot Backend ]
   │ (Port 5173 / Proxy)                                                   │ (Port 8080)
   ├── Auth Context & Jwt Axios Interceptor                                ├── SecurityFilterChain & JwtFilter
   ├── Admin / Employee Dashboards                                         ├── Layered Controllers & DTOs
   ├── Employee, Project & Task Modules                                    ├── Service Layer & Repositories
   └── PDF & Excel Downloader                                              └── Database (H2 / MySQL)
```

## 2. Layered Backend Design

1. **Controller Layer (`com.semp.controller`)**: Exposes RESTful endpoints. Validates incoming requests via `@Valid` and returns strongly-typed response DTOs.
2. **DTO Layer (`com.semp.dto`)**: Separates internal JPA entity representations from public API contracts for security and payload optimization.
3. **Service Layer (`com.semp.service`)**: Encapsulates core business rules, status updates, team assignment validations, and report compilation.
4. **Data Access Layer (`com.semp.repository`)**: Utilizes Spring Data JPA repositories with custom JPQL queries and pagination support.
5. **Security & JWT (`com.semp.security`)**: Intercepts HTTP requests, validates JWT signatures statelessly, and enforces Role-Based Access Control (RBAC).

## 3. Database Entity Relationship Diagram (ERD)

- **`Department` (1) ─── (N) `Employee`**: One department houses multiple employees.
- **`User` (1) ─── (0..1) `Employee`**: Optional 1-to-1 connection linking user login accounts to employee HR profiles.
- **`Project` (M) ─── (N) `Employee`**: Many-to-Many team assignment stored in `project_employees` join table.
- **`Project` (1) ─── (N) `Task`**: One project contains multiple tasks.
- **`Employee` (1) ─── (N) `Task`**: Tasks are assigned to specific employees.
- **`Task` (1) ─── (N) `Remark`**: A task maintains a chronologically ordered audit trail of discussion remarks.

## 4. Security Framework & JWT Flow

1. User sends POST request to `/api/auth/login` with `usernameOrEmail` and `password`.
2. Spring Security `AuthenticationManager` verifies credentials against BCrypt password hashes in the database.
3. Upon authentication success, `JwtTokenProvider` signs a stateless HS256 JWT containing user ID, username, and role.
4. React frontend stores the JWT in `localStorage` and automatically attaches `Authorization: Bearer <token>` on all outgoing Axios requests.
5. `JwtAuthenticationFilter` intercepts requests, extracts the JWT, verifies its signature and expiration, and populates `SecurityContextHolder`.
6. Endpoint access is guarded by `@PreAuthorize("hasRole('ADMIN')")` and URL path matchers.
