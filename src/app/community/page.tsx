'use client';

import Link from 'next/link';
import SiteNavbar from '@/components/layout/SiteNavbar';
import SiteFooter from '@/components/layout/SiteFooter';

export default function CommunityPage() {
  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", backgroundColor: '#ffffff', color: '#0d0f1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteNavbar />

      <section style={{ backgroundColor: '#1b5a92', color: '#ffffff', padding: '7.5rem 1.5rem 5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, padding: '4px 12px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#10b981', textTransform: 'uppercase' }}>
            Amira AI Community
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, margin: '1rem 0 1rem 0', lineHeight: 1.1 }}>
            Join 15,000+ AI Support Engineers & Builders
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0 }}>
            Connect with AI developers, share voice agent prompts, discover workflow automation templates, and build the future of autonomous customer experience together.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1.5rem', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#f8fafc', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '0.75rem' }}>💬</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>Discord Community</h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              Chat in real time with the core engineering team, share voice agent prompts, and get instant community debugging support.
            </p>
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.65rem 1.4rem', borderRadius: '10px', backgroundColor: '#5865F2', color: '#ffffff', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
              Join Discord Server →
            </a>
          </div>

          <div style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#f8fafc', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '0.75rem' }}>💻</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>GitHub Discussions</h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              Propose feature enhancements, inspect SDK code snippets, and collaborate on open-source webchat & telephony plugins.
            </p>
            <a href="https://github.com/Richmondeke/tryamira" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.65rem 1.4rem', borderRadius: '10px', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
              View GitHub Repo →
            </a>
          </div>

          <div style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#f8fafc', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '0.75rem' }}>🎓</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>Weekly Office Hours</h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              Join live technical office hours every Thursday at 10am PST with Amira architects for agent prompt teardowns and live QA.
            </p>
            <Link href="/dashboard/tutorials" style={{ display: 'inline-block', padding: '0.65rem 1.4rem', borderRadius: '10px', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
              Register for Office Hours →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
