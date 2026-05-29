import os
import json

base_dir = "/Users/mac/.gemini/antigravity/scratch/tryamira/src/app/dashboard"

pages_data = {
    "webchat": {
        "title": "Webchat Appearance",
        "subtitle": "Customize how the AI widget looks on your website.",
        "content": """
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Widget Settings</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Brand Color</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#533afd', border: '1px solid var(--stripe-border)' }}></div>
              <input type="text" value="#533afd" readOnly style={{ padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px', color: 'var(--stripe-navy)' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Initial Greeting</label>
            <input type="text" defaultValue="Hi there! How can I help you today?" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px', color: 'var(--stripe-navy)' }} />
          </div>

          <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>Save Changes</button>
        </div>

        <div style={{ backgroundColor: '#f6f9fc', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', minHeight: '400px' }}>
          <div style={{ width: '300px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#533afd', padding: '1rem', color: '#ffffff', fontWeight: 500 }}>
              Amira AI Support
            </div>
            <div style={{ padding: '1rem', height: '200px', backgroundColor: '#f9f9f9' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '8px', borderBottomLeftRadius: '0', fontSize: '14px', color: 'var(--stripe-navy)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'inline-block' }}>
                Hi there! How can I help you today?
              </div>
            </div>
            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--stripe-border)', display: 'flex', gap: '0.5rem' }}>
              <input type="text" placeholder="Type a message..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px' }} />
            </div>
          </div>
        </div>
      </div>
"""
    },
    "email": {
        "title": "Email Agent",
        "subtitle": "Connect your inboxes and configure auto-replies.",
        "content": """
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
"""
    },
    "broadcast": {
        "title": "Broadcast Campaigns",
        "subtitle": "Send mass messages to your leads via WhatsApp and SMS.",
        "content": """
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
"""
    },
    "drip": {
        "title": "Automated Sequences",
        "subtitle": "Build and manage multi-step follow-up sequences.",
        "content": """
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
"""
    },
    "forms": {
        "title": "Lead Capture Forms",
        "subtitle": "Create high-converting forms for your AI to share.",
        "content": """
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
"""
    },
    "tutorials": {
        "title": "Tutorials & Guides",
        "subtitle": "Learn how to get the most out of your Amira agent.",
        "content": """
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { title: 'Optimizing your System Prompt', duration: '5:24' },
          { title: 'Connecting WhatsApp Business', duration: '3:15' },
          { title: 'Setting up Zapier Integrations', duration: '8:42' },
          { title: 'How to build Automated Drips', duration: '6:10' },
          { title: 'Importing your CRM Leads', duration: '4:05' },
          { title: 'Customizing Webchat Appearance', duration: '2:30' }
        ].map((tut, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', overflow: 'hidden', boxShadow: 'var(--stripe-shadow-ambient)', cursor: 'pointer' }}>
            <div style={{ height: '140px', backgroundColor: '#e3e8ee', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '12px solid #ffffff', marginLeft: '4px' }}></div>
              </div>
              <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#ffffff', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontFeatureSettings: '"tnum"' }}>{tut.duration}</div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{tut.title}</div>
            </div>
          </div>
        ))}
      </div>
"""
    },
    "templates": {
        "title": "Agent Templates",
        "subtitle": "Quick-start your AI with pre-configured personas.",
        "content": """
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { name: 'Customer Support Bot', desc: 'Handles FAQs, returns policies, and support ticketing.' },
          { name: 'Sales Qualifier', desc: 'Asks BANT questions and books meetings on your calendar.' },
          { name: 'Real Estate Agent', desc: 'Captures property preferences and schedules showings.' },
          { name: 'Ecommerce Concierge', desc: 'Recommends products and tracks order status.' }
        ].map((tpl, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '16px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.5rem' }}>{tpl.name}</div>
            <div style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1.5rem', flex: 1 }}>{tpl.desc}</div>
            <button style={{ width: '100%', backgroundColor: '#f6f9fc', color: 'var(--stripe-purple)', border: '1px solid rgba(83,58,253,0.2)', borderRadius: '4px', padding: '0.5rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Use Template</button>
          </div>
        ))}
      </div>
"""
    },
    "channels": {
        "title": "Omni-Channel Connect",
        "subtitle": "Deploy your AI agent across multiple messaging platforms.",
        "content": """
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {[
          { name: 'WhatsApp Business', status: 'Connected', desc: 'Connect via official Cloud API.', active: True },
          { name: 'Facebook Messenger', status: 'Disconnected', desc: 'Reply to page messages automatically.', active: False },
          { name: 'Instagram Direct', status: 'Disconnected', desc: 'Engage with IG followers and story replies.', active: False },
          { name: 'SMS / Twilio', status: 'Disconnected', desc: 'Send text messages via Twilio.', active: False }
        ].map((channel, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--stripe-purple)', borderRadius: '50%' }}></div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <div style={{ fontSize: '16px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{channel.name}</div>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: 500, 
                  color: channel.active ? 'var(--stripe-success-text)' : 'var(--stripe-muted)',
                  backgroundColor: channel.active ? 'rgba(21,190,83,0.1)' : '#f6f9fc',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>{channel.status}</div>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1rem' }}>{channel.desc}</div>
              <button style={{ backgroundColor: channel.active ? '#ffffff' : 'var(--stripe-purple)', color: channel.active ? 'var(--stripe-purple)' : '#ffffff', border: channel.active ? '1px solid var(--stripe-border)' : 'none', borderRadius: '4px', padding: '0.35rem 0.75rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                {channel.active ? 'Configure' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
"""
    },
    "widget": {
        "title": "Embed Widget",
        "subtitle": "Copy the code below to add the AI agent to your website.",
        "content": """
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 500 }}>HTML Snippet</h3>
        <p style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1.5rem' }}>Paste this code right before the closing <code>&lt;/body&gt;</code> tag on your website.</p>
        
        <div style={{ backgroundColor: '#061b31', borderRadius: '6px', padding: '1.5rem', position: 'relative', marginBottom: '1.5rem' }}>
          <button style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '12px', cursor: 'pointer' }}>Copy Code</button>
          <pre style={{ margin: 0, color: '#a0aec0', fontSize: '13px', fontFamily: 'monospace', overflowX: 'auto' }}>
<code>&lt;script&gt;
  window.AmiraConfig = {{
    workspaceId: "ws_live_9a8b7c6d5e",
    theme: "light",
    position: "bottom-right"
  }};
&lt;/script&gt;
&lt;script src="https://cdn.heyamira.com/widget.js" async&gt;&lt;/script&gt;</code>
          </pre>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button style={{ backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Email Instructions to Dev</button>
        </div>
      </div>
"""
    },
    "integrations": {
        "title": "Integrations",
        "subtitle": "Connect Amira to your favorite tools and CRMs.",
        "content": """
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { name: 'HubSpot', desc: 'Sync leads and conversations.', connected: True },
          { name: 'Salesforce', desc: 'Enterprise CRM sync.', connected: False },
          { name: 'Zapier', desc: 'Connect to 5,000+ apps.', connected: False },
          { name: 'Stripe', desc: 'Accept payments in chat.', connected: False },
          { name: 'Google Calendar', desc: 'Book meetings instantly.', connected: True },
          { name: 'Slack', desc: 'Get notified of hot leads.', connected: False }
        ].map((app, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#f6f9fc', borderRadius: '8px', border: '1px solid var(--stripe-border)' }}></div>
              {app.connected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--stripe-success-text)' }}></div>}
            </div>
            <div style={{ fontSize: '16px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.25rem' }}>{app.name}</div>
            <div style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1.5rem', flex: 1 }}>{app.desc}</div>
            <button style={{ width: '100%', backgroundColor: app.connected ? '#f6f9fc' : '#ffffff', color: app.connected ? 'var(--stripe-navy)' : 'var(--stripe-purple)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
              {app.connected ? 'Manage' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
"""
    },
    "notifications": {
        "title": "Notifications",
        "subtitle": "Manage when and how Amira alerts you.",
        "content": """
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Email Alerts</h3>
        
        {[
          { title: 'New Lead Captured', desc: 'Get an email every time the AI captures a new lead.', active: True },
          { title: 'Agent Handover Request', desc: 'Alert me when a user asks to speak to a human.', active: True },
          { title: 'Daily Performance Summary', desc: 'A morning digest of yesterday\'s metrics.', active: False },
          { title: 'Billing & Account', desc: 'Invoices, limits, and subscription updates.', active: True }
        ].map((setting, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: i === 3 ? 'none' : '1px solid var(--stripe-border)' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.25rem' }}>{setting.title}</div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-body)' }}>{setting.desc}</div>
            </div>
            <div style={{ width: '44px', height: '24px', backgroundColor: setting.active ? 'var(--stripe-purple)' : '#e3e8ee', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#ffffff', borderRadius: '50%', position: 'absolute', top: '2px', left: setting.active ? '22px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'left 0.2s' }}></div>
            </div>
          </div>
        ))}
      </div>
"""
    },
    "settings": {
        "title": "Workspace Settings",
        "subtitle": "Manage your company profile and team access.",
        "content": """
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
"""
    },
    "refer": {
        "title": "Refer a Friend",
        "subtitle": "Earn 30% recurring commission for every customer you bring.",
        "content": """
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { title: 'Clicks', value: '342' },
          { title: 'Signups', value: '18' },
          { title: 'Commissions', value: '$450.00' }
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <div style={{ fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>{stat.title}</div>
            <div style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', fontFeatureSettings: '"tnum", "ss01"', letterSpacing: '-0.64px' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 500 }}>Your Unique Link</h3>
        <p style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1.5rem' }}>Share this link on your blog, social media, or with clients.</p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input type="text" value="https://heyamira.com/?via=ashley29" readOnly style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px', color: 'var(--stripe-navy)', backgroundColor: '#f6f9fc' }} />
          <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0 1.5rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Copy Link</button>
        </div>
      </div>
"""
    },
    "partner": {
        "title": "Agency Dashboard",
        "subtitle": "Manage your client sub-accounts and white-labeling.",
        "content": """
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: 0, fontWeight: 500 }}>Client Accounts</h3>
          <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>+ Add Client</button>
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
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Burger Joint LLC</td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-body)' }}>Pro ($99/mo)</td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-body)' }}>$99.00</td>
              <td style={{ padding: '1rem 0' }}><span style={{ backgroundColor: 'rgba(21,190,83,0.1)', color: 'var(--stripe-success-text)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Active</span></td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-purple)', cursor: 'pointer' }}>Login as Client</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Downtown Realtors</td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-body)' }}>Enterprise ($299/mo)</td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-body)' }}>$299.00</td>
              <td style={{ padding: '1rem 0' }}><span style={{ backgroundColor: 'rgba(21,190,83,0.1)', color: 'var(--stripe-success-text)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Active</span></td>
              <td style={{ padding: '1rem 0', fontSize: '14px', color: 'var(--stripe-purple)', cursor: 'pointer' }}>Login as Client</td>
            </tr>
          </tbody>
        </table>
      </div>
"""
    },
    "plan": {
        "title": "Your Plan",
        "subtitle": "Track your usage and manage your subscription.",
        "content": """
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-label)', fontWeight: 500, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Plan</div>
              <div style={{ fontSize: '24px', color: 'var(--stripe-navy)', fontWeight: 300, letterSpacing: '-0.48px', marginBottom: '0.5rem' }}>Pro Tier</div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-body)' }}>$99.00 / month</div>
            </div>
            <span style={{ backgroundColor: 'rgba(21,190,83,0.1)', color: 'var(--stripe-success-text)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Active</span>
          </div>
          
          <button style={{ width: '100%', backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: '1rem' }}>Manage Billing (Stripe)</button>
          <button style={{ width: '100%', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Upgrade Plan</button>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Monthly Usage</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '0.5rem', fontFeatureSettings: '"tnum"' }}>
              <span style={{ color: 'var(--stripe-navy)', fontWeight: 500 }}>AI Conversations</span>
              <span style={{ color: 'var(--stripe-body)' }}>450 / 1,000</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#e3e8ee', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '45%', height: '100%', backgroundColor: 'var(--stripe-purple)' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '0.5rem', fontFeatureSettings: '"tnum"' }}>
              <span style={{ color: 'var(--stripe-navy)', fontWeight: 500 }}>Team Members</span>
              <span style={{ color: 'var(--stripe-body)' }}>2 / 5</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#e3e8ee', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '40%', height: '100%', backgroundColor: 'var(--stripe-purple)' }}></div>
            </div>
          </div>
        </div>
      </div>
"""
    },
    "upgrade": {
        "title": "Upgrade Plan",
        "subtitle": "Choose the right plan to scale your AI operations.",
        "content": """
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { name: 'Starter', price: '$29', limit: '100 conversations/mo', features: ['Webchat widget', 'Basic knowledge base', '1 Team member'] },
          { name: 'Pro', price: '$99', limit: '1,000 conversations/mo', features: ['WhatsApp & Social', 'Automated Drips', 'Zapier Integration', '5 Team members'], highlighted: True },
          { name: 'Enterprise', price: '$299', limit: 'Unlimited', features: ['Custom API access', 'Dedicated success rep', 'White-labeling', 'Unlimited members'] }
        ].map((plan, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: plan.highlighted ? '2px solid var(--stripe-purple)' : '1px solid var(--stripe-border)', borderRadius: '8px', padding: '2rem', boxShadow: plan.highlighted ? '0 8px 30px rgba(83,58,253,0.12)' : 'var(--stripe-shadow-ambient)', position: 'relative' }}>
            {plan.highlighted && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Most Popular</div>}
            
            <div style={{ fontSize: '18px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.5rem' }}>{plan.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '36px', fontWeight: 300, color: 'var(--stripe-navy)', letterSpacing: '-0.72px', fontFeatureSettings: '"tnum", "ss01"' }}>{plan.price}</span>
              <span style={{ fontSize: '14px', color: 'var(--stripe-body)' }}>/mo</span>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--stripe-purple)', fontWeight: 500, marginBottom: '2rem', fontFeatureSettings: '"tnum"' }}>{plan.limit}</div>
            
            <button style={{ width: '100%', backgroundColor: plan.highlighted ? 'var(--stripe-purple)' : '#ffffff', color: plan.highlighted ? '#ffffff' : 'var(--stripe-navy)', border: plan.highlighted ? 'none' : '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.75rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: '2rem' }}>
              {plan.highlighted ? 'Current Plan' : 'Upgrade'}
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {plan.features.map((feat, j) => (
                <div key={j} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--stripe-purple)', fontSize: '14px' }}>✓</div>
                  <div style={{ fontSize: '14px', color: 'var(--stripe-body)' }}>{feat}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
"""
    }
}

def generate_page(folder_name, data):
    title = data["title"]
    subtitle = data["subtitle"]
    content = data["content"]
    
    # We must use {{{{ and }}}} in the f-string where we want JSX {{ and }}
    # But since content is a raw string from the dict, we do NOT escape inside content, it already has {{ and }}.
    # We only escape the wrapper around it.
    return f'''export default function Page() {{
  return (
    <div style={{{{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}}}>
      <div style={{{{ marginBottom: '2rem' }}}}>
        <h1 style={{{{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}}}>{title}</h1>
        <p style={{{{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}}}>{subtitle}</p>
      </div>
      {content}
    </div>
  );
}}
'''

for page_slug, data in pages_data.items():
    page_dir = os.path.join(base_dir, page_slug)
    os.makedirs(page_dir, exist_ok=True)
    file_path = os.path.join(page_dir, "page.tsx")
    with open(file_path, "w") as f:
        f.write(generate_page(page_slug, data))

print("Successfully generated all 16 detailed Stripe dashboard pages.")
