'use client';

import SiteNavbar from '@/components/layout/SiteNavbar';
import SiteFooter from '@/components/layout/SiteFooter';

export default function TermsPage() {
  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", backgroundColor: '#ffffff', color: '#0d0f1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteNavbar />

      <div style={{ maxWidth: '840px', margin: '6.5rem auto 4rem auto', padding: '0 1.5rem', flex: 1 }}>
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

      <SiteFooter />
    </div>
  );
}
