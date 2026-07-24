import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = '#2563eb', subtitle }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '12px',
        backgroundColor: `${color}15`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {Icon && <Icon size={26} />}
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>{title}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{value}</div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatCard;
