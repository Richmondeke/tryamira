import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  count?: number | string;
}

interface SegmentedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  size?: 'sm' | 'md';
}

export function SegmentedTabs({ tabs, activeTab, onChange, size = 'md' }: SegmentedTabsProps) {
  const paddings = {
    sm: '0.35rem 0.75rem',
    md: '0.45rem 1rem'
  };

  const fontSizes = {
    sm: '12px',
    md: '13px'
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: 'var(--bg-subtle, #f1f5f9)',
        padding: '4px',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle, #e2e8f0)',
        maxWidth: '100%',
        overflowX: 'auto',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: paddings[size],
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isActive ? 'var(--bg-card, #ffffff)' : 'transparent',
              color: isActive ? 'var(--text-primary, #0f172a)' : 'var(--text-secondary, #64748b)',
              fontSize: fontSizes[size],
              fontWeight: isActive ? 750 : 550,
              cursor: 'pointer',
              boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.icon && <span style={{ fontSize: '14px' }}>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '999px',
                  backgroundColor: isActive ? '#1b5a9215' : 'rgba(0,0,0,0.06)',
                  color: isActive ? '#1b5a92' : 'var(--text-secondary, #64748b)',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
