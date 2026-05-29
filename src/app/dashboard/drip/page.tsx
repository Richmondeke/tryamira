export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Automated Sequences</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Build and manage multi-step follow-up sequences.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { name: 'Lead Qualification', trigger: 'New Form Submission', steps: 4, conversion: '32%' },
          { name: 'Abandoned Cart', trigger: 'Cart Inactive 24h', steps: 2, conversion: '18%' },
          { name: 'Meeting Reminder', trigger: '24h Before Meeting', steps: 1, conversion: '95%' }
        ].map((drip, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ fontSize: '16px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{drip.name}</div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--stripe-success-text)' }}></div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Trigger</div>
            <div style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1rem' }}>{drip.trigger}</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--stripe-border)', paddingTop: '1rem', fontFeatureSettings: '"tnum"' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--stripe-label)' }}>Steps</div>
                <div style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{drip.steps}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--stripe-label)' }}>Conversion</div>
                <div style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{drip.conversion}</div>
              </div>
            </div>
          </div>
        ))}
        
        <div style={{ backgroundColor: '#f6f9fc', border: '1px dashed var(--stripe-purple)', borderRadius: '6px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '180px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(83,58,253,0.1)', color: 'var(--stripe-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '1rem' }}>+</div>
          <div style={{ fontSize: '14px', color: 'var(--stripe-purple)', fontWeight: 500 }}>Create Sequence</div>
        </div>
      </div>

    </div>
  );
}
