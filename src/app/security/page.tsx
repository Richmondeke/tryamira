'use client';

import Link from 'next/link';
import SiteNavbar from '@/components/layout/SiteNavbar';
import SiteFooter from '@/components/layout/SiteFooter';

export default function SecurityPage() {
  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", backgroundColor: '#ffffff', color: '#0d0f1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteNavbar />

      <section style={{ backgroundColor: '#1b5a92', color: '#ffffff', padding: '7.5rem 1.5rem 5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, padding: '4px 12px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Enterprise Security & Compliance
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, margin: '1rem 0 1rem 0', lineHeight: 1.1 }}>
            Bank-Grade Security for Every Conversation
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0 }}>
            Amira AI is built from the ground up with end-to-end encryption, SOC 2 Type II compliance, HIPAA BAA support, and STIR/SHAKEN certified telephony safeguards.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1.5rem', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {[
            { badge: "SOC 2 Type II", title: "Audited & Certified Infrastructure", desc: "Our data centers and software processes undergo rigorous annual SOC 2 Type II audits ensuring complete data confidentiality, integrity, and operational availability." },
            { badge: "HIPAA Compliant", title: "Healthcare & BAA Ready", desc: "Execute Business Associate Agreements (BAA) with Zero Data Retention (ZDR) mode, PII redacting, and HIPAA-ready voice recording processing." },
            { badge: "GDPR & CCPA", title: "Data Rights & Encryption", desc: "AES-256 encryption at rest, TLS 1.3 encryption in transit, and instantaneous customer data deletion mechanisms for complete regulatory compliance." },
            { badge: "STIR / SHAKEN", title: "Certified Telephony Routing", desc: "Full A-level STIR/SHAKEN certification ensuring outbound calls are authenticated and never flagged as spam by telecom carriers." },
            { badge: "ISO 27001", title: "Information Security Standard", desc: "Certified ISO 27001 security management systems enforcing strict access controls, multi-factor authentication, and intrusion detection." },
            { badge: "24/7 Monitoring", title: "Threat Intelligence & Audits", desc: "Automated penetration testing, continuous vulnerability scanning, and isolated tenant databases protecting your enterprise data." }
          ].map(item => (
            <div key={item.badge} style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '99px', backgroundColor: '#10b98115', color: '#047857', border: '1px solid #10b98130', textTransform: 'uppercase' }}>
                {item.badge}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 750, color: '#1b5a92', margin: '1rem 0 0.5rem 0' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: '#10b9810a', border: '1px solid #10b98130', borderRadius: '20px', padding: '2.5rem', textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#047857', margin: '0 0 0.5rem 0' }}>Need a Security Assessment or BAA?</h3>
          <p style={{ fontSize: '14.5px', color: '#475569', margin: '0 0 1.5rem 0' }}>
            Our security team is ready to provide SOC 2 reports, execute BAAs, and answer vendor security questionnaires.
          </p>
          <Link href="/contact" style={{ display: 'inline-block', padding: '0.75rem 1.6rem', borderRadius: '10px', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
            Request Security Packet →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
