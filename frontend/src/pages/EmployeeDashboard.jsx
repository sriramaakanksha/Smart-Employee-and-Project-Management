import React, { useEffect, useState } from 'react';
import { dashboardApi, taskApi } from '../api/apiServices';
import StatCard from '../components/StatCard';
import { StatusBadge, PriorityBadge } from '../components/UIComponents';
import { CheckSquare, Clock, CheckCircle2, FolderKanban, MessageSquare } from 'lucide-react';
import { Modal } from '../components/UIComponents';
import { useToast } from '../context/ToastContext';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: 'IN_PROGRESS', progressPercentage: 50, remarkContent: '' });
  const { showToast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardApi.getEmployeeStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (task) => {
    setSelectedTask(task);
    setStatusUpdate({
      status: task.status,
      progressPercentage: task.progressPercentage || 0,
      remarkContent: ''
    });
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      await taskApi.updateTaskStatus(selectedTask.id, statusUpdate);
      showToast('Task progress updated successfully!', 'success');
      setSelectedTask(null);
      fetchStats();
    } catch (err) {
      showToast('Failed to update task progress.', 'error');
    }
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '4rem' }}>Loading Workspace...</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Work Dashboard</h1>
          <p className="page-subtitle">Track assigned tasks, update progress, and review upcoming project deadlines.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard title="Assigned Tasks" value={stats?.totalTasks || 0} icon={CheckSquare} color="#2563eb" />
        <StatCard title="Pending Tasks" value={stats?.pendingTasks || 0} icon={Clock} color="#f59e0b" />
        <StatCard title="Completed Tasks" value={stats?.completedTasks || 0} icon={CheckCircle2} color="#10b981" />
        <StatCard title="Active Projects" value={stats?.myAssignedProjects?.length || 0} icon={FolderKanban} color="#06b6d4" />
      </div>

      {/* My Tasks Table */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>My Assigned Tasks</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Task Title</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats?.myAssignedTasks?.length > 0 ? (
                stats.myAssignedTasks.map((task) => (
                  <tr key={task.id}>
                    <td><code>{task.taskCode}</code></td>
                    <td style={{ fontWeight: 600 }}>{task.title}</td>
                    <td>{task.projectName}</td>
                    <td><PriorityBadge priority={task.priority} /></td>
                    <td><StatusBadge status={task.status} /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '60px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${task.progressPercentage}%`, height: '100%', backgroundColor: '#2563eb' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{task.progressPercentage}%</span>
                      </div>
                    </td>
                    <td>{task.dueDate || 'N/A'}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => handleUpdateClick(task)}>
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                    No tasks currently assigned to you.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Updating Progress */}
      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title={`Update Task: ${selectedTask?.taskCode}`}>
        <form onSubmit={handleStatusSubmit}>
          <div className="form-group">
            <label className="form-label">Task Status</label>
            <select
              className="form-control form-select"
              value={statusUpdate.status}
              onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="IN_REVIEW">IN_REVIEW</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Progress ({statusUpdate.progressPercentage}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              className="form-control"
              value={statusUpdate.progressPercentage}
              onChange={(e) => setStatusUpdate({ ...statusUpdate, progressPercentage: parseInt(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Add Remark / Progress Update</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Completed API integration layer..."
              value={statusUpdate.remarkContent}
              onChange={(e) => setStatusUpdate({ ...statusUpdate, remarkContent: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '1.5rem', backgroundColor: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setSelectedTask(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Progress</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;
