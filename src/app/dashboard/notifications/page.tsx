export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Notifications</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Manage when and how Amira alerts you.</p>
      </div>
      
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Email Alerts</h3>
        
        {[
          { title: 'New Lead Captured', desc: 'Get an email every time the AI captures a new lead.', active: True },
          { title: 'Agent Handover Request', desc: 'Alert me when a user asks to speak to a human.', active: True },
          { title: 'Daily Performance Summary', desc: 'A morning digest of yesterday's metrics.', active: False },
          { title: 'Billing & Account', desc: 'Invoices, limits, and subscription updates.', active: True }
        ].map((setting, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: i === 3 ? 'none' : '1px solid var(--stripe-border)' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.25rem' }}>{setting.title}</div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-body)' }}>{setting.desc}</div>
            </div>
            <div style={{ width: '44px', height: '24px', backgroundColor: setting.active ? 'var(--stripe-purple)' : '#e3e8ee', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#ffffff', borderRadius: '50%', position: 'absolute', top: '2px', left: setting.active ? '22px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'left 0.2s' }}></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
