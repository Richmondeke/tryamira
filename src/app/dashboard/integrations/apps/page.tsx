'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';
import { 
  getComposioApps, 
  getComposioStatus, 
  initiateComposioConnection, 
  removeComposioIntegration, 
  saveIntegrationConfig 
} from '@/app/actions/integrations';

export default function IntegrationsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [connectingApp, setConnectingApp] = useState<any | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<any[]>([]);

  // Function to load all integrations dynamically
  const loadIntegrations = async () => {
    try {
      const appsRes = await getComposioApps();
      const statusRes = await getComposioStatus();

      if (appsRes.success && appsRes.data) {
        const activeIds = statusRes.success && statusRes.data
          ? statusRes.data.map((d: any) => d.provider.toLowerCase())
          : [];

        const mapped = appsRes.data.map((app: any) => ({
          ...app,
          status: activeIds.includes(app.id.toLowerCase()) ? 'Installed' : 'Not Installed'
        }));

        setIntegrations(mapped);
      }
    } catch (err) {
      console.error('Failed to load integrations:', err);
      setToast('Failed to sync integration status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Check for OAuth callback parameters in URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status');
      const app = params.get('app');

      if (status === 'success' && app) {
        // Automatically save local DB status to make it active
        saveIntegrationConfig(app, { connected: true }).then(() => {
          // Find matching app name if possible
          const cleanName = app.charAt(0).toUpperCase() + app.slice(1);
          setToast(`🎉 Successfully authenticated! ${cleanName} is now connected.`);
          
          // Clear query parameters cleanly from URL without reloading
          const url = new URL(window.location.href);
          url.searchParams.delete('status');
          url.searchParams.delete('app');
          window.history.replaceState({}, '', url.pathname + url.search);
          
          // Reload integrations to display newly installed status
          loadIntegrations();
        });
        return;
      }
    }

    loadIntegrations();
  }, []);

  const handleCardClick = (app: any) => {
    if (app.status !== 'Installed') {
      setConnectingApp(app);
      setShowModal(true);
    }
  };

  const handleUninstall = async (e: React.MouseEvent, appId: string, appName: string) => {
    e.stopPropagation();
    const res = await removeComposioIntegration(appId);
    if (res.success) {
      setIntegrations(prev => prev.map(a => a.id === appId ? { ...a, status: 'Not Installed' } : a));
      setToast(`${appName} disconnected successfully.`);
    } else {
      setToast(`Failed to disconnect ${appName}.`);
    }
  };

  const performInstall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectingApp) return;

    setIsConnecting(true);

    try {
      // 1. Request dynamic connection link from server action (which links directly to Composio SDK)
      const res = await initiateComposioConnection(connectingApp.id);
      
      if (res.success && res.redirectUrl) {
        // 2. Local fallback save state (just in case they close before callback redirects)
        await saveIntegrationConfig(connectingApp.id, { connected: true });
        
        setToast(`Redirecting to ${connectingApp.name} secure login...`);
        
        // 3. Perform redirect to Composio OAuth flows
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
      
      <Modal isOpen={showModal} onClose={() => !isConnecting && setShowModal(false)} title={`Install ${connectingApp?.name}`}>
        {isConnecting ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
            <div style={{ color: '#6366f1', fontSize: '14px', fontWeight: 600 }}>Secure Authorization</div>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '0.5rem', marginInline: 'auto', maxWidth: '320px' }}>
              Redirecting you to the Composio OAuth portal to authorize {connectingApp?.name} securely...
            </p>
          </div>
        ) : (
          <form onSubmit={performInstall}>
            <p style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Connect your <strong>{connectingApp?.name}</strong> account to allow Amira AI agents to sync and automate workflows inside your CRM.
            </p>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
                <span style={{ fontSize: '16px' }}>🛡️</span>
                <span>
                  <strong>Composio Verified Connection:</strong> Authentication takes place directly through secure OAuth. Amira does not store your credentials.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#cbd5e1', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', backgroundColor: '#6366f1', color: '#fff', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#4f46e5'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#6366f1'; }}
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

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 500, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>Composio Integrations</h2>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
          Enable multi-source syncing for your dialer, sync HubSpot CRM pipelines, import Google Contacts, and connect your workflow stack via Composio.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {[1, 2, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              style={{ 
                width: 'calc(50% - 0.5rem)', 
                height: '140px', 
                backgroundColor: 'rgba(30, 41, 59, 0.5)', 
                border: '1px solid rgba(255,255,255,0.04)', 
                borderRadius: '8px', 
                animation: 'pulse 1.5s infinite ease-in-out' 
              }} 
            />
          ))}
          <style jsx>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.6; }
              50% { opacity: 0.3; }
            }
          `}</style>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {integrations.map((app, i) => {
            const isInstalled = app.status === 'Installed';
            return (
              <div 
                key={app.id || i} 
                onClick={() => handleCardClick(app)}
                style={{ 
                  backgroundColor: isInstalled ? 'rgba(30, 41, 59, 0.4)' : 'rgba(15, 23, 42, 0.6)', 
                  border: isInstalled ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '10px', 
                  padding: '1.5rem', 
                  backdropFilter: 'blur(12px)',
                  boxShadow: isInstalled ? '0 4px 20px rgba(99, 102, 241, 0.05)' : 'none',
                  cursor: isInstalled ? 'default' : 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => { 
                  if (!isInstalled) {
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px -10px rgba(0,0,0,0.5)';
                  }
                }}
                onMouseOut={(e) => { 
                  if (!isInstalled) {
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {/* Visual Installed Accent */}
                {isInstalled && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#6366f1' }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ 
                    width: '46px', 
                    height: '46px', 
                    borderRadius: '10px', 
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '22px' 
                  }}>
                    {app.icon && app.icon.startsWith('http') ? (
                      <img src={app.icon || undefined} alt={app.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                    ) : (
                      app.icon || '🧩'
                    )}
                  </div>
                  {isInstalled ? (
                    <button 
                      onClick={(e) => handleUninstall(e, app.id, app.name)} 
                      style={{ 
                        backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                        color: '#f87171', 
                        border: '1px solid rgba(239, 68, 68, 0.2)', 
                        borderRadius: '6px', 
                        padding: '0.4rem 0.9rem', 
                        fontSize: '12px', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
                    >
                      Uninstall
                    </button>
                  ) : (
                    <span style={{ 
                      fontSize: '11px', 
                      backgroundColor: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.05)',
                      padding: '0.25rem 0.6rem', 
                      borderRadius: '12px', 
                      color: '#64748b',
                      fontWeight: 500
                    }}>
                      Not Active
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '14px', color: '#f8fafc', margin: '0 0 0.5rem 0', fontWeight: 600 }}>{app.name}</h3>
                <p style={{ fontSize: '12px', color: isInstalled ? '#cbd5e1' : '#64748b', margin: 0, lineHeight: 1.5 }}>
                  {app.desc || `Integrate ${app.name} smoothly via secure Composio login.`}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
