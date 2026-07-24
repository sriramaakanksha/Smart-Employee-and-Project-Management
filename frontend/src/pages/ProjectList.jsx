import React, { useEffect, useState } from 'react';
import { projectApi, employeeApi } from '../api/apiServices';
import { Modal, Pagination, StatusBadge, PriorityBadge } from '../components/UIComponents';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus, Search, Users, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [pageInfo, setPageInfo] = useState({ pageNo: 0, totalPages: 0 });
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [assigningProject, setAssigningProject] = useState(null);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const [formData, setFormData] = useState({
    projectCode: '',
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    budget: '50000',
  });

  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchProjects(pageInfo.pageNo);
  }, [keyword, selectedStatus, selectedPriority]);

  const fetchEmployees = async () => {
    try {
      const res = await employeeApi.getAllEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async (page = 0) => {
    setLoading(true);
    try {
      const res = await projectApi.getProjects({
        keyword,
        status: selectedStatus || null,
        priority: selectedPriority || null,
        page,
        size: 6,
      });
      setProjects(res.data.content);
      setPageInfo({ pageNo: res.data.pageNo, totalPages: res.data.totalPages });
    } catch (err) {
      showToast('Failed to load projects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      projectCode: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'NOT_STARTED',
      priority: 'MEDIUM',
      budget: '75000',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProject(p);
    setFormData({
      projectCode: p.projectCode,
      name: p.name,
      description: p.description || '',
      startDate: p.startDate,
      endDate: p.endDate || '',
      status: p.status,
      priority: p.priority,
      budget: p.budget || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenAssign = (p) => {
    setAssigningProject(p);
    setSelectedEmployeeIds(p.assignedEmployees?.map(e => e.id) || []);
    setIsAssignModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectApi.updateProject(editingProject.id, formData);
        showToast('Project updated!', 'success');
      } else {
        await projectApi.createProject(formData);
        showToast('Project created!', 'success');
      }
      setIsModalOpen(false);
      fetchProjects(pageInfo.pageNo);
    } catch (err) {
      showToast('Error saving project.', 'error');
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectApi.assignEmployees(assigningProject.id, selectedEmployeeIds);
      showToast('Team members assigned successfully!', 'success');
      setIsAssignModalOpen(false);
      fetchProjects(pageInfo.pageNo);
    } catch (err) {
      showToast('Failed to update team assignments.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await projectApi.deleteProject(id);
        showToast('Project deleted.', 'success');
        fetchProjects(pageInfo.pageNo);
      } catch (err) {
        showToast('Failed to delete project.', 'error');
      }
    }
  };

  const toggleEmployeeSelection = (empId) => {
    setSelectedEmployeeIds(prev => 
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Management</h1>
          <p className="page-subtitle">Track project timelines, employee assignments, and progress budgets.</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Create Project
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search projects..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>

          <select
            className="form-control form-select"
            style={{ width: '180px' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="NOT_STARTED">NOT STARTED</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="ON_HOLD">ON HOLD</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <select
            className="form-control form-select"
            style={{ width: '160px' }}
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>Loading Projects...</div>
        ) : projects.length > 0 ? (
          projects.map((p) => (
            <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <code style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.projectCode}</code>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{p.name}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <StatusBadge status={p.status} />
                    <PriorityBadge priority={p.priority} />
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {p.description || 'No description provided.'}
                </p>

                {/* Progress bar */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                    <span>Progress ({p.completedTasks}/{p.totalTasks} Tasks)</span>
                    <span>{p.progressPercentage}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${p.progressPercentage}%`, height: '100%', backgroundColor: '#2563eb' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} /> {p.startDate} to {p.endDate || 'Ongoing'}
                  </div>
                  {p.budget && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <DollarSign size={14} /> ${p.budget.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Assigned Team */}
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                  <strong>Assigned Team ({p.assignedEmployees?.length || 0}):</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                    {p.assignedEmployees?.slice(0, 4).map((emp) => (
                      <span key={emp.id} style={{ padding: '0.2rem 0.5rem', backgroundColor: '#f1f5f9', borderRadius: '4px', fontWeight: 600 }}>
                        {emp.fullName}
                      </span>
                    ))}
                    {p.assignedEmployees?.length > 4 && (
                      <span style={{ padding: '0.2rem 0.5rem', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '4px', fontWeight: 600 }}>
                        +{p.assignedEmployees.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', pt: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => handleOpenAssign(p)} style={{ flex: 1 }}>
                    <Users size={14} /> Assign Team
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(p)}>
                    <Edit size={14} />
                  </button>
                  <button className="btn btn-outline btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(p.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>
            No projects found.
          </div>
        )}
      </div>

      <Pagination
        pageNo={pageInfo.pageNo}
        totalPages={pageInfo.totalPages}
        onPageChange={(page) => fetchProjects(page)}
      />

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'Edit Project' : 'Create New Project'}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Project Code</label>
              <input type="text" className="form-control" value={formData.projectCode} onChange={(e) => setFormData({...formData, projectCode: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input type="date" className="form-control" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Target End Date</label>
              <input type="date" className="form-control" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control form-select" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="NOT_STARTED">NOT_STARTED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="ON_HOLD">ON_HOLD</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-control form-select" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Budget ($)</label>
              <input type="number" className="form-control" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingProject ? 'Save Changes' : 'Create Project'}</button>
          </div>
        </form>
      </Modal>

      {/* Assign Team Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={`Assign Team: ${assigningProject?.name}`}>
        <form onSubmit={handleAssignSubmit}>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
            Select employees to assign to this project:
          </p>
          <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {employees.map((emp) => (
              <label key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedEmployeeIds.includes(emp.id)}
                  onChange={() => toggleEmployeeSelection(emp.id)}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{emp.fullName} ({emp.employeeCode})</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.designation} • {emp.departmentName || 'General'}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsAssignModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Team Assignments</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectList;
