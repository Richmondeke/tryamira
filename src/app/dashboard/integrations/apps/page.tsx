'use client';

import { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';

export default function IntegrationsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [connectingApp, setConnectingApp] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const integrations = [
    { name: 'HubSpot', desc: 'Sync leads to your HubSpot CRM.', status: 'Not Installed', icon: '🟠' },
    { name: 'Salesforce', desc: 'Two-way sync for Salesforce records.', status: 'Not Installed', icon: '☁️' },
    { name: 'Zapier', desc: 'Connect Amira to 5,000+ apps.', status: 'Installed', icon: '⚡' },
    { name: 'Stripe', desc: 'Capture payments directly in chat.', status: 'Not Installed', icon: '💳' }
  ];

  const handleInstallClick = (appName: string) => {
    setConnectingApp(appName);
    setShowModal(true);
  };

  const performInstall = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setShowModal(false);
      setToast(`${connectingApp} installed successfully!`);
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showModal} onClose={() => !isConnecting && setShowModal(false)} title={`Install ${connectingApp}`}>
        {isConnecting ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ color: 'var(--stripe-purple)', fontSize: '12px', fontWeight: 500 }}>Authorizing...</div>
            <p style={{ color: 'var(--stripe-muted)', fontSize: '12px', marginTop: '0.5rem' }}>Securely connecting Amira to {connectingApp}.</p>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--stripe-body)', fontSize: '12px', marginBottom: '1rem' }}>
              Amira will request permission to read and write data to your {connectingApp} account to ensure seamless synchronization.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={performInstall} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: 'var(--stripe-purple)', color: '#fff', cursor: 'pointer' }}>Authorize Integration</button>
            </div>
          </div>
        )}
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>App Integrations</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0 }}>Connect Amira with your existing software stack.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {integrations.map((app, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {app.icon}
              </div>
              {app.status === 'Installed' ? (
                <span style={{ fontSize: '12px', color: 'var(--stripe-success-text)', backgroundColor: 'rgba(21,190,83,0.1)', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>Installed</span>
              ) : (
                <button onClick={() => handleInstallClick(app.name)} style={{ backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.35rem 0.75rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Install</button>
              )}
            </div>
            <h3 style={{ fontSize: '12px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 500 }}>{app.name}</h3>
            <p style={{ fontSize: '12px', color: 'var(--stripe-body)', margin: 0 }}>{app.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
