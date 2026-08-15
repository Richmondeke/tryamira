'use client';

import SiteNavbar from '@/components/layout/SiteNavbar';
import SiteFooter from '@/components/layout/SiteFooter';

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", backgroundColor: '#ffffff', color: '#0d0f1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteNavbar />

      <div style={{ maxWidth: '840px', margin: '6.5rem auto 4rem auto', padding: '0 1.5rem', flex: 1 }}>
        <span style={{ fontSize: '12px', fontWeight: 800, padding: '4px 12px', borderRadius: '99px', backgroundColor: '#10b98115', color: '#047857', textTransform: 'uppercase' }}>Legal Documentation</span>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1b5a92', margin: '0.75rem 0 0.5rem 0' }}>Privacy Policy</h1>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '2.5rem' }}>Last updated: August 15, 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '15px', color: '#334155', lineHeight: 1.7 }}>
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 750, color: '#0f172a', margin: '0 0 0.75rem 0' }}>1. Information We Collect</h2>
            <p>Amira Technologies Inc. ("Amira AI", "we", "us") collects information necessary to provision autonomous AI voice, chat, email, and workflow support agents. This includes account registration data (name, work email, payment credentials) and customer interaction payload logs (audio call transcripts, telephony Metadata, webchat session messages, and API webhook parameters).</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 750, color: '#0f172a', margin: '0 0 0.75rem 0' }}>2. Zero Data Retention (ZDR) & AI Model Safeguards</h2>
            <p>Customer voice recordings and call transcripts processed via Amira AI engines are encrypted using AES-256 standard encryption. Customers on Enterprise and HIPAA tiers can toggle <strong>Zero Data Retention (ZDR)</strong> mode, ensuring that conversational payload data is processed transiently in-memory and never persisted on disk or used to train third-party foundation models.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 750, color: '#0f172a', margin: '0 0 0.75rem 0' }}>3. How We Use Information</h2>
            <p>We process data solely to execute customer voice calls, route webchat sessions, connect automated tool actions (Linear, HubSpot, Slack), analyze support analytics metrics, enforce STIR/SHAKEN caller ID authentication, and prevent fraudulent telephony usage.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 750, color: '#0f172a', margin: '0 0 0.75rem 0' }}>4. GDPR & CCPA Data Rights</h2>
            <p>Under GDPR and CCPA regulations, users possess full rights to inspect, export, restrict processing of, or request permanent deletion of their personal data. Delete requests can be triggered directly inside your workspace settings or by emailing privacy@heyamira.com.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 750, color: '#0f172a', margin: '0 0 0.75rem 0' }}>5. Contact Our Data Protection Officer</h2>
            <p>For inquiries concerning data compliance, HIPAA BAA agreements, or vendor security audits, contact our Data Protection Officer at privacy@heyamira.com or write to Amira Technologies Inc., 500 Howard Street, Suite 400, San Francisco, CA 94105.</p>
          </section>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
