export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Broadcast Campaigns</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Send mass messages to your leads via WhatsApp and SMS.</p>
      </div>
      
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: 0, fontWeight: 500 }}>Recent Campaigns</h3>
          <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>New Broadcast</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontFeatureSettings: '"tnum", "ss01"' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--stripe-border)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>CAMPAIGN NAME</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>DATE SENT</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>AUDIENCE</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>OPEN RATE</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Q3 Promo Deal', date: 'Oct 12, 2026', audience: '1,240', rate: '68%', status: 'Completed', color: 'var(--stripe-success-text)', bg: 'rgba(21,190,83,0.1)' },
              { name: 'Feature Announcement', date: 'Oct 05, 2026', audience: '3,410', rate: '45%', status: 'Completed', color: 'var(--stripe-success-text)', bg: 'rgba(21,190,83,0.1)' },
              { name: 'Webinar Invite', date: 'Sep 28, 2026', audience: '850', rate: '--', status: 'Draft', color: 'var(--stripe-muted)', bg: '#f6f9fc' }
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: i === 2 ? 'none' : '1px solid var(--stripe-border)' }}>
                <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{row.name}</td>
                <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-body)' }}>{row.date}</td>
                <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-body)' }}>{row.audience}</td>
                <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-body)' }}>{row.rate}</td>
                <td style={{ padding: '1rem 0' }}><span style={{ backgroundColor: row.bg, color: row.color, padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
