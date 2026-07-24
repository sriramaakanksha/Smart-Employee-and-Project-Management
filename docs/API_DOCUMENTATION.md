# REST API Documentation - SEMP

Base URL: `http://localhost:8080/api`

## Authentication Endpoints (`/api/auth`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/auth/login` | POST | Public | Authenticates credentials and returns JWT Bearer token |
| `/auth/register` | POST | Public | Registers a new user account / employee profile |
| `/auth/me` | GET | Authenticated | Returns current user profile details |

---

## Employee Management Endpoints (`/api/admin/employees`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/admin/employees` | GET | ADMIN / USER | Search employees with keyword, departmentId, status, and pagination |
| `/admin/employees/all` | GET | Authenticated | Get list of all active employees for selection dropdowns |
| `/admin/employees/{id}` | GET | Authenticated | Get employee by ID |
| `/admin/employees` | POST | ADMIN | Create new employee record |
| `/admin/employees/{id}` | PUT | ADMIN | Update employee details |
| `/admin/employees/{id}` | DELETE | ADMIN | Delete employee record |

---

## Project Management Endpoints (`/api/admin/projects`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/admin/projects` | GET | Authenticated | Search projects with status, priority, employeeId filters |
| `/admin/projects/{id}` | GET | Authenticated | Get project details |
| `/admin/projects` | POST | ADMIN | Create new project |
| `/admin/projects/{id}` | PUT | ADMIN | Update project details |
| `/admin/projects/{id}/assign` | PUT | ADMIN | Assign list of employee IDs to project team |
| `/admin/projects/{id}` | DELETE | ADMIN | Delete project |

---

## Task Management Endpoints (`/api/admin/tasks`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/admin/tasks` | GET | Authenticated | Search tasks with project, status, priority filters |
| `/admin/tasks` | POST | ADMIN | Create and assign task |
| `/admin/tasks/{id}` | PUT | ADMIN | Update task details |
| `/employee/tasks/{id}/status` | PATCH | Authenticated | Update task status, progress %, and add optional remark |
| `/employee/tasks/{id}/remarks` | POST | Authenticated | Post remark comment to task thread |
| `/admin/tasks/{id}` | DELETE | ADMIN | Delete task |

---

## Reports & Export Endpoints (`/api/admin/reports`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/admin/reports/employee-tasks` | GET | ADMIN | Employee task matrix report |
| `/admin/reports/project-progress` | GET | ADMIN | Project progress report |
| `/admin/reports/pending-tasks` | GET | ADMIN | Pending and overdue tasks report |
| `/admin/reports/tasks/excel` | GET | ADMIN | Download task report as formatted `.xlsx` |
| `/admin/reports/tasks/pdf` | GET | ADMIN | Download task report as formatted `.pdf` |
| `/admin/reports/projects/excel` | GET | ADMIN | Download project report as formatted `.xlsx` |
| `/admin/reports/projects/pdf` | GET | ADMIN | Download project report as formatted `.pdf` |
