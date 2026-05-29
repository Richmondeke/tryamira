'use client';

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';

export default function SettingsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setToast('Preferences saved successfully!');
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setShowInviteModal(false);
    setToast('Invite sent to team member.');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Team Member">
        <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Email Address</label>
            <input type="email" required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} placeholder="colleague@company.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Role</label>
            <select style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
              <option>Admin</option>
              <option>Agent</option>
              <option>Viewer</option>
            </select>
          </div>
          <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Send Invite</button>
        </form>
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Workspace Settings</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '14px', margin: 0 }}>Manage your team and workspace preferences.</p>
        </div>
        <button onClick={() => setShowInviteModal(true)} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>+ Invite Team</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f6f9fc', borderRadius: '6px', color: 'var(--stripe-navy)', fontWeight: 500, fontSize: '14px', cursor: 'pointer' }}>General</div>
          <div style={{ padding: '1rem', color: 'var(--stripe-body)', fontSize: '14px', cursor: 'pointer' }}>Team Members</div>
          <div style={{ padding: '1rem', color: 'var(--stripe-body)', fontSize: '14px', cursor: 'pointer' }}>Billing & Invoices</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <form onSubmit={handleSavePreferences} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>General Information</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Workspace Name</label>
              <input type="text" defaultValue="Acme Real Estate" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px', color: 'var(--stripe-navy)' }} />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Timezone</label>
              <select style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px', color: 'var(--stripe-navy)', backgroundColor: '#fff' }}>
                <option>Pacific Time (PT)</option>
                <option defaultValue="Eastern Time (ET)">Eastern Time (ET)</option>
                <option>Greenwich Mean Time (GMT)</option>
              </select>
            </div>
            
            <button type="submit" style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Save Preferences</button>
          </form>
        </div>
      </div>
    </div>
  );
}
