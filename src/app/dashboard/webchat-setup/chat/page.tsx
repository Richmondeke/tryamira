'use client';

import { useState } from 'react';
import Toast from '../../../../components/ui/Toast';

export default function WebchatPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#533AFD');
  const [greeting, setGreeting] = useState('Hi there! 👋 How can I help you today?');
  const [agentName, setAgentName] = useState('Amira Assistant');
  const [position, setPosition] = useState('Bottom Right');
  const [showAvatar, setShowAvatar] = useState(true);
  const [userMessage, setUserMessage] = useState('');
  const [previewMessages, setPreviewMessages] = useState([
    { from: 'ai', text: 'Hi there! 👋 How can I help you today?' }
  ]);

  const handleSave = () => setToast('Webchat settings saved successfully!');

  const handlePreviewSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;
    setPreviewMessages(prev => [
      ...prev,
      { from: 'user', text: userMessage },
      { from: 'ai', text: 'Thanks for reaching out! This is a live preview. Your real agent will respond here.' }
    ]);
    setUserMessage('');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Webchat Customization</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>Design how the chat widget appears on your website.</p>
        </div>
        <button onClick={handleSave} style={{ backgroundColor: '#533afd', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '0.5rem 1.25rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
          Save Settings
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Settings Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 1.25rem 0', fontWeight: 600 }}>Appearance</h3>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Agent Name</label>
              <input type="text" value={agentName} onChange={e => setAgentName(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Brand Color</label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                  style={{ width: '44px', height: '44px', padding: '2px', border: '1px solid var(--stripe-border)', borderRadius: '6px', cursor: 'pointer' }} />
                <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                  style={{ flex: 1, padding: '0.6rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '13px', fontFamily: 'monospace' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Initial Greeting</label>
              <input type="text" value={greeting} onChange={e => setGreeting(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Widget Position</label>
              <select value={position} onChange={e => setPosition(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '13px', color: 'var(--stripe-navy)', backgroundColor: '#fff' }}>
                <option>Bottom Right</option>
                <option>Bottom Left</option>
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={showAvatar} onChange={e => setShowAvatar(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#533afd' }} />
              <span style={{ fontSize: '13px', color: 'var(--stripe-navy)' }}>Show agent avatar in widget</span>
            </label>
          </div>
        </div>

        {/* Live Preview */}
        <div style={{ backgroundColor: '#f1f5f9', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px', position: 'relative' }}>
          <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginBottom: '1rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Preview</div>
          <div style={{ width: '300px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Widget Header */}
            <div style={{ backgroundColor: primaryColor, padding: '1rem 1.25rem', color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {showAvatar && (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🤖</div>
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>{agentName}</div>
                  <div style={{ fontSize: '11px', opacity: 0.85 }}>● Online — Replies instantly</div>
                </div>
              </div>
            </div>
            {/* Messages */}
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', height: '200px', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
              {previewMessages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{ backgroundColor: m.from === 'user' ? primaryColor : '#ffffff', color: m.from === 'user' ? '#fff' : 'var(--stripe-navy)', padding: '0.625rem 0.875rem', borderRadius: '12px', borderBottomRightRadius: m.from === 'user' ? '2px' : '12px', borderBottomLeftRadius: m.from === 'user' ? '12px' : '2px', fontSize: '12px', lineHeight: 1.5, boxShadow: '0 1px 2px rgba(0,0,0,0.08)', border: m.from === 'user' ? 'none' : '1px solid var(--stripe-border)' }}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            {/* Input */}
            <form onSubmit={handlePreviewSend} style={{ padding: '0.75rem', borderTop: '1px solid var(--stripe-border)', backgroundColor: '#fff', display: 'flex', gap: '0.5rem' }}>
              <input type="text" value={userMessage} onChange={e => setUserMessage(e.target.value)} placeholder="Type a message..."
                style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '20px', border: '1px solid var(--stripe-border)', fontSize: '12px', outline: 'none' }} />
              <button type="submit" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: primaryColor, color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>↑</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
