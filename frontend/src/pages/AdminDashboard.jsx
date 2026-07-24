import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../api/apiServices';
import StatCard from '../components/StatCard';
import { StatusBadge, PriorityBadge } from '../components/UIComponents';
import { Users, FolderKanban, CheckSquare, Clock, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardApi.getAdminStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '4rem' }}>Loading Dashboard Metrics...</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Real-time overview of workforce, active projects, task statuses & productivity metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/reports" className="btn btn-outline">
            <TrendingUp size={16} /> View Reports
          </Link>
          <Link to="/tasks" className="btn btn-primary">
            <CheckSquare size={16} /> Manage Tasks
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard title="Total Employees" value={stats?.totalEmployees || 0} icon={Users} color="#2563eb" subtitle="Across all departments" />
        <StatCard title="Total Projects" value={stats?.totalProjects || 0} icon={FolderKanban} color="#06b6d4" subtitle={`${stats?.activeProjects || 0} Currently Active`} />
        <StatCard title="Total Tasks" value={stats?.totalTasks || 0} icon={CheckSquare} color="#8b5cf6" subtitle={`${stats?.pendingTasks || 0} Pending Action`} />
        <StatCard title="Completed Tasks" value={stats?.completedTasks || 0} icon={CheckCircle2} color="#10b981" subtitle="Fully delivered" />
        <StatCard title="Overdue Tasks" value={stats?.overdueTasks || 0} icon={AlertTriangle} color="#ef4444" subtitle="Requires attention" />
      </div>

      {/* Distribution Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Task Status Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Tasks Breakdown by Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {stats?.tasksByStatus && Object.entries(stats.tasksByStatus).map(([status, count]) => {
              const percentage = stats.totalTasks > 0 ? Math.round((count / stats.totalTasks) * 100) : 0;
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>{status.replace('_', ' ')}</span>
                    <span style={{ color: '#64748b' }}>{count} ({percentage}%)</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      backgroundColor: status === 'DONE' ? '#10b981' : status === 'IN_PROGRESS' ? '#06b6d4' : '#f59e0b'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Workforce */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Department Workforce Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.employeesByDepartment && Object.entries(stats.employeesByDepartment).map(([dept, count]) => (
              <div key={dept} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{dept}</span>
                <span className="badge badge-info">{count} Employees</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
