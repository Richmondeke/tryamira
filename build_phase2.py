import os

base_dir = "/Users/mac/.gemini/antigravity/scratch/tryamira/src/app/dashboard"

# 1. Update /dashboard/webchat/page.tsx
webchat_content = """'use client';

import { useState } from 'react';
import Toast from '../../../components/ui/Toast';

export default function WebchatPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#533AFD');
  const [greeting, setGreeting] = useState('Hi there! How can I help you today?');

  const handleSave = () => {
    setToast('Webchat settings saved successfully!');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Webchat Customization</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '14px', margin: 0 }}>Design how the widget appears on your website.</p>
        </div>
        <button onClick={handleSave} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>Save Settings</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Appearance</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Brand Color</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
              <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Initial Greeting</label>
            <input type="text" value={greeting} onChange={(e) => setGreeting(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px' }} />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Widget Position</label>
            <select style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px', color: 'var(--stripe-navy)' }}>
              <option>Bottom Right</option>
              <option>Bottom Left</option>
            </select>
          </div>
        </div>

        <div style={{ backgroundColor: '#f6f9fc', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', position: 'relative' }}>
          
          {/* Mock Widget Preview */}
          <div style={{ width: '320px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 12px 24px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ backgroundColor: primaryColor, padding: '1.5rem', color: '#ffffff', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '0.25rem' }}>Amira Assistant</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Typically replies instantly</div>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', height: '200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '8px', borderBottomLeftRadius: '0', fontSize: '13px', color: 'var(--stripe-navy)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', alignSelf: 'flex-start', maxWidth: '85%' }}>
                {greeting}
              </div>
            </div>
            <div style={{ padding: '1rem', borderTop: '1px solid var(--stripe-border)', backgroundColor: '#ffffff' }}>
              <div style={{ backgroundColor: '#f6f9fc', borderRadius: '20px', padding: '0.5rem 1rem', fontSize: '13px', color: 'var(--stripe-muted)' }}>Type a message...</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
""".replace("True", "true").replace("False", "false")

with open(os.path.join(base_dir, "webchat", "page.tsx"), "w") as f:
    f.write(webchat_content)


# 2. Update /dashboard/widget/page.tsx
widget_content = """'use client';

import { useState } from 'react';
import Toast from '../../../components/ui/Toast';

export default function WidgetPage() {
  const [toast, setToast] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(`<script>
  window.AmiraConfig = {
    workspaceId: "ws_live_9a8b7c6d5e",
    theme: "light",
    position: "bottom-right"
  };
</script>
<script src="https://cdn.heyamira.com/widget.js" async></script>`);
    setToast('Widget code copied to clipboard!');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Embed Widget</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '14px', margin: 0 }}>Install the Amira webchat on your site.</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 500 }}>Installation Code</h3>
        <p style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1.5rem' }}>Paste this snippet right before the closing <code>&lt;/body&gt;</code> tag of your website.</p>
        
        <div style={{ backgroundColor: '#061b31', borderRadius: '6px', padding: '1.5rem', position: 'relative' }}>
          <button onClick={handleCopy} style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '12px', cursor: 'pointer', transition: 'background 0.2s' }}>Copy Code</button>
          <pre style={{ margin: 0, color: '#a0aec0', fontSize: '13px', fontFamily: 'monospace', overflowX: 'auto' }}>
<code>&lt;script&gt;
  window.AmiraConfig = {"{"}
    workspaceId: "ws_live_9a8b7c6d5e",
    theme: "light",
    position: "bottom-right"
  {"}"};
&lt;/script&gt;
&lt;script src="https://cdn.heyamira.com/widget.js" async&gt;&lt;/script&gt;</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
""".replace("True", "true").replace("False", "false")

with open(os.path.join(base_dir, "widget", "page.tsx"), "w") as f:
    f.write(widget_content)


