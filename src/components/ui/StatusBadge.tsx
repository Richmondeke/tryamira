import React from 'react';

export type BadgeStatus =
  | 'qualified'
  | 'unqualified'
  | 'in_progress'
  | 'completed'
  | 'pending'
  | 'escalated'
  | 'active'
  | 'paused'
  | 'scheduled'
  | 'converted'
  | 'contacted'
  | 'new'
  | 'failed';

interface StatusBadgeProps {
  status: BadgeStatus | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const BADGE_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  qualified: { bg: '#10b98115', text: '#059669', dot: '#10b981', label: 'Qualified' },
  converted: { bg: '#10b98115', text: '#059669', dot: '#10b981', label: 'Converted' },
  active: { bg: '#10b98115', text: '#059669', dot: '#10b981', label: 'Active' },
  completed: { bg: '#10b98115', text: '#059669', dot: '#10b981', label: 'Completed' },
  
  in_progress: { bg: '#1b5a9215', text: '#1b5a92', dot: '#1b5a92', label: 'In Progress' },
  contacted: { bg: '#1b5a9215', text: '#1b5a92', dot: '#1b5a92', label: 'Contacted' },
  new: { bg: '#6366f115', text: '#4f46e5', dot: '#6366f1', label: 'New Lead' },
  
  pending: { bg: '#f59e0b15', text: '#d97706', dot: '#f59e0b', label: 'Pending' },
  scheduled: { bg: '#f59e0b15', text: '#d97706', dot: '#f59e0b', label: 'Scheduled' },
  paused: { bg: '#64748b15', text: '#475569', dot: '#64748b', label: 'Paused' },
  
  escalated: { bg: '#ef444415', text: '#dc2626', dot: '#ef4444', label: 'Escalated' },
  unqualified: { bg: '#ef444415', text: '#dc2626', dot: '#ef4444', label: 'Unqualified' },
  failed: { bg: '#ef444415', text: '#dc2626', dot: '#ef4444', label: 'Failed' },
};

export function StatusBadge({ status, label, size = 'sm', dot = true }: StatusBadgeProps) {
  const normKey = status.toLowerCase().replace(/[\s-]/g, '_');
  const conf = BADGE_CONFIG[normKey] || {
    bg: '#64748b15',
    text: '#475569',
    dot: '#64748b',
    label: label || status
  };

  const displayText = label || conf.label;

  const fontSizes = {
    sm: '11px',
    md: '12px',
    lg: '13px'
  };

  const paddings = {
    sm: '2px 8px',
    md: '3px 10px',
    lg: '4px 12px'
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: paddings[size],
        borderRadius: '999px',
        backgroundColor: conf.bg,
        color: conf.text,
        fontSize: fontSizes[size],
        fontWeight: 700,
        letterSpacing: '0.01em',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: conf.dot,
            flexShrink: 0
          }}
        />
      )}
      {displayText}
    </span>
  );
}
