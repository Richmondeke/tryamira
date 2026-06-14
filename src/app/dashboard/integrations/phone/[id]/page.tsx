'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import { getAgents } from '@/app/actions/agent';

export default function PhoneDetailsDashboard({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');

  const [phoneData, setPhoneData] = useState<any>({
    id: params.id,
    number: '+1 (415) 801-3920', // This would typically be fetched by ID
    carrier: 'Owned',
    assignedAgentId: null,
    assignedAgentName: null,
    billingStatus: '$2.00 / mo',
    createdAt: new Date().toLocaleDateString(),
    callsSummary: { totalCalls: 124, amountSpent: '$14.20', totalDuration: '4h 12m' },
    callLogs: [
      { id: 'call_1', date: '2026-06-01', duration: '5m 20s', cost: '$0.50', status: 'Completed', reason: 'Customer Inquiry' },
      { id: 'call_2', date: '2026-06-01', duration: '2m 10s', cost: '$0.20', status: 'Completed', reason: 'Support Ticket' },
      { id: 'call_3', date: '2026-05-30', duration: '0m 45s', cost: '$0.08', status: 'Voicemail', reason: 'No Answer' },
    ]
  });

  useEffect(() => {
    getAgents().then(res => {
      if (res.success && res.data) {
        setAgents(res.data);
      }
    });
  }, []);

  const handleLinkAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedAgent = agents.find(a => a.id === selectedAgentId);
    
    setPhoneData((prev: any) => ({
      ...prev,
      assignedAgentId: selectedAgentId || null,
      assignedAgentName: matchedAgent ? matchedAgent.name : null
    }));

    setShowLinkModal(false);
    setToast({ 
      message: matchedAgent 
        ? `Successfully linked ${phoneData.number} to AI employee "${matchedAgent.name}"` 
        : `Successfully disconnected agent from ${phoneData.number}`, 
      type: 'success' 
    });
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%', padding: '1rem' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* --- LINK AGENT MODAL --- */}
      <Modal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} title={`Configure Route for ${phoneData.number}`}>
        <form onSubmit={handleLinkAgentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
            Direct all incoming calls reaching <strong>{phoneData.number}</strong> to a specific active AI Employee.
          </p>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '6px', fontWeight: 500 }}>Select AI Employee Agent</label>
            <select 
              value={selectedAgentId} 
              onChange={(e) => setSelectedAgentId(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '13px', backgroundColor: '#fff', color: 'var(--stripe-navy)' }}
            >
              <option value="">-- Disconnected / Standby --</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button type="button" variant="outline" onClick={() => setShowLinkModal(false)}>Cancel</Button>
            <Button type="submit" style={{ backgroundColor: '#4caf50', color: '#fff' }}>
              Save Route Configuration
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- HEADER --- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => router.push('/dashboard/integrations/phone')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>
          ←
        </button>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>{phoneData.number}</h2>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '13px' }}>
            <span style={{ fontWeight: 600, color: '#64748b', backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '20px' }}>
              {phoneData.carrier}
            </span>
            <span style={{ color: phoneData.assignedAgentName ? '#10b981' : '#64748b', fontWeight: phoneData.assignedAgentName ? 600 : 400 }}>
              {phoneData.assignedAgentName ? `🟢 Routed to: ${phoneData.assignedAgentName}` : '⚪ Standby / Unassigned'}
            </span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              setSelectedAgentId(phoneData.assignedAgentId || '');
              setShowLinkModal(true);
            }}
          >
            ⚙️ Link / Unlink Agent
          </Button>
        </div>
      </div>

      {/* --- SUMMARY CARDS --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '13px', color: 'var(--stripe-muted)' }}>Total Calls</p>
          <h3 style={{ margin: 0, fontSize: '24px', color: 'var(--stripe-navy)' }}>{phoneData.callsSummary.totalCalls}</h3>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '13px', color: 'var(--stripe-muted)' }}>Amount Spent</p>
          <h3 style={{ margin: 0, fontSize: '24px', color: 'var(--stripe-navy)' }}>{phoneData.callsSummary.amountSpent}</h3>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '13px', color: 'var(--stripe-muted)' }}>Total Duration</p>
          <h3 style={{ margin: 0, fontSize: '24px', color: 'var(--stripe-navy)' }}>{phoneData.callsSummary.totalDuration}</h3>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '13px', color: 'var(--stripe-muted)' }}>Billing Status</p>
          <h3 style={{ margin: 0, fontSize: '24px', color: 'var(--stripe-navy)' }}>{phoneData.billingStatus}</h3>
        </div>
      </div>

      {/* --- CALL LOGS --- */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--stripe-border)' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--stripe-navy)' }}>Call Logs</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--stripe-border)' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--stripe-muted)', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--stripe-muted)', fontWeight: 600 }}>Duration</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--stripe-muted)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--stripe-muted)', fontWeight: 600 }}>Reason</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--stripe-muted)', fontWeight: 600 }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {phoneData.callLogs.map((log: any) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--stripe-navy)' }}>{log.date}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--stripe-navy)' }}>{log.duration}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
                      backgroundColor: log.status === 'Completed' ? '#ecfdf5' : '#fef2f2',
                      color: log.status === 'Completed' ? '#059669' : '#dc2626'
                    }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--stripe-navy)' }}>{log.reason}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--stripe-navy)', fontWeight: 500 }}>{log.cost}</td>
                </tr>
              ))}
              {phoneData.callLogs.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    No call logs available for this number yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
