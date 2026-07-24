import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <AlertCircle size={64} style={{ color: '#ef4444', marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>404 - Page Not Found</h1>
      <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">Return to Dashboard</Link>
    </div>
  );
};

export default NotFound;
