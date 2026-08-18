import React from 'react';

interface EmptyStateProps {
  icon?: string;
  image?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

export function EmptyState({
  icon,
  image = '/amira-head.png',
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div
      style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-card, #ffffff)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle, #e2e8f0)',
        maxWidth: '520px',
        margin: '2rem auto',
      }}
    >
      {image ? (
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            backgroundColor: '#1b5a9212',
            border: '1px solid #1b5a9225',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            padding: '10px'
          }}
        >
          <img src={image} alt="Amira" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      ) : icon ? (
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      ) : null}

      <h3
        style={{
          fontSize: '17px',
          fontWeight: 750,
          color: 'var(--text-primary, #0f172a)',
          margin: '0 0 0.5rem 0',
          fontFamily: "'Satoshi', sans-serif"
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary, #64748b)',
          margin: '0 0 1.75rem 0',
          lineHeight: 1.55,
          maxWidth: '420px',
        }}
      >
        {description}
      </p>

      {(action || secondaryAction) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {action && (
            action.href ? (
              <a
                href={action.href}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: '#1b5a92',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(27, 90, 146, 0.25)',
                  cursor: 'pointer'
                }}
              >
                {action.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={action.onClick}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: '#1b5a92',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(27, 90, 146, 0.25)',
                  cursor: 'pointer'
                }}
              >
                {action.label}
              </button>
            )
          )}

          {secondaryAction && (
            secondaryAction.href ? (
              <a
                href={secondaryAction.href}
                style={{
                  padding: '0.6rem 1.15rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle, #f1f5f9)',
                  color: 'var(--text-primary, #0f172a)',
                  border: '1px solid var(--border-subtle, #e2e8f0)',
                  fontSize: '13px',
                  fontWeight: 650,
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                {secondaryAction.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                style={{
                  padding: '0.6rem 1.15rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle, #f1f5f9)',
                  color: 'var(--text-primary, #0f172a)',
                  border: '1px solid var(--border-subtle, #e2e8f0)',
                  fontSize: '13px',
                  fontWeight: 650,
                  cursor: 'pointer'
                }}
              >
                {secondaryAction.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
