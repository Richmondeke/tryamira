'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/app/page.module.css';

export default function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.navLogo}>
            <img src="/amira-logo-dark.svg" alt="Amira AI" style={{ height: '26px', width: 'auto' }} />
          </Link>

          <ul className={styles.navLinks}>
            {[
              { label: "Product", href: "/#product" },
              { label: "Capabilities", href: "/#capabilities" },
              { label: "Multi-Channel", href: "/#multichannel" },
              { label: "Integrations", href: "/dashboard/v3/integrations" },
              { label: "Use Cases", href: "/#usecases" },
              { label: "Benefits", href: "/#benefits" },
            ].map(l => (
              <li key={l.label}>
                <Link href={l.href} className={styles.navLink}>{l.label}</Link>
              </li>
            ))}
          </ul>

          <div className={styles.navActions}>
            <Link href="/login" className={styles.navLogin}>Log in</Link>
            <Link href="/dashboard/v3/outreach" className={styles.navCta} style={{ backgroundColor: '#10b981' }}>
              Get Started
            </Link>
          </div>

          <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>

        {mobileOpen && (
          <div style={{ backgroundColor: '#ffffff', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Link href="/#product" style={{ color: '#0d0f1a', fontWeight: 600, textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Product</Link>
            <Link href="/#capabilities" style={{ color: '#0d0f1a', fontWeight: 600, textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Capabilities</Link>
            <Link href="/#multichannel" style={{ color: '#0d0f1a', fontWeight: 600, textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Multi-Channel</Link>
            <Link href="/dashboard/v3/integrations" style={{ color: '#0d0f1a', fontWeight: 600, textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Integrations</Link>
            <Link href="/#usecases" style={{ color: '#0d0f1a', fontWeight: 600, textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Use Cases</Link>
            <Link href="/#benefits" style={{ color: '#0d0f1a', fontWeight: 600, textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Benefits</Link>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <Link href="/login" style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#0d0f1a', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
              <Link href="/dashboard/v3/outreach" style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#10b981', color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
