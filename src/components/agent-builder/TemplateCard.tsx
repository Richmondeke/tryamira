'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AgentTemplate } from '@/data/agentTemplates';

export interface TemplateCardProps {
  template: AgentTemplate;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--stripe-border)',
        borderRadius: '12px',
        boxShadow: 'var(--stripe-shadow-ambient)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '440px',
        transition: 'all 0.15s ease-in-out',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--stripe-shadow-action)';
        e.currentTarget.style.borderColor = template.categoryColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--stripe-shadow-ambient)';
        e.currentTarget.style.borderColor = 'var(--stripe-border)';
      }}
    >
      {/* Card Cover Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--stripe-border)', backgroundColor: 'var(--bg-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            fontSize: '10.5px',
            fontWeight: 700,
            color: template.categoryColor,
            backgroundColor: `${template.categoryColor}18`,
            padding: '2px 8px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {template.category}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--stripe-muted)', backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
            {template.callsHandled}
          </span>
        </div>
        <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>{template.name}</h3>
        <p style={{ fontSize: '12px', color: 'var(--stripe-body)', margin: 0, lineHeight: 1.5 }}>{template.desc}</p>
      </div>

      {/* Capabilities list */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--stripe-border)', flex: 1 }}>
        <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--stripe-label)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.65rem' }}>
          Specialized Capabilities
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {template.capabilities.map((cap, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#10b981', fontSize: '12px', flexShrink: 0, fontWeight: 'bold' }}>✓</span>
              <span style={{ fontSize: '12px', color: 'var(--stripe-body)', lineHeight: 1.35 }}>{cap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Required Integrations */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--stripe-border)' }}>
        <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--stripe-label)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
          Workflow Integrations
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {template.requiredIntegrations.map((int, i) => (
            <div 
              key={i} 
              title={int.reason}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem', 
                padding: '4px 8px', 
                backgroundColor: '#f8fafc', 
                border: '1px solid var(--stripe-border)',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--stripe-navy)'
              }}
            >
              <span>{int.icon}</span>
              <span>{int.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: '#f8fafc' }}>
        <button
          onClick={() => router.push(`/dashboard/ai-agent?template=${template.id}`)}
          style={{
            width: '100%',
            backgroundColor: '#4caf50',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.65rem 1rem',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(76,175,80,0.2)'
          }}
        >
          Hire & Deploy Worker →
        </button>
      </div>
    </div>
  );
}
