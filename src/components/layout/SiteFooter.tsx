'use client';

import Link from 'next/link';
import styles from '@/app/page.module.css';

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogoRow}>
            <img src="/amira-logo-footer.svg" alt="Amira AI" style={{ height: '26px', width: 'auto' }} />
          </div>
          <p className={styles.footerDesc}>Amira AI — Your AI Customer Support Workforce. 24/7 support across calls, chats, emails, and tickets.</p>
        </div>
        {[
          { 
            heading: "Product", 
            items: [
              { label: "Capabilities", href: "/#capabilities" },
              { label: "Multi-Channel", href: "/#multichannel" },
              { label: "Integrations", href: "/dashboard/v3/integrations" },
              { label: "Use Cases", href: "/#usecases" },
              { label: "Benefits", href: "/#benefits" }
            ] 
          },
          { 
            heading: "Company", 
            items: [
              { label: "About Us", href: "/about" },
              { label: "Security & Compliance", href: "/security" },
              { label: "Contact Sales & Support", href: "/contact" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" }
            ] 
          },
          { 
            heading: "Support", 
            items: [
              { label: "Developer Docs", href: "/docs" },
              { label: "Builder Community", href: "/community" },
              { label: "System Status", href: "/status" }
            ] 
          },
        ].map(col => (
          <div key={col.heading} className={styles.footerCol}>
            <h4 className={styles.footerColHead}>{col.heading}</h4>
            <ul className={styles.footerColLinks}>
              {col.items.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className={styles.footerLink}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.footerBottom}>
        <span className={styles.footerCopy}>© 2026 Amira Technologies Inc. All rights reserved.</span>
        <div className={styles.footerSocials}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>LinkedIn</a>
          <a href="https://github.com/Richmondeke/tryamira" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>GitHub</a>
        </div>
      </div>
    </footer>
  );
}
