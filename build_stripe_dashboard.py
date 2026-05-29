import os

PAGES = {
    # Core Operations
    "chat": {
        "title": "Live Chat",
        "subtitle": "Monitor and take over active AI conversations.",
        "content": """
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
      </div>"""
    },
    "leads": {
        "title": "Lead Management",
        "subtitle": "Track and export your captured leads.",
        "content": """
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
      </div>"""
    },
    "analytics": {
        "title": "Analytics",
        "subtitle": "Visualize your AI agent's performance.",
        "content": """
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', minHeight: '300px' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '16px', color: 'var(--stripe-navy)' }}>Conversations Over Time</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', paddingBottom: '1rem', borderBottom: '1px solid var(--stripe-border)' }}>
            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: 'var(--stripe-purple)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: 'var(--stripe-muted)', fontSize: '12px' }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', minHeight: '300px' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '16px', color: 'var(--stripe-navy)' }}>Lead Conversion Rate</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
             <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '16px solid var(--stripe-purple)', borderTopColor: '#e5edf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '24px', fontWeight: 600, color: 'var(--stripe-navy)' }}>68%</span>
             </div>
          </div>
        </div>
      </div>"""
    },
    "ai-agent": {
        "title": "AI Agent Configuration",
        "subtitle": "Train and instruct your AI.",
        "content": """
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
      </div>"""
    },
    "default": {
        "title": "{Title}",
        "subtitle": "Configure and manage your {Title} settings.",
        "content": """
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--stripe-purple)', fontSize: '24px' }}>✨</span>
        </div>
        <h3 style={{ fontSize: '20px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 500 }}>{Title} is coming soon</h3>
        <p style={{ color: 'var(--stripe-body)', maxWidth: '400px', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>We're working hard to bring you the best experience for this feature. Check back soon for updates.</p>
        <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Join Waitlist</button>
      </div>"""
    }
}

ALL_PAGES = [
    "chat", "webchat", "email", "analytics", "leads", "broadcast", 
    "drip", "ai-agent", "forms", "tutorials", "templates", "channels", 
    "widget", "integrations", "notifications", "settings", "refer", 
    "partner", "plan", "upgrade"
]

def generate_page(slug):
    data = PAGES.get(slug, PAGES["default"])
    title = data["title"].replace("{Title}", slug.replace("-", " ").title())
    subtitle = data["subtitle"].replace("{Title}", slug.replace("-", " ").title())
    content = data["content"].replace("{Title}", slug.replace("-", " ").title())
    
    return f'''export default function Page() {{
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px' }}>{title}</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300 }}>{subtitle}</p>
      </div>
      {content}
    </div>
  );
}}
'''

for slug in ALL_PAGES:
    dir_path = f"src/app/dashboard/{slug}"
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    with open(f"{dir_path}/page.tsx", "w") as f:
        f.write(generate_page(slug))

print("Dashboard pages successfully generated with Stripe aesthetic.")
