'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  time: string;
}

export default function AmiraChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hi there! 👋 I'm Amira, your autonomous AI Operator for Work. How can I help you automate your workflows or customer care today?",
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setHasInteracted(true);

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: 'Amira',
          message: text,
          history: messages.map(m => ({ role: m.role, text: m.text })).slice(-8)
        })
      });

      const data = await res.json();
      const botReply = data.reply || "I'm here to help! Feel free to ask about our voice telephony, pricing, or custom integrations.";

      setMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: "I'm having a brief connection issue. Feel free to explore our platform or contact us at investors@heyamira.com!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999999, fontFamily: "'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      
      {/* ── EXPANDED CHAT WINDOW ────────────────────────────────────────── */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 32px)',
          height: '560px',
          maxHeight: 'calc(100vh - 120px)',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(27, 90, 146, 0.12)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'amiraSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            backgroundColor: '#1b5a92',
            background: 'linear-gradient(135deg, #1b5a92 0%, #0d3860 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src="/amira-head.png"
                  alt="Amira AI"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '2px solid rgba(255, 255, 255, 0.6)',
                    objectFit: 'contain'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  border: '2px solid #1b5a92'
                }} />
              </div>

              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  Amira <span style={{ color: '#10b981', fontSize: '12px' }}>AI</span>
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>⚡</span> Autonomous Work Operator
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link
                href="/investors"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  textDecoration: 'none'
                }}
              >
                📊 Deal Room
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.8)',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#f8fafc'
          }}>
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    alignSelf: isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    backgroundColor: isUser ? '#1b5a92' : '#ffffff',
                    color: isUser ? '#ffffff' : '#0d0f1a',
                    fontSize: '13.5px',
                    lineHeight: 1.5,
                    boxShadow: isUser ? '0 2px 8px rgba(27, 90, 146, 0.25)' : '0 2px 6px rgba(0, 0, 0, 0.05)',
                    border: isUser ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
                    wordBreak: 'break-word'
                  }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px', padding: '0 4px' }}>
                    {m.time}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start', padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ width: '6px', height: '6px', backgroundColor: '#1b5a92', borderRadius: '50%', animation: 'amiraPulse 1s infinite' }} />
                <div style={{ width: '6px', height: '6px', backgroundColor: '#1b5a92', borderRadius: '50%', animation: 'amiraPulse 1s infinite 0.2s' }} />
                <div style={{ width: '6px', height: '6px', backgroundColor: '#1b5a92', borderRadius: '50%', animation: 'amiraPulse 1s infinite 0.4s' }} />
              </div>
            )}

            {/* Quick Prompt Pills (Shown until heavy interaction) */}
            {!hasInteracted && (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Suggested Questions:</span>
                {[
                  "What workflows can Amira automate?",
                  "How does the Voice AI speed-to-lead work?",
                  "What are your pricing plans?",
                  "Where can I view the 2026 Pitch Deck?"
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      color: '#1b5a92',
                      fontWeight: 650,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '12px 14px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <input
              type="text"
              placeholder="Ask Amira anything..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '99px',
                border: '1px solid #cbd5e1',
                fontSize: '13.5px',
                outline: 'none',
                backgroundColor: '#f8fafc',
                color: '#0d0f1a'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#1b5a92',
                color: '#ffffff',
                border: 'none',
                cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !inputText.trim() ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(27, 90, 146, 0.3)'
              }}
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </form>

        </div>
      )}

      {/* ── FLOATING TRIGGER BUBBLE ─────────────────────────────────────── */}
      <button
        id="amira-global-chat-bubble"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#1b5a92',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(27, 90, 146, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
          outline: 'none'
        }}
        aria-label={isOpen ? "Close Amira AI chat" : "Open Amira AI chat"}
      >
        {isOpen ? (
          <span style={{ color: '#ffffff', fontSize: '24px', fontWeight: 800 }}>✕</span>
        ) : (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/amira-head.png"
              alt="Amira"
              style={{ width: '38px', height: '38px', objectFit: 'contain' }}
            />
            {/* Green Online Badge */}
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '12px',
              height: '12px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              border: '2px solid #1b5a92'
            }} />
          </div>
        )}
      </button>

      <style jsx global>{`
        @keyframes amiraSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes amiraPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        #amira-global-chat-bubble:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 32px rgba(27, 90, 146, 0.5);
        }
      `}</style>

    </div>
  );
}
