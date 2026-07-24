import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, FolderKanban, CheckSquare, BarChart3, Building2 } from 'lucide-react';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      path: isAdmin ? '/admin/dashboard' : '/employee/dashboard',
      icon: LayoutDashboard,
    },
    ...(isAdmin ? [{ name: 'Employees', path: '/admin/employees', icon: Users }] : []),
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    ...(isAdmin ? [{ name: 'Reports', path: '/admin/reports', icon: BarChart3 }] : []),
    ...(isAdmin ? [{ name: 'Departments', path: '/admin/departments', icon: Building2 }] : []),
  ];

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--bg-sidebar)',
      color: 'var(--text-muted)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      flexShrink: 0,
      borderRight: '1px solid var(--border-color)',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <div style={{ marginBottom: '2rem', paddingLeft: '0.75rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
        Main Menu
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              })}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
