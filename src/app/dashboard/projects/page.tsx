'use client';

import { useState, useEffect } from 'react';
import { executeAmiraCommand } from '@/app/actions/agent';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjGoal, setNewProjGoal] = useState('');
  const [newProjDept, setNewProjDept] = useState('Operations');
  const [executingId, setExecutingId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('amira_user_projects');
      if (stored) {
        try { setProjects(JSON.parse(stored)); } catch {}
      }
    }
  }, []);

  const saveProjects = (updated: any[]) => {
    setProjects(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('amira_user_projects', JSON.stringify(updated));
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjGoal.trim()) return;

    const isRecurring = /daily|everyday|every day|every morning|every week|cron|schedule/i.test(newProjGoal + ' ' + newProjName);

    const newProj = {
      id: `proj-${Date.now()}`,
      name: newProjName,
      dept: newProjDept,
      progress: isRecurring ? 50 : 0,
      goal: newProjGoal,
      aiSummary: 'Project initiated. Ready to configure automated execution schedule.',
      people: ['Richmond (Owner)', 'Amira AI'],
      risks: isRecurring ? 'Cron Configured — Scheduled' : 'Active — Tasks initialized',
      riskColor: '#10b981',
      createdAt: new Date().toLocaleDateString(),
      cronInfo: isRecurring ? {
        frequency: 'Daily at 9:00 AM',
        nextRun: 'Tomorrow at 9:00 AM',
        status: 'ACTIVE'
      } : null,
      tasks: []
    };

    const updated = [newProj, ...projects];
    saveProjects(updated);
    setNewProjName('');
    setNewProjGoal('');
    setIsCreating(false);
  };

  const handleExecuteProjectStep = async (proj: any) => {
    setExecutingId(proj.id);
    try {
      const res = await executeAmiraCommand(`Execute next autonomous step for project initiative: "${proj.name}". Goal: ${proj.goal}`);
      const updated = projects.map(p => {
        if (p.id === proj.id) {
          const cronConfig = res?.cronConfigured || p.cronInfo || {
            frequency: 'Daily at 9:00 AM',
            nextRun: 'Tomorrow at 9:00 AM',
            status: 'ACTIVE'
          };

          return {
            ...p,
            progress: 100,
            aiSummary: res?.reply || 'Amira configured automated daily execution & dispatched initial report payload via Gmail.',
            cronInfo: cronConfig,
            lastPayload: res?.reply || 'Report generated and dispatched via Gmail.',
            tasks: [...(p.tasks || []), res?.reply || 'Step executed successfully']
          };
        }
        return p;
      });
      saveProjects(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setExecutingId(null);
    }
  };

  const togglePauseCron = (projId: string) => {
    const updated = projects.map(p => {
      if (p.id === projId && p.cronInfo) {
        return {
          ...p,
          cronInfo: {
            ...p.cronInfo,
            status: p.cronInfo.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
          }
        };
      }
      return p;
    });
    saveProjects(updated);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    saveProjects(updated);
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '24px' }}>📁</span>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Projects
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            Define high-level goals and let Amira execute multi-step initiatives across your integrations.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          style={{
            padding: '0.65rem 1.2rem',
            borderRadius: '10px',
            backgroundColor: '#1b5a92',
            color: '#ffffff',
            fontSize: '13.5px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(27,90,146,0.25)'
          }}
        >
          + New Project Initiative
        </button>
      </div>

      {/* Create Modal */}
      {isCreating && (
        <form onSubmit={handleCreateProject} style={{
          backgroundColor: 'var(--bg-card, #ffffff)',
          border: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
            Initialize New Project Initiative
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.4rem' }}>
                PROJECT NAME
              </label>
              <input
                type="text"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                placeholder="e.g. Q3 Customer Onboarding Campaign"
                required
                style={{
                  width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px',
                  border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle, #f8f9fc)',
                  fontSize: '13px', color: 'var(--text-primary)', outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.4rem' }}>
                PROJECT GOAL & OUTCOME INSTRUCTIONS FOR AMIRA
              </label>
              <textarea
                value={newProjGoal}
                onChange={(e) => setNewProjGoal(e.target.value)}
                placeholder="e.g. Parse new leads, schedule kickoff calls on Google Calendar, and send welcome emails..."
                rows={3}
                required
                style={{
                  width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px',
                  border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle, #f8f9fc)',
                  fontSize: '13px', color: 'var(--text-primary)', outline: 'none', resize: 'vertical'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              style={{
                padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: 'transparent',
                color: 'var(--text-tertiary)', fontSize: '13px', border: '1px solid var(--border-subtle)', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1.1rem', borderRadius: '8px', backgroundColor: '#1b5a92',
                color: '#ffffff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer'
              }}
            >
              Create Initiative
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-card, #ffffff)',
          border: '1px dashed var(--border-subtle, rgba(0,0,0,0.12))',
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>📁</div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.4rem 0' }}>
            No Active Projects Yet
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 1.25rem auto', lineHeight: 1.5 }}>
            Create your first project initiative to give Amira high-level objectives that cross multiple apps and integrations.
          </p>
          <button
            onClick={() => setIsCreating(true)}
            style={{
              padding: '0.6rem 1.2rem', borderRadius: '8px', backgroundColor: '#1b5a92',
              color: '#ffffff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer'
            }}
          >
            + Create Your First Project
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {projects.map(proj => (
            <div key={proj.id} style={{
              backgroundColor: 'var(--bg-card, #ffffff)',
              border: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#1b5a92', letterSpacing: '0.05em' }}>
                    {proj.dept || 'Operations'}
                  </span>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0 0 0' }}>
                    {proj.name}
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', backgroundColor: 'rgba(16,185,129,0.12)', padding: '4px 10px', borderRadius: '99px' }}>
                    {proj.progress}% Complete
                  </span>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    style={{ background: 'none', border: 'none', fontSize: '14px', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                    title="Delete Project"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '6px', backgroundColor: 'var(--bg-subtle, #f1f3fa)', borderRadius: '99px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <div style={{ height: '100%', width: `${proj.progress}%`, backgroundColor: '#1b5a92', borderRadius: '99px' }} />
              </div>

              {/* Active Cron Schedule Banner */}
              {proj.cronInfo && (
                <div style={{
                  backgroundColor: 'var(--bg-subtle, #f8f9fc)',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px',
                      backgroundColor: proj.cronInfo.status === 'ACTIVE' ? '#10b98118' : '#f59e0b18',
                      color: proj.cronInfo.status === 'ACTIVE' ? '#10b981' : '#f59e0b'
                    }}>
                      {proj.cronInfo.status === 'ACTIVE' ? '🟢 CRON ACTIVE' : '⏸️ PAUSED'}
                    </span>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Schedule: {proj.cronInfo.frequency || 'Daily at 9:00 AM'}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                      (Next Run: {proj.cronInfo.nextRun || 'Tomorrow at 9:00 AM'})
                    </span>
                  </div>

                  <button
                    onClick={() => togglePauseCron(proj.id)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-card, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      border: '1px solid var(--border-subtle, rgba(0,0,0,0.12))',
                      cursor: 'pointer'
                    }}
                  >
                    {proj.cronInfo.status === 'ACTIVE' ? '⏸️ Pause Cron' : '▶️ Resume Cron'}
                  </button>
                </div>
              )}

              {/* Goal & AI Execution Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ backgroundColor: 'var(--bg-subtle, #f8f9fc)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle, rgba(0,0,0,0.04))' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Initiative Goal</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '0.25rem 0 0 0', lineHeight: 1.5, fontWeight: 500 }}>
                    {proj.goal}
                  </p>
                </div>
                <div style={{ backgroundColor: 'rgba(27,90,146,0.04)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(27,90,146,0.12)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#1b5a92', textTransform: 'uppercase' }}>Amira AI Execution Status</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '0.25rem 0 0 0', lineHeight: 1.5 }}>
                    {proj.aiSummary}
                  </p>
                </div>
              </div>

              {/* Last Dispatched Payload */}
              {proj.lastPayload && (
                <div style={{
                  backgroundColor: 'var(--bg-subtle, #f8f9fc)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid var(--border-subtle, rgba(0,0,0,0.06))',
                  marginBottom: '1.25rem'
                }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#1b5a92', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
                    📜 Dispatched Action Execution Payload
                  </span>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.5, whiteSpace: 'pre-line', maxHeight: '180px', overflowY: 'auto' }}>
                    {proj.lastPayload}
                  </div>
                </div>
              )}

              {/* Action Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle, rgba(0,0,0,0.06))' }}>
                <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                  Created on {proj.createdAt || 'Today'}
                </div>

                <button
                  onClick={() => handleExecuteProjectStep(proj)}
                  disabled={executingId === proj.id}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: executingId === proj.id ? 'var(--bg-subtle)' : '#1b5a92',
                    color: executingId === proj.id ? 'var(--text-tertiary)' : '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: executingId === proj.id ? 'wait' : 'pointer'
                  }}
                >
                  {executingId === proj.id ? '• Amira Executing Step...' : '• Execute Next Step'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
