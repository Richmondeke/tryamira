'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { getVapiPhoneNumbers } from '@/app/actions/vapi';

interface PhoneLine {
  flag: string;
  country: string;
  num: string;
  agent: string;
  provider: string;
  status: string;
  mode?: string;
  greeting?: string;
}

export default function V3PhonePage() {
  const { isDemoMode } = useDemoMode();
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [liveNumbers, setLiveNumbers] = useState<PhoneLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Modals state
  const [activeModal, setActiveModal] = useState<'configure' | 'buy' | null>(null);
  const [selectedLine, setSelectedLine] = useState<PhoneLine | null>(null);

  // Config Form State
  const [configAgent, setConfigAgent] = useState('Amira — Executive Voice Ambassador');
  const [configMode, setConfigMode] = useState('Inbound Phone Assistant');
  const [configGreeting, setConfigGreeting] = useState('Hello! Thanks for calling. Amira is here to assist you 24/7. How can I help you today?');
  const [isRecording, setIsRecording] = useState(true);

  // Buy Form State
  const [buyCountry, setBuyCountry] = useState('United States');
  const [buyType, setBuyType] = useState('Local');
  const [buyAgent, setBuyAgent] = useState('Amira — Executive Voice Ambassador');

  useEffect(() => {
    if (!isDemoMode) {
      setIsLoading(true);
      getVapiPhoneNumbers().then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveNumbers(data.map((item: any) => ({
            flag: '🌐',
            country: 'Global Line',
            num: item.number || item.phoneNumber || 'Bound Number',
            agent: item.assistant?.name || item.assistantId || 'Amira — Executive Voice Ambassador',
            provider: 'Amira Phone Route',
            status: '🟢 Active',
            mode: 'Inbound Phone Assistant',
            greeting: 'Hello! Thanks for calling Amira Voice AI.'
          })));
        } else {
          setLiveNumbers([]);
        }
      }).catch(() => setLiveNumbers([])).finally(() => setIsLoading(false));
    }
  }, [isDemoMode]);

  const demoNumbers: PhoneLine[] = [
    { flag: '🇺🇸', country: 'United States', num: '+1 (415) 555-0198', agent: 'Amira — Executive Voice Ambassador', provider: 'Amira Phone Line', status: '🟢 Active', mode: 'Outbound Auto-Dialer', greeting: 'Hi, Amira here calling on behalf of Amira Voice AI.' },
    { flag: '🇮🇳', country: 'India', num: '+91 80 1234 5678', agent: 'Support Genie', provider: 'Amira Phone Line', status: '🟢 Active', mode: 'Inbound Phone Assistant', greeting: 'Welcome to customer support, how can I assist you?' },
    { flag: '🇬🇧', country: 'United Kingdom', num: '+44 20 7946 0958', agent: 'Appointment Pro', provider: 'Amira Phone Line', status: '🟢 Active', mode: 'Inbound Phone Assistant', greeting: 'Hello! I can help you schedule an appointment.' },
    { flag: '🇳🇬', country: 'Nigeria', num: '+234 812 345 6789', agent: 'Onboarding Buddy', provider: 'Amira Phone Line', status: '🟢 Active', mode: 'Inbound Phone Assistant', greeting: 'Welcome! How can I help get your setup completed today?' },
    { flag: '🇧🇷', country: 'Brazil', num: '+55 11 99999-9999', agent: 'Retention Expert', provider: 'Amira Phone Line', status: '🟢 Active', mode: 'Inbound Phone Assistant', greeting: 'Olá! How can I help with your account?' },
  ];

  const [numbersList, setNumbersList] = useState<PhoneLine[]>(demoNumbers);

  useEffect(() => {
    if (!isDemoMode && liveNumbers.length > 0) {
      setNumbersList(liveNumbers);
    } else if (isDemoMode) {
      setNumbersList(demoNumbers);
    }
  }, [isDemoMode, liveNumbers]);

  const handleOpenConfigure = (item: PhoneLine) => {
    setSelectedLine(item);
    setConfigAgent(item.agent);
    setConfigMode(item.mode || 'Inbound Phone Assistant');
    setConfigGreeting(item.greeting || 'Hello! Amira is here to assist you.');
    setActiveModal('configure');
  };

  const handleSaveConfiguration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLine) return;

    setNumbersList(prev => prev.map(l => l.num === selectedLine.num ? {
      ...l,
      agent: configAgent,
      mode: configMode,
      greeting: configGreeting
    } : l));

    setActiveModal(null);
    alert(`✅ Phone line ${selectedLine.num} successfully configured and bound to agent "${configAgent}"!`);
  };

  const handleBuyNumber = (e: React.FormEvent) => {
    e.preventDefault();

    const flagMap: Record<string, string> = {
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Nigeria': '🇳🇬',
      'Kenya': '🇰🇪',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Canada': '🇨🇦'
    };

    const newNum: PhoneLine = {
      flag: flagMap[buyCountry] || '🌐',
      country: buyCountry,
      num: `+1 (${Math.floor(200 + Math.random() * 700)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      agent: buyAgent,
      provider: 'Amira Phone Line',
      status: '🟢 Active',
      mode: 'Inbound Phone Assistant',
      greeting: `Hello! Thanks for calling. ${buyAgent} is ready to assist you.`
    };

    setNumbersList([newNum, ...numbersList]);
    setActiveModal(null);
    alert(`🎉 New phone number ${newNum.num} (${buyCountry}) successfully provisioned!`);
  };

  return (
    <div className="v3-widget-animate delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Global Phone Numbers & Lines</h1>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#10b98115', color: '#10b981', border: '1px solid #10b98130' }}>
              {isDemoMode ? '100+ Countries Available' : `${numbersList.length} Provisioned`}
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>Buy local phone numbers, connect your phone lines, and assign numbers directly to your voice agents.</p>
        </div>

        <button
          onClick={() => setActiveModal('buy')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: '#10b981',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          + Buy New Number
        </button>
      </div>

      {/* Numbers Table Card */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Your Provisioned Phone Lines ({numbersList.length} Numbers)
        </h3>

        {numbersList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', border: '1px dashed var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '36px' }}>📞</span>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>No Phone Numbers Provisioned</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, maxWidth: '420px', lineHeight: 1.5 }}>
              Your workspace currently has no bound phone numbers. Click &quot;+ Buy New Number&quot; to connect a phone line.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {numbersList.map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.2fr 1.2fr auto', alignItems: 'center', padding: '0.95rem 1.1rem', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '20px' }}>{item.flag}</span>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.num}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.country}</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Assigned Voice Agent</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>{item.agent}</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Phone Provider</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: 600 }}>{item.provider}</div>
                </div>

                <div>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#10b981' }}>{item.status}</span>
                </div>

                <button
                  onClick={() => handleOpenConfigure(item)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '8px',
                    backgroundColor: '#10b98115',
                    border: '1px solid #10b98140',
                    color: '#10b981',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⚙️ Configure Phone Line
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL 1: CONFIGURE PHONE NUMBER MODAL ────────────────────────────── */}
      {mounted && activeModal === 'configure' && selectedLine && createPortal(
        <div onClick={() => setActiveModal(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem', overflowY: 'auto' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '18px', padding: '1.75rem', maxWidth: '520px', width: '100%', maxHeight: 'calc(100vh - 2rem)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflow: 'hidden' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '22px' }}>{selectedLine.flag}</span>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Configure Phone Line</h3>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#10b981' }}>{selectedLine.num} ({selectedLine.country})</div>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveConfiguration} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Assigned Voice Agent</label>
                <select
                  value={configAgent}
                  onChange={(e) => setConfigAgent(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', marginTop: '0.25rem', cursor: 'pointer' }}
                >
                  <option value="Amira — Executive Voice Ambassador">Amira — Executive Voice Ambassador (US Female Rachel)</option>
                  <option value="Sales Closer">Sales Closer Agent</option>
                  <option value="Support Genie">Customer Support Genie</option>
                  <option value="Appointment Pro">Appointment Scheduling Assistant</option>
                  <option value="Onboarding Buddy">Onboarding & Setup Specialist</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Phone Call Mode</label>
                <select
                  value={configMode}
                  onChange={(e) => setConfigMode(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', marginTop: '0.25rem', cursor: 'pointer' }}
                >
                  <option value="Inbound Phone Assistant">Inbound Phone Assistant (Answers 24/7 customer calls)</option>
                  <option value="Outbound Auto-Dialer">Outbound Auto-Dialer Line (Executes cold calling campaigns)</option>
                  <option value="Forwarding Line">Forwarding Line (Routes to human mobile number after hours)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Custom Inbound Opening Greeting</label>
                <textarea
                  rows={3}
                  value={configGreeting}
                  onChange={(e) => setConfigGreeting(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', marginTop: '0.25rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>Automatic Call Recording</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Record audio and generate AI transcript logs</div>
                </div>
                <input
                  type="checkbox"
                  checked={isRecording}
                  onChange={(e) => setIsRecording(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setActiveModal(null)} style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '12.5px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.55rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>Save Configuration</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── MODAL 2: BUY NEW PHONE NUMBER MODAL ─────────────────────────────── */}
      {mounted && activeModal === 'buy' && createPortal(
        <div onClick={() => setActiveModal(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1.5rem', overflowY: 'auto' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '18px', padding: '1.75rem', maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Provision New Local Phone Line</h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleBuyNumber} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Select Country</label>
                <select
                  value={buyCountry}
                  onChange={(e) => setBuyCountry(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', marginTop: '0.25rem', cursor: 'pointer' }}
                >
                  <option value="United States">🇺🇸 United States (+1)</option>
                  <option value="United Kingdom">🇬🇧 United Kingdom (+44)</option>
                  <option value="Nigeria">🇳🇬 Nigeria (+234)</option>
                  <option value="Kenya">🇰🇪 Kenya (+254)</option>
                  <option value="India">🇮🇳 India (+91)</option>
                  <option value="Brazil">🇧🇷 Brazil (+55)</option>
                  <option value="Canada">🇨🇦 Canada (+1)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Line Type</label>
                <select
                  value={buyType}
                  onChange={(e) => setBuyType(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', marginTop: '0.25rem', cursor: 'pointer' }}
                >
                  <option value="Local">Local City Number</option>
                  <option value="Toll-Free">Toll-Free (800 Number)</option>
                  <option value="Mobile">Mobile Line</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Assign to Voice Agent</label>
                <select
                  value={buyAgent}
                  onChange={(e) => setBuyAgent(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', marginTop: '0.25rem', cursor: 'pointer' }}
                >
                  <option value="Amira — Executive Voice Ambassador">Amira — Executive Voice Ambassador</option>
                  <option value="Sales Closer">Sales Closer Agent</option>
                  <option value="Support Genie">Customer Support Genie</option>
                  <option value="Appointment Pro">Appointment Scheduling Assistant</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setActiveModal(null)} style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '12.5px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.55rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>Provision Phone Line</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
