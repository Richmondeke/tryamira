export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Agency Dashboard</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Manage your client sub-accounts and white-labeling.</p>
      </div>
      
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '12px', color: 'var(--stripe-navy)', margin: 0, fontWeight: 500 }}>Client Accounts</h3>
          <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>+ Add Client</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontFeatureSettings: '"tnum"' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--stripe-border)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>CLIENT NAME</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>PLAN</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>MRR</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>STATUS</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--stripe-border)' }}>
              <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Burger Joint LLC</td>
              <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-body)' }}>Pro ($99/mo)</td>
              <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-body)' }}>$99.00</td>
              <td style={{ padding: '1rem 0' }}><span style={{ backgroundColor: 'rgba(21,190,83,0.1)', color: 'var(--stripe-success-text)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Active</span></td>
              <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-purple)', cursor: 'pointer' }}>Login as Client</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Downtown Realtors</td>
              <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-body)' }}>Enterprise ($299/mo)</td>
              <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-body)' }}>$299.00</td>
              <td style={{ padding: '1rem 0' }}><span style={{ backgroundColor: 'rgba(21,190,83,0.1)', color: 'var(--stripe-success-text)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Active</span></td>
              <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-purple)', cursor: 'pointer' }}>Login as Client</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
