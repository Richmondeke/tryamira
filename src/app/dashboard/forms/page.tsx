export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Lead Capture Forms</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Create high-converting forms for your AI to share.</p>
      </div>
      
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: 0, fontWeight: 500 }}>Active Forms</h3>
          <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Create Form</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontFeatureSettings: '"tnum"' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--stripe-border)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>FORM NAME</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>VIEWS</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>SUBMISSIONS</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>CONVERSION</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--stripe-border)' }}>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Real Estate Inquiry</td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-body)' }}>4,521</td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-body)' }}>892</td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-success-text)' }}>19.7%</td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-purple)', cursor: 'pointer' }}>Edit Fields</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Contact Us Support</td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-body)' }}>1,204</td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-body)' }}>154</td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-success-text)' }}>12.8%</td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-purple)', cursor: 'pointer' }}>Edit Fields</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
