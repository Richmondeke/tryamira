'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GlowIcon } from '@/components/ui/GlowIcon';
import { AmiraResultEmbed } from '@/components/ui/AmiraResultEmbed';

interface AgentTemplate {
  id: string;
  title: string;
  description: string;
  integrationsCount: number;
  integrations: string[];
  category: 'Sales & Leads' | 'Support & Reception' | 'Staffing & HR' | 'Real Estate & Finance';
  voiceEngine: string;
  phoneRegion: string;
  nodesCount: number;
}

const TEMPLATES: AgentTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'Outbound Customer Feedback & NPS Agent',
    description: 'Post-interaction feedback collector — gathers ratings, NPS, and open-ended feedback.',
    integrationsCount: 1,
    integrations: ['Gmail'],
    category: 'Sales & Leads',
    voiceEngine: 'Amira Voice Engine (Rachel) + Amira Engine',
    phoneRegion: '🇺🇸 +1 (415)',
    nodesCount: 5
  },
  {
    id: 'tmpl-2',
    title: 'General Staffing / Temp Agency Agent',
    description: 'Matches job seekers to open positions — collects skills, availability, and scheduling.',
    integrationsCount: 2,
    integrations: ['Google Calendar', 'Google Sheets'],
    category: 'Staffing & HR',
    voiceEngine: 'Amira Ultra-Fast Engine + Amira Engine',
    phoneRegion: '🇿🇦 +27 (11)',
    nodesCount: 6
  },
  {
    id: 'tmpl-3',
    title: 'Insurance Quote Intake Agent',
    description: 'Collects details for auto, home, life, or health insurance quotes.',
    integrationsCount: 2,
    integrations: ['HubSpot', 'Gmail'],
    category: 'Real Estate & Finance',
    voiceEngine: 'Amira Voice Engine (Adam) + Amira Engine',
    phoneRegion: '🇬🇧 +44 (20)',
    nodesCount: 6
  },
  {
    id: 'tmpl-4',
    title: 'Mortgage Pre-Qualification Agent',
    description: 'Collects financial info to pre-qualify mortgage and loan leads automatically.',
    integrationsCount: 2,
    integrations: ['Salesforce', 'Google Calendar'],
    category: 'Real Estate & Finance',
    voiceEngine: 'Amira Realtime Voice + Amira Engine',
    phoneRegion: '🇺🇸 +1 (212)',
    nodesCount: 7
  },
  {
    id: 'tmpl-5',
    title: 'Catering & Event Inquiry Agent',
    description: 'Collects event details, answers menu questions, and schedules tastings.',
    integrationsCount: 1,
    integrations: ['Google Calendar'],
    category: 'Sales & Leads',
    voiceEngine: 'Amira Voice Engine (Emily) + Amira Engine',
    phoneRegion: '🇿🇦 +27 (21)',
    nodesCount: 4
  },
  {
    id: 'tmpl-6',
    title: 'Pet Care / Veterinary Receptionist',
    description: 'Veterinary and pet service calls — appointments, pricing, emergency triage.',
    integrationsCount: 1,
    integrations: ['Google Calendar'],
    category: 'Support & Reception',
    voiceEngine: 'Amira Ultra-Fast Engine + Amira Engine',
    phoneRegion: '🇬🇧 +44 (161)',
    nodesCount: 5
  },
  {
    id: 'tmpl-7',
    title: 'Accounting / Tax Firm Receptionist',
    description: 'CPA firm calls — appointments, tax deadlines, document follow-ups.',
    integrationsCount: 2,
    integrations: ['Gmail', 'Google Sheets'],
    category: 'Support & Reception',
    voiceEngine: 'Amira Voice Engine (Roger) + Amira Engine',
    phoneRegion: '🇳🇬 +234 (1)',
    nodesCount: 6
  },
  {
    id: 'tmpl-8',
    title: 'IVR-Navigating Outbound Caller',
    description: 'Navigates complex IVR phone trees to reach decision makers and deliver pitch.',
    integrationsCount: 2,
    integrations: ['HubSpot', 'Outlook'],
    category: 'Sales & Leads',
    voiceEngine: 'Amira Realtime Voice + Amira Engine',
    phoneRegion: '🇺🇸 +1 (310)',
    nodesCount: 8
  }
];

