import os

base_dir = "/Users/mac/.gemini/antigravity/scratch/tryamira/src/app/dashboard"

# 1. Update /dashboard/page.tsx
overview_content = """'use client';
import Link from 'next/link';

export default function OverviewPage() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Welcome back, Ashley</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Here's what's happening with your AI agent today.</p>
        </div>
        <img 
          src="https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png" 
          alt="Amira Logo" 
          style={{ height: '40px', width: 'auto' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { title: 'Total Leads', value: '1,248', trend: '+12%', positive: True, link: '/dashboard/leads' },
          { title: 'Active Conversations', value: '42', trend: '+5%', positive: True, link: '/dashboard/chat' },
          { title: 'Agent Deflection Rate', value: '89%', trend: '-2%', positive: False, link: '/dashboard/analytics' }
        ].map((stat, i) => (
          <Link href={stat.link} key={i} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
                 onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(50,50,93,0.1)'; }}
                 onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--stripe-shadow-ambient)'; }}>
              <div style={{ fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500, fontFeatureSettings: '"ss01"' }}>{stat.title}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <div style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', fontFeatureSettings: '"tnum", "ss01"', letterSpacing: '-0.64px' }}>{stat.value}</div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 500,
                  color: stat.positive ? 'var(--stripe-success-text)' : '#d92d20',
                  backgroundColor: stat.positive ? 'rgba(21,190,83,0.1)' : 'rgba(217,45,32,0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFeatureSettings: '"tnum"'
                }}>
                  {stat.trend}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)', minHeight: '400px' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500, fontFeatureSettings: '"ss01"' }}>Recent Activity</h3>
        
        {[
          { action: 'New lead captured', entity: 'John Doe', time: '10 mins ago', avatar: 'https://i.pravatar.cc/150?u=1' },
          { action: 'Agent handled objection', entity: 'Sarah Smith', time: '1 hour ago', avatar: 'https://i.pravatar.cc/150?u=2' },
          { action: 'Knowledge base updated', entity: 'Pricing.pdf', time: '3 hours ago', avatar: null },
          { action: 'Campaign finished', entity: 'Q3 Promo Drip', time: '1 day ago', avatar: null }
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: i === 3 ? 'none' : '1px solid var(--stripe-border)' }}>
            {item.avatar ? (
                <img src={item.avatar} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--stripe-purple)', flexShrink: 0 }}>
                <span style={{ fontSize: '16px', lineHeight: 1 }}>•</span>
                </div>
            )}
            <div style={{ flex: 1, fontFeatureSettings: '"ss01"' }}>
              <div style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.25rem' }}>{item.action}</div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-body)' }}>{item.entity}</div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--stripe-muted)', fontFeatureSettings: '"ss01"' }}>{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
""".replace("True", "true").replace("False", "false")

with open(os.path.join(base_dir, "page.tsx"), "w") as f:
    f.write(overview_content)

