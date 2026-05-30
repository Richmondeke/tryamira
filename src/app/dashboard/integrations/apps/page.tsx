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
          const cleanName = app.charAt(0).toUpperCase() + app.slice(1);
          setToast(`🎉 Successfully connected to ${cleanName}!`);
          
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
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', marginTop: '0.5rem', marginInline: 'auto', maxWidth: '320px', lineHeight: 1.5 }}>
              Redirecting you to the Composio OAuth portal to authorize {connectingApp?.name} securely...
            </p>
          </div>
        ) : (
          <form onSubmit={performInstall}>
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Connect your <strong>{connectingApp?.name}</strong> account to allow Amira AI agents to sync and automate workflows inside your CRM.
            </p>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--stripe-border)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '12px', color: 'var(--stripe-body)', lineHeight: 1.5 }}>
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
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f6f9fc'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', backgroundColor: '#6366f1', color: '#fff', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', transition: 'all 0.2s' }}
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

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 400, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>Software Apps</h2>
        <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>
          Connect Amira with your existing software stack.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              style={{ 
                width: 'calc(50% - 0.5rem)', 
                height: '140px', 
                backgroundColor: '#ffffff', 
                border: '1px solid var(--stripe-border)', 
                borderRadius: '6px', 
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
                  backgroundColor: '#ffffff', 
                  border: isInstalled ? '1px solid #6366f1' : '1px solid var(--stripe-border)', 
                  borderRadius: '6px', 
                  padding: '1.5rem', 
                  boxShadow: 'var(--stripe-shadow-ambient)',
                  cursor: isInstalled ? 'default' : 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  position: 'relative'
                }}
                onMouseOver={(e) => { 
                  if (!isInstalled) {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(50,50,93,0.08)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => { 
                  if (!isInstalled) {
                    e.currentTarget.style.boxShadow = 'var(--stripe-shadow-ambient)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Visual Installed Badge */}
                {isInstalled && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '1.5rem', 
                    right: '1.5rem', 
                    fontSize: '11px', 
                    backgroundColor: 'rgba(99, 102, 241, 0.1)', 
                    color: '#6366f1',
                    padding: '0.25rem 0.6rem', 
                    borderRadius: '12px', 
                    fontWeight: 600
                  }}>
                    Connected
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px', 
                    backgroundColor: '#f6f9fc', 
                    border: '1px solid var(--stripe-border)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '20px' 
                  }}>
                    {app.icon && app.icon.startsWith('http') ? (
                      <img src={app.icon || undefined} alt={app.name} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                    ) : (
                      app.icon || '🧩'
                    )}
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
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginRight: '5.5rem' // push to left of Connected badge
                      }}
                      onMouseOver={(e) => { 
                        e.currentTarget.style.backgroundColor = '#fff1f0'; 
                      }}
                      onMouseOut={(e) => { 
                        e.currentTarget.style.backgroundColor = '#ffffff'; 
                      }}
                    >
                      Uninstall
                    </button>
                  )}
                </div>
                <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 500 }}>{app.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--stripe-body)', margin: 0, lineHeight: 1.5 }}>
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
