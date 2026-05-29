'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';
import { getComposioStatus, initiateComposioConnection, removeComposioIntegration, saveIntegrationConfig } from '@/app/actions/integrations';

export default function IntegrationsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [connectingApp, setConnectingApp] = useState<any | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Inputs
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  const [integrations, setIntegrations] = useState([
    { id: 'hubspot', name: 'HubSpot', desc: 'Sync leads to your HubSpot CRM.', status: 'Not Installed', icon: '🟠', type: 'oauth' },
    { id: 'salesforce', name: 'Salesforce', desc: 'Two-way sync for Salesforce records.', status: 'Not Installed', icon: '☁️', type: 'oauth' },
    { id: 'zapier', name: 'Zapier', desc: 'Connect Amira to 5,000+ apps.', status: 'Not Installed', icon: '⚡', type: 'webhook' },
    { id: 'stripe', name: 'Stripe', desc: 'Capture payments directly in chat.', status: 'Not Installed', icon: '💳', type: 'oauth' },
    { id: 'slack', name: 'Slack', desc: 'Send notifications to Slack channels.', status: 'Not Installed', icon: '💬', type: 'oauth' },
    { id: 'googlecalendar', name: 'Google Calendar', desc: 'Book meetings directly on your calendar.', status: 'Not Installed', icon: '📅', type: 'oauth' },
    { id: 'zendesk', name: 'Zendesk', desc: 'Create and manage support tickets.', status: 'Not Installed', icon: '🎧', type: 'oauth' },
    { id: 'mailchimp', name: 'Mailchimp', desc: 'Sync email subscribers automatically.', status: 'Not Installed', icon: '✉️', type: 'oauth' },
    { id: 'shopify', name: 'Shopify', desc: 'Manage e-commerce orders and customers.', status: 'Not Installed', icon: '🛍️', type: 'oauth' },
    { id: 'notion', name: 'Notion', desc: 'Sync data to Notion databases.', status: 'Not Installed', icon: '📝', type: 'oauth' },
  ]);

  useEffect(() => {
    // Load Composio connections
    getComposioStatus().then(res => {
      if (res.success && res.data) {
        const activeIds = res.data.map((d: any) => d.provider);
        setIntegrations(prev => prev.map(app => 
          activeIds.includes(app.id) ? { ...app, status: 'Installed' } : app
        ));
      }
    });
  }, []);

  const handleCardClick = (app: any) => {
    if (app.status !== 'Installed') {
      setConnectingApp(app);
      setApiKey('');
      setWebhookUrl('');
      setShowModal(true);
    }
  };

  const handleUninstall = async (e: React.MouseEvent, appId: string, appName: string) => {
    e.stopPropagation();
    const res = await removeComposioIntegration(appId);
    if (res.success) {
      setIntegrations(prev => prev.map(a => a.id === appId ? { ...a, status: 'Not Installed' } : a));
      setToast(`${appName} disconnected.`);
    } else {
      setToast(`Failed to disconnect ${appName}.`);
    }
  };

  const performInstall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectingApp) return;

    setIsConnecting(true);

    try {
      // 1. Ask Composio for an OAuth redirect URL
      const res = await initiateComposioConnection(connectingApp.id);
      
      if (res.success && res.redirectUrl) {
        // Also save a mock state locally so the UI updates
        await saveIntegrationConfig(connectingApp.id, { connected: true });
        
        // 2. Redirect the user to the Composio OAuth flow
        setToast(`Redirecting to ${connectingApp.name}...`);
        setTimeout(() => {
          window.location.href = res.redirectUrl;
        }, 1500);
      } else {
        setToast(`Failed to initiate ${connectingApp.name} connection.`);
        setIsConnecting(false);
        setShowModal(false);
      }
    } catch (err) {
      setToast(`Error connecting to ${connectingApp.name}.`);
      setIsConnecting(false);
      setShowModal(false);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showModal} onClose={() => !isConnecting && setShowModal(false)} title={`Install ${connectingApp?.name}`}>
        {isConnecting ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ color: 'var(--stripe-purple)', fontSize: '14px', fontWeight: 500 }}>Authorizing...</div>
            <p style={{ color: 'var(--stripe-muted)', fontSize: '13px', marginTop: '0.5rem' }}>Securely connecting Amira to {connectingApp?.name}.</p>
          </div>
        ) : (
          <form onSubmit={performInstall}>
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Connect your <strong>{connectingApp?.name}</strong> account to sync data directly with your AI Agents.
            </p>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '4px', border: '1px solid var(--stripe-border)' }}>
              <p style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: 0, lineHeight: 1.5 }}>
                Amira securely authenticates and connects your accounts. You will be redirected to the official {connectingApp?.name} login page to grant access.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
              <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: '#6366f1', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                Connect {connectingApp?.name}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 400, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>Software Apps</h2>
        <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>Connect Amira with your existing software stack.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {integrations.map((app, i) => {
          const isInstalled = app.status === 'Installed';
          return (
            <div 
              key={i} 
              onClick={() => handleCardClick(app)}
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid var(--stripe-border)', 
                borderRadius: '6px', 
                padding: '1.25rem', 
                boxShadow: 'var(--stripe-shadow-ambient)',
                cursor: isInstalled ? 'default' : 'pointer',
                transition: 'box-shadow 0.2s',
              }}
              onMouseOver={(e) => { if (!isInstalled) e.currentTarget.style.boxShadow = '0 8px 24px rgba(50,50,93,0.1)'; }}
              onMouseOut={(e) => { if (!isInstalled) e.currentTarget.style.boxShadow = 'var(--stripe-shadow-ambient)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  {app.icon}
                </div>
                {isInstalled && (
                  <button 
                    onClick={(e) => handleUninstall(e, app.id, app.name)} 
                    style={{ 
                      backgroundColor: '#ffffff', 
                      color: '#d92d20', 
                      border: '1px solid #d92d20', 
                      borderRadius: '4px', 
                      padding: '0.35rem 0.75rem', 
                      fontSize: '12px', 
                      fontWeight: 500, 
                      cursor: 'pointer'
                    }}>
                    Uninstall
                  </button>
                )}
              </div>
              <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 500 }}>{app.name}</h3>
              <p style={{ fontSize: '12px', color: isInstalled ? 'var(--stripe-body)' : '#9ca3af', margin: 0 }}>{app.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
