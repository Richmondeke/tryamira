export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Omni-Channel Connect</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Deploy your AI agent across multiple messaging platforms.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {[
          { name: 'WhatsApp Business', status: 'Connected', desc: 'Connect via official Cloud API.', active: True },
          { name: 'Facebook Messenger', status: 'Disconnected', desc: 'Reply to page messages automatically.', active: False },
          { name: 'Instagram Direct', status: 'Disconnected', desc: 'Engage with IG followers and story replies.', active: False },
          { name: 'SMS / Twilio', status: 'Disconnected', desc: 'Send text messages via Twilio.', active: False }
        ].map((channel, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--stripe-purple)', borderRadius: '50%' }}></div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <div style={{ fontSize: '16px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{channel.name}</div>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: 500, 
                  color: channel.active ? 'var(--stripe-success-text)' : 'var(--stripe-muted)',
                  backgroundColor: channel.active ? 'rgba(21,190,83,0.1)' : '#f6f9fc',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>{channel.status}</div>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1rem' }}>{channel.desc}</div>
              <button style={{ backgroundColor: channel.active ? '#ffffff' : 'var(--stripe-purple)', color: channel.active ? 'var(--stripe-purple)' : '#ffffff', border: channel.active ? '1px solid var(--stripe-border)' : 'none', borderRadius: '4px', padding: '0.35rem 0.75rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                {channel.active ? 'Configure' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
