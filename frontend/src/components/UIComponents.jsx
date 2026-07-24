import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export const Pagination = ({ pageNo, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
      <button
        className="btn btn-outline btn-sm"
        disabled={pageNo === 0}
        onClick={() => onPageChange(pageNo - 1)}
      >
        Previous
      </button>
      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', padding: '0 0.5rem' }}>
        Page {pageNo + 1} of {totalPages}
      </span>
      <button
        className="btn btn-outline btn-sm"
        disabled={pageNo >= totalPages - 1}
        onClick={() => onPageChange(pageNo + 1)}
      >
        Next
      </button>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const getBadgeClass = (st) => {
    switch (st) {
      case 'DONE':
      case 'COMPLETED':
      case 'ACTIVE':
        return 'badge-success';
      case 'IN_PROGRESS':
      case 'IN_REVIEW':
        return 'badge-info';
      case 'TODO':
      case 'NOT_STARTED':
      case 'ON_HOLD':
        return 'badge-warning';
      case 'CANCELLED':
      case 'INACTIVE':
      case 'ON_LEAVE':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  return <span className={`badge ${getBadgeClass(status)}`}>{status?.replace('_', ' ')}</span>;
};

export const PriorityBadge = ({ priority }) => {
  const getBadgeClass = (p) => {
    switch (p) {
      case 'URGENT':
      case 'HIGH':
        return 'badge-danger';
      case 'MEDIUM':
        return 'badge-warning';
      case 'LOW':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  };

  return <span className={`badge ${getBadgeClass(priority)}`}>{priority}</span>;
};
