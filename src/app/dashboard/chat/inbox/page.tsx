'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';
import { createClient } from '../../../../utils/supabase/client';

export default function ChatPage() {
  const supabase = createClient();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  // Real data state
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  
  // Fallback / Initial State
  const fallbackChats = [
    { id: '1', name: 'Sarah Smith', channel: 'WhatsApp', status: 'Active (AI)', avatar: 'https://i.pravatar.cc/150?u=a1' },
    { id: '2', name: 'Michael Chen', channel: 'Webchat', status: 'Waiting', avatar: 'https://i.pravatar.cc/150?u=a2' },
    { id: '3', name: 'Elena Rodriguez', channel: 'Instagram', status: 'Closed', avatar: 'https://i.pravatar.cc/150?u=a3' },
  ];
  const fallbackMessages = [
    { content: 'Hi, I saw your ad on Facebook.', sender_type: 'lead' },
    { content: 'Hello! Thanks for reaching out. Are you interested in our real estate CRM or our AI tools?', sender_type: 'ai' }
  ];

  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Fetch Conversations on Mount
  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          channel,
          status,
          leads (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setConversations(fallbackChats);
        setActiveChatId('1');
      } else {
        const mappedData = data.map((conv: any) => ({
          id: conv.id,
          name: conv.leads?.name || 'Unknown Lead',
          channel: conv.channel,
          status: conv.status,
          avatar: `https://i.pravatar.cc/150?u=${conv.id}`
        }));
        setConversations(mappedData);
        if (mappedData.length > 0) setActiveChatId(mappedData[0].id);
      }
    };
    fetchConversations();
  }, []);

  // Fetch Messages when Active Chat Changes
  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      // If we are using fallback mock data
      if (activeChatId.length < 10) { 
        setMessages(fallbackMessages);
        return;
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeChatId)
        .order('created_at', { ascending: true });
        
      if (!error && data) {
        setMessages(data);
      }
    };
    fetchMessages();

    // Subscribe to new messages for this conversation
    const channel = supabase
      .channel(`messages-${activeChatId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${activeChatId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChatId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChatId) return;
    
    // Optimistic UI for fallback
    if (activeChatId.length < 10) {
      setMessages([...messages, { content: inputValue, sender_type: 'user' }]);
      setInputValue('');
      return;
    }

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: activeChatId,
        sender_type: 'user', // Human takeover
        content: inputValue
      });

    if (!error) {
      setInputValue('');
      // Subscription handles the UI append
    } else {
      setToast('Error sending message');
    }
  };

  const handleTakeover = async () => {
    setShowModal(false);
    
    if (activeChatId && activeChatId.length > 10) {
      await supabase.from('conversations').update({ status: 'Manual' }).eq('id', activeChatId);
      // Update local state
      setConversations(prev => prev.map(c => c.id === activeChatId ? { ...c, status: 'Manual' } : c));
    }

    setToast('You have successfully taken over the chat.');
  };

  const activeChatData = conversations.find(c => c.id === activeChatId) || conversations[0];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', height: 'calc(100vh - 120px)' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Take Over Chat?">
        <p style={{ color: 'var(--stripe-body)', fontSize: '12px', marginBottom: '1rem' }}>
          Taking over this chat will pause the AI agent. Are you sure you want to proceed?
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleTakeover} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: 'var(--stripe-purple)', color: '#fff', cursor: 'pointer' }}>Take Over</button>
        </div>
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Live Inbox</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0 }}>Monitor and jump into AI conversations.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0', backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', height: '100%', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
        <div style={{ width: '320px', borderRight: '1px solid var(--stripe-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--stripe-border)' }}>
            <input type="text" placeholder="Search conversations..." style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', fontSize: '12px' }} />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {conversations.map((chat) => (
              <div key={chat.id} onClick={() => setActiveChatId(chat.id)} style={{ padding: '1rem', borderBottom: '1px solid var(--stripe-border)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', backgroundColor: activeChatId === chat.id ? '#f6f9fc' : '#ffffff' }}>
                <img src={chat.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.25rem' }}>{chat.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>{chat.channel} • {chat.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--stripe-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {activeChatData && <img src={activeChatData.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />}
              <div>
                <div style={{ fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{activeChatData?.name || 'Loading...'}</div>
                <div style={{ fontSize: '12px', color: 'var(--stripe-success-text)' }}>Online now</div>
              </div>
            </div>
            <button onClick={() => setShowModal(true)} style={{ backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Take Over Chat</button>
          </div>
          
          <div style={{ flex: 1, backgroundColor: '#f6f9fc', padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, i) => {
              const isLead = msg.sender_type === 'lead';
              return (
                <div key={i} style={{ alignSelf: !isLead ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                  <div style={{ backgroundColor: !isLead ? 'var(--stripe-purple)' : '#ffffff', color: !isLead ? '#ffffff' : 'var(--stripe-navy)', padding: '0.75rem 1rem', borderRadius: '8px', borderBottomLeftRadius: !isLead ? '8px' : '0', borderBottomRightRadius: !isLead ? '0' : '8px', fontSize: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: !isLead ? 'none' : '1px solid var(--stripe-border)' }}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '0.25rem', textAlign: !isLead ? 'right' : 'left' }}>
                    {msg.sender_type === 'ai' ? 'Amira AI' : msg.sender_type === 'user' ? 'You' : activeChatData?.name}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--stripe-border)', backgroundColor: '#ffffff' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', fontSize: '12px', outline: 'none' }} />
              <button type="submit" style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0 1.5rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

