'use client';

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
            <button onClick={() => setShowModal(true)} style={{ backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Take Over Chat</button>
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
