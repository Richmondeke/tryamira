'use client';

import { useState } from 'react';
import Toast from '../../../../components/ui/Toast';

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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Embed Widget</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0 }}>Install the Amira webchat on your site.</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <h3 style={{ fontSize: '12px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 500 }}>Installation Code</h3>
        <p style={{ fontSize: '12px', color: 'var(--stripe-body)', marginBottom: '1rem' }}>Paste this snippet right before the closing <code>&lt;/body&gt;</code> tag of your website.</p>
        
        <div style={{ backgroundColor: '#061b31', borderRadius: '6px', padding: '1.25rem', position: 'relative' }}>
          <button onClick={handleCopy} style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '12px', cursor: 'pointer', transition: 'background 0.2s' }}>Copy Code</button>
          <pre style={{ margin: 0, color: '#a0aec0', fontSize: '12px', fontFamily: 'monospace', overflowX: 'auto' }}>
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
