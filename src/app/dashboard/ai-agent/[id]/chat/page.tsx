'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Message = {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  mediaType?: 'text' | 'image' | 'table' | 'graph';
  mediaPayload?: any;
};

export default function AgentChatPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: `Hello! I'm your AI employee. I'm connected to your apps via Composio. How can I help you today?`,
      timestamp: new Date().toISOString(),
      mediaType: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
      mediaType: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI Response parsing logic based on input
    setTimeout(() => {
      setIsTyping(false);
      
      const lowerInput = userMessage.content.toLowerCase();
      let responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: "I executed that for you.",
        timestamp: new Date().toISOString(),
        mediaType: 'text'
      };

      if (lowerInput.includes('table') || lowerInput.includes('leads') || lowerInput.includes('contacts')) {
        responseMessage.content = "Here are the latest leads from your CRM:";
        responseMessage.mediaType = 'table';
        responseMessage.mediaPayload = [
          { name: "John Doe", company: "Acme Corp", email: "john@acme.com", status: "Hot" },
          { name: "Sarah Smith", company: "TechFlow", email: "sarah@techflow.io", status: "Warm" },
          { name: "Mike Johnson", company: "Globex", email: "mike@globex.net", status: "Cold" }
        ];
      } else if (lowerInput.includes('graph') || lowerInput.includes('chart') || lowerInput.includes('metrics')) {
        responseMessage.content = "Here is the performance graph over the last week:";
        responseMessage.mediaType = 'graph';
        responseMessage.mediaPayload = {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          data: [12, 19, 3, 5, 2]
        };
      } else if (lowerInput.includes('image') || lowerInput.includes('photo')) {
        responseMessage.content = "Here is the image you requested:";
        responseMessage.mediaType = 'image';
        responseMessage.mediaPayload = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop";
      } else {
        responseMessage.content = `I understood: "${userMessage.content}". Since I'm in demo mode, I'm just echoing this back. Once my Composio backend is fully wired, I'll execute this action in your connected apps!`;
      }
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const renderMedia = (msg: Message) => {
    if (msg.mediaType === 'table' && msg.mediaPayload) {
      const data = msg.mediaPayload as any[];
      if (!data || data.length === 0) return null;
      const headers = Object.keys(data[0]);
      
      return (
        <div style={{ marginTop: '0.75rem', overflowX: 'auto', border: '1px solid var(--stripe-border)', borderRadius: '6px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--stripe-border)' }}>
                {headers.map(h => (
                  <th key={h} style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 600, color: 'var(--stripe-navy)', textTransform: 'capitalize' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} style={{ borderBottom: i === data.length - 1 ? 'none' : '1px solid var(--stripe-border)' }}>
                  {headers.map(h => (
                    <td key={h} style={{ padding: '0.5rem', color: 'var(--stripe-body)' }}>{row[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
    if (msg.mediaType === 'graph' && msg.mediaPayload) {
      // Mock Graph using flex bars
      const { labels, data } = msg.mediaPayload;
      const max = Math.max(...data);
      return (
        <div style={{ marginTop: '0.75rem', padding: '1rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', backgroundColor: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '120px' }}>
            {data.map((val: number, i: number) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '100%', backgroundColor: '#0ea5e9', borderRadius: '4px 4px 0 0', height: \`\${(val / max) * 100}%\`, transition: 'height 0.3s ease' }} />
                <span style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>{labels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (msg.mediaType === 'image' && msg.mediaPayload) {
      return (
        <div style={{ marginTop: '0.75rem', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--stripe-border)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={msg.mediaPayload} alt="Agent Output" style={{ width: '100%', display: 'block' }} />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '1.5rem 0', borderBottom: '1px solid var(--stripe-border)' }}>
        <button 
          onClick={() => router.push(\`/dashboard/ai-agent/\${params.id}\`)}
          style={{ background: 'none', border: 'none', color: 'var(--stripe-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.25rem', fontSize: '13px', marginRight: '1rem' }}
        >
          ← Back to Config
        </button>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Chat with AI Employee</h1>
          <p style={{ fontSize: '13px', color: 'var(--stripe-body)', margin: 0 }}>
            Interact with your agent directly. Try asking for a "table", "graph", or "image".
          </p>
        </div>
      </div>

      {/* CHAT HISTORY */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#f8fafc' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ 
              maxWidth: '75%', 
              backgroundColor: msg.role === 'user' ? '#0ea5e9' : '#ffffff',
              color: msg.role === 'user' ? '#ffffff' : 'var(--stripe-navy)',
              padding: '1rem',
              borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
              boxShadow: 'var(--stripe-shadow-ambient)',
              border: msg.role === 'agent' ? '1px solid var(--stripe-border)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.8 }}>
                  {msg.role === 'user' ? 'You' : 'AI Employee'}
                </span>
                <span style={{ fontSize: '10px', opacity: 0.6 }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={{ fontSize: '14px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
              
              {renderMedia(msg)}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ 
              backgroundColor: '#ffffff',
              padding: '1rem',
              borderRadius: '12px 12px 12px 0',
              boxShadow: 'var(--stripe-shadow-ambient)',
              border: '1px solid var(--stripe-border)',
              display: 'flex',
              gap: '4px'
            }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--stripe-muted)', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
              <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--stripe-muted)', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
              <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--stripe-muted)', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA */}
      <div style={{ padding: '1.5rem 0', borderTop: '1px solid var(--stripe-border)' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ 
              flex: 1, 
              padding: '1rem', 
              border: '1px solid var(--stripe-border)', 
              borderRadius: '8px', 
              fontSize: '14px',
              outline: 'none',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            style={{
              padding: '0 1.5rem',
              backgroundColor: !inputValue.trim() || isTyping ? '#cbd5e1' : '#0ea5e9',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: !inputValue.trim() || isTyping ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Send
          </button>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--stripe-muted)', margin: '0.5rem 0 0 0', textAlign: 'center' }}>
          Agent tasks and outputs are simulated in this interface until Composio backend routing is complete.
        </p>
      </div>

    </div>
  );
}
