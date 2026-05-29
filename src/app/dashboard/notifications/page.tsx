'use client';

import { useState } from 'react';
import Toast from '../../../components/ui/Toast';

export default function NotificationsPage() {
  const [toast, setToast] = useState<string | null>(null);

  const handleToggle = (setting: string) => {
    setToast(`${setting} preference updated.`);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Notification Preferences</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0 }}>Control when and how you are alerted.</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <h3 style={{ fontSize: '12px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Email Alerts</h3>
        
        {[
          { title: 'New Lead Captured', desc: 'Get an email immediately when a new lead is captured by the AI.', active: true },
          { title: 'Human Takeover Requested', desc: 'Alert when a user explicitly asks to speak to a human.', active: true },
          { title: 'Daily Performance Summary', desc: "A morning digest of yesterday's metrics.", active: false },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', borderBottom: i === 2 ? 'none' : '1px solid var(--stripe-border)' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.25rem' }}>{item.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--stripe-body)' }}>{item.desc}</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked={item.active} onChange={() => handleToggle(item.title)} style={{ width: '18px', height: '18px', accentColor: 'var(--stripe-purple)' }} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
