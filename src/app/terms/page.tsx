'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", backgroundColor: '#ffffff', color: '#0d0f1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#ffffff', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/">
            <img src="/amira-logo-footer.svg" alt="Amira AI" style={{ height: '28px', width: 'auto' }} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/" style={{ fontSize: '14px', fontWeight: 600, color: '#475569', textDecoration: 'none' }}>Home</Link>
            <Link href="/dashboard/v3" style={{ padding: '0.55rem 1.2rem', borderRadius: '8px', backgroundColor: '#10b981', color: '#ffffff', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none' }}>
              Launch Dashboard →
            </Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '840px', margin: '4rem auto', padding: '0 1.5rem', flex: 1 }}>
        <span style={{ fontSize: '12px', fontWeight: 800, padding: '4px 12px', borderRadius: '99px', backgroundColor: '#10b98115', color: '#047857', textTransform: 'uppercase' }}>Legal Documentation</span>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1b5a92', margin: '0.75rem 0 0.5rem 0' }}>Terms of Service</h1>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '2.5rem' }}>Last updated: August 15, 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '15px', color: '#334155', lineHeight: 1.7 }}>
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 750, color: '#0f172a', margin: '0 0 0.75rem 0' }}>1. Acceptance of Terms</h2>
            <p>By registering, accessing, or utilizing the Amira AI platform, API endpoints, webchat SDKs, or voice telephony gateways provided by Amira Technologies Inc., you agree to be bound by these Terms of Service.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 750, color: '#0f172a', margin: '0 0 0.75rem 0' }}>2. Voice Telephony & Recording Compliance</h2>
            <p>Customers deploying AI voice agents are strictly responsible for complying with local, state, and international call recording consent laws (including two-party consent mandates). Amira AI provides automated pre-call recording disclosure prompts to ensure compliance.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 750, color: '#0f172a', margin: '0 0 0.75rem 0' }}>3. Acceptable Use Policy</h2>
            <p>Amira AI platforms must not be utilized for unauthorized robocalling, caller ID spoofing, spamming, harassment, or fraudulent telecommunications activities. All outbound voice traffic must strictly comply with STIR/SHAKEN authentication protocols.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 750, color: '#0f172a', margin: '0 0 0.75rem 0' }}>4. SLA & Uptime Guarantees</h2>
            <p>Enterprise plans carry a 99.99% uptime Service Level Agreement (SLA) for voice telephony and API webhooks, backed by financial credits in the event of unscheduled service disruptions.</p>
          </section>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '2rem 1.5rem', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        © 2026 Amira Technologies Inc. All rights reserved. • <Link href="/privacy" style={{ color: '#1b5a92', textDecoration: 'none' }}>Privacy Policy</Link> • <Link href="/security" style={{ color: '#1b5a92', textDecoration: 'none' }}>Security</Link>
      </footer>
    </div>
  );
}
