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
    { name: 'Analytics', href: '/dashboard/analytics' },
    { name: 'Leads', href: '/dashboard/leads' },
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
    <aside style={{ 
      width: '260px', 
      height: '100vh', 
      backgroundColor: '#ffffff',
      borderRight: '1px solid var(--stripe-border)',
      display: 'flex', 
      flexDirection: 'column',
      fontFeatureSettings: '"ss01"'
    }}>
      {/* Logo Section */}
      <div style={{ 
        height: '64px', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 1.5rem',
        borderBottom: '1px solid var(--stripe-border)'
      }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img 
            src="https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png" 
            alt="Amira Logo" 
            style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {Object.entries(navItems).map(([section, items]) => (
          <div key={section} style={{ marginBottom: '1rem' }}>
            <div style={{ padding: '0 0.75rem 0.5rem', fontSize: '12px', color: 'var(--stripe-muted)', fontWeight: 600 }}>{section}</div>
            {items.map(item => (
              <Link 
                key={item.name} 
                href={item.href} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  color: pathname === item.href ? 'var(--stripe-purple)' : 'var(--stripe-label)',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderRadius: '6px',
                  backgroundColor: pathname === item.href ? 'var(--stripe-bg)' : 'transparent'
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--stripe-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--stripe-purple)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AO</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600 }}>Ashley Okoye</div>
            <div style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>Free Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
