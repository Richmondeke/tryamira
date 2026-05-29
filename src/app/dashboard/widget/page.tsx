export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Embed Widget</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Copy the code below to add the AI agent to your website.</p>
      </div>
      
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 500 }}>HTML Snippet</h3>
        <p style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1.5rem' }}>Paste this code right before the closing <code>&lt;/body&gt;</code> tag on your website.</p>
        
        <div style={{ backgroundColor: '#061b31', borderRadius: '6px', padding: '1.5rem', position: 'relative', marginBottom: '1.5rem' }}>
          <button style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '12px', cursor: 'pointer' }}>Copy Code</button>
          <pre style={{ margin: 0, color: '#a0aec0', fontSize: '13px', fontFamily: 'monospace', overflowX: 'auto' }}>
<code>&lt;script&gt;
  window.AmiraConfig = {{
    workspaceId: "ws_live_9a8b7c6d5e",
    theme: "light",
    position: "bottom-right"
  }};
&lt;/script&gt;
&lt;script src="https://cdn.heyamira.com/widget.js" async&gt;&lt;/script&gt;</code>
          </pre>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button style={{ backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Email Instructions to Dev</button>
        </div>
      </div>

    </div>
  );
}
