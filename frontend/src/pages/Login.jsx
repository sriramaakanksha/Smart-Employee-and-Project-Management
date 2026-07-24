import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Briefcase, Lock, User } from 'lucide-react';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ usernameOrEmail, password });
      showToast(`Welcome back, ${data.fullName || data.username}!`, 'success');
      if (data.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Please check your credentials.', 'error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      padding: '1.5rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: '1rem'
          }}>
            <Briefcase size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Sign In to SEMP</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Smart Employee & Project Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="admin@semp.com or john.doe"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
              />
              <User size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          Don't have an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Register Here</Link>
        </div>

        <div style={{
          marginTop: '1.5rem',
          padding: '0.875rem',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          <strong>Quick Autofill Demo Credentials:</strong><br />
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => { setUsernameOrEmail('admin@semp.com'); setPassword('admin123'); }}
              style={{ textAlign: 'left', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '0.35rem 0.5rem', color: '#1e40af', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
            >
              👑 Fill Admin: admin@semp.com / admin123
            </button>
            <button
              type="button"
              onClick={() => { setUsernameOrEmail('john.doe@semp.com'); setPassword('user123'); }}
              style={{ textAlign: 'left', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '0.35rem 0.5rem', color: '#166534', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
            >
              👤 Fill Employee: john.doe@semp.com / user123
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
