export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Email Agent</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Connect your inboxes and configure auto-replies.</p>
      </div>
      
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: 0, fontWeight: 500 }}>Connected Inboxes</h3>
          <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>+ Add Inbox</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--stripe-border)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>EMAIL ADDRESS</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>STATUS</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>AUTO-REPLY</th>
              <th style={{ padding: '0.75rem 0', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--stripe-border)' }}>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-navy)' }}>support@amira.com</td>
              <td style={{ padding: '1rem 0' }}><span style={{ backgroundColor: 'rgba(21,190,83,0.1)', color: 'var(--stripe-success-text)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Connected</span></td>
              <td style={{ padding: '1rem 0' }}>
                <div style={{ width: '36px', height: '20px', backgroundColor: 'var(--stripe-purple)', borderRadius: '10px', position: 'relative' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
                </div>
              </td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-purple)', cursor: 'pointer' }}>Configure</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-navy)' }}>sales@amira.com</td>
              <td style={{ padding: '1rem 0' }}><span style={{ backgroundColor: 'rgba(217,45,32,0.1)', color: '#d92d20', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Disconnected</span></td>
              <td style={{ padding: '1rem 0' }}>
                <div style={{ width: '36px', height: '20px', backgroundColor: '#e3e8ee', borderRadius: '10px', position: 'relative' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                </div>
              </td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-purple)', cursor: 'pointer' }}>Reconnect</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
