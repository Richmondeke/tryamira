export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px' }}>Live Chat</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300 }}>Monitor and take over active AI conversations.</p>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', height: '600px' }}>
        {/* Chat List */}
        <div style={{ width: '300px', backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--stripe-border)', fontWeight: 500, color: 'var(--stripe-navy)' }}>Recent Conversations</div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ padding: '1rem', borderBottom: '1px solid var(--stripe-border)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong style={{ color: 'var(--stripe-navy)' }}>Anonymous Visitor</strong>
                  <span style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>2m ago</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--stripe-body)' }}>I'm interested in the 3-bedroom property...</div>
              </div>
            ))}
          </div>
        </div>
        {/* Chat Window */}
        <div style={{ flex: 1, backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--stripe-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: 'var(--stripe-navy)' }}>Anonymous Visitor</strong>
            <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Take Over Chat</button>
          </div>
          <div style={{ flex: 1, padding: '1rem', backgroundColor: '#fafbfc' }}>
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--stripe-border)', maxWidth: '70%' }}>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--stripe-navy)' }}>I'm interested in the 3-bedroom property in downtown.</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--stripe-purple)', padding: '0.75rem', borderRadius: '8px', color: '#ffffff', maxWidth: '70%' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>Great! I can help you with that. Would you like to schedule a viewing?</p>
              </div>
            </div>
          </div>
          <div style={{ padding: '1rem', borderTop: '1px solid var(--stripe-border)' }}>
            <input type="text" placeholder="Type a message..." style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', outline: 'none' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
