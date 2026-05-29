export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px' }}>Lead Management</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300 }}>Track and export your captured leads.</p>
      </div>
      
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--stripe-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input type="text" placeholder="Search leads..." style={{ padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', width: '300px' }} />
          <button style={{ backgroundColor: 'transparent', color: 'var(--stripe-purple)', border: '1px solid var(--stripe-border)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Export CSV</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--stripe-border)', color: 'var(--stripe-label)', fontSize: '13px' }}>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Email</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Phone</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Score</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px', color: 'var(--stripe-navy)' }}>
            {[
              { name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', status: 'Hot', score: '92' },
              { name: 'Sarah Smith', email: 'sarah@example.com', phone: '+1 987 654 321', status: 'Warm', score: '65' },
              { name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 555 123 456', status: 'Cold', score: '24' }
            ].map((lead, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                <td style={{ padding: '1rem' }}>{lead.name}</td>
                <td style={{ padding: '1rem' }}>{lead.email}</td>
                <td style={{ padding: '1rem', fontFeatureSettings: '"tnum"' }}>{lead.phone}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    backgroundColor: lead.status === 'Hot' ? 'rgba(21,190,83,0.2)' : lead.status === 'Warm' ? '#fff3cd' : '#e2e8f0', 
                    color: lead.status === 'Hot' ? 'var(--stripe-success-text)' : lead.status === 'Warm' ? '#856404' : '#475569', 
                    padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500 
                  }}>
                    {lead.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontFeatureSettings: '"tnum"', fontWeight: 500 }}>{lead.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
