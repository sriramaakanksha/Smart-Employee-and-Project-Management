import React, { useEffect, useState } from 'react';
import { employeeApi, departmentApi } from '../api/apiServices';
import { Modal, Pagination, StatusBadge } from '../components/UIComponents';
import { useToast } from '../context/ToastContext';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pageInfo, setPageInfo] = useState({ pageNo: 0, totalPages: 0, totalElements: 0 });
  const [keyword, setKeyword] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: '',
    departmentId: '',
    salary: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    createAccount: true,
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchEmployees(pageInfo.pageNo);
  }, [keyword, selectedDept, selectedStatus]);

  const fetchDepartments = async () => {
    try {
      const res = await departmentApi.getDepartments();
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async (page = 0) => {
    setLoading(true);
    try {
      const res = await employeeApi.getEmployees({
        keyword,
        departmentId: selectedDept || null,
        status: selectedStatus || null,
        page,
        size: 8,
      });
      setEmployees(res.data.content);
      setPageInfo({
        pageNo: res.data.pageNo,
        totalPages: res.data.totalPages,
        totalElements: res.data.totalElements,
      });
    } catch (err) {
      showToast('Failed to load employees.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingEmp(null);
    setFormData({
      employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      designation: 'Software Developer',
      departmentId: departments[0]?.id || '',
      salary: '85000',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      createAccount: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmp(emp);
    setFormData({
      employeeCode: emp.employeeCode,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone || '',
      designation: emp.designation,
      departmentId: emp.departmentId || '',
      salary: emp.salary || '',
      joinDate: emp.joinDate || new Date().toISOString().split('T')[0],
      status: emp.status,
      createAccount: false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmp) {
        await employeeApi.updateEmployee(editingEmp.id, formData);
        showToast('Employee updated successfully!', 'success');
      } else {
        await employeeApi.createEmployee(formData);
        showToast('Employee created successfully!', 'success');
      }
      setIsModalOpen(false);
      fetchEmployees(pageInfo.pageNo);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving employee details.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee record?')) {
      try {
        await employeeApi.deleteEmployee(id);
        showToast('Employee deleted.', 'success');
        fetchEmployees(pageInfo.pageNo);
      } catch (err) {
        showToast('Failed to delete employee.', 'error');
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Directory</h1>
          <p className="page-subtitle">Manage workforce records, department allocations, and credentials.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add New Employee
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by name, email, designation..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>

          <select
            className="form-control form-select"
            style={{ width: '200px' }}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            className="form-control form-select"
            style={{ width: '160px' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="ON_LEAVE">ON LEAVE</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading Employees...</td></tr>
            ) : employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td><code>{emp.employeeCode}</code></td>
                  <td style={{ fontWeight: 600 }}>{emp.fullName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.departmentName || 'N/A'}</td>
                  <td><StatusBadge status={emp.status} /></td>
                  <td>{emp.joinDate}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(emp)}>
                        <Edit size={14} />
                      </button>
                      <button className="btn btn-outline btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(emp.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No employees found matching criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        pageNo={pageInfo.pageNo}
        totalPages={pageInfo.totalPages}
        onPageChange={(page) => fetchEmployees(page)}
      />

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEmp ? 'Edit Employee Record' : 'Add New Employee'}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Employee Code</label>
              <input type="text" className="form-control" value={formData.employeeCode} onChange={(e) => setFormData({...formData, employeeCode: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input type="text" className="form-control" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" className="form-control" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-control form-select" value={formData.departmentId} onChange={(e) => setFormData({...formData, departmentId: e.target.value})} required>
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Annual Salary ($)</label>
              <input type="number" className="form-control" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingEmp ? 'Save Changes' : 'Create Employee'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeList;
