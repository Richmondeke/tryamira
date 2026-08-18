import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'blue' | 'green' | 'amber' | 'neutral';
  };
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, badge, actions }: PageHeaderProps) {
  const badgeColors = {
    blue: { bg: '#1b5a9215', text: '#1b5a92', border: '#1b5a9230' },
    green: { bg: '#10b98115', text: '#059669', border: '#10b98130' },
    amber: { bg: '#f59e0b15', text: '#d97706', border: '#f59e0b30' },
    neutral: { bg: 'var(--bg-subtle, #f1f5f9)', text: 'var(--text-secondary, #64748b)', border: 'var(--border-subtle, #e2e8f0)' },
  };

  const currentBadgeColor = badge ? badgeColors[badge.variant || 'blue'] : null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        marginBottom: '1.75rem',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.02em',
              fontFamily: "'Satoshi', sans-serif"
            }}
          >
            {title}
          </h1>
          {badge && currentBadgeColor && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: '999px',
                backgroundColor: currentBadgeColor.bg,
                color: currentBadgeColor.text,
                border: `1px solid ${currentBadgeColor.border}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {badge.text}
            </span>
          )}
        </div>
        {subtitle && (
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              margin: '0.35rem 0 0 0',
              lineHeight: 1.5,
              maxWidth: '680px'
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
