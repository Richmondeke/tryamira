'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InvestorDealRoomPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'deck' | 'memo' | 'traction' | 'financials' | 'inquire'>('deck');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    email: '',
    checkSize: '$50k - $100k',
    type: 'Institutional VC',
    notes: ''
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoToForm = () => {
    setActiveTab('inquire');
    setTimeout(() => {
      const el = document.getElementById('diligence-form-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        const input = document.getElementById('investor-name-input');
        if (input) (input as HTMLInputElement).focus();
      }
    }, 50);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#0d0f1a',
      fontFamily: "'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      overflowX: 'hidden'
    }}>
      {/* ── MAIN STICKY NAVBAR (MATCHING LANDING PAGE) ────────────────────── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <img
              src="/amira-head.png"
              alt="Amira Logo"
              style={{ height: '34px', width: 'auto', objectFit: 'contain' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#0d0f1a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Amira <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 800 }}>A.I.</span>
              </span>
              <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 650 }}>Investor Deal Room</span>
            </div>
          </Link>

          {/* Quick Sub-Navigation */}
          <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
            {[
              { id: 'deck', label: '📊 Pitch Deck', icon: '📊' },
              { id: 'memo', label: '💡 Market Thesis', icon: '💡' },
              { id: 'traction', label: '⚡ Benchmarks', icon: '⚡' },
              { id: 'financials', label: '💰 Unit Economics', icon: '💰' },
              { id: 'inquire', label: '🤝 Diligence Form', icon: '🤝' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  const el = document.getElementById('dealroom-content');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? '#1b5a92' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a
              href="/AMIRA-DECK-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#1b5a92',
                border: '1px solid rgba(27, 90, 146, 0.25)',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>👁️</span> Full Screen PDF
            </a>
            <button
              onClick={handleGoToForm}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              <span>📅</span> Request Diligence Info
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION (LANDING PAGE STYLE) ──────────────────────────────── */}
      <section style={{
        position: 'relative',
        padding: '4.5rem 1.5rem 3rem 1.5rem',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        borderBottom: '1px solid rgba(0,0,0,0.06)'
      }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '99px',
            backgroundColor: 'rgba(27, 90, 146, 0.08)',
            border: '1px solid rgba(27, 90, 146, 0.2)',
            color: '#1b5a92',
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1.5rem'
          }}>
            <span>✨</span> Amira AI • Institutional & Angel Investor Deal Room
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#0d0f1a',
            margin: '0 auto 1.25rem auto',
            maxWidth: '920px'
          }}>
            Automating Enterprise Customer Care with Autonomous Conversational AI
          </h1>

          <p style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#475569',
            maxWidth: '780px',
            margin: '0 auto 2.25rem auto'
          }}>
            Traditional call centers cost <strong style={{ color: '#0d0f1a' }}>$180,000/yr</strong> per 100 agents with frustrating 7.3-minute hold queues. Amira delivers <strong style={{ color: '#10b981' }}>80%+ operational cost reduction</strong> with sub-800ms natural voice telephony, 95%+ accuracy, and human-in-the-loop escalation.
          </p>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <a
              href="/AMIRA-DECK-2026.pdf"
              download="AMIRA-DECK-2026.pdf"
              style={{
                padding: '0.85rem 1.85rem',
                borderRadius: '12px',
                backgroundColor: '#1b5a92',
                color: '#ffffff',
                fontSize: '14.5px',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(27, 90, 146, 0.35)'
              }}
            >
              <span>📥</span> Download Pitch Deck (PDF)
            </a>

            <button
              onClick={() => {
                setActiveTab('deck');
                const el = document.getElementById('dealroom-content');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                padding: '0.85rem 1.85rem',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                color: '#0d0f1a',
                border: '1px solid rgba(0,0,0,0.15)',
                fontSize: '14.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <span>📊</span> View Interactive Deck Below
            </button>

            <button
              onClick={handleGoToForm}
              style={{
                padding: '0.85rem 1.85rem',
                borderRadius: '12px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                fontSize: '14.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
              }}
            >
              <span>📅</span> Request Due Diligence Info
            </button>
          </div>

          {/* Institutional Trust Logos Strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', opacity: 0.85 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Built for Enterprise Security & Scale:
            </span>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '13px', fontWeight: 750, color: '#334155' }}>
              <span>🔒 AES-256 Encrypted</span>
              <span>⚡ Sub-800ms Latency</span>
              <span>🛡️ SOC-2 Compliant Stack</span>
              <span>☁️ 10,000+ Concurrent Calls</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── TABBED DEAL ROOM CONTAINER ─────────────────────────────────────── */}
      <main id="dealroom-content" style={{ maxWidth: '1180px', margin: '2rem auto 0 auto', padding: '0 1.5rem 5rem 1.5rem' }}>
        
        {/* Dealroom Section Switcher Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '2rem',
          overflowX: 'auto'
        }}>
          {[
            { id: 'deck', label: '📊 Official Pitch Deck', desc: 'Full PDF presentation' },
            { id: 'memo', label: '💡 Market & Product Thesis', desc: 'Problem, solution, verticals' },
            { id: 'traction', label: '⚡ Performance & Benchmarks', desc: 'Latency, concurrency & architecture' },
            { id: 'financials', label: '💰 Unit Economics & Savings', desc: 'Enterprise cost breakdown' },
            { id: 'inquire', label: '🤝 Diligence Request & Contacts', desc: 'Direct partner channel' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: '0.85rem 1.25rem',
                border: 'none',
                borderBottom: activeTab === t.id ? '3px solid #1b5a92' : '3px solid transparent',
                marginBottom: '-2px',
                backgroundColor: 'transparent',
                color: activeTab === t.id ? '#1b5a92' : '#64748b',
                fontSize: '14px',
                fontWeight: activeTab === t.id ? 800 : 650,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div>{t.label}</div>
            </button>
          ))}
        </div>

        {/* ── TAB 1: PITCH DECK PRESENTATION ───────────────────────────────── */}
        {activeTab === 'deck' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              backgroundColor: '#f8fafc',
              padding: '1rem 1.5rem',
              borderRadius: '14px',
              border: '1px solid #e2e8f0'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0d0f1a', margin: 0 }}>
                  📄 AMIRA DECK 2026.pdf (Official Presentation)
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Presentation covering call center inefficiencies, unit economics, banking workflows, and technical benchmarks.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <a
                  href="/AMIRA-DECK-2026.pdf"
                  download="AMIRA-DECK-2026.pdf"
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: '8px',
                    backgroundColor: '#1b5a92',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>📥</span> Download PDF
                </a>
                <a
                  href="/AMIRA-DECK-2026.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    color: '#0d0f1a',
                    border: '1px solid #cbd5e1',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>↗</span> Open In Tab
                </a>
              </div>
            </div>

            {/* Embedded In-Browser High-Resolution PDF Presentation */}
            <div style={{
              width: '100%',
              height: '800px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #cbd5e1',
              backgroundColor: '#0f172a',
              boxShadow: '0 16px 40px rgba(0,0,0,0.08)'
            }}>
              <object
                data="/AMIRA-DECK-2026.pdf#toolbar=1&navpanes=0&scrollbar=1"
                type="application/pdf"
                width="100%"
                height="100%"
              >
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  <p>Your browser doesn&apos;t support direct inline PDF viewing.</p>
                  <a
                    href="/AMIRA-DECK-2026.pdf"
                    download="AMIRA-DECK-2026.pdf"
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      backgroundColor: '#1b5a92',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 700
                    }}
                  >
                    📥 Click here to download AMIRA DECK 2026.pdf
                  </a>
                </div>
              </object>
            </div>
          </div>
        )}

        {/* ── TAB 2: MARKET & PRODUCT THESIS ──────────────────────────────── */}
        {activeTab === 'memo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* The Problem & Opportunity Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              
              {/* Problem */}
              <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '16px', padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '20px' }}>🚨</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#e11d48', margin: 0 }}>
                    The Problem: Broken Legacy Call Centers
                  </h3>
                </div>
                <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                  Call centers are congested, outdated, and costly. Telcos and banks suffer an average customer wait time of <strong style={{ color: '#e11d48' }}>7.30 minutes</strong>.
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>
                  <li><strong>Long Wait Times:</strong> Customers abandon calls leading to elevated churn.</li>
                  <li><strong>Costly Human Resources:</strong> $180k/year for 100 reps with high burnout.</li>
                  <li><strong>Frustrating IVR:</strong> &quot;Press 1, Press 2...&quot; with zero context memory.</li>
                </ul>
              </div>

              {/* Solution */}
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '20px' }}>💡</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a', margin: 0 }}>
                    The Amira Solution: 80%+ Autonomous Efficiency
                  </h3>
                </div>
                <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                  Amira brings over <strong style={{ color: '#16a34a' }}>80% efficiency</strong> to customer care with autonomous voice agents that understand context, resolve routine inquiries instantly, and escalate when needed.
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>
                  <li><strong>0-Second Hold Queues:</strong> 24/7 availability with instant response.</li>
                  <li><strong>Seamless Escalation:</strong> Routes complex calls to human reps with full transcripts.</li>
                  <li><strong>AES-256 Encryption:</strong> Strict data security for regulated banking & healthcare.</li>
                </ul>
              </div>

            </div>

            {/* Vertical Execution */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0d0f1a', margin: '0 0 1.25rem 0' }}>
                🎯 Target Verticals & Execution Playbook
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
                {[
                  { icon: '🏦', title: 'Banking & Fintech', desc: 'Reactivating dormant accounts, balance verification, card activation, and account opening guidance.' },
                  { icon: '🏥', title: 'Healthcare & Emergency', desc: 'Automated 24/7 patient intake, consultation scheduling, and emergency response dispatch.' },
                  { icon: '🍽️', title: 'Hospitality & Restaurants', desc: 'Handling peak table bookings, dietary inquiries, and customer care without busy tones.' },
                  { icon: '📞', title: 'Outbound Sales & Speed-to-Lead', desc: 'Calling web lead form submissions within 10 seconds to qualify and schedule sales meetings.' }
                ].map((v, idx) => (
                  <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '24px', marginBottom: '0.4rem' }}>{v.icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0d0f1a' }}>{v.title}</div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px', lineHeight: 1.55 }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 3: TRACTION & GROWTH ─────────────────────────────────────── */}
        {activeTab === 'traction' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Top KPI Traction Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '2rem'
            }}>
              {[
                { label: 'Concurrent Voice Capacity', val: '10,000+', sub: 'Auto-scaling enterprise telephony', color: '#1b5a92', icon: '⚡' },
                { label: 'Voice Response Latency', val: '500-800ms', sub: 'Sub-second conversational streaming', color: '#10b981', icon: '🎙️' },
                { label: 'Operational Cost Reduction', val: '80%+', sub: 'Vs. $180k/yr 100-rep call centers', color: '#6366f1', icon: '💰' },
                { label: 'Knowledge Base Accuracy', val: '95%+', sub: 'Context-grounded enterprise RAG', color: '#f59e0b', icon: '🎯' }
              ].map((kpi, idx) => (
                <div key={idx} style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{kpi.label}</span>
                    <span style={{ fontSize: '16px' }}>{kpi.icon}</span>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: kpi.color, letterSpacing: '-0.02em' }}>{kpi.val}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Traction Pillars */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              
              {/* Product Defensibility */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0d0f1a', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🛡️</span> Technical Defensibility & Infrastructure Moat
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '13.5px', color: '#475569', lineHeight: 1.8 }}>
                  <li><strong>Sub-800ms Real-Time Turn Taking:</strong> Proprietary audio streaming pipeline built on WebRTC and WebSocket multiplexing.</li>
                  <li><strong>Multi-Lingual Global Telephony:</strong> Natural speech synthesis across 100+ languages and localized cultural dialects.</li>
                  <li><strong>1,000+ Native Integrations:</strong> Bi-directional sync with HubSpot, Salesforce, Notion, Supabase, and Google Drive.</li>
                  <li><strong>Zero-Hallucination Knowledge Engine:</strong> Context-grounded RAG indexed from PDF manuals, company knowledge bases, and FAQs.</li>
                </ul>
              </div>

              {/* Expansion Roadmap */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0d0f1a', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🗺️</span> 2026 Growth Roadmap & Scaling Vectors
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '13.5px', color: '#475569', lineHeight: 1.8 }}>
                  <li><strong>Instant Voice Cloning (Q3 2026):</strong> One-click executive voice replica models for high-touch customer outreach.</li>
                  <li><strong>Autonomous Omnichannel Supervisor (Q4 2026):</strong> Live human co-pilot mode enabling human agents to monitor 100 concurrent AI calls.</li>
                  <li><strong>Carrier SIP Trunking:</strong> Direct enterprise telco peering for ultra-high-volume banks and healthcare systems.</li>
                  <li><strong>Self-Service Web Embed Builder:</strong> No-code drag-and-drop widget customizer live across customer landing pages.</li>
                </ul>
              </div>

            </div>

          </div>
        )}

        {/* ── TAB 4: UNIT ECONOMICS ────────────────────────────────────────── */}
        {activeTab === 'financials' && (
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '2.5rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Financial Traction & Unit Economics
              </span>
              <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0d0f1a', margin: '0.5rem 0' }}>
                Cost Comparison: Traditional Call Center vs. Amira
              </h2>
              <p style={{ color: '#64748b', fontSize: '14.5px', margin: 0 }}>
                How Amira reduces enterprise operational expenditure by at least 30% to 80% while increasing CSAT.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              
              {/* Traditional Human Model */}
              <div style={{ backgroundColor: '#ffffff', border: '2px solid #fecdd3', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 12px rgba(225,29,72,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#e11d48', textTransform: 'uppercase' }}>Traditional Staffing</span>
                  <span style={{ fontSize: '18px' }}>❌</span>
                </div>
                <div style={{ fontSize: '40px', fontWeight: 900, color: '#0d0f1a', margin: '1rem 0' }}>
                  $180,000 <span style={{ fontSize: '16px', color: '#64748b', fontWeight: 600 }}>/ year</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '13.5px', color: '#475569', lineHeight: 1.8 }}>
                  <li><strong>100 Customer Care Agents</strong> at $150/employee/month</li>
                  <li><strong>7.30 mins</strong> average customer wait time</li>
                  <li>High agent attrition, sick leaves, and training overhead</li>
                  <li>Inability to handle sudden spike in concurrent calls</li>
                </ul>
              </div>

              {/* Amira Autonomous Model */}
              <div style={{ backgroundColor: '#ffffff', border: '2px solid #bbf7d0', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 24px rgba(16,185,129,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>Amira AI Hybrid Model</span>
                  <span style={{ fontSize: '18px' }}>✅</span>
                </div>
                <div style={{ fontSize: '40px', fontWeight: 900, color: '#16a34a', margin: '1rem 0' }}>
                  $0.12/min <span style={{ fontSize: '16px', color: '#64748b', fontWeight: 600 }}>+ 20 Agents</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '13.5px', color: '#475569', lineHeight: 1.8 }}>
                  <li><strong>Amira resolves 80% of routine calls autonomously</strong></li>
                  <li>Seamlessly routes remaining 20% to specialists</li>
                  <li><strong>0-Second wait time</strong> with 24/7 round-the-clock availability</li>
                  <li>Guaranteed operational cost reduction of <strong>at least 80%</strong></li>
                  <li>Scales instantly to <strong>10,000+ concurrent callers</strong></li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* ── TAB 5: INVESTOR INQUIRIES & DILIGENCE FORM ───────────────────── */}
        {activeTab === 'inquire' && (
          <div id="diligence-form-section" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
            
            {/* Left: Syndicate & Direct Contact Channels */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '2rem' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1b5a92', textTransform: 'uppercase' }}>
                Open to All Institutional & Angel Investors
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0d0f1a', margin: '0.4rem 0 1rem 0' }}>
                Investor Relations & Syndicate Leads
              </h3>
              <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                We welcome angel investors, institutional venture funds, and family offices looking to participate in our current funding round.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Single Official Investor Channel Card */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#1b5a92', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Official Investor Relations
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#0d0f1a', margin: '4px 0 6px 0' }}>
                    Amira Investor Office
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                    For term sheets, data room access, due diligence inquiries, and partner introduction meetings:
                  </p>
                  <a
                    href="mailto:investors@heyamira.com?subject=Amira%20Investment%20Inquiry"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#1b5a92',
                      fontWeight: 800,
                      textDecoration: 'none',
                      fontFamily: 'monospace',
                      fontSize: '15px'
                    }}
                  >
                    ✉️ investors@heyamira.com ↗
                  </a>
                </div>

              </div>
            </div>

            {/* Right: Diligence Request Form */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0d0f1a', margin: '0 0 0.5rem 0' }}>
                Request Diligence Access & Model
              </h4>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 1.25rem 0' }}>
                Enter your details to receive full access to our financial model, cap table, and technical diligence memo.
              </p>

              {requestSubmitted ? (
                <div style={{ padding: '1.5rem', borderRadius: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>🎉</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#16a34a' }}>Diligence Request Received!</div>
                  <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '4px' }}>
                    Our team will send access permissions to <strong>{formData.email}</strong> within 4 hours.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Your Name</label>
                    <input
                      id="investor-name-input"
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Fund / Syndicate Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sequoia Scout / Angel / Capital"
                      value={formData.firm}
                      onChange={e => setFormData({ ...formData, firm: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Investor Email</label>
                    <input
                      type="email"
                      required
                      placeholder="partner@fund.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Target Check Size</label>
                    <select
                      value={formData.checkSize}
                      onChange={e => setFormData({ ...formData, checkSize: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#ffffff' }}
                    >
                      <option value="$25k - $50k">$25,000 - $50,000 (Angel / Scout)</option>
                      <option value="$50k - $100k">$50,000 - $100,000 (Co-Investor)</option>
                      <option value="$100k - $250k">$100,000 - $250,000 (Strategic / Syndicate)</option>
                      <option value="$250k - $500k+">$250,000 - $500,000+ (Major Allocation / Lead)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      backgroundColor: '#1b5a92',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(27, 90, 146, 0.25)'
                    }}
                  >
                    Request Due Diligence Access
                  </button>
                </form>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ── FOOTER (MATCHING LANDING PAGE) ─────────────────────────────────── */}
      <footer style={{
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        padding: '3rem 1.5rem 2rem 1.5rem',
        fontSize: '13px',
        color: '#64748b'
      }}>
        <div style={{
          maxWidth: '1180px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/amira-head.png" alt="Amira" style={{ height: '24px', width: 'auto' }} />
            <span style={{ fontWeight: 700, color: '#0d0f1a' }}>Amira Technologies Inc.</span>
            <span>• © 2026 All Rights Reserved • Confidential Investor Memo</span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 650 }}>
            <Link href="/" style={{ color: '#475569', textDecoration: 'none' }}>Home</Link>
            <a href="/AMIRA-DECK-2026.pdf" download style={{ color: '#475569', textDecoration: 'none' }}>Download Deck</a>
            <a href="mailto:investors@heyamira.com" style={{ color: '#1b5a92', textDecoration: 'none' }}>investors@heyamira.com</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