export default function VoiceAgentsStudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate>(TEMPLATES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'workflow' | 'preview'>('workflow');
  const [testInputText, setTestInputText] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callLogs, setCallLogs] = useState<Array<{ role: 'user' | 'agent'; text: string; actionResult?: string }>>([
    {
      role: 'agent',
      text: 'Hey there! This is Jamie from Amira Support. What can I help you with today?'
    }
  ]);

  const filteredTemplates = TEMPLATES.filter(tmpl => {
    const matchesCategory = activeCategory === 'All' || tmpl.category === activeCategory;
    const matchesSearch = tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTestCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInputText.trim()) return;

    const userText = testInputText;
    setTestInputText('');

    const newLogs = [
      ...callLogs,
      { role: 'user' as const, text: userText }
    ];
    setCallLogs(newLogs);

    // Simulate Agent Voice & Tool Execution Response
    setTimeout(() => {
      let agentReply = `I understand you need assistance with "${userText}". I am scheduling a sync and updating your records right away.`;
      let actionResult = '';

      if (/demo|meeting|calendar|schedule/i.test(userText)) {
        agentReply = `I've booked a live demo meeting on Google Calendar for tomorrow at 10:00 AM and dispatched an email confirmation to your inbox!`;
        actionResult = `✅ Action Executed via Google Calendar & Gmail Integration:\nDirect Link: https://calendar.google.com/event?id=demo_invite_amira\nDirect Link: https://mail.google.com/mail/u/0/#inbox/msg_98124`;
      } else if (/quote|insurance|mortgage|lead/i.test(userText)) {
        agentReply = `I've collected your intake details and created a new deal stage record in HubSpot CRM.`;
        actionResult = `✅ Action Executed via HubSpot CRM Integration:\nDirect Link: https://app.hubspot.com/contacts/deals/record_98123`;
      }

      setCallLogs(prev => [
        ...prev,
        { role: 'agent', text: agentReply, actionResult }
      ]);
    }, 600);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      backgroundColor: 'var(--bg-main, #f8f9fc)',
      fontFamily: "'Satoshi', sans-serif",
      overflow: 'hidden'
    }}>
      {/* ── TOP STUDIO BAR ─────────────────────────────────────────────────── */}
      <div style={{
        padding: '0.85rem 1.5rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            backgroundColor: 'rgba(27,90,146,0.1)', color: '#1b5a92',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
          }}>
            🎙️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Voice Agents Studio
              </h1>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#1b5a9215', color: '#1b5a92' }}>
                Multi-Model Aggregator Active
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Build & test visual voice call flows powered by Amira Voice Engine + Amira Engine across 100+ countries.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/dashboard/integrations/apps"
            style={{
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle, rgba(0,0,0,0.15))',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            📞 Phone Numbers Market
          </Link>
          <button
            type="button"
            onClick={() => alert('New Blank Voice Agent Created! Assigning Amira Engine + Amira Voice Engine credentials...')}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '8px',
              backgroundColor: '#1b5a92',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(27,90,146,0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            + New Custom Blank Agent
          </button>
        </div>
      </div>

      {/* ── 3-PANEL STUDIO CANVAS ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* ── PANEL 1: TEMPLATES & PRE-BUILT AGENTS (LEFT) ──────────────────── */}
        <div style={{
          width: '320px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0
        }}>
          {/* Panel Header & Search */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle, rgba(0,0,0,0.06))' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.65rem 0' }}>
              Browse Voice Templates
            </h3>
            
            <div style={{ position: 'relative', marginBottom: '0.65rem' }}>
              <input
                type="text"
                placeholder="Search templates & agents..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem 0.5rem 2.1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-subtle, #f8f9fc)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                🔍
              </span>
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              {['All', 'Sales & Leads', 'Support & Reception', 'Staffing & HR', 'Real Estate & Finance'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '99px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: activeCategory === cat ? '1px solid #1b5a92' : '1px solid var(--border-subtle)',
                    backgroundColor: activeCategory === cat ? '#1b5a92' : 'var(--bg-subtle, #f8f9fc)',
                    color: activeCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Cards Scrollable List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filteredTemplates.map(tmpl => {
              const isSelected = selectedTemplate.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? 'rgba(27,90,146,0.06)' : 'var(--bg-card, #ffffff)',
                    border: isSelected ? '1px solid #1b5a92' : '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(27,90,146,0.12)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                      {tmpl.phoneRegion}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', color: '#1b5a92' }}>
                      {tmpl.integrationsCount} {tmpl.integrationsCount === 1 ? 'Integration' : 'Integrations'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem 0', lineHeight: 1.35 }}>
                    {tmpl.title}
                  </h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                    {tmpl.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {tmpl.integrations.map(integ => (
                      <span key={integ} style={{ fontSize: '10px', fontWeight: 600, padding: '1px 5px', borderRadius: '4px', backgroundColor: '#f1f3fa', color: 'var(--text-secondary)' }}>
                        {integ}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PANEL 2: VISUAL WORKFLOW CANVAS (CENTER) ───────────────────────── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fdfdfd',
          backgroundColor: 'var(--bg-subtle)',
          backgroundSize: '20px 20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Canvas Top Controls Bar */}
          <div style={{
            padding: '0.65rem 1.25rem',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-subtle, #f8f9fc)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setActiveTab('workflow')}
                style={{
                  padding: '0.35rem 0.85rem', borderRadius: '6px', fontSize: '12px', fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  backgroundColor: activeTab === 'workflow' ? '#ffffff' : 'transparent',
                  color: activeTab === 'workflow' ? '#1b5a92' : 'var(--text-secondary)',
                  boxShadow: activeTab === 'workflow' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                🛠️ Visual Workflow Graph
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                style={{
                  padding: '0.35rem 0.85rem', borderRadius: '6px', fontSize: '12px', fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  backgroundColor: activeTab === 'preview' ? '#ffffff' : 'transparent',
                  color: activeTab === 'preview' ? '#1b5a92' : 'var(--text-secondary)',
                  boxShadow: activeTab === 'preview' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                👁️ Flow Inspector
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Selected: <strong>{selectedTemplate.title}</strong>
              </span>
              <button
                type="button"
                onClick={() => alert(`Using template "${selectedTemplate.title}" to provision new voice agent!`)}
                style={{
                  padding: '0.45rem 0.95rem', borderRadius: '7px', backgroundColor: '#1b5a92', color: '#ffffff',
                  fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(27,90,146,0.2)'
                }}
              >
                Use Template
              </button>
            </div>
          </div>

          {/* Interactive Flow Diagram Graph Canvas */}
          {activeTab === 'preview' ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '2rem',
              overflowY: 'auto'
            }}>
              {/* CSS Animation Keyframes for Pulsing 3D Voice Orb */}
              <style>{`
                @keyframes voiceOrbPulse {
                  0% {
                    transform: scale(0.95) rotate(0deg);
                    box-shadow: 0 0 40px rgba(27,90,146,0.4), inset 0 0 30px rgba(59,130,246,0.5);
                  }
                  50% {
                    transform: scale(1.08) rotate(180deg);
                    box-shadow: 0 0 80px rgba(27,90,146,0.7), inset 0 0 50px rgba(16,185,129,0.6);
                  }
                  100% {
                    transform: scale(0.95) rotate(360deg);
                    box-shadow: 0 0 40px rgba(27,90,146,0.4), inset 0 0 30px rgba(59,130,246,0.5);
                  }
                }
                .voice-orb-active {
                  animation: voiceOrbPulse 4s ease-in-out infinite;
                }
              `}</style>

              {/* Status Header */}
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1rem',
                  borderRadius: '99px', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                  fontSize: '12px', fontWeight: 800, color: '#10b981', marginBottom: '0.75rem'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  LIVE VOICE CONVERSATION ({selectedTemplate.phoneRegion})
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                  {selectedTemplate.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                  Engine: {selectedTemplate.voiceEngine} • Microphone Active
                </p>
              </div>

              {/* Central Pulsing 3D Voice Orb */}
              <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem' }}>
                <div
                  className="voice-orb-active"
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: '#1b5a92',
                    filter: 'blur(2px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => setIsCalling(!isCalling)}
                >
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                  }}>
                    🎙️
                  </div>
                </div>
              </div>

              {/* Floating Bottom Voice Control Bar (Amira Voice Engine Style) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '99px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle, rgba(0,0,0,0.12))',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
              }}>
                <button
                  type="button"
                  onClick={() => alert('Audio Settings: Input Device -> Macbook Pro Microphone')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600
                  }}
                >
                  ⚙️ Settings
                </button>
                <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />
                <button
                  type="button"
                  onClick={() => alert('Microphone Muted/Unmuted')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)',
                    display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700
                  }}
                >
                  🎙️ Mute Microphone
                </button>
                <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />
                <button
                  type="button"
                  onClick={() => setActiveTab('workflow')}
                  style={{
                    padding: '0.35rem 0.85rem', borderRadius: '99px', backgroundColor: '#ef4444', color: '#ffffff',
                    fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer'
                  }}
                >
                  🛑 End Call
                </button>
              </div>

            </div>
          ) : (
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              {/* NODE 1: START CALL */}
              <div style={{
                width: '340px', backgroundColor: '#ffffff', border: '2px solid #1b5a92', borderRadius: '12px',
                padding: '1rem 1.25rem', boxShadow: '0 4px 16px rgba(27,90,146,0.12)', position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#1b5a92', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🚩 Start Call Trigger
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                    {selectedTemplate.phoneRegion}
                  </span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Inbound/Outbound Phone Trigger
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                  Engine: {selectedTemplate.voiceEngine}
                </p>
              </div>

              {/* CONNECTING LINE */}
              <div style={{ width: '2px', height: '24px', backgroundColor: '#1b5a92' }} />

              {/* NODE 2: GREETING */}
              <div style={{
                width: '380px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle, rgba(0,0,0,0.12))', borderRadius: '12px',
                padding: '1rem 1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                  👤 Greeting & Memory Recall
                </div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                  Identify Caller Intent & Context
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-subtle, #f8f9fc)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  "Open Memory: Hey, this is Jamie from support — what can I help you with today?"
                </div>
              </div>

              {/* CONNECTING LINE */}
              <div style={{ width: '2px', height: '24px', backgroundColor: 'var(--border-subtle, #cbd5e1)' }} />

              {/* NODE 3: INTENT DECISION BRANCH */}
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '99px', backgroundColor: '#1b5a9215', color: '#1b5a92', border: '1px solid rgba(27,90,146,0.3)' }}>
                    • Technical Inquiry
                  </div>
                  <div style={{ width: '240px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                    <h5 style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                      Schedule Demo
                    </h5>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
                      Executes <strong>GOOGLECALENDAR_CREATE_EVENT</strong>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '99px', backgroundColor: '#10b98115', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                    • Billing Inquiry
                  </div>
                  <div style={{ width: '240px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                    <h5 style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                      Verify CRM Deal
                    </h5>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
                      Executes <strong>HUBSPOT_GET_DEAL</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* CONNECTING LINE */}
              <div style={{ width: '2px', height: '24px', backgroundColor: 'var(--border-subtle, #cbd5e1)' }} />

              {/* NODE 4: RESOLUTION */}
              <div style={{ width: '380px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                  👤 Resolve & Dispatch Receipt
                </div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                  Confirm Fix & Send Gmail Receipt
                </h4>
              </div>

              {/* CONNECTING LINE */}
              <div style={{ width: '2px', height: '24px', backgroundColor: '#ef4444' }} />

              {/* NODE 5: END CALL */}
              <div style={{ backgroundColor: '#ef444415', border: '1px solid #ef444440', color: '#ef4444', borderRadius: '99px', padding: '0.4rem 1.25rem', fontSize: '12px', fontWeight: 800 }}>
                ⛔ Call Terminated & Logs Saved
              </div>
            </div>
          )}
        </div>

        {/* ── PANEL 3: LIVE TEST VOICE CALL & ASSISTANT CONSOLE (RIGHT) ─────── */}
        <div style={{
          width: '360px',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0
        }}>
          {/* Test Console Header */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle, rgba(0,0,0,0.06))', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.15rem 0' }}>
                Live Agent Simulator
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
                Test call responses & Amira tool execution.
              </p>
            </div>

            <button
              onClick={() => setIsCalling(!isCalling)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: isCalling ? '#ef4444' : '#10b981',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: isCalling ? '0 2px 8px rgba(239,68,68,0.3)' : '0 2px 8px rgba(16,185,129,0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {isCalling ? '🛑 End Call' : '📞 Start Test Call'}
            </button>
          </div>

          {/* Active Call Waveform Bar (When calling) */}
          {isCalling && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#10b98110', borderBottom: '1px solid #10b98130', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>🟢 LIVE CALL CONNECTED</span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{selectedTemplate.phoneRegion}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                00:14
              </div>
            </div>
          )}

          {/* Chat / Call Conversation Transcript Stream */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {callLogs.map((log, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: log.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                  lineHeight: 1.45,
                  backgroundColor: log.role === 'user' ? '#1b5a92' : 'var(--bg-subtle, #f8f9fc)',
                  color: log.role === 'user' ? '#ffffff' : 'var(--text-primary)',
                  border: log.role === 'user' ? 'none' : '1px solid var(--border-subtle, rgba(0,0,0,0.08))'
                }}>
                  {log.text}
                </div>

                {log.actionResult && (
                  <div style={{ marginTop: '0.5rem', width: '100%' }}>
                    <AmiraResultEmbed feedback={log.actionResult} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Test Call / Chat Input Bar */}
          <form onSubmit={handleTestCallSubmit} style={{ padding: '0.85rem', borderTop: '1px solid var(--border-subtle, rgba(0,0,0,0.06))', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Ask anything... (e.g. 'Book a demo for tomorrow')"
              value={testInputText}
              onChange={e => setTestInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '12.5px',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-subtle, #f8f9fc)',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.6rem 0.95rem',
                borderRadius: '8px',
                backgroundColor: '#1b5a92',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Send
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
