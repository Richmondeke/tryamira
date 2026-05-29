'use client';

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';

export default function BroadcastPage() {
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
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Channel</label>
            <select style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
              <option>Email</option>
              <option>SMS</option>
              <option>WhatsApp</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Message Body</label>
            <textarea required rows={4} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', resize: 'vertical' }} placeholder="Hi {{first_name}}, check out our new listings!"></textarea>
          </div>
          <button type="submit" style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Schedule Send</button>
        </form>
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Broadcasts</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0 }}>Send one-off messages to your leads.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>New Broadcast</button>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f6f9fc', borderBottom: '1px solid var(--stripe-border)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>CAMPAIGN NAME</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>AUDIENCE</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>SENT</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>OPEN RATE</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--stripe-border)' }}>
              <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Q3 Promotion</td>
              <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-body)' }}>All Leads</td>
              <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-body)' }}>Aug 12, 2024</td>
              <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-success-text)' }}>42%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
