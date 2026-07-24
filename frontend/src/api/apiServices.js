import api from './axiosConfig';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const employeeApi = {
  getEmployees: (params) => api.get('/common/employees', { params }),
  getAllEmployees: () => api.get('/common/employees/all'),
  getEmployeeById: (id) => api.get(`/common/employees/${id}`),
  createEmployee: (data) => api.post('/admin/employees', data),
  updateEmployee: (id, data) => api.put(`/admin/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/admin/employees/${id}`),
};

export const projectApi = {
  getProjects: (params) => api.get('/employee/projects', { params }),
  getAllProjects: () => api.get('/common/projects/all'),
  getProjectById: (id) => api.get(`/employee/projects/${id}`),
  createProject: (data) => api.post('/admin/projects', data),
  updateProject: (id, data) => api.put(`/admin/projects/${id}`, data),
  assignEmployees: (id, employeeIds) => api.put(`/admin/projects/${id}/assign`, employeeIds),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`),
};

export const taskApi = {
  getTasks: (params) => api.get('/employee/tasks', { params }),
  getAllTasks: () => api.get('/common/tasks/all'),
  getTaskById: (id) => api.get(`/employee/tasks/${id}`),
  createTask: (data) => api.post('/admin/tasks', data),
  updateTask: (id, data) => api.put(`/admin/tasks/${id}`, data),
  updateTaskStatus: (id, data) => api.patch(`/employee/tasks/${id}/status`, data),
  addRemark: (id, data) => api.post(`/employee/tasks/${id}/remarks`, data),
  deleteTask: (id) => api.delete(`/admin/tasks/${id}`),
};

export const departmentApi = {
  getDepartments: () => api.get('/common/departments'),
  getDepartmentById: (id) => api.get(`/admin/departments/${id}`),
  createDepartment: (data) => api.post('/admin/departments', data),
  updateDepartment: (id, data) => api.put(`/admin/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),
};

export const dashboardApi = {
  getAdminStats: () => api.get('/admin/dashboard'),
  getEmployeeStats: () => api.get('/employee/dashboard'),
};

export const reportApi = {
  getEmployeeTasks: (employeeId) => api.get('/admin/reports/employee-tasks', { params: { employeeId } }),
  getProjectProgress: () => api.get('/admin/reports/project-progress'),
  getPendingTasks: () => api.get('/admin/reports/pending-tasks'),
  
  exportTasksExcel: (employeeId) => api.get('/admin/reports/tasks/excel', { params: { employeeId }, responseType: 'blob' }),
  exportTasksPdf: (employeeId) => api.get('/admin/reports/tasks/pdf', { params: { employeeId }, responseType: 'blob' }),
  exportProjectsExcel: () => api.get('/admin/reports/projects/excel', { responseType: 'blob' }),
  exportProjectsPdf: () => api.get('/admin/reports/projects/pdf', { responseType: 'blob' }),
};


