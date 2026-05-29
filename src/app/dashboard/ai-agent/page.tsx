'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAgents, createAgent } from '@/app/actions/agent';
import Toast from '../../../components/ui/Toast';

export default function AgentDirectoryPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgents() {
      const res = await getAgents();
      if (res.success && res.data) {
        setAgents(res.data);
      }
      setIsLoading(false);
    }
    fetchAgents();
  }, []);

  const handleCreateAgent = async () => {
    setIsCreating(true);
    const res = await createAgent('New Agent');
    if (res.success && res.data) {
      router.push(`/dashboard/ai-agent/${res.data.id}`);
    } else {
      setToast('Failed to create a new agent.');
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%', padding: '2rem', textAlign: 'center', color: 'var(--stripe-muted)' }}>
        Loading agents...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>AI Agents</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>Manage your specialized AI employees.</p>
        </div>
        <button 
          onClick={handleCreateAgent} 
          disabled={isCreating}
          style={{ 
            backgroundColor: 'var(--stripe-purple)', 
            color: '#ffffff', 
            border: 'none', 
            borderRadius: '4px', 
            padding: '0.5rem 1.25rem', 
            fontSize: '13px', 
            fontWeight: 500, 
            cursor: isCreating ? 'wait' : 'pointer', 
            boxShadow: 'var(--stripe-shadow-action)',
            opacity: isCreating ? 0.7 : 1
          }}>
          {isCreating ? 'Creating...' : '+ Create New Agent'}
        </button>
      </div>

      {agents.length === 0 ? (
        <div style={{ padding: '3rem', backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', textAlign: 'center', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>No Agents Yet</h3>
          <p style={{ fontSize: '13px', color: 'var(--stripe-body)', marginBottom: '1.5rem' }}>Create your first AI agent to start automating your workflows.</p>
          <button 
            onClick={handleCreateAgent}
            disabled={isCreating}
            style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '13px', cursor: 'pointer', color: 'var(--stripe-navy)', fontWeight: 500 }}
          >
            Create Agent
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {agents.map((agent, idx) => (
            <div 
              key={idx} 
              onClick={() => router.push(`/dashboard/ai-agent/${agent.id}`)}
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid var(--stripe-border)', 
                borderRadius: '6px', 
                padding: '1.5rem', 
                boxShadow: 'var(--stripe-shadow-ambient)',
                cursor: 'pointer',
                transition: 'transform 0.1s, box-shadow 0.1s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--stripe-shadow-action)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--stripe-shadow-ambient)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(83,58,253,0.1)', color: 'var(--stripe-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  🤖
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0', fontWeight: 500 }}>{agent.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>{agent.config?.attachedWorkflows?.length || 0} Workflows</div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--stripe-body)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {agent.config?.systemPrompt || 'No system prompt configured.'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
