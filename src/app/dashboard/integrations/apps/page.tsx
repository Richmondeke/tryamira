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
  const [connectStep, setConnectStep] = useState(1);
  const [billingTier, setBillingTier] = useState<'starter' | 'pro' | 'team' | 'enterprise'>('starter');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('amira_billing_tier');
      if (cached) setBillingTier(cached as 'starter' | 'pro' | 'team' | 'enterprise');
    }
  }, []);

  const [integrations, setIntegrations] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('amira_cached_integrations');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('amira_cached_integrations');
      return !cached;
    }
    return true;
  });

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
        
        // Cache the mapped results locally
        if (typeof window !== 'undefined') {
          localStorage.setItem('amira_cached_integrations', JSON.stringify(mapped));
        }
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
      const isCRM = ['hubspot', 'salesforce'].includes(app.id?.toLowerCase()) || 
                    app.name?.toLowerCase().includes('hubspot') || 
                    app.name?.toLowerCase().includes('salesforce');
      if (isCRM && (billingTier === 'starter' || billingTier === 'pro')) {
        setToast("🔌 CRM Integrations (HubSpot, Salesforce) are restricted on the Starter & Pro Plans. Upgrade to the Team Plan to connect your pipelines.");
        return;
      }
      setConnectingApp(app);
      setShowModal(true);
    }
  };

  const handleUninstall = async (e: React.MouseEvent, appId: string, appName: string) => {
    e.stopPropagation();
    const res = await removeComposioIntegration(appId);
    if (res.success) {
      setIntegrations(prev => {
        const updated = prev.map(a => a.id === appId ? { ...a, status: 'Not Installed' } : a);
        if (typeof window !== 'undefined') {
          localStorage.setItem('amira_cached_integrations', JSON.stringify(updated));
        }
        return updated;
      });
      setToast(`${appName} disconnected successfully.`);
    } else {
      setToast(`Failed to disconnect ${appName}.`);
    }
  };

  const performInstall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectingApp) return;

    setIsConnecting(true);
    setConnectStep(1);

    try {
      // 1. Request dynamic connection link from server action (which links directly to Composio SDK)
      const res = await initiateComposioConnection(connectingApp.id);
      
      if (res.success && res.redirectUrl) {
        setConnectStep(2);
        // 2. Local fallback save state (just in case they close before callback redirects)
        await saveIntegrationConfig(connectingApp.id, { connected: true });
        
        setTimeout(() => {
          setConnectStep(3);
          // 3. Perform redirect to Composio OAuth flows
          setTimeout(() => {
            window.location.href = res.redirectUrl as string;
          }, 1000);
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
          <div style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            {/* Connection Visual Tunnel */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ padding: '10px 16px', backgroundColor: 'rgba(0, 82, 204, 0.08)', border: '1px solid rgba(0, 82, 204, 0.15)', borderRadius: '8px', color: '#0052cc', fontWeight: 700, fontSize: '13px' }}>
                Amira
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                <span style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }} />
                <span style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }} />
              </div>
              <div style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#334155', fontWeight: 700, fontSize: '13px' }}>
                {connectingApp?.name?.substring(0, 10)}
              </div>
            </div>

            {/* Stepper Status Indicators */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px', margin: '0 auto', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: connectStep >= 1 ? '#0f172a' : '#94a3b8' }}>
                <span style={{ color: connectStep > 1 ? '#4caf50' : '#3b82f6', fontWeight: 'bold' }}>
                  {connectStep > 1 ? '✓' : '●'}
                </span>
                <span>Generating Composio OAuth session...</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: connectStep >= 2 ? '#0f172a' : '#94a3b8' }}>
                <span style={{ color: connectStep > 2 ? '#4caf50' : connectStep === 2 ? '#3b82f6' : '#94a3b8', fontWeight: 'bold' }}>
                  {connectStep > 2 ? '✓' : connectStep === 2 ? '●' : '○'}
                </span>
                <span>Configuring callback channels...</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: connectStep >= 3 ? '#0f172a' : '#94a3b8' }}>
                <span style={{ color: connectStep === 3 ? '#3b82f6' : '#94a3b8', fontWeight: 'bold' }}>
                  {connectStep === 3 ? '●' : '○'}
                </span>
                <span>Redirecting to secure login...</span>
              </div>
            </div>
            
            {/* Progress line */}
            <div style={{ width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden', marginTop: '2rem' }}>
              <div style={{ 
                width: connectStep === 1 ? '33%' : connectStep === 2 ? '66%' : '100%', 
                height: '100%', 
                backgroundColor: '#3b82f6', 
                transition: 'width 0.8s ease-in-out' 
              }} />
            </div>
          </div>
        ) : (
          <form onSubmit={performInstall}>
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Connect your <strong>{connectingApp?.name}</strong> account to allow Amira AI agents to sync and automate workflows inside your CRM.
            </p>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--stripe-border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '12px', color: 'var(--stripe-body)', lineHeight: 1.5 }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✓</span>
                  <span>OAuth 2.0 connection powered securely by <strong>Composio</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✓</span>
                  <span>Scoped read & write access only</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✓</span>
                  <span>Revocable at any time from Settings</span>
                </div>
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
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#3b82f6'; }}
              >
                Redirect & Authorize
              </button>
            </div>
          </form>
        )}
      </Modal>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
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
                  border: isInstalled ? '1px solid #4caf50' : '1px solid var(--stripe-border)', 
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
                    backgroundColor: 'rgba(76, 175, 80, 0.1)', 
                    color: '#4caf50',
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
                <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0', fontWeight: 500 }}>{app.name}</h3>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
