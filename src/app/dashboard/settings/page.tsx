export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Workspace Settings</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Manage your company profile and team access.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Company Profile</h3>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Company Name</label>
              <input type="text" defaultValue="Acme Corp" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px', color: 'var(--stripe-navy)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Timezone</label>
              <select style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px', color: 'var(--stripe-navy)', backgroundColor: '#fff' }}>
                <option>Pacific Time (PT)</option>
                <option selected>Eastern Time (ET)</option>
                <option>Greenwich Mean Time (GMT)</option>
              </select>
            </div>
          </div>
          <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Save Profile</button>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: 0, fontWeight: 500 }}>Team Members</h3>
            <button style={{ backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Invite Member</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--stripe-border)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>NAME</th>
                <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>EMAIL</th>
                <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>ROLE</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Ashley Director</td>
                <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-body)' }}>ashley@acme.com</td>
                <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-body)' }}>Admin</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
