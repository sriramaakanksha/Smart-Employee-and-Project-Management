import React, { useEffect, useState } from 'react';
import { reportApi, employeeApi } from '../api/apiServices';
import { StatusBadge, PriorityBadge } from '../components/UIComponents';
import { useToast } from '../context/ToastContext';
import { FileSpreadsheet, FileText, Download, Filter, BarChart3, CheckSquare, Clock } from 'lucide-react';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('employee'); // employee, project, pending
  const [reportData, setReportData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [activeTab, selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const res = await employeeApi.getAllEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'employee') {
        const res = await reportApi.getEmployeeTasks(selectedEmployee || null);
        setReportData(res.data);
      } else if (activeTab === 'project') {
        const res = await reportApi.getProjectProgress();
        setReportData(res.data);
      } else if (activeTab === 'pending') {
        const res = await reportApi.getPendingTasks();
        setReportData(res.data);
      }
    } catch (err) {
      showToast('Failed to generate report data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      showToast('Preparing Excel export...', 'info');
      let res;
      if (activeTab === 'project') {
        res = await reportApi.exportProjectsExcel();
      } else {
        res = await reportApi.exportTasksExcel(selectedEmployee || null);
      }
      downloadBlob(res.data, `${activeTab}_report_${Date.now()}.xlsx`);
      showToast('Excel report downloaded successfully!', 'success');
    } catch (err) {
      showToast('Excel export failed.', 'error');
    }
  };

  const handleExportPdf = async () => {
    try {
      showToast('Preparing PDF export...', 'info');
      let res;
      if (activeTab === 'project') {
        res = await reportApi.exportProjectsPdf();
      } else {
        res = await reportApi.exportTasksPdf(selectedEmployee || null);
      }
      downloadBlob(res.data, `${activeTab}_report_${Date.now()}.pdf`);
      showToast('PDF report downloaded successfully!', 'success');
    } catch (err) {
      showToast('PDF export failed.', 'error');
    }
  };

  const downloadBlob = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Audit Analytics</h1>
          <p className="page-subtitle">Export employee-wise task matrices, project completion ratios, and overdue task reports in PDF/Excel.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline" style={{ color: '#10b981', borderColor: '#a7f3d0' }} onClick={handleExportExcel}>
            <FileSpreadsheet size={16} /> Export to Excel
          </button>
          <button className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#fca5a5' }} onClick={handleExportPdf}>
            <FileText size={16} /> Export to PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          className={`btn ${activeTab === 'employee' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('employee')}
        >
          <CheckSquare size={16} /> Employee-wise Task Report
        </button>
        <button
          className={`btn ${activeTab === 'project' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('project')}
        >
          <BarChart3 size={16} /> Project Progress Report
        </button>
        <button
          className={`btn ${activeTab === 'pending' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('pending')}
        >
          <Clock size={16} /> Pending & Overdue Tasks Report
        </button>
      </div>

      {/* Employee Filter when in Employee tab */}
      {activeTab === 'employee' && (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Filter by Employee:</span>
            <select
              className="form-control form-select"
              style={{ width: '260px' }}
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">All Employees (Full Company)</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.fullName} ({e.employeeCode})</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="table-container">
        {activeTab === 'project' ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Code</th>
                <th>Project Name</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Budget</th>
                <th>Total Tasks</th>
                <th>Completed Tasks</th>
                <th>Overall Progress</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Generating Project Analytics...</td></tr>
              ) : reportData.length > 0 ? (
                reportData.map((p) => (
                  <tr key={p.id}>
                    <td><code>{p.projectCode}</code></td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td><PriorityBadge priority={p.priority} /></td>
                    <td>${p.budget?.toLocaleString() || 0}</td>
                    <td>{p.totalTasks}</td>
                    <td>{p.completedTasks}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '60px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${p.progressPercentage}%`, height: '100%', backgroundColor: '#06b6d4' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{p.progressPercentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No projects available for report.</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Task Code</th>
                <th>Title</th>
                <th>Project</th>
                <th>Assigned Employee</th>
                <th>Department</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Generating Task Analytics...</td></tr>
              ) : reportData.length > 0 ? (
                reportData.map((t) => (
                  <tr key={t.id}>
                    <td><code>{t.taskCode}</code></td>
                    <td style={{ fontWeight: 600 }}>{t.title}</td>
                    <td>{t.projectName}</td>
                    <td>{t.assignedEmployeeName || 'Unassigned'}</td>
                    <td>{t.departmentName || 'N/A'}</td>
                    <td><StatusBadge status={t.status} /></td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td>{t.dueDate || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No task records found for this report view.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
