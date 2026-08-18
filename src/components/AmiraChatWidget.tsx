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
      text: "Hi there! 👋 I'm Amira, your autonomous AI Operator for Work. How can I help you automate customer care, voice calls, or team workflows today?",
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
      
      {/* ── EXPANDED CHAT WINDOW (HERO AMIRABACKGROUND CONTAINER) ───────── */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: '390px',
          maxWidth: 'calc(100vw - 32px)',
          height: '580px',
          maxHeight: 'calc(100vh - 120px)',
          background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(27, 90, 146, 0.45), 0 8px 24px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'amiraSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          
          {/* Header */}
          <div style={{
            padding: '1.1rem 1.25rem',
            backgroundColor: 'rgba(13, 56, 96, 0.65)',
            backdropFilter: 'blur(12px)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src="/amira-head.png"
                  alt="Amira Head"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    objectFit: 'contain',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '1px',
                  right: '1px',
                  width: '11px',
                  height: '11px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  border: '2px solid #0d3860'
                }} />
              </div>

              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  Amira <span style={{ color: '#10b981', fontSize: '12.5px' }}>AI</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s ease'
                }}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Body with Frosted Gradient Container */}
          <div style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)'
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
                    padding: '11px 15px',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    backgroundColor: isUser ? '#10b981' : '#ffffff',
                    color: isUser ? '#ffffff' : '#0f172a',
                    fontSize: '13.5px',
                    lineHeight: 1.5,
                    boxShadow: isUser ? '0 4px 12px rgba(16, 185, 129, 0.35)' : '0 4px 16px rgba(0, 0, 0, 0.15)',
                    border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.8)',
                    wordBreak: 'break-word'
                  }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.75)', marginTop: '3px', padding: '0 4px' }}>
                    {m.time}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start', padding: '10px 14px', backgroundColor: '#ffffff', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '6px', height: '6px', backgroundColor: '#1b5a92', borderRadius: '50%', animation: 'amiraPulse 1s infinite' }} />
                <div style={{ width: '6px', height: '6px', backgroundColor: '#1b5a92', borderRadius: '50%', animation: 'amiraPulse 1s infinite 0.2s' }} />
                <div style={{ width: '6px', height: '6px', backgroundColor: '#1b5a92', borderRadius: '50%', animation: 'amiraPulse 1s infinite 0.4s' }} />
              </div>
            )}

            {/* Suggested Questions Pills */}
            {!hasInteracted && (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Suggested Questions:</span>
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
                      padding: '9px 13px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      fontSize: '12.5px',
                      color: '#1b5a92',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
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
              backgroundColor: 'rgba(13, 56, 96, 0.75)',
              backdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
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
                padding: '11px 16px',
                borderRadius: '99px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                fontSize: '13.5px',
                outline: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#0f172a'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !inputText.trim() ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
              }}
              aria-label="Send message"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </form>

        </div>
      )}

      {/* ── FLOATING TRIGGER BUBBLE (AMIRA HEAD AVATAR & HERO BACKGROUND) ─ */}
      <button
        id="amira-global-chat-bubble"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
          border: '2.5px solid rgba(255, 255, 255, 0.85)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 28px rgba(27, 90, 146, 0.5), 0 4px 12px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
          outline: 'none',
          padding: '2px'
        }}
        aria-label={isOpen ? "Close Amira AI chat" : "Open Amira AI chat"}
      >
        {isOpen ? (
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: 'rgba(13, 56, 96, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: 800
          }}>
            ✕
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/amira-head.png"
              alt="Amira Head"
              style={{
                width: '46px',
                height: '46px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))'
              }}
            />
            {/* Green Online Badge */}
            <span style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              width: '14px',
              height: '14px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              border: '2.5px solid #1b5a92',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
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
          box-shadow: 0 14px 36px rgba(27, 90, 146, 0.65);
        }
      `}</style>

    </div>
  );
}