# 2. Update /dashboard/chat/page.tsx
chat_content = """'use client';

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(0);
  const [messages, setMessages] = useState([
    { text: 'Hi, I saw your ad on Facebook.', isBot: false },
    { text: 'Hello! Thanks for reaching out. Are you interested in our real estate CRM or our AI tools?', isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const chats = [
    { name: 'Sarah Smith', platform: 'WhatsApp', status: 'Active (AI)', avatar: 'https://i.pravatar.cc/150?u=a1' },
    { name: 'Michael Chen', platform: 'Webchat', status: 'Waiting', avatar: 'https://i.pravatar.cc/150?u=a2' },
    { name: 'Elena Rodriguez', platform: 'Instagram', status: 'Closed', avatar: 'https://i.pravatar.cc/150?u=a3' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setMessages([...messages, { text: inputValue, isBot: false }]);
    setInputValue('');
  };

  const handleTakeover = () => {
    setShowModal(false);
    setToast('You have successfully taken over the chat.');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', height: 'calc(100vh - 120px)' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Take Over Chat?">
        <p style={{ color: 'var(--stripe-body)', fontSize: '14px', marginBottom: '1.5rem' }}>
          Taking over this chat will pause the AI agent. Are you sure you want to proceed?
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleTakeover} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: 'var(--stripe-purple)', color: '#fff', cursor: 'pointer' }}>Take Over</button>
        </div>
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Live Inbox</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '14px', margin: 0 }}>Monitor and jump into AI conversations.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0', backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', height: '100%', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
        <div style={{ width: '320px', borderRight: '1px solid var(--stripe-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--stripe-border)' }}>
            <input type="text" placeholder="Search conversations..." style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', fontSize: '14px' }} />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {chats.map((chat, i) => (
              <div key={i} onClick={() => setActiveChat(i)} style={{ padding: '1rem', borderBottom: '1px solid var(--stripe-border)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', backgroundColor: activeChat === i ? '#f6f9fc' : '#ffffff' }}>
                <img src={chat.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.25rem' }}>{chat.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>{chat.platform} • {chat.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--stripe-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={chats[activeChat].avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <div style={{ fontSize: '16px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{chats[activeChat].name}</div>
                <div style={{ fontSize: '13px', color: 'var(--stripe-success-text)' }}>Online now</div>
              </div>
            </div>
            <button onClick={() => setShowModal(True)} style={{ backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Take Over Chat</button>
          </div>
          
          <div style={{ flex: 1, backgroundColor: '#f6f9fc', padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.isBot ? 'flex-start' : 'flex-end', maxWidth: '70%' }}>
                <div style={{ backgroundColor: msg.isBot ? '#ffffff' : 'var(--stripe-purple)', color: msg.isBot ? 'var(--stripe-navy)' : '#ffffff', padding: '0.75rem 1rem', borderRadius: '8px', borderBottomLeftRadius: msg.isBot ? '0' : '8px', borderBottomRightRadius: msg.isBot ? '8px' : '0', fontSize: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: msg.isBot ? '1px solid var(--stripe-border)' : 'none' }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '0.25rem', textAlign: msg.isBot ? 'left' : 'right' }}>
                  {msg.isBot ? 'Amira AI' : chats[activeChat].name} • Just now
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--stripe-border)', backgroundColor: '#ffffff' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', fontSize: '14px', outline: 'none' }} />
              <button type="submit" style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0 1.5rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
""".replace("True", "true").replace("False", "false")

with open(os.path.join(base_dir, "chat", "page.tsx"), "w") as f:
    f.write(chat_content)


# 3. Update /dashboard/leads/page.tsx
leads_content = """'use client';

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const allLeads = [
    { name: 'Sarah Smith', email: 'sarah.s@example.com', phone: '+1 (555) 0123', status: 'Hot', score: '98' },
    { name: 'Michael Chen', email: 'michael.c@example.com', phone: '+1 (555) 0124', status: 'Warm', score: '74' },
    { name: 'Elena Rodriguez', email: 'elena.r@example.com', phone: '+1 (555) 0125', status: 'Cold', score: '32' },
    { name: 'James Wilson', email: 'j.wilson@example.com', phone: '+1 (555) 0126', status: 'Warm', score: '65' }
  ];

  const filteredLeads = allLeads.filter(lead => 
    lead.name.toLowerCase().includes(search.toLowerCase()) || 
    lead.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    setIsExporting(True);
    setTimeout(() => {
      setIsExporting(False);
      setToast({ message: 'CSV Exported Successfully!', type: 'success' });
    }, 1500);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddModal(False);
    setToast({ message: 'New lead added successfully.', type: 'success' });
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(False)} title="Add New Lead">
        <form onSubmit={handleAddLead} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Full Name</label>
            <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Email Address</label>
            <input type="email" required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
          </div>
          <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Save Lead</button>
        </form>
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Leads CRM</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '14px', margin: 0 }}>Manage and export your captured leads.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleExport} disabled={isExporting} style={{ backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button onClick={() => setShowAddModal(True)} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            + Add Lead
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--stripe-border)', backgroundColor: '#f6f9fc' }}>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: '400px', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--stripe-border)', fontSize: '14px', outline: 'none' }} 
          />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFeatureSettings: '"tnum", "ss01"' }}>
          <thead>
            <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--stripe-border)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>NAME</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>EMAIL</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>PHONE</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>STATUS</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>SCORE</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                <td style={{ padding: '1rem 1.5rem', fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{lead.name}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '14px', color: 'var(--stripe-body)' }}>{lead.email}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '14px', color: 'var(--stripe-body)' }}>{lead.phone}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ 
                    backgroundColor: lead.status === 'Hot' ? 'rgba(217,45,32,0.1)' : lead.status === 'Warm' ? 'rgba(247,144,9,0.1)' : '#f6f9fc',
                    color: lead.status === 'Hot' ? '#d92d20' : lead.status === 'Warm' ? '#b54708' : 'var(--stripe-muted)',
                    padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500 
                  }}>
                    {lead.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '14px', color: 'var(--stripe-navy)' }}>{lead.score}</td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--stripe-muted)' }}>No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
""".replace("True", "true").replace("False", "false")

