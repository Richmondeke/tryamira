import os

base_dir = "/Users/mac/.gemini/antigravity/scratch/tryamira/src/app/dashboard"

# 1. Update /dashboard/integrations/page.tsx
integrations_content = """'use client';

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';

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
    setShowModal(True);
  };

  const performInstall = () => {
    setIsConnecting(True);
    setTimeout(() => {
      setIsConnecting(False);
      setShowModal(False);
      setToast(`${connectingApp} installed successfully!`);
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showModal} onClose={() => !isConnecting && setShowModal(False)} title={`Install ${connectingApp}`}>
        {isConnecting ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ color: 'var(--stripe-purple)', fontSize: '18px', fontWeight: 500 }}>Authorizing...</div>
            <p style={{ color: 'var(--stripe-muted)', fontSize: '14px', marginTop: '0.5rem' }}>Securely connecting Amira to {connectingApp}.</p>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--stripe-body)', fontSize: '14px', marginBottom: '1.5rem' }}>
              Amira will request permission to read and write data to your {connectingApp} account to ensure seamless synchronization.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(False)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={performInstall} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: 'var(--stripe-purple)', color: '#fff', cursor: 'pointer' }}>Authorize Integration</button>
            </div>
          </div>
        )}
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>App Integrations</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '14px', margin: 0 }}>Connect Amira with your existing software stack.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {integrations.map((app, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {app.icon}
              </div>
              {app.status === 'Installed' ? (
                <span style={{ fontSize: '12px', color: 'var(--stripe-success-text)', backgroundColor: 'rgba(21,190,83,0.1)', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>Installed</span>
              ) : (
                <button onClick={() => handleInstallClick(app.name)} style={{ backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.35rem 0.75rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Install</button>
              )}
            </div>
            <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 500 }}>{app.name}</h3>
            <p style={{ fontSize: '14px', color: 'var(--stripe-body)', margin: 0 }}>{app.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
""".replace("True", "true").replace("False", "false")

with open(os.path.join(base_dir, "integrations", "page.tsx"), "w") as f:
    f.write(integrations_content)

# 2. Update /dashboard/settings/page.tsx
settings_content = """'use client';

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
    setShowInviteModal(False);
    setToast('Invite sent to team member.');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(False)} title="Invite Team Member">
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
        <button onClick={() => setShowInviteModal(True)} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>+ Invite Team</button>
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
""".replace("True", "true").replace("False", "false")

with open(os.path.join(base_dir, "settings", "page.tsx"), "w") as f:
    f.write(settings_content)


# 3. Update /dashboard/notifications/page.tsx
notifications_content = """'use client';

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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Notification Preferences</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '14px', margin: 0 }}>Control when and how you are alerted.</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Email Alerts</h3>
        
        {[
          { title: 'New Lead Captured', desc: 'Get an email immediately when a new lead is captured by the AI.', active: true },
          { title: 'Human Takeover Requested', desc: 'Alert when a user explicitly asks to speak to a human.', active: true },
          { title: 'Daily Performance Summary', desc: "A morning digest of yesterday's metrics.", active: false },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', borderBottom: i === 2 ? 'none' : '1px solid var(--stripe-border)' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.25rem' }}>{item.title}</div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-body)' }}>{item.desc}</div>
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
""".replace("True", "true").replace("False", "false")

with open(os.path.join(base_dir, "notifications", "page.tsx"), "w") as f:
    f.write(notifications_content)

print("Phase 3 pages successfully updated.")
