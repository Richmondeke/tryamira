'use client';

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';

export default function WhatsAppPage() {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'drip'>('broadcast');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setToast('Broadcast successfully scheduled for dispatch!');
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
            <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Audience Segment</label>
                <select style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
                  <option>All Leads (1,248)</option>
                  <option>Hot Leads (240)</option>
                  <option>Cold Leads (1,008)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Message Body</label>
                <textarea required rows={4} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', resize: 'vertical' }} placeholder="Hi {{first_name}}, check out our new listings!"></textarea>
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Schedule Send</button>
            </form>
          </Modal>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={() => setShowModal(true)} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>New Broadcast</button>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f6f9fc', borderBottom: '1px solid var(--stripe-border)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>CAMPAIGN NAME</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>AUDIENCE</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>SENT</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>OPEN RATE</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Q3 Promotion</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-body)' }}>All Leads</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-body)' }}>Aug 12, 2024</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-success-text)' }}>42%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'drip' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { name: 'Lead Qualification', trigger: 'New Form Submission', steps: 4, conversion: '32%' },
            { name: 'Abandoned Cart', trigger: 'Cart Inactive 24h', steps: 2, conversion: '18%' },
            { name: 'Meeting Reminder', trigger: '24h Before Meeting', steps: 1, conversion: '95%' }
          ].map((drip, i) => (
            <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
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
          
          <div style={{ backgroundColor: '#f6f9fc', border: '1px dashed var(--stripe-purple)', borderRadius: '6px', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '180px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(83,58,253,0.1)', color: 'var(--stripe-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '1rem' }}>+</div>
            <div style={{ fontSize: '13px', color: 'var(--stripe-purple)', fontWeight: 500 }}>Create Sequence</div>
          </div>
        </div>
      )}
    </div>
  );
}