with open(os.path.join(base_dir, "leads", "page.tsx"), "w") as f:
    f.write(leads_content)


# 4. Update /dashboard/ai-agent/page.tsx
ai_agent_content = """'use client';

import { useState } from 'react';
import Toast from '../../../components/ui/Toast';

export default function AIAgentPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<string[]>(['Pricing.pdf']);

  const handleSave = () => {
    setToast('Agent persona updated successfully.');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(True);
  };

  const handleDragLeave = () => {
    setIsDragging(False);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(False);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles([...files, e.dataTransfer.files[0].name]);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>AI Agent Setup</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '14px', margin: 0 }}>Configure how your agent behaves and what it knows.</p>
        </div>
        <button onClick={handleSave} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>Save Changes</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>System Prompt</h3>
            <p style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1rem' }}>Tell the AI who it is and how it should respond.</p>
            <textarea 
              style={{ width: '100%', height: '150px', padding: '1rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '14px', color: 'var(--stripe-navy)', outline: 'none', resize: 'vertical' }}
              defaultValue="You are Amira, a helpful real estate assistant. Always be polite, ask for the user's budget, and try to schedule a viewing."
            />
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Knowledge Base</h3>
            <p style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1rem' }}>Upload PDFs, TXTs, or link your website for the AI to learn from.</p>
            
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{ 
                border: isDragging ? '2px dashed var(--stripe-purple)' : '1px dashed var(--stripe-border)', 
                backgroundColor: isDragging ? 'rgba(83,58,253,0.05)' : '#f9fafb', 
                borderRadius: '6px', 
                padding: '3rem', 
                textAlign: 'center', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ color: 'var(--stripe-purple)', fontSize: '24px', marginBottom: '0.5rem' }}>+</div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Click or drag file to upload</div>
              <div style={{ fontSize: '12px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>PDF, DOCX, TXT (Max 10MB)</div>
            </div>

            {files.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                {files.map((file, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#f6f9fc', borderRadius: '4px', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--stripe-purple)' }}>📄</span>
                    <span style={{ fontSize: '13px', color: 'var(--stripe-navy)', flex: 1 }}>{file}</span>
                    <span style={{ fontSize: '12px', color: 'var(--stripe-success-text)', backgroundColor: 'rgba(21,190,83,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Ready</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Personality</h3>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: 'var(--stripe-purple)' }} />
              <span style={{ fontSize: '14px', color: 'var(--stripe-navy)' }}>Use emojis naturally 😊</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: 'var(--stripe-purple)' }} />
              <span style={{ fontSize: '14px', color: 'var(--stripe-navy)' }}>Keep responses under 2 sentences</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: 'var(--stripe-purple)' }} />
              <span style={{ fontSize: '14px', color: 'var(--stripe-navy)' }}>Always capture email first</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
""".replace("True", "true").replace("False", "false")

with open(os.path.join(base_dir, "ai-agent", "page.tsx"), "w") as f:
    f.write(ai_agent_content)

print("Phase 1 pages successfully updated with stateful React components.")
