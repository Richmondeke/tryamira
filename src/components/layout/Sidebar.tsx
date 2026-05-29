"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface NavItem {
  name: string;
  href: string;
  badge?: string;
  count?: number;
}

const navItems: Record<string, NavItem[]> = {
  MAIN: [
    { name: 'Overview', href: '/' },
    { name: 'Chat', href: '/chat' },
    { name: 'WebChat', href: '/webchat' },
    { name: 'Email Assistance', href: '/email', badge: 'NEW' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Leads', href: '/leads' },
    { name: 'WA Broadcast', href: '/broadcast' },
    { name: 'WA Drip', href: '/drip', badge: 'IMPROVED' },
    { name: 'AI Agent', href: '/ai-agent' },
    { name: 'Forms', href: '/forms' },
  ],
  SETUP: [
    { name: 'Tutorials', href: '/tutorials' },
    { name: 'Message Templates', href: '/templates' },
    { name: 'Channels', href: '/channels' },
    { name: 'Chat Widget', href: '/widget' },
    { name: 'Integrations', href: '/integrations' },
  ],
  ACCOUNT: [
    { name: 'Notifications', href: '/notifications', count: 1 },
    { name: 'Settings', href: '/settings' },
    { name: 'Refer & Earn', href: '/refer' },
    { name: 'Partner Program', href: '/partner' },
    { name: 'Plan', href: '/plan' },
    { name: 'Upgrade', href: '/upgrade' },
  ]
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div style={{ background: 'var(--brand-primary)', color: 'white', padding: '4px', borderRadius: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        TryAmira
      </div>
      
      <div className={styles.brandSelector}>
        <div className={styles.brandAvatar}>AO</div>
        <div className={styles.brandInfo}>
          <span className={styles.brandName}>Ashley Okoye</span>
          <span className={styles.brandSub}>Default brand</span>
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        {Object.entries(navItems).map(([section, items]) => (
          <div key={section} className={styles.section}>
            <div className={styles.sectionTitle}>{section}</div>
            {items.map(item => (
              <Link key={item.name} href={item.href} className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}>
                <div style={{ width: '16px', height: '16px', border: '1px solid currentColor', borderRadius: '4px' }} />
                {item.name}
                {item.badge && <span style={{ marginLeft: 'auto', fontSize: '10px', background: 'var(--error)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{item.badge}</span>}
                {item.count && <span style={{ marginLeft: 'auto', fontSize: '10px', background: 'var(--brand-primary)', color: 'white', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>{item.count}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.userFooter}>
        <div className={styles.brandSelector} style={{ margin: 0, border: 'none', background: 'var(--bg-surface-hover)' }}>
          <div className={styles.brandAvatar} style={{ background: 'var(--brand-primary)' }}>AO</div>
          <div className={styles.brandInfo}>
            <span className={styles.brandName}>Ashley Okoye</span>
            <span className={styles.brandSub}>Free Plan</span>
          </div>
          <div style={{ marginLeft: 'auto' }}>→</div>
        </div>
      </div>
    </aside>
  );
}
