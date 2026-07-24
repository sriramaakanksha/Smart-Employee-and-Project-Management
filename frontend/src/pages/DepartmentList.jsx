import React, { useEffect, useState } from 'react';
import { departmentApi } from '../api/apiServices';
import { Modal } from '../components/UIComponents';
import { useToast } from '../context/ToastContext';
import { Plus, Building2, Edit, Trash2 } from 'lucide-react';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const { showToast } = useToast();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentApi.getDepartments();
      setDepartments(res.data);
    } catch (err) {
      showToast('Failed to load departments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingDept(null);
    setFormData({ name: '', code: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, code: dept.code, description: dept.description || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await departmentApi.updateDepartment(editingDept.id, formData);
        showToast('Department updated!', 'success');
      } else {
        await departmentApi.createDepartment(formData);
        showToast('Department created!', 'success');
      }
      setIsModalOpen(false);
      fetchDepartments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving department.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentApi.deleteDepartment(id);
        showToast('Department deleted.', 'success');
        fetchDepartments();
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to delete department.', 'error');
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Configure organizational units, department codes, and headcount allocations.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Create Department
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>Loading Departments...</div>
        ) : departments.length > 0 ? (
          departments.map((dept) => (
            <div key={dept.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{dept.name}</h3>
                      <code style={{ fontSize: '0.75rem', color: '#64748b' }}>{dept.code}</code>
                    </div>
                  </div>
                  <span className="badge badge-info">{dept.employeeCount} Members</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                  {dept.description || 'No description available.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => handleOpenEdit(dept)}>
                  <Edit size={14} /> Edit
                </button>
                <button className="btn btn-outline btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(dept.id)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>No departments created.</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDept ? 'Edit Department' : 'Create Department'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Department Name</label>
            <input type="text" className="form-control" placeholder="Engineering" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Department Code</label>
            <input type="text" className="form-control" placeholder="ENG" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" placeholder="Description of responsibilities..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingDept ? 'Save Changes' : 'Create Department'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentList;
