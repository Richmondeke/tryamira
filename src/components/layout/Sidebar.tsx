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
    { name: 'Overview', href: '/dashboard' },
    { name: 'Chat', href: '/dashboard/chat' },
    { name: 'WebChat', href: '/dashboard/webchat' },
    { name: 'Email Assistance', href: '/dashboard/email', badge: 'NEW' },
    { name: 'Analytics', href: '/dashboard/analytics' },
    { name: 'Leads', href: '/dashboard/leads' },
    { name: 'WA Broadcast', href: '/dashboard/broadcast' },
    { name: 'WA Drip', href: '/dashboard/drip', badge: 'IMPROVED' },
    { name: 'AI Agent', href: '/dashboard/ai-agent' },
    { name: 'Forms', href: '/dashboard/forms' },
  ],
  SETUP: [
    { name: 'Tutorials', href: '/dashboard/tutorials' },
    { name: 'Message Templates', href: '/dashboard/templates' },
    { name: 'Channels', href: '/dashboard/channels' },
    { name: 'Chat Widget', href: '/dashboard/widget' },
    { name: 'Integrations', href: '/dashboard/integrations' },
  ],
  ACCOUNT: [
    { name: 'Notifications', href: '/dashboard/notifications', count: 1 },
    { name: 'Settings', href: '/dashboard/settings' },
    { name: 'Refer & Earn', href: '/dashboard/refer' },
    { name: 'Partner Program', href: '/dashboard/partner' },
    { name: 'Plan', href: '/dashboard/plan' },
    { name: 'Upgrade', href: '/dashboard/upgrade' },
  ]
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <img 
          src="https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png" 
          alt="Amira Logo" 
          style={{ height: '26px', width: 'auto', display: 'block' }} 
        />
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
