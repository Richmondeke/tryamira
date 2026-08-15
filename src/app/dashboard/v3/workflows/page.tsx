'use client';

import React, { useState, useEffect } from 'react';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { getWorkspaceWorkflows, saveWorkflowRecipe, toggleWorkflowStatus, deleteWorkflowRecipe, WorkflowRecipe } from '@/app/actions/workflows';
import { getWorkspaceAgents } from '@/app/actions/agent';

export default function V3WorkflowsPage() {
  const { isDemoMode } = useDemoMode();
  const [workflows, setWorkflows] = useState<WorkflowRecipe[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  // Form State for 3-Step Builder
  const [step, setStep] = useState<number>(1);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('whatsapp_dm');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [useKB, setUseKB] = useState(true);
  const [intentCondition, setIntentCondition] = useState('all');
  const [actionType, setActionType] = useState('auto_reply');
  const [targetTool, setTargetTool] = useState('hubspot');
  const [dripDays, setDripDays] = useState(3);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [isDemoMode]);

  async function loadData() {
    setIsLoading(true);
    try {
      const [wfRes, agRes] = await Promise.all([
        getWorkspaceWorkflows(),
        getWorkspaceAgents()
      ]);

      if (wfRes.success && wfRes.data) {
        setWorkflows(wfRes.data);
      }
      if (agRes.success && agRes.data) {
        setAgents(agRes.data);
        if (agRes.data.length > 0) {
          setSelectedAgentId(agRes.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load workflows:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleStatus(id: string) {
    await toggleWorkflowStatus(id);
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w));
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this workflow recipe?')) {
      await deleteWorkflowRecipe(id);
      setWorkflows(prev => prev.filter(w => w.id !== id));
    }
  }

  async function handleSaveRecipe(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    const agentObj = agents.find(a => a.id === selectedAgentId);
    const agentName = agentObj?.name || 'Customer Support Genie';

    const titleToUse = recipeTitle.trim() || `${getTriggerLabel(triggerEvent)} → ${getActionLabel(actionType)}`;

    const res = await saveWorkflowRecipe({
      title: titleToUse,
      triggerEvent,
      agentId: selectedAgentId || 'default-agent',
      agentName,
      useKnowledgeBase: useKB,
      intentCondition,
      actionType,
      targetTool: actionType === 'composio_tool' ? targetTool : undefined,
      dripDays: actionType === 'drip_campaign' ? dripDays : undefined,
      status: 'active'
    });

    if (res.success && res.data) {
      setWorkflows(prev => [res.data!, ...prev]);
      setShowModal(false);
      resetForm();
    }
    setIsSaving(false);
  }

  function resetForm() {
    setStep(1);
    setRecipeTitle('');
    setTriggerEvent('whatsapp_dm');
    setUseKB(true);
    setIntentCondition('all');
    setActionType('auto_reply');
    setTargetTool('hubspot');
    setDripDays(3);
  }

  function getTriggerLabel(t: string) {
    switch (t) {
      case 'whatsapp_dm': return '💬 WhatsApp DM Received';
      case 'email_received': return '✉️ Support Email Received';
      case 'form_submission': return '📝 Lead Capture Form Submitted';
      case 'call_completed': return '📞 Voice Call Completed';
      case 'ticket_created': return '🎟️ Slack / Linear Ticket Created';
      default: return t;
    }
  }

  function getActionLabel(a: string) {
    switch (a) {
      case 'auto_reply': return '🤖 Send AI Text Auto-Reply';
      case 'vapi_call': return '📞 Dispatch VAPI Voice Call';
      case 'composio_tool': return `🛠️ Sync with ${targetTool.toUpperCase()}`;
      case 'drip_campaign': return `⏳ Enroll in ${dripDays}-Day Drip`;
      default: return a;
    }
  }

  const filteredWorkflows = workflows.filter(w => {
    if (filterCategory === 'whatsapp') return w.triggerEvent === 'whatsapp_dm';
    if (filterCategory === 'email') return w.triggerEvent === 'email_received';
    if (filterCategory === 'form') return w.triggerEvent === 'form_submission';
    if (filterCategory === 'call') return w.triggerEvent === 'call_completed';
    return true;
  });

  return (
    <div className="v3-widget-animate delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Autonomous Workflows</h1>
            <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', backgroundColor: '#10b98115', color: '#047857', border: '1px solid #10b98130' }}>
              {workflows.length} Active Recipes
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Build multi-channel trigger-action recipes across WhatsApp DMs, Email parsing, Lead Forms, VAPI Voice, and Composio tools.
          </p>
        </div>

        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          style={{ padding: '0.7rem 1.4rem', borderRadius: '12px', backgroundColor: '#10b981', color: '#fff', fontSize: '13.5px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>+ New Workflow Recipe</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Recipes' },
          { id: 'whatsapp', label: '💬 WhatsApp' },
          { id: 'email', label: '✉️ Email' },
          { id: 'form', label: '📝 Lead Forms' },
          { id: 'call', label: '📞 Voice Calls' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            style={{
              padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '13px', fontWeight: 650, cursor: 'pointer',
              border: filterCategory === tab.id ? '1.5px solid #10b981' : '1px solid var(--border-subtle)',
              backgroundColor: filterCategory === tab.id ? '#10b98115' : 'var(--bg-card)',
              color: filterCategory === tab.id ? '#047857' : 'var(--text-secondary)'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workflow Recipes Grid */}
      {filteredWorkflows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '38px' }}>⚡</span>
          <div style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--text-primary)' }}>No Matching Workflow Recipes</div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, maxWidth: '460px', lineHeight: 1.5 }}>
            Click &quot;+ New Workflow Recipe&quot; to build an automated trigger-action sequence for WhatsApp, Email, or Voice.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filteredWorkflows.map(wf => (
            <div key={wf.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', backgroundColor: '#1b5a9215', color: '#1b5a92' }}>
                    {getTriggerLabel(wf.triggerEvent)}
                  </span>
                  <button 
                    onClick={() => handleToggleStatus(wf.id)}
                    style={{ fontSize: '11px', fontWeight: 750, padding: '2px 8px', borderRadius: '99px', border: 'none', cursor: 'pointer', backgroundColor: wf.status === 'active' ? '#10b98120' : '#f1f5f9', color: wf.status === 'active' ? '#047857' : '#64748b' }}>
                    {wf.status === 'active' ? '● Active' : '○ Paused'}
                  </button>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 750, color: 'var(--text-primary)', margin: '0 0 0.4rem 0' }}>{wf.title}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0.6rem 0' }}>
                  <div>🤖 <strong>Agent:</strong> {wf.agentName}</div>
                  <div>📚 <strong>Knowledge Base:</strong> {wf.useKnowledgeBase ? 'Enabled (PDF / FAQ active)' : 'Disabled'}</div>
                  <div>🎯 <strong>Intent Filter:</strong> {wf.intentCondition.toUpperCase()}</div>
                  <div>⚡ <strong>Action:</strong> {getActionLabel(wf.actionType)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>Created {new Date(wf.createdAt).toLocaleDateString()}</span>
                <button 
                  onClick={() => handleDelete(wf.id)}
                  style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 3-STEP TRIGGER-ACTION WORKFLOW BUILDER MODAL ───────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '640px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#1b5a92', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Create Autonomous Workflow Recipe</h2>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: '0.2rem 0 0 0' }}>Step {step} of 3 — {step === 1 ? 'Trigger Event' : step === 2 ? 'Agent & Rules' : 'Automated Action'}</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Step Indicators */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              {[
                { s: 1, label: '1. Select Trigger' },
                { s: 2, label: '2. Rules & Agent' },
                { s: 3, label: '3. Execute Action' }
              ].map(st => (
                <div 
                  key={st.s}
                  onClick={() => setStep(st.s)}
                  style={{
                    flex: 1, padding: '0.75rem', textAlign: 'center', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                    color: step === st.s ? '#10b981' : '#64748b',
                    borderBottom: step === st.s ? '2.5px solid #10b981' : 'none',
                    backgroundColor: step === st.s ? '#ffffff' : 'transparent'
                  }}>
                  {st.label}
                </div>
              ))}
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveRecipe} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* STEP 1: TRIGGER EVENT */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                    Recipe Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. WhatsApp Lead Auto-Call & HubSpot Sync"
                    value={recipeTitle}
                    onChange={e => setRecipeTitle(e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                  />

                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '0.5rem' }}>
                    Select Trigger Event
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { id: 'whatsapp_dm', title: '💬 WhatsApp DM', desc: 'When a customer sends a WhatsApp message' },
                      { id: 'email_received', title: '✉️ Support Email', desc: 'When a new email arrives in inbox' },
                      { id: 'form_submission', title: '📝 Lead Form', desc: 'When a lead submits a website capture form' },
                      { id: 'call_completed', title: '📞 Voice Call Ended', desc: 'When an inbound/outbound phone call ends' },
                      { id: 'ticket_created', title: '🎟️ Slack / Linear', desc: 'When a workplace support ticket is logged' }
                    ].map(t => (
                      <div
                        key={t.id}
                        onClick={() => setTriggerEvent(t.id)}
                        style={{
                          padding: '0.85rem', borderRadius: '12px', cursor: 'pointer',
                          border: triggerEvent === t.id ? '2px solid #10b981' : '1px solid #e2e8f0',
                          backgroundColor: triggerEvent === t.id ? '#10b98110' : '#ffffff'
                        }}>
                        <div style={{ fontSize: '14px', fontWeight: 750, color: '#1b5a92' }}>{t.title}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '0.2rem' }}>{t.desc}</div>
                      </div>
                    ))}
                  </div>

                  <button type="button" onClick={() => setStep(2)} style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '10px', backgroundColor: '#1b5a92', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                    Next: Agent & Rules →
                  </button>
                </div>
              )}

              {/* STEP 2: AGENT & RULES */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                    Assign AI Agent
                  </label>
                  <select
                    value={selectedAgentId}
                    onChange={e => setSelectedAgentId(e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}>
                    {agents.length > 0 ? (
                      agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.role || 'AI Voice/Text'})</option>)
                    ) : (
                      <option value="default-genie">Customer Support Genie (Default)</option>
                    )}
                  </select>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Knowledge Base Retrieval</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Search uploaded PDFs, DOCX, and FAQ guidelines during workflow</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={useKB}
                      onChange={e => setUseKB(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                    />
                  </div>

                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '0.5rem' }}>
                    Intent Condition Filter
                  </label>
                  <select
                    value={intentCondition}
                    onChange={e => setIntentCondition(e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}>
                    <option value="all">ALL (Process every message/submission)</option>
                    <option value="pricing">PRICING (Customer asks about pricing or packages)</option>
                    <option value="refund">REFUND (Customer requests refund or cancellation)</option>
                    <option value="leads">HIGH INTENT (Lead provided phone number)</option>
                    <option value="support">TECHNICAL (Troubleshooting request)</option>
                  </select>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>
                      ← Back
                    </button>
                    <button type="button" onClick={() => setStep(3)} style={{ flex: 2, padding: '0.75rem', borderRadius: '10px', backgroundColor: '#1b5a92', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                      Next: Execute Action →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: EXECUTE ACTION */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                    Select Automated Action
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { id: 'auto_reply', title: '🤖 AI Text Auto-Reply', desc: 'Reply instantly via WhatsApp or Email' },
                      { id: 'vapi_call', title: '📞 VAPI Voice Call', desc: 'Trigger immediate outbound AI voice call' },
                      { id: 'composio_tool', title: '🛠️ Composio Tool Sync', desc: 'Execute action in CRM / Linear / Stripe' },
                      { id: 'drip_campaign', title: '⏳ Drip Campaign', desc: 'Enroll lead into multi-day drip sequence' }
                    ].map(a => (
                      <div
                        key={a.id}
                        onClick={() => setActionType(a.id)}
                        style={{
                          padding: '0.85rem', borderRadius: '12px', cursor: 'pointer',
                          border: actionType === a.id ? '2px solid #10b981' : '1px solid #e2e8f0',
                          backgroundColor: actionType === a.id ? '#10b98110' : '#ffffff'
                        }}>
                        <div style={{ fontSize: '14px', fontWeight: 750, color: '#1b5a92' }}>{a.title}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '0.2rem' }}>{a.desc}</div>
                      </div>
                    ))}
                  </div>

                  {actionType === 'composio_tool' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>Target Tool Integration</label>
                      <select
                        value={targetTool}
                        onChange={e => setTargetTool(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '0.3rem', fontSize: '13px' }}>
                        <option value="hubspot">HubSpot CRM (Create Deal & Score Lead)</option>
                        <option value="linear">Linear (Create Support Issue)</option>
                        <option value="slack">Slack (Send Urgent Alert Channel Message)</option>
                        <option value="stripe">Stripe (Process Refund / Check Subscription)</option>
                      </select>
                    </div>
                  )}

                  {actionType === 'drip_campaign' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>Drip Sequence Duration</label>
                      <select
                        value={dripDays}
                        onChange={e => setDripDays(Number(e.target.value))}
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '0.3rem', fontSize: '13px' }}>
                        <option value={1}>1-Day Follow-Up Sequence</option>
                        <option value={3}>3-Day Nurture Sequence</option>
                        <option value={7}>7-Day Onboarding Sequence</option>
                      </select>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>
                      ← Back
                    </button>
                    <button type="submit" disabled={isSaving} style={{ flex: 2, padding: '0.75rem', borderRadius: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', fontWeight: 750, cursor: 'pointer', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)' }}>
                      {isSaving ? 'Saving Recipe...' : '🚀 Save & Activate Recipe'}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
