'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';
import { createClient } from '../../../../utils/supabase/client';

export default function WhatsAppPage() {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'drip'>('broadcast');
  const [showModal, setShowModal] = useState(false);
  const [showDripModal, setShowDripModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [broadcasts, setBroadcasts] = useState([
    { id: 1, name: 'Q3 Promotion', audience: 'All Leads', sent: 'Aug 12, 2024', openRate: '42%' }
  ]);

  const [drips, setDrips] = useState([
    { id: 1, name: 'Lead Qualification', trigger: 'New Form Submission', steps: 4, conversion: '32%' },
    { id: 2, name: 'Abandoned Cart', trigger: 'Cart Inactive 24h', steps: 2, conversion: '18%' },
    { id: 3, name: 'Meeting Reminder', trigger: '24h Before Meeting', steps: 1, conversion: '95%' }
  ]);

  const [leadStats, setLeadStats] = useState({ total: 1248, hot: 240, warm: 400, cold: 608 }); // Defaults if no DB
  const supabase = createClient();

  useEffect(() => {
    async function loadLeadStats() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
      const { data } = await supabase.from('leads').select('status');
      if (data && data.length > 0) {
        setLeadStats({
          total: data.length,
          hot: data.filter(d => d.status === 'hot').length,
          warm: data.filter(d => d.status === 'warm').length,
          cold: data.filter(d => d.status === 'cold').length,
        });
      }
    }
    loadLeadStats();
  }, [supabase]);

  const handleSendBroadcast = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const audience = formData.get('audience') as string;
    
    setBroadcasts([
      {
        id: Date.now(),
        name: 'New Broadcast',
        audience: audience,
        sent: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        openRate: '0%'
      },
      ...broadcasts
    ]);
    
    setShowModal(false);
    setToast('Broadcast successfully scheduled for dispatch!');
  };

  const handleCreateDrip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const trigger = formData.get('trigger') as string;
    const steps = parseInt(formData.get('steps') as string) || 1;
    
    setDrips([
      ...drips,
      {
        id: Date.now(),
        name,
        trigger,
        steps,
        conversion: '0%'
      }
    ]);
    
    setShowDripModal(false);
    setToast('Automated drip sequence created successfully!');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>WhatsApp Outbound</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>Manage one-off broadcasts and automated drip sequences.</p>
        </div>
        <div style={{ display: 'flex', backgroundColor: '#f6f9fc', borderRadius: '6px', padding: '0.25rem', border: '1px solid var(--stripe-border)' }}>
          <button 
            onClick={() => setActiveTab('broadcast')}
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '13px', 
              fontWeight: 500, 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              backgroundColor: activeTab === 'broadcast' ? '#fff' : 'transparent',
              color: activeTab === 'broadcast' ? 'var(--stripe-navy)' : 'var(--stripe-label)',
              boxShadow: activeTab === 'broadcast' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            Broadcasts
          </button>
          <button 
            onClick={() => setActiveTab('drip')}
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '13px', 
              fontWeight: 500, 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              backgroundColor: activeTab === 'drip' ? '#fff' : 'transparent',
              color: activeTab === 'drip' ? 'var(--stripe-navy)' : 'var(--stripe-label)',
              boxShadow: activeTab === 'drip' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            Automated Drip
          </button>
        </div>
      </div>

      {activeTab === 'broadcast' && (
        <>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Broadcast">
            <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Audience Segment</label>
                <select name="audience" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
                  <option value="All Leads">All Leads ({leadStats.total})</option>
                  <option value="Hot Leads">Hot Leads ({leadStats.hot})</option>
                  <option value="Warm Leads">Warm Leads ({leadStats.warm})</option>
                  <option value="Cold Leads">Cold Leads ({leadStats.cold})</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Message Body</label>
                <textarea required rows={4} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', resize: 'vertical' }} placeholder="Hi {{first_name}}, check out our new listings!"></textarea>
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4caf50'}>Schedule Send</button>
            </form>
          </Modal>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={() => setShowModal(true)} style={{ backgroundColor: '#4caf50', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4caf50'}>New Broadcast</button>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFeatureSettings: '"tnum", "ss01"' }}>
              <thead>
                <tr style={{ backgroundColor: '#f6f9fc', borderBottom: '1px solid var(--stripe-border)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>CAMPAIGN NAME</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>AUDIENCE</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>SENT</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>OPEN RATE</th>
                </tr>
              </thead>
              <tbody>
                {broadcasts.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--stripe-label)', fontSize: '13px' }}>
                      No broadcasts found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  broadcasts.map(broadcast => (
                    <tr key={broadcast.id} style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{broadcast.name}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-body)' }}>{broadcast.audience}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-body)' }}>{broadcast.sent}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-success-text)' }}>{broadcast.openRate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'drip' && (
        <>
          <Modal isOpen={showDripModal} onClose={() => setShowDripModal(false)} title="Create Drip Sequence">
            <form onSubmit={handleCreateDrip} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Sequence Name</label>
                <input required type="text" name="name" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} placeholder="e.g., Welcome Series" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Trigger Event</label>
                <select name="trigger" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
                  <option value="New Lead Captured">New Lead Captured</option>
                  <option value="Form Submission">Form Submission</option>
                  <option value="Meeting Scheduled">Meeting Scheduled</option>
                  <option value="Custom Tag Added">Custom Tag Added</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Number of Steps</label>
                <input required type="number" min="1" max="10" name="steps" defaultValue="3" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Create Sequence</button>
            </form>
          </Modal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {drips.map((drip) => (
              <div key={drip.id} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{drip.name}</div>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--stripe-success-text)' }}></div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Trigger</div>
                <div style={{ fontSize: '13px', color: 'var(--stripe-body)', marginBottom: '1rem' }}>{drip.trigger}</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--stripe-border)', paddingTop: '1rem', fontFeatureSettings: '"tnum"' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--stripe-label)' }}>Steps</div>
                    <div style={{ fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{drip.steps}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--stripe-label)' }}>Conversion</div>
                    <div style={{ fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{drip.conversion}</div>
                  </div>
                </div>
              </div>
            ))}
            
            <div onClick={() => setShowDripModal(true)} style={{ backgroundColor: '#f6f9fc', border: '1px dashed var(--stripe-purple)', borderRadius: '6px', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '180px', transition: 'background-color 0.2s' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(76,175,80,0.1)', color: 'var(--stripe-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '1rem' }}>+</div>
              <div style={{ fontSize: '13px', color: 'var(--stripe-purple)', fontWeight: 500 }}>Create Sequence</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
