export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Tutorials & Guides</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Learn how to get the most out of your Amira agent.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { title: 'Optimizing your System Prompt', duration: '5:24' },
          { title: 'Connecting WhatsApp Business', duration: '3:15' },
          { title: 'Setting up Zapier Integrations', duration: '8:42' },
          { title: 'How to build Automated Drips', duration: '6:10' },
          { title: 'Importing your CRM Leads', duration: '4:05' },
          { title: 'Customizing Webchat Appearance', duration: '2:30' }
        ].map((tut, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', overflow: 'hidden', boxShadow: 'var(--stripe-shadow-ambient)', cursor: 'pointer' }}>
            <div style={{ height: '140px', backgroundColor: '#e3e8ee', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '12px solid #ffffff', marginLeft: '4px' }}></div>
              </div>
              <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#ffffff', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontFeatureSettings: '"tnum"' }}>{tut.duration}</div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{tut.title}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
