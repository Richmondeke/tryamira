export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Webchat Appearance</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Customize how the AI widget looks on your website.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Widget Settings</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Brand Color</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#533afd', border: '1px solid var(--stripe-border)' }}></div>
              <input type="text" value="#533afd" readOnly style={{ padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px', color: 'var(--stripe-navy)' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Initial Greeting</label>
            <input type="text" defaultValue="Hi there! How can I help you today?" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px', color: 'var(--stripe-navy)' }} />
          </div>

          <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>Save Changes</button>
        </div>

        <div style={{ backgroundColor: '#f6f9fc', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', minHeight: '400px' }}>
          <div style={{ width: '300px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#533afd', padding: '1rem', color: '#ffffff', fontWeight: 500 }}>
              Amira AI Support
            </div>
            <div style={{ padding: '1rem', height: '200px', backgroundColor: '#f9f9f9' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '8px', borderBottomLeftRadius: '0', fontSize: '14px', color: 'var(--stripe-navy)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'inline-block' }}>
                Hi there! How can I help you today?
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--stripe-border)', display: 'flex', gap: '0.5rem' }}>
              <input type="text" placeholder="Type a message..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px' }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
