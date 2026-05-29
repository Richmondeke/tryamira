'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    { name: 'Webchat & Widget', href: '/dashboard/webchat-setup' },
    { name: 'Integrations & Channels', href: '/dashboard/integrations' },
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
  // Keep track of which sections are collapsed. By default, none are.
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside style={{ 
      width: '260px', 
      height: '100vh', 
      backgroundColor: '#0a1128', // Dark blackish blue
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex', 
      flexDirection: 'column',
      fontFeatureSettings: '"ss01"'
    }}>
      {/* Logo Section */}
      <div style={{ 
        height: '96px', // Increased height to fit larger logo
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img 
            src="https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png" 
            alt="Amira Logo" 
            style={{ width: '64px', height: '64px', objectFit: 'contain' }} // Logo is 2x larger
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem' }}> {/* Increased top padding for spacing */}
        {Object.entries(navItems).map(([section, items]) => {
          const isCollapsed = collapsedSections[section];
          return (
            <div key={section} style={{ marginBottom: '2rem' }}> {/* Increased spacing between sections */}
              <div 
                onClick={() => toggleSection(section)}
                style={{ 
                  padding: '0 0.75rem 0.5rem', 
                  fontSize: '12px', 
                  color: '#94a3b8', 
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{section}</span>
                <span style={{ fontSize: '10px' }}>{isCollapsed ? '▼' : '▲'}</span>
              </div>
              
              {!isCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {items.map(item => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link 
                        key={item.name} 
                        href={item.href} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.5rem 0.75rem',
                          color: isActive ? '#ffffff' : '#cbd5e1',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: 500,
                          borderRadius: '6px',
                          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '6px', 
            background: 'var(--stripe-purple)', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 'bold' 
          }}>
            AO
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>Ashley Okoye</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Free Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
