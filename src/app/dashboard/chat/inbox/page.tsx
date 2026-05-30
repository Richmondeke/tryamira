'use client';

import { useState, useEffect, useRef } from 'react';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';
import { createClient } from '../../../../utils/supabase/client';

const MOCK_CONVERSATIONS = [
  { id: 'mock-1', name: 'James Thornton', channel: 'Web Chat', status: 'AI Active', avatar: 'https://i.pravatar.cc/150?u=1', lastMessage: 'What are your office hours?', time: '2m ago', unread: 2 },
  { id: 'mock-2', name: 'Priya Menon', channel: 'Phone', status: 'Manual', avatar: 'https://i.pravatar.cc/150?u=2', lastMessage: 'I need to reschedule my appointment.', time: '15m ago', unread: 0 },
  { id: 'mock-3', name: 'Carlos Rivera', channel: 'WhatsApp', status: 'AI Active', avatar: 'https://i.pravatar.cc/150?u=3', lastMessage: 'Is there a free trial?', time: '1h ago', unread: 1 },
  { id: 'mock-4', name: 'Amaka Osei', channel: 'Web Chat', status: 'Resolved', avatar: 'https://i.pravatar.cc/150?u=4', lastMessage: 'Thanks for your help!', time: '3h ago', unread: 0 },
];

const MOCK_MESSAGES: Record<string, any[]> = {
  'mock-1': [
    { id: 1, sender_type: 'lead', content: 'Hi, I saw your product online.', created_at: '' },
    { id: 2, sender_type: 'ai', content: 'Hi James! Welcome to Amira. How can I help you today?', created_at: '' },
    { id: 3, sender_type: 'lead', content: 'What are your office hours?', created_at: '' },
    { id: 4, sender_type: 'ai', content: 'We are open Monday to Friday, 9am – 6pm EST. Is there anything specific I can help you with?', created_at: '' },
    { id: 5, sender_type: 'user', sender_name: 'Sarah Jenkins', content: 'Hello sir', created_at: '' },
  ],
  'mock-2': [
    { id: 1, sender_type: 'lead', content: 'I need to reschedule my appointment from Thursday.', created_at: '' },
    { id: 2, sender_type: 'ai', content: 'Of course! Let me pull up your booking. Can I get your email address?', created_at: '' },
    { id: 3, sender_type: 'lead', content: 'Sure, it\'s priya@example.com', created_at: '' },
  ],
  'mock-3': [
    { id: 1, sender_type: 'lead', content: 'Hello! Is there a free trial available?', created_at: '' },
    { id: 2, sender_type: 'ai', content: 'Yes! We offer a 14-day free trial with no credit card required. Would you like me to set one up for you?', created_at: '' },
    { id: 3, sender_type: 'lead', content: 'That sounds great, yes please!', created_at: '' },
  ],
  'mock-4': [
    { id: 1, sender_type: 'lead', content: 'My order arrived, thank you!', created_at: '' },
    { id: 2, sender_type: 'ai', content: 'That\'s wonderful to hear, Amaka! Enjoy your order. Feel free to reach out if you need anything.', created_at: '' },
    { id: 3, sender_type: 'lead', content: 'Thanks for your help!', created_at: '' },
  ],
};

const statusColors: Record<string, string> = {
  'AI Active': '#10b981',
  'Manual': '#f59e0b',
  'Resolved': '#94a3b8',
};

const channelIcons: Record<string, string> = {
  'Web Chat': '💬',
  'Phone': '📞',
  'WhatsApp': '🟢',
  'Email': '📧',
};

