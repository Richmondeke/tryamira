'use client';

import { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';
import { Mail } from 'lucide-react';

export default function Page() {
  const [inboxes, setInboxes] = useState<any[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleAddInbox = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    setInboxes([
      ...inboxes,
      { id: Date.now(), email, status: 'Connected', autoReply: false }
    ]);
    
    setShowModal(false);
    setToast('Inbox connected successfully!');
  };

  const toggleAutoReply = (id: number) => {
    setInboxes(inboxes.map(inbox => {
      if (inbox.id === id) {
        const newValue = !inbox.autoReply;
        if (newValue) {
          setToast(`Auto-reply enabled for ${inbox.email}`);
        } else {
          setToast(`Auto-reply disabled for ${inbox.email}`);
        }
        return { ...inbox, autoReply: newValue };
      }
      return inbox;
    }));
  };

  const reconnect = (id: number) => {
    setInboxes(inboxes.map(inbox => {
      if (inbox.id === id) {
        setToast(`Successfully reconnected ${inbox.email}`);
        return { ...inbox, status: 'Connected' };
      }
      return inbox;
    }));
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Connect Inbox">
        <form onSubmit={handleAddInbox} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Email Address</label>
            <input required type="email" name="email" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} placeholder="e.g., hello@yourcompany.com" />
          </div>
          <button type="submit" style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Connect via OAuth</button>
        </form>
      </Modal>

      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Email Agent</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Connect your inboxes and configure auto-replies.</p>
      </div>
      
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        {inboxes.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Mail style={{ width: '24px', height: '24px', color: '#64748b' }} />
            </div>
            <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 500 }}>No inboxes connected</h3>
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: '0 0 1.5rem 0', maxWidth: '300px' }}>Connect your email inbox to start receiving and responding to customer queries automatically.</p>
            <button onClick={() => setShowModal(true)} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>Connect Inbox</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '12px', color: 'var(--stripe-navy)', margin: 0, fontWeight: 500 }}>Connected Inboxes</h3>
              <button onClick={() => setShowModal(true)} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>+ Add Inbox</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--stripe-border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>EMAIL ADDRESS</th>
                  <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>STATUS</th>
                  <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>AUTO-REPLY</th>
                  <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {inboxes.map((inbox) => (
                  <tr key={inbox.id} style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                    <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-navy)' }}>{inbox.email}</td>
                    <td style={{ padding: '1rem 0' }}>
                      {inbox.status === 'Connected' ? (
                        <span style={{ backgroundColor: 'rgba(21,190,83,0.1)', color: 'var(--stripe-success-text)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Connected</span>
                      ) : (
                        <span style={{ backgroundColor: 'rgba(217,45,32,0.1)', color: '#d92d20', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Disconnected</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <div 
                        onClick={() => toggleAutoReply(inbox.id)}
                        style={{ 
                          width: '36px', 
                          height: '20px', 
                          backgroundColor: inbox.autoReply ? 'var(--stripe-purple)' : '#e3e8ee', 
                          borderRadius: '10px', 
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: '#fff', 
                          borderRadius: '50%', 
                          position: 'absolute', 
                          top: '2px', 
                          left: inbox.autoReply ? '18px' : '2px',
                          transition: 'left 0.2s',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}></div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-purple)', cursor: 'pointer' }}>
                      {inbox.status === 'Connected' ? (
                        <span onClick={() => setToast(`Configuring auto-reply for ${inbox.email}`)}>Configure</span>
                      ) : (
                        <span onClick={() => reconnect(inbox.id)}>Reconnect</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

    </div>
  );
}
