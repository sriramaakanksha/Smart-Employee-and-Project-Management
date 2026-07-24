# User Manual & Role Guide - SEMP

Welcome to the **Smart Employee & Project Management System (SEMP)** user manual.

## 1. System Access & Roles

SEMP provides role-based access control (RBAC):

### Admin Account
- **Default Username / Email**: `admin@semp.com`
- **Default Password**: `admin123`
- **Capabilities**:
  - Full CRUD on Employees, Departments, Projects, Tasks
  - Team assignment to Projects
  - Executive Dashboard view across all departments
  - Generate and download PDF & Excel reports

### Employee Account
- **Default Username / Email**: `john.doe@semp.com`
- **Default Password**: `user123`
- **Capabilities**:
  - Personal Work Dashboard
  - View assigned projects and assigned tasks
  - Update task progress percentage (0-100%) and change task statuses
  - Post remarks on assigned task threads

---

## 2. Step-by-Step Feature Walkthrough

### Managing Employees (Admin)
1. Navigate to **Employees** from the sidebar.
2. Use the search bar to filter by name, email, or designation.
3. Click **Add New Employee**, fill out the required details, and toggle **Create Account** to generate login credentials for the employee.

### Managing Projects & Teams (Admin)
1. Navigate to **Projects**.
2. Click **Create Project**, specify project code, name, dates, priority, and budget.
3. Click **Assign Team** on any project card to select employees assigned to the project.

### Managing Tasks & Remarks
1. Navigate to **Tasks**.
2. Click **Create Task** to assign a task to an employee under a specific project with a due date.
3. Employees can click **Update Status** on their dashboard or tasks page to move tasks from `TODO` ➔ `IN_PROGRESS` ➔ `DONE` and record progress notes.

### Generating PDF & Excel Reports (Admin)
1. Navigate to **Reports** from the sidebar.
2. Switch between **Employee-wise Task Report**, **Project Progress Report**, and **Pending Tasks Report**.
3. Click **Export to Excel** or **Export to PDF** to download formatted report documents.
