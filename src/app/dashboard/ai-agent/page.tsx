export default function Page() {
  return (
    <div style={ maxWidth: '1080px', margin: '0 auto', width: '100%' }>
      <div style={ marginBottom: '2rem' }>
        <h1 style={ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px' }>AI Agent Configuration</h1>
        <p style={ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300 }>Train and instruct your AI.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '16px', color: 'var(--stripe-navy)' }}>System Prompt</h3>
          <p style={{ color: 'var(--stripe-body)', fontSize: '14px', marginBottom: '1rem' }}>Define exactly how your AI should behave and answer questions.</p>
          <textarea style={{ width: '100%', height: '200px', padding: '1rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px', color: 'var(--stripe-navy)', outline: 'none', resize: 'vertical' }} defaultValue="You are a helpful real estate assistant for Amira. You answer questions about property listings, capture lead contact information, and schedule viewings." />
          <button style={{ marginTop: '1rem', backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Save Prompt</button>
        </div>
        <div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '16px', color: 'var(--stripe-navy)' }}>Knowledge Base</h3>
            <div style={{ border: '1px dashed var(--stripe-purple)', backgroundColor: '#f6f9fc', padding: '2rem 1rem', textAlign: 'center', borderRadius: '4px', cursor: 'pointer' }}>
              <span style={{ color: 'var(--stripe-purple)', fontSize: '24px', display: 'block', marginBottom: '0.5rem' }}>+</span>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--stripe-navy)' }}>Drag & Drop PDF or TXT</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '12px', color: 'var(--stripe-muted)' }}>Max 50MB per file</p>
            </div>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem' }}>
             <h3 style={{ margin: '0 0 1rem 0', fontSize: '16px', color: 'var(--stripe-navy)' }}>Personality Settings</h3>
             <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '14px', color: 'var(--stripe-navy)' }}>
                <input type="checkbox" defaultChecked /> Use Emojis
             </label>
             <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px', color: 'var(--stripe-navy)' }}>
                <input type="checkbox" /> Be overly enthusiastic
             </label>
          </div>
        </div>
      </div>
    </div>
  );
}