export default function ChatPage() {
  const supabase = createClient();
  const [activeChatId, setActiveChatId] = useState<string>('mock-1');
  const [conversations, setConversations] = useState<any[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<any[]>(MOCK_MESSAGES['mock-1']);
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [useLiveData, setUseLiveData] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`id, channel, status, leads (name)`)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mappedData = data.map((conv: any) => ({
          id: conv.id, name: conv.leads?.name || 'Unknown Lead',
          channel: conv.channel, status: conv.status,
          avatar: `https://i.pravatar.cc/150?u=${conv.id}`,
          lastMessage: '', time: 'now', unread: 0
        }));
        setConversations(mappedData);
        setActiveChatId(mappedData[0].id);
        setUseLiveData(true);
      }
    };
    fetchConversations();

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        setCurrentUser({ id: user.id, full_name: profile?.full_name || 'You' });
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!useLiveData) {
      setMessages(MOCK_MESSAGES[activeChatId] || []);
      return;
    }
    if (!activeChatId) return;
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages').select('*, profiles(full_name)')
        .eq('conversation_id', activeChatId)
        .order('created_at', { ascending: true });
      if (!error && data) setMessages(data);
    };
    fetchMessages();
    const channel = supabase.channel(`messages-${activeChatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeChatId}` },
        async (payload) => {
          let profiles = null;
          if (payload.new.sender_id) {
            const { data } = await supabase.from('profiles').select('full_name').eq('id', payload.new.sender_id).single();
            profiles = data;
          }
          setMessages(prev => [...prev, { ...payload.new, profiles }]);
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeChatId, useLiveData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (!useLiveData) {
      setMessages(prev => [...prev, { id: Date.now(), sender_type: 'user', content: inputValue, created_at: '' }]);
      setInputValue('');
      return;
    }
    const { error } = await supabase.from('messages').insert({ 
      conversation_id: activeChatId, 
      sender_type: 'user', 
      sender_id: currentUser?.id,
      content: inputValue 
    });
    if (!error) setInputValue('');
    else setToast('Error sending message');
  };

  const handleTakeover = async () => {
    setShowModal(false);
    if (useLiveData && activeChatId.length > 10) {
      await supabase.from('conversations').update({ status: 'Manual' }).eq('id', activeChatId);
    }
    setConversations(prev => prev.map(c => c.id === activeChatId ? { ...c, status: 'Manual' } : c));
    setToast('You have taken over this conversation.');
  };

  const activeChatData = conversations.find(c => c.id === activeChatId);
  const filtered = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Take Over Chat?">
        <p style={{ color: 'var(--stripe-body)', fontSize: '13px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Taking over will pause the AI agent on this conversation. You will handle it manually. The AI can be resumed at any time.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
          <button onClick={handleTakeover} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: '#533afd', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>Take Over</button>
        </div>
      </Modal>

      <div style={{ display: 'flex', flex: 1, backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
        
        {/* Sidebar */}
        <div style={{ width: '300px', borderRight: '1px solid var(--stripe-border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--stripe-border)' }}>
            <input
              type="text" placeholder="Search conversations..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--stripe-border)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              {['All', 'AI Active', 'Manual', 'Resolved'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '2px 8px', borderRadius: '20px', border: '1px solid', fontSize: '11px', cursor: 'pointer', fontWeight: filter === f ? 600 : 400,
                    backgroundColor: filter === f ? '#533afd' : 'transparent',
                    color: filter === f ? '#fff' : 'var(--stripe-muted)',
                    borderColor: filter === f ? '#533afd' : 'var(--stripe-border)',
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--stripe-muted)', fontSize: '13px' }}>No conversations found.</div>
            ) : filtered.map((chat) => (
              <div key={chat.id} onClick={() => setActiveChatId(chat.id)}
                style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--stripe-border)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', backgroundColor: activeChatId === chat.id ? '#f6f9fc' : '#fff', transition: 'background 0.1s', position: 'relative' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={chat.avatar} style={{ width: '38px', height: '38px', borderRadius: '50%' }} alt={chat.name} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', backgroundColor: statusColors[chat.status] || '#94a3b8', border: '2px solid #fff' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--stripe-muted)', flexShrink: 0, marginLeft: '0.5rem' }}>{chat.time}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--stripe-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>{chat.lastMessage}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '11px' }}>{channelIcons[chat.channel] || '💬'}</span>
                    <span style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>{chat.channel}</span>
                    {chat.unread > 0 && (
                      <span style={{ marginLeft: 'auto', backgroundColor: '#533afd', color: '#fff', borderRadius: '20px', fontSize: '10px', fontWeight: 700, padding: '1px 6px' }}>{chat.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {!activeChatData ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--stripe-muted)', fontSize: '13px' }}>
              Select a conversation to get started.
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={{ padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--stripe-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <img src={activeChatData.avatar} style={{ width: '38px', height: '38px', borderRadius: '50%' }} alt={activeChatData.name} />
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{activeChatData.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColors[activeChatData.status] }} />
                      <span style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>{activeChatData.status} · {channelIcons[activeChatData.channel]} {activeChatData.channel}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {activeChatData.status !== 'Resolved' && (
                    <button onClick={() => setShowModal(true)}
                      style={{ backgroundColor: '#fff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.4rem 0.875rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
                      {activeChatData.status === 'Manual' ? 'Resume AI' : 'Take Over'}
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg, i) => {
                  const isOutbound = msg.sender_type !== 'lead';
                  const isAI = msg.sender_type === 'ai';
                  return (
                    <div key={i} style={{ alignSelf: isOutbound ? 'flex-end' : 'flex-start', maxWidth: '68%' }}>
                      <div style={{ backgroundColor: isAI ? '#533afd' : isOutbound ? '#1e293b' : '#ffffff', color: isOutbound ? '#ffffff' : 'var(--stripe-navy)', padding: '0.75rem 1rem', borderRadius: '12px', borderBottomRightRadius: isOutbound ? '2px' : '12px', borderBottomLeftRadius: isOutbound ? '12px' : '2px', fontSize: '13px', lineHeight: 1.5, boxShadow: '0 1px 2px rgba(0,0,0,0.06)', border: isOutbound ? 'none' : '1px solid var(--stripe-border)' }}>
                        {msg.content}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '0.25rem', textAlign: isOutbound ? 'right' : 'left', paddingLeft: isOutbound ? 0 : '0.25rem' }}>
                        {isAI ? '🤖 AI Agent' : isOutbound ? (
                          msg.sender_name ? (msg.sender_name === currentUser?.full_name ? 'You' : msg.sender_name) :
                          msg.profiles?.full_name ? (msg.profiles.full_name === currentUser?.full_name ? 'You' : msg.profiles.full_name) : 'You'
                        ) : activeChatData.name}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--stripe-border)', backgroundColor: '#fff' }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                    placeholder={activeChatData.status === 'AI Active' ? 'AI is handling this — take over to reply manually...' : 'Type a message...'}
                    disabled={activeChatData.status === 'AI Active'}
                    style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--stripe-border)', fontSize: '13px', outline: 'none', backgroundColor: activeChatData.status === 'AI Active' ? '#f9fafb' : '#fff', color: 'var(--stripe-navy)' }}
                  />
                  <button type="submit" disabled={activeChatData.status === 'AI Active'}
                    style={{ backgroundColor: activeChatData.status === 'AI Active' ? '#e2e8f0' : '#533afd', color: activeChatData.status === 'AI Active' ? 'var(--stripe-muted)' : '#fff', border: 'none', borderRadius: '8px', padding: '0.65rem 1.25rem', fontSize: '13px', fontWeight: 500, cursor: activeChatData.status === 'AI Active' ? 'not-allowed' : 'pointer' }}>
                    Send
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
