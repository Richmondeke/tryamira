'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  Bot, 
  Zap, 
  ShieldCheck, 
  Globe2, 
  Cpu, 
  Layers,
  Sparkles
} from 'lucide-react';

export default function ProductPage() {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [activeTab, setActiveTab] = useState<'voice' | 'omnichannel' | 'workflows'>('voice');

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* ── TOP NAVIGATION ────────────────────────────────────────── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.85rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img src="/amira-logo.png" alt="Amira AI" style={{ height: '28px', objectFit: 'contain' }} onError={(e: any) => { e.target.src = '/amira-head.png'; }} />
          <span style={{ fontSize: '20px', fontWeight: 850, color: '#0f172a', letterSpacing: '-0.02em' }}>amira</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <Link href="/#capabilities" style={{ fontSize: '14px', fontWeight: 600, color: '#475569', textDecoration: 'none' }}>Capabilities</Link>
          <Link href="/#integrations" style={{ fontSize: '14px', fontWeight: 600, color: '#475569', textDecoration: 'none' }}>Integrations</Link>
          <Link href="/investors" style={{ fontSize: '14px', fontWeight: 600, color: '#475569', textDecoration: 'none' }}>Deal Room</Link>
          <Link href="/login" style={{ fontSize: '14px', fontWeight: 600, color: '#475569', textDecoration: 'none' }}>Log in</Link>
          <Link
            href="/signup"
            style={{
              fontSize: '13.5px',
              fontWeight: 700,
              backgroundColor: '#10b981',
              color: '#ffffff',
              padding: '0.55rem 1.25rem',
              borderRadius: '99px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* ── HERO BANNER ───────────────────────────────────────────── */}
      <section style={{
        background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
        color: '#ffffff',
        padding: '5rem 2rem 4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            padding: '4px 14px',
            borderRadius: '99px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'inline-block',
            marginBottom: '1.25rem'
          }}>
            Product Architecture & Live Demos
          </span>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 850, letterSpacing: '-0.03em', lineHeight: 1.15, margin: 0 }}>
            The Autonomous AI Customer Support Workforce
          </h1>

          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6, maxWidth: '750px', margin: '1.25rem auto 2.5rem auto' }}>
            Watch how Amira resolves customer calls, automates 10-second speed-to-lead dialing, and executes CRM workflows across 1,000+ business tools with sub-500ms voice latency.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/signup"
              style={{
                fontSize: '15px',
                fontWeight: 750,
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '0.85rem 2rem',
                borderRadius: '99px',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Start Free Trial <ArrowRight size={18} />
            </Link>

            <a
              href="mailto:team@heyamira.com?subject=Amira%20Live%20Executive%20Walkthrough"
              style={{
                fontSize: '15px',
                fontWeight: 750,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '0.85rem 1.75rem',
                borderRadius: '99px',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📅 Book Executive Demo
            </a>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE PRODUCT DEMO SHOWCASE ────────────────────────── */}
      <section style={{ maxWidth: '1140px', margin: '-2.5rem auto 4rem auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(13, 56, 96, 0.16)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          {/* Header Tab Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 2rem',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', marginLeft: '8px' }}>Amira Operator Studio 2.5</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'voice', label: '🎙️ Voice Telephony (Sub-500ms)' },
                { id: 'omnichannel', label: '💬 Multi-Channel Hub' },
                { id: 'workflows', label: '⚡ 1,000+ Tool Integrations' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeTab === tab.id ? '#1b5a92' : '#ffffff',
                    color: activeTab === tab.id ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                    boxShadow: activeTab === tab.id ? '0 2px 8px rgba(27, 90, 146, 0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Workspace Screen */}
          <div style={{ padding: '2.5rem', backgroundColor: '#ffffff' }}>
            {activeTab === 'voice' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Neural Voice AI</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 1rem 0' }}>Ultra-Human Phone Cadence with Zero Lag</h3>
                  <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
                    Engineered with Deepgram Nova-3 speech recognition, Cartesia / ElevenLabs neural acoustics, and instant turn-taking interruption logic. Callers speak naturally without awkward delays.
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      "10-Second Speed-to-Lead Auto-Dialer for inbound forms",
                      "STIR/SHAKEN A-Level Verified Caller ID (zero spam flags)",
                      "Instant live call transfers to human managers with full context summaries",
                      "Native global dialing across 100+ countries with local numbers"
                    ].map(feat => (
                      <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#334155' }}>
                        <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ backgroundColor: '#0f172a', borderRadius: '18px', padding: '1.75rem', color: '#ffffff', boxShadow: '0 12px 36px rgba(0,0,0,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src="/amira-head.png" alt="Amira Head" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: 750, display: 'block' }}>Live Inbound Voice Call</span>
                        <span style={{ fontSize: '11px', color: '#10b981' }}>● Active Connection (460ms latency)</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>01:42</span>
                  </div>

                  {/* Audio Wave Simulation */}
                  <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', margin: '1.25rem 0' }}>
                    {[12, 28, 44, 20, 36, 16, 48, 30, 14, 40, 24, 46, 18, 32, 10].map((h, i) => (
                      <div
                        key={i}
                        style={{
                          width: '4px',
                          height: `${h}px`,
                          backgroundColor: '#10b981',
                          borderRadius: '99px',
                          opacity: 0.85
                        }}
                      />
                    ))}
                  </div>

                  <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px', fontSize: '13px', lineHeight: 1.5, color: '#e2e8f0' }}>
                    <strong>Caller:</strong> "Can you schedule a demo for our VP of Operations tomorrow at 3 PM and notify our team on Slack?"<br />
                    <strong style={{ color: '#10b981' }}>Amira:</strong> "I've locked in tomorrow at 3:00 PM EST, sent a Google Calendar invite to your inbox, and logged the meeting summary directly into HubSpot and your #sales Slack channel!"
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'omnichannel' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Omnichannel Engine</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 1rem 0' }}>One Unified Memory Across Every Channel</h3>
                  <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
                    Whether a customer chats on your website, replies via SMS, sends an email, or calls on the phone, Amira remembers full customer history with zero context loss.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '1.25rem' }}>
                    {[
                      { icon: '📞', name: 'Phone Voice' },
                      { icon: '💬', name: 'Webchat Widget' },
                      { icon: '📱', name: 'WhatsApp & SMS' },
                      { icon: '✉️', name: 'Email Helpdesk' }
                    ].map(ch => (
                      <div key={ch.name} style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 700, color: '#1b5a92', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{ch.icon}</span> {ch.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <img src="/amira-laptop.png" alt="Amira Omnichannel Workspace" style={{ width: '100%', maxHeight: '340px', objectFit: 'contain' }} />
                </div>
              </div>
            )}

            {activeTab === 'workflows' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tool Execution</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 1rem 0' }}>1,000+ Composio MCP Integrations</h3>
                  <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
                    Amira doesn't just talk—she takes autonomous action. Connect HubSpot, Salesforce, Slack, Notion, Google Drive, Linear, and Jira with 1 click.
                  </p>

                  <div style={{ marginTop: '1.5rem' }}>
                    <Link
                      href="/dashboard/v3/integrations"
                      style={{
                        fontSize: '14px',
                        fontWeight: 750,
                        backgroundColor: '#1b5a92',
                        color: '#ffffff',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      Explore 1,000+ Integrations <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <img src="/amira-integrations-banner.png" alt="Integrations" style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', borderRadius: '12px' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA STRIP ────────────────────────────────────────── */}
      <section style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '4rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 850, margin: 0 }}>Ready to Deploy Your AI Workforce?</h2>
          <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.75)', margin: '1rem auto 2rem auto' }}>
            Start automating inbound customer calls, lead qualification, and CRM workflows in under 2 minutes.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/signup"
              style={{
                fontSize: '15px',
                fontWeight: 750,
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '0.85rem 2.25rem',
                borderRadius: '99px',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
