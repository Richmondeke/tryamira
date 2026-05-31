'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';
import { Mail, Settings } from 'lucide-react';
import { 
  getComposioApps, 
  getComposioStatus, 
  initiateComposioConnection, 
  removeComposioIntegration,
  saveIntegrationConfig
} from '@/app/actions/integrations';

export default function Page() {
  const [toast, setToast] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [connectingApp, setConnectingApp] = useState<any | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emailApps, setEmailApps] = useState<any[]>([]);

  // List of slugs or keywords for email apps in Composio
  const EMAIL_APP_KEYS = ['gmail', 'outlook', 'sendgrid', 'mailchimp', 'exchange', 'imap', 'smtp'];

  const loadIntegrations = async () => {
    try {
      const appsRes = await getComposioApps();
      const statusRes = await getComposioStatus();

      if (appsRes.success && appsRes.data) {
        const activeIds = statusRes.success && statusRes.data
          ? statusRes.data.map((d: any) => d.provider.toLowerCase())
          : [];

        const filtered = appsRes.data.filter((app: any) => 
          EMAIL_APP_KEYS.includes(app.id.toLowerCase()) || 
          app.name.toLowerCase().includes('mail') ||
          app.name.toLowerCase().includes('inbox')
        );

        const mapped = filtered.map((app: any) => ({
          ...app,
          status: activeIds.includes(app.id.toLowerCase()) ? 'Connected' : 'Disconnected',
          autoReply: activeIds.includes(app.id.toLowerCase()) // just mockup auto-reply for now based on status
        }));

        setEmailApps(mapped);
      }
    } catch (err) {
      console.error('Failed to load email integrations:', err);
      setToast('Failed to sync integration status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status');
      const app = params.get('app');

      if (status === 'success' && app) {
        saveIntegrationConfig(app, { connected: true }).then(() => {
          const cleanName = app.charAt(0).toUpperCase() + app.slice(1);
          setToast(`🎉 Successfully connected to ${cleanName}!`);
          
          const url = new URL(window.location.href);
          url.searchParams.delete('status');
          url.searchParams.delete('app');
          window.history.replaceState({}, '', url.pathname + url.search);
          
          loadIntegrations();
        });
        return;
      }
    }
    loadIntegrations();
  }, []);

  const handleCardClick = (app: any) => {
    if (app.status !== 'Connected') {
      setConnectingApp(app);
      setShowModal(true);
    }
  };

  const handleUninstall = async (e: React.MouseEvent, appId: string, appName: string) => {
    e.stopPropagation();
    const res = await removeComposioIntegration(appId);
    if (res.success) {
      setEmailApps(prev => prev.map(a => a.id === appId ? { ...a, status: 'Disconnected', autoReply: false } : a));
      setToast(`${appName} disconnected successfully.`);
    } else {
      setToast(`Failed to disconnect ${appName}.`);
    }
  };

  const toggleAutoReply = (appId: string, currentAutoReply: boolean) => {
    setEmailApps(prev => prev.map(app => {
      if (app.id === appId) {
        const newValue = !currentAutoReply;
        setToast(`Auto-reply ${newValue ? 'enabled' : 'disabled'} for ${app.name}`);
        return { ...app, autoReply: newValue };
      }
      return app;
    }));
  };

  const performInstall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectingApp) return;

    setIsConnecting(true);

    try {
      const res = await initiateComposioConnection(connectingApp.id, '/dashboard/chat/email');
      
      if (res.success && res.redirectUrl) {
        await saveIntegrationConfig(connectingApp.id, { connected: true });
        setToast(`Redirecting to ${connectingApp.name} secure login...`);
        setTimeout(() => {
          window.location.href = res.redirectUrl as string;
        }, 1200);
      } else {
        setToast(`Failed to establish OAuth link with ${connectingApp.name}.`);
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
      
      <Modal isOpen={showModal} onClose={() => !isConnecting && setShowModal(false)} title={`Connect ${connectingApp?.name}`}>
        {isConnecting ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #4caf50', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
            <div style={{ color: '#4caf50', fontSize: '14px', fontWeight: 600 }}>Secure Authorization</div>
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', marginTop: '0.5rem', marginInline: 'auto', maxWidth: '320px', lineHeight: 1.5 }}>
              Redirecting you to the Composio OAuth portal to authorize {connectingApp?.name} securely...
            </p>
          </div>
        ) : (
          <form onSubmit={performInstall}>
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Connect your <strong>{connectingApp?.name}</strong> account to allow Amira AI agents to read and respond to emails automatically.
            </p>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--stripe-border)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '12px', color: 'var(--stripe-body)', lineHeight: 1.5 }}>
                <span style={{ fontSize: '16px' }}>🛡️</span>
                <span>
                  <strong>Composio Verified Connection:</strong> Authentication takes place directly through secure OAuth. Amira does not store your email credentials.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', backgroundColor: '#4caf50', color: '#fff', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)', transition: 'all 0.2s' }}
              >
                Connect {connectingApp?.name}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Email Agent</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Connect your email integrations and allow Amira to automatically reply to queries.</p>
      </div>
      
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        {loading ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '2px solid var(--stripe-purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', marginTop: '1rem' }}>Loading available email providers...</p>
          </div>
        ) : emailApps.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Mail style={{ width: '24px', height: '24px', color: '#64748b' }} />
            </div>
            <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 500 }}>No email providers found</h3>
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: '0 0 1.5rem 0', maxWidth: '300px' }}>Could not load email providers from Composio. Please check your API key.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '12px', color: 'var(--stripe-navy)', margin: 0, fontWeight: 500 }}>Available Email Integrations</h3>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--stripe-border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>PROVIDER</th>
                  <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>STATUS</th>
                  <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>AUTO-REPLY</th>
                  <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {emailApps.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                    <td style={{ padding: '1rem 0', fontSize: '13px', color: 'var(--stripe-navy)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#f6f9fc', border: '1px solid var(--stripe-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        {app.icon && app.icon.startsWith('http') ? (
                          <img src={app.icon} alt={app.name} style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                        ) : (
                          app.icon || '📧'
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500 }}>{app.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--stripe-body)' }}>{app.id}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      {app.status === 'Connected' ? (
                        <span style={{ backgroundColor: 'rgba(21,190,83,0.1)', color: 'var(--stripe-success-text)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Connected</span>
                      ) : (
                        <span style={{ backgroundColor: 'rgba(217,45,32,0.1)', color: '#d92d20', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Disconnected</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <div 
                        onClick={() => app.status === 'Connected' && toggleAutoReply(app.id, app.autoReply)}
                        style={{ 
                          width: '36px', 
                          height: '20px', 
                          backgroundColor: app.autoReply && app.status === 'Connected' ? 'var(--stripe-purple)' : '#e3e8ee', 
                          borderRadius: '10px', 
                          position: 'relative',
                          cursor: app.status === 'Connected' ? 'pointer' : 'not-allowed',
                          opacity: app.status === 'Connected' ? 1 : 0.5,
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
                          left: app.autoReply && app.status === 'Connected' ? '18px' : '2px',
                          transition: 'left 0.2s',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}></div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0', fontSize: '12px' }}>
                      {app.status === 'Connected' ? (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <span onClick={() => setToast(`Configuring settings for ${app.name}`)} style={{ color: 'var(--stripe-purple)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Settings size={14} /> Configure
                          </span>
                          <span onClick={(e) => handleUninstall(e, app.id, app.name)} style={{ color: '#d92d20', cursor: 'pointer' }}>Disconnect</span>
                        </div>
                      ) : (
                        <span onClick={() => handleCardClick(app)} style={{ color: 'var(--stripe-purple)', cursor: 'pointer', fontWeight: 500 }}>Connect</span>
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
