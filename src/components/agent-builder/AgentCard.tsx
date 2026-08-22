'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    config?: {
      systemPrompt?: string;
      attachedWorkflows?: any[];
      voice?: string;
      language?: string;
    };
    created_at?: string;
    createdAt?: string;
  };
}

export function AgentCard({ agent }: AgentCardProps) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/dashboard/ai-agent/${agent.id}`)}
      style={{ 
        backgroundColor: '#ffffff', 
        border: '1px solid var(--stripe-border)', 
        borderRadius: '10px', 
        padding: '1.5rem', 
        boxShadow: 'var(--stripe-shadow-ambient)',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--stripe-shadow-action)';
        e.currentTarget.style.borderColor = '#818cf8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--stripe-shadow-ambient)';
        e.currentTarget.style.borderColor = 'var(--stripe-border)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(76,175,80,0.1)', color: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
          🤖
        </div>
        <div>
          <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0', fontWeight: 600 }}>{agent.name}</h3>
          <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', fontWeight: 500 }}>
            {agent.config?.attachedWorkflows?.length || 0} Workflows Connected
          </div>
        </div>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--stripe-body)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.45 }}>
        {agent.config?.systemPrompt || 'No system prompt configured.'}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
        <span style={{ fontSize: '11px', color: '#4caf50', fontWeight: 700 }}>Configure Employee →</span>
      </div>
    </div>
  );
}
