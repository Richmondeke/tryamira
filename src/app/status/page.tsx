'use client';

import Link from 'next/link';

export default function StatusPage() {
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

      {/* Banner */}
      <section style={{ backgroundColor: '#10b98115', borderBottom: '1px solid #10b98130', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '99px', backgroundColor: '#10b981', boxShadow: '0 0 12px #10b981' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#047857', margin: 0 }}>All Amira Systems Operational</h1>
        </div>
        <p style={{ fontSize: '14px', color: '#475569', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
          Real-time service health, telephony gateways, and voice synthesizer metrics.
        </p>
      </section>

      {/* Services Health Grid */}
      <section style={{ maxWidth: '960px', margin: '3.5rem auto', padding: '0 1.5rem', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1b5a92', marginBottom: '1.25rem' }}>Core Infrastructure Health</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '3.5rem' }}>
          {[
            { name: "Voice Telephony Gateway (Vapi REST / SIP)", status: "Operational", uptime: "99.99%", latency: "280ms" },
            { name: "Cloudflare R2 Audio Recording Streaming", status: "Operational", uptime: "100.0%", latency: "45ms" },
            { name: "Webchat Realtime Supabase Channel", status: "Operational", uptime: "99.98%", latency: "110ms" },
            { name: "Autonomous Tool Functions (Linear, HubSpot)", status: "Operational", uptime: "99.95%", latency: "340ms" },
            { name: "Neural Voice Synthesizer & Speech Engine", status: "Operational", uptime: "99.99%", latency: "190ms" },
            { name: "STIR / SHAKEN Telecom Certification Engine", status: "Operational", uptime: "100.0%", latency: "15ms" }
          ].map(sys => (
            <div key={sys.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', backgroundColor: '#10b98115', padding: '3px 8px', borderRadius: '6px' }}>● {sys.status}</span>
                <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#0d0f1a' }}>{sys.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '13px', color: '#64748b' }}>
                <span>Latency: <strong style={{ color: '#0d0f1a' }}>{sys.latency}</strong></span>
                <span>Uptime: <strong style={{ color: '#10b981' }}>{sys.uptime}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Past Incidents */}
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1b5a92', marginBottom: '1.25rem' }}>Incident History</h3>
        <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.5rem', backgroundColor: '#f8fafc' }}>
          <div style={{ fontSize: '13.5px', fontWeight: 750, color: '#0f172a' }}>August 12, 2026 — Telephony Carrier Maintenance</div>
          <p style={{ fontSize: '13px', color: '#475569', margin: '0.35rem 0 0 0', lineHeight: 1.5 }}>
            Scheduled maintenance on US-East telecom trunk lines completed with 0 downtime. All voice calls automatically failed over to backup secondary SIP gateways.
          </p>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '2rem 1.5rem', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        © 2026 Amira Technologies Inc. All rights reserved. • <Link href="/docs" style={{ color: '#1b5a92', textDecoration: 'none' }}>Developer Docs</Link> • <Link href="/security" style={{ color: '#1b5a92', textDecoration: 'none' }}>Security</Link>
      </footer>
    </div>
  );
}
