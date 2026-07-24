import React, { useEffect, useState } from 'react';
import { taskApi, projectApi, employeeApi } from '../api/apiServices';
import { Modal, Pagination, StatusBadge, PriorityBadge } from '../components/UIComponents';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus, Search, MessageSquare, Edit, Trash2, Send, CheckCircle2 } from 'lucide-react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [pageInfo, setPageInfo] = useState({ pageNo: 0, totalPages: 0 });
  
  // Filters
  const [keyword, setKeyword] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [newRemark, setNewRemark] = useState('');

  const [formData, setFormData] = useState({
    taskCode: '',
    title: '',
    description: '',
    projectId: '',
    assignedEmployeeId: '',
    status: 'TODO',
    priority: 'MEDIUM',
    progressPercentage: 0,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchTasks(pageInfo.pageNo);
  }, [keyword, selectedProject, selectedEmployee, selectedStatus, selectedPriority]);

  const fetchOptions = async () => {
    try {
      const [projRes, empRes] = await Promise.all([
        projectApi.getAllProjects(),
        employeeApi.getAllEmployees(),
      ]);
      setProjects(projRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async (page = 0) => {
    setLoading(true);
    try {
      const res = await taskApi.getTasks({
        keyword,
        projectId: selectedProject || null,
        assignedEmployeeId: selectedEmployee || null,
        status: selectedStatus || null,
        priority: selectedPriority || null,
        page,
        size: 10,
      });
      setTasks(res.data.content);
      setPageInfo({ pageNo: res.data.pageNo, totalPages: res.data.totalPages });
    } catch (err) {
      showToast('Failed to load tasks.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingTask(null);
    setFormData({
      taskCode: `TSK-${Math.floor(5000 + Math.random() * 5000)}`,
      title: '',
      description: '',
      projectId: projects[0]?.id || '',
      assignedEmployeeId: employees[0]?.id || '',
      status: 'TODO',
      priority: 'MEDIUM',
      progressPercentage: 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTask(t);
    setFormData({
      taskCode: t.taskCode,
      title: t.title,
      description: t.description || '',
      projectId: t.projectId || '',
      assignedEmployeeId: t.assignedEmployeeId || '',
      status: t.status,
      priority: t.priority,
      progressPercentage: t.progressPercentage || 0,
      dueDate: t.dueDate || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenRemarks = (t) => {
    setViewingTask(t);
    setNewRemark('');
    setIsRemarkModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskApi.updateTask(editingTask.id, formData);
        showToast('Task updated successfully!', 'success');
      } else {
        await taskApi.createTask(formData);
        showToast('Task created & assigned!', 'success');
      }
      setIsModalOpen(false);
      fetchTasks(pageInfo.pageNo);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving task.', 'error');
    }
  };

  const handleAddRemarkSubmit = async (e) => {
    e.preventDefault();
    if (!newRemark.trim()) return;
    try {
      const res = await taskApi.addRemark(viewingTask.id, { content: newRemark });
      showToast('Remark added!', 'success');
      setViewingTask(prev => ({
        ...prev,
        remarks: [res.data, ...(prev.remarks || [])]
      }));
      setNewRemark('');
    } catch (err) {
      showToast('Failed to post remark.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(id);
        showToast('Task deleted.', 'success');
        fetchTasks(pageInfo.pageNo);
      } catch (err) {
        showToast('Failed to delete task.', 'error');
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Management & Board</h1>
          <p className="page-subtitle">Assign tasks, track progress percentages, and audit activity remarks.</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Create Task
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search tasks..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>

          <select
            className="form-control form-select"
            style={{ width: '180px' }}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            className="form-control form-select"
            style={{ width: '180px' }}
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">All Assignees</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.fullName}</option>
            ))}
          </select>

          <select
            className="form-control form-select"
            style={{ width: '140px' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="IN_REVIEW">IN REVIEW</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
      </div>

      {/* Task Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Task Code</th>
              <th>Title</th>
              <th>Project</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>Loading Tasks...</td></tr>
            ) : tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td><code>{task.taskCode}</code></td>
                  <td style={{ fontWeight: 600 }}>{task.title}</td>
                  <td>{task.projectName || 'N/A'}</td>
                  <td>{task.assignedEmployeeName || 'Unassigned'}</td>
                  <td><PriorityBadge priority={task.priority} /></td>
                  <td><StatusBadge status={task.status} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '50px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${task.progressPercentage}%`, height: '100%', backgroundColor: '#2563eb' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{task.progressPercentage}%</span>
                    </div>
                  </td>
                  <td>{task.dueDate || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="btn btn-outline btn-sm" title="View Remarks & History" onClick={() => handleOpenRemarks(task)}>
                        <MessageSquare size={14} />
                      </button>
                      {isAdmin && (
                        <>
                          <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(task)}>
                            <Edit size={14} />
                          </button>
                          <button className="btn btn-outline btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(task.id)}>
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No tasks found matching query filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        pageNo={pageInfo.pageNo}
        totalPages={pageInfo.totalPages}
        onPageChange={(page) => fetchTasks(page)}
      />

      {/* Create / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTask ? 'Edit Task' : 'Create New Task'}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Task Code</label>
              <input type="text" className="form-control" value={formData.taskCode} onChange={(e) => setFormData({...formData, taskCode: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input type="text" className="form-control" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Associated Project</label>
              <select className="form-control form-select" value={formData.projectId} onChange={(e) => setFormData({...formData, projectId: e.target.value})} required>
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Employee</label>
              <select className="form-control form-select" value={formData.assignedEmployeeId} onChange={(e) => setFormData({...formData, assignedEmployeeId: e.target.value})}>
                <option value="">Unassigned</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.fullName} ({e.departmentName || 'General'})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control form-select" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="DONE">DONE</option>
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
              <label className="form-label">Due Date</label>
              <input type="date" className="form-control" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingTask ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </Modal>

      {/* Remarks Thread Modal */}
      <Modal isOpen={isRemarkModalOpen} onClose={() => setIsRemarkModalOpen(false)} title={`Remarks Thread: ${viewingTask?.taskCode}`}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{viewingTask?.title}</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>{viewingTask?.description}</p>

          <form onSubmit={handleAddRemarkSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Type a remark or progress note..."
              value={newRemark}
              onChange={(e) => setNewRemark(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Post
            </button>
          </form>

          <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {viewingTask?.remarks?.length > 0 ? (
              viewingTask.remarks.map((r) => (
                <div key={r.id} style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid #2563eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                    <span>{r.authorName} ({r.authorRole?.replace('ROLE_', '')})</span>
                    <span>{new Date(r.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#0f172a' }}>{r.content}</div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '1rem' }}>No remarks posted yet.</div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskList;