# 3. Update /dashboard/channels/page.tsx
channels_content = """'use client';

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';

export default function ChannelsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [connectingChannel, setConnectingChannel] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const channels = [
    { name: 'Instagram DM', status: 'Connected', icon: '📱' },
    { name: 'WhatsApp Business', status: 'Not Connected', icon: '💬' },
    { name: 'Facebook Messenger', status: 'Not Connected', icon: '🔵' },
    { name: 'SMS (Twilio)', status: 'Not Connected', icon: '📱' }
  ];

  const handleConnectClick = (channelName: string) => {
    setConnectingChannel(channelName);
    setShowModal(True);
  };

  const performConnection = () => {
    setIsConnecting(True);
    setTimeout(() => {
      setIsConnecting(False);
      setShowModal(False);
      setToast(`${connectingChannel} connected successfully!`);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showModal} onClose={() => !isConnecting && setShowModal(False)} title={`Connect ${connectingChannel}`}>
        {isConnecting ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ color: 'var(--stripe-purple)', fontSize: '18px', fontWeight: 500 }}>Connecting securely...</div>
            <p style={{ color: 'var(--stripe-muted)', fontSize: '14px', marginTop: '0.5rem' }}>Please wait while we establish the OAuth connection.</p>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--stripe-body)', fontSize: '14px', marginBottom: '1.5rem' }}>
              You will be redirected to authenticate with {connectingChannel}. Amira will request permission to read and reply to messages on your behalf.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(False)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={performConnection} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: 'var(--stripe-purple)', color: '#fff', cursor: 'pointer' }}>Authenticate</button>
            </div>
          </div>
        )}
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Social Channels</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '14px', margin: 0 }}>Connect your messaging platforms to the AI agent.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {channels.map((channel, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {channel.icon}
              </div>
              <div>
                <div style={{ fontSize: '16px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{channel.name}</div>
                <div style={{ fontSize: '13px', color: channel.status === 'Connected' ? 'var(--stripe-success-text)' : 'var(--stripe-muted)' }}>{channel.status}</div>
              </div>
            </div>
            {channel.status === 'Connected' ? (
              <button style={{ backgroundColor: '#ffffff', color: '#d92d20', border: '1px solid #d92d20', borderRadius: '4px', padding: '0.35rem 0.75rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Disconnect</button>
            ) : (
              <button onClick={() => handleConnectClick(channel.name)} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.35rem 0.75rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Connect</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
""".replace("True", "true").replace("False", "false")

with open(os.path.join(base_dir, "channels", "page.tsx"), "w") as f:
    f.write(channels_content)


# 4. Update /dashboard/broadcast/page.tsx
broadcast_content = """'use client';

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';

export default function BroadcastPage() {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(False);
    setToast('Broadcast successfully scheduled for dispatch!');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showModal} onClose={() => setShowModal(False)} title="Create Broadcast">
        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Audience Segment</label>
            <select style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
              <option>All Leads (1,248)</option>
              <option>Hot Leads (240)</option>
              <option>Cold Leads (1,008)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Channel</label>
            <select style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
              <option>Email</option>
              <option>SMS</option>
              <option>WhatsApp</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Message Body</label>
            <textarea required rows={4} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', resize: 'vertical' }} placeholder="Hi {{first_name}}, check out our new listings!"></textarea>
          </div>
          <button type="submit" style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Schedule Send</button>
        </form>
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Broadcasts</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '14px', margin: 0 }}>Send one-off messages to your leads.</p>
        </div>
        <button onClick={() => setShowModal(True)} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>New Broadcast</button>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f6f9fc', borderBottom: '1px solid var(--stripe-border)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>CAMPAIGN NAME</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>AUDIENCE</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>SENT</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>OPEN RATE</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--stripe-border)' }}>
              <td style={{ padding: '1rem 1.5rem', fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Q3 Promotion</td>
              <td style={{ padding: '1rem 1.5rem', fontSize: '14px', color: 'var(--stripe-body)' }}>All Leads</td>
              <td style={{ padding: '1rem 1.5rem', fontSize: '14px', color: 'var(--stripe-body)' }}>Aug 12, 2024</td>
              <td style={{ padding: '1rem 1.5rem', fontSize: '14px', color: 'var(--stripe-success-text)' }}>42%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
""".replace("True", "true").replace("False", "false")

with open(os.path.join(base_dir, "broadcast", "page.tsx"), "w") as f:
    f.write(broadcast_content)


print("Phase 2 pages successfully updated.")
