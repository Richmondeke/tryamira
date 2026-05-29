'use client';

import { useState } from 'react';
import Toast from '../../../../components/ui/Toast';

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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Webchat Customization</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0 }}>Design how the widget appears on your website.</p>
        </div>
        <button onClick={handleSave} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>Save Settings</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <h3 style={{ fontSize: '12px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Appearance</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Brand Color</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
              <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Initial Greeting</label>
            <input type="text" value={greeting} onChange={(e) => setGreeting(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px' }} />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Widget Position</label>
            <select style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)' }}>
              <option>Bottom Right</option>
              <option>Bottom Left</option>
            </select>
          </div>
        </div>

        <div style={{ backgroundColor: '#f6f9fc', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', position: 'relative' }}>
          
          {/* Mock Widget Preview */}
          <div style={{ width: '320px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 12px 24px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ backgroundColor: primaryColor, padding: '1.25rem', color: '#ffffff', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '0.25rem' }}>Amira Assistant</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Typically replies instantly</div>
            </div>
            <div style={{ padding: '1.25rem', backgroundColor: '#f9fafb', height: '200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '8px', borderBottomLeftRadius: '0', fontSize: '12px', color: 'var(--stripe-navy)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', alignSelf: 'flex-start', maxWidth: '85%' }}>
                {greeting}
              </div>
            </div>
            <div style={{ padding: '1rem', borderTop: '1px solid var(--stripe-border)', backgroundColor: '#ffffff' }}>
              <div style={{ backgroundColor: '#f6f9fc', borderRadius: '20px', padding: '0.5rem 1rem', fontSize: '12px', color: 'var(--stripe-muted)' }}>Type a message...</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
