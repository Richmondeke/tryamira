'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Toast from '../../../../components/ui/Toast';
import { getAgentById, updateAgent } from '@/app/actions/agent';
import { getComposioStatus } from '@/app/actions/integrations';

export default function AgentBuilderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  
  const [toast, setToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Agent Identity (The Brain)
  const [agentName, setAgentName] = useState('New Agent');
  const [voice, setVoice] = useState('11labs-josh');
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant.");
  
  // Knowledge Base
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<string[]>(['Pricing.pdf']);

  // Workflows (The Hands)
  const [availableWorkflows, setAvailableWorkflows] = useState<any[]>([]);
  const [attachedWorkflows, setAttachedWorkflows] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!params.id) return;
      
      // Fetch user's active Composio integrations
      const integrationsRes = await getComposioStatus();
      if (integrationsRes.success && integrationsRes.data) {
        setAvailableWorkflows(integrationsRes.data);
      }

      // Fetch saved agent config
      const agentRes = await getAgentById(params.id);
      if (agentRes.success && agentRes.data) {
        const config = agentRes.data.config || {};
        setAgentName(agentRes.data.name || 'New Agent');
        if (config.voice) setVoice(config.voice);
        if (config.systemPrompt) setSystemPrompt(config.systemPrompt);
        if (config.attachedWorkflows) setAttachedWorkflows(config.attachedWorkflows);
      }
      setIsLoading(false);
    }
    loadData();
  }, [params.id]);

  const handleSave = async () => {
    if (!params.id) return;
    setIsSaving(true);
    const config = {
      agentName,
      voice,
      systemPrompt,
      attachedWorkflows,
    };
    const res = await updateAgent(params.id, config);
    setIsSaving(false);
    if (res.success) {
      setToast('Agent updated successfully.');
    } else {
      setToast('Failed to save agent configuration.');
    }
  };

  const toggleWorkflow = (provider: string) => {
    setAttachedWorkflows(prev => 
      prev.includes(provider) 
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles([...files, e.dataTransfer.files[0].name]);
    }
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%', padding: '2rem', textAlign: 'center', color: 'var(--stripe-muted)' }}>
        Loading agent configuration...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => router.push('/dashboard/ai-agent')}
          style={{ background: 'none', border: 'none', color: 'var(--stripe-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.25rem' }}
        >
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>{agentName}</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>Configure this agent's brain and workflows.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          style={{ 
            backgroundColor: 'var(--stripe-purple)', 
            color: '#ffffff', 
            border: 'none', 
            borderRadius: '4px', 
            padding: '0.5rem 1.25rem', 
            fontSize: '13px', 
            fontWeight: 500, 
            cursor: isSaving ? 'wait' : 'pointer', 
            boxShadow: 'var(--stripe-shadow-action)',
            opacity: isSaving ? 0.7 : 1
          }}>
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: The Brain */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 500 }}>Agent Identity (The Brain)</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Agent Name</label>
                <input 
                  type="text" 
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '13px', color: 'var(--stripe-navy)' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Voice Model</label>
                <select 
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '13px', color: 'var(--stripe-navy)', backgroundColor: '#fff' }}>
                  <option value="11labs-josh">ElevenLabs - Josh (Deep, Professional)</option>
                  <option value="11labs-rachel">ElevenLabs - Rachel (Friendly, Upbeat)</option>
                  <option value="openai-alloy">OpenAI - Alloy (Neutral)</option>
                  <option value="openai-nova">OpenAI - Nova (Warm)</option>
                </select>
              </div>
            </div>

            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>System Prompt</label>
            <textarea 
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              style={{ width: '100%', height: '180px', padding: '0.75rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '13px', color: 'var(--stripe-navy)', outline: 'none', resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 500 }}>Knowledge Base</h3>
            <p style={{ fontSize: '13px', color: 'var(--stripe-body)', marginBottom: '1.5rem' }}>Upload PDFs, TXTs, or link your website for the AI to learn from.</p>
            
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{ 
                border: isDragging ? '2px dashed var(--stripe-purple)' : '1px dashed var(--stripe-border)', 
                backgroundColor: isDragging ? 'rgba(83,58,253,0.05)' : '#f9fafb', 
                borderRadius: '6px', 
                padding: '3rem', 
                textAlign: 'center', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ color: 'var(--stripe-purple)', fontSize: '20px', marginBottom: '0.5rem' }}>+</div>
              <div style={{ fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Click or drag file to upload</div>
              <div style={{ fontSize: '12px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>PDF, DOCX, TXT (Max 10MB)</div>
            </div>

            {files.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                {files.map((file, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#f6f9fc', borderRadius: '4px', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--stripe-purple)' }}>📄</span>
                    <span style={{ fontSize: '13px', color: 'var(--stripe-navy)', flex: 1 }}>{file}</span>
                    <span style={{ fontSize: '12px', color: 'var(--stripe-success-text)', backgroundColor: 'rgba(21,190,83,0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>Ready</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: The Hands (Workflows) & Personality */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 500 }}>Attached Workflows (The Hands)</h3>
            <p style={{ fontSize: '13px', color: 'var(--stripe-body)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Give this agent access to specific tools. Only tools you have connected in the <strong>Integrations</strong> tab will appear here.
            </p>

            {availableWorkflows.length === 0 ? (
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px dashed var(--stripe-border)', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: 'var(--stripe-muted)', margin: 0 }}>No integrations connected yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {availableWorkflows.map((workflow, idx) => {
                  const isActive = attachedWorkflows.includes(workflow.provider);
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', backgroundColor: isActive ? 'rgba(83,58,253,0.02)' : '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isActive ? 'var(--stripe-success)' : 'var(--stripe-muted)' }}></div>
                        <span style={{ fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500, textTransform: 'capitalize' }}>{workflow.provider}</span>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={isActive} 
                          onChange={() => toggleWorkflow(workflow.provider)}
                          style={{ opacity: 0, width: 0, height: 0 }} 
                        />
                        <span style={{
                          position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                          backgroundColor: isActive ? 'var(--stripe-purple)' : '#e5e7eb',
                          transition: '.2s', borderRadius: '20px'
                        }}>
                          <span style={{
                            position: 'absolute', content: '""', height: '16px', width: '16px', left: '2px', bottom: '2px',
                            backgroundColor: 'white', transition: '.2s', borderRadius: '50%',
                            transform: isActive ? 'translateX(16px)' : 'translateX(0)'
                          }} />
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 500 }}>Personality Guardrails</h3>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: 'var(--stripe-purple)' }} />
              <span style={{ fontSize: '13px', color: 'var(--stripe-navy)' }}>Use emojis naturally 😊</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: 'var(--stripe-purple)' }} />
              <span style={{ fontSize: '13px', color: 'var(--stripe-navy)' }}>Keep responses under 2 sentences</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: 'var(--stripe-purple)' }} />
              <span style={{ fontSize: '13px', color: 'var(--stripe-navy)' }}>Always capture email first</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
