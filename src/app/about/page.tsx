'use client';

import SiteNavbar from '@/components/layout/SiteNavbar';
import SiteFooter from '@/components/layout/SiteFooter';

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", backgroundColor: '#ffffff', color: '#0d0f1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteNavbar />

      {/* Hero Section */}
      <section style={{ backgroundColor: '#1b5a92', color: '#ffffff', padding: '7.5rem 1.5rem 5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, padding: '4px 12px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Our Mission
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, margin: '1rem 0 1rem 0', lineHeight: 1.1 }}>
            Building the World's Most Human AI Workforce
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0 }}>
            Amira AI is empowering businesses globally to deliver 24/7, zero-wait customer support across phone calls, webchat, WhatsApp, email, and automated tool actions.
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1.5rem', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#f8fafc' }}>
            <div style={{ fontSize: '28px', marginBottom: '1rem' }}>🎙️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 750, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>Sub-300ms Voice Telephony</h3>
            <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Engineered with ultra-low latency audio processing, STIR/SHAKEN certified caller ID, and multi-tone neural voice synthesizers that sound indistinguishable from human agents.
            </p>
          </div>

          <div style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#f8fafc' }}>
            <div style={{ fontSize: '28px', marginBottom: '1rem' }}>🌐</div>
            <h3 style={{ fontSize: '20px', fontWeight: 750, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>100+ Multilingual Coverage</h3>
            <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Supporting over 100 languages and regional accents, allowing enterprises to seamlessly scale global customer coverage across Europe, Asia, Africa, and the Americas.
            </p>
          </div>

          <div style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#f8fafc' }}>
            <div style={{ fontSize: '28px', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '20px', fontWeight: 750, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>Autonomous Tool Execution</h3>
            <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Amira AI doesn't just answer questions — it takes action. Connect directly to HubSpot, Linear, Salesforce, Slack, and Google Calendar to log CRM entries and schedule appointments.
            </p>
          </div>
        </div>

        {/* Leadership & Story */}
        <div style={{ backgroundColor: '#1b5a920a', border: '1px solid #1b5a9220', borderRadius: '20px', padding: '3rem 2rem', textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1b5a92', margin: '0 0 1rem 0' }}>Built for Modern Support Operations</h2>
          <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.7, margin: '0 auto 1.5rem auto' }}>
            Founded by AI speech pioneers and cloud communications veterans, Amira Technologies Inc. is headquartered in San Francisco with research hubs globally. We believe customers shouldn't wait on hold or get passed around call centers.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>10M+</div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Conversations Handled</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>99.99%</div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Telephony Uptime</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>340ms</div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Avg Voice Latency</div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
