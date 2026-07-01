'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { usePathname, useRouter } from 'next/navigation';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { AmiraLogo } from '../ui/AmiraLogo';
import { hapticMedium } from '../../utils/haptics';
import { createClient } from '@/utils/supabase/client';

interface NavItem {
  name: string;
  href: string;
  badge?: string;
  count?: number;
}

const navItems: Record<string, NavItem[]> = {
  MAIN: [
    { name: 'Overview',   href: '/dashboard' },
    { name: 'Agent',      href: '/dashboard/ai-agent' },
    { name: 'Chat',       href: '/dashboard/chat' },
    { name: 'Leads',      href: '/dashboard/leads' },
    { name: 'Forms',      href: '/dashboard/forms' },
    { name: 'Analytics',  href: '/dashboard/analytics' },
  ],
  SETUP: [
    { name: 'Tutorials', href: '/dashboard/tutorials' },
    { name: 'Webchat & Widget', href: '/dashboard/webchat-setup' },
    { name: 'Integrations & Channels', href: '/dashboard/integrations' },
  ],
};

interface SidebarUser {
  fullName: string;
  initials: string;
  email: string;
  plan: string;
  role: string;
}


export function Sidebar({ closeMobileMenu }: { closeMobileMenu?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [isDemoMode, setIsDemoMode] = useState(false);

  // ── Use shared profile context instead of fetching independently ─────────
  // Profile was already fetched once at dashboard/layout.tsx level.
  // Zero additional Supabase calls here.
  const { profile } = useUserProfile();

  const billingTier = (profile?.plan?.toLowerCase() || 'starter') as 'starter' | 'pro' | 'team' | 'enterprise';
  const sidebarUser = profile ? {
    fullName: profile.full_name || profile.email.split('@')[0],
    initials: profile.initials,
    email: profile.email,
    plan: profile.plan,
    role: profile.role,
  } : null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDemoMode(localStorage.getItem('amira_demo_mode') === 'true');
    }
  }, []);

  const toggleDemoMode = () => {
    const next = !isDemoMode;
    setIsDemoMode(next);
    localStorage.setItem('amira_demo_mode', String(next));
    window.location.reload();
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };


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
      backgroundColor: '#174275', // Amira brand navy
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex', 
      flexDirection: 'column',
      fontFeatureSettings: '"ss01"'
    }}>
      {/* Logo Section */}
      <div style={{ 
        height: '120px', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Link href="/dashboard" onClick={() => closeMobileMenu?.()} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <AmiraLogo size={32} style={{ color: '#ffffff' }} />
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem' }}> {/* Increased top padding for spacing */}
        {Object.entries(navItems).map(([section, items]) => {
          const isCollapsed = collapsedSections[section];
          return (
            <div key={section} style={{ marginBottom: '2rem' }}> {/* Increased spacing between sections */}
              <div 
                onClick={() => { hapticMedium(); toggleSection(section); }}
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
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
                    let tourId = undefined;
                    if (item.name === 'Leads') tourId = 'tour-leads';
                    if (item.name === 'Chat') tourId = 'tour-chat';
                    if (item.name === 'Webchat & Widget') tourId = 'tour-setup';

                    return (
                      <Link 
                        key={item.name} 
                        href={item.href} 
                        id={tourId}
                        onClick={() => { hapticMedium(); closeMobileMenu?.(); }}
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

      {/* Premium Upgrade Widget */}
      {billingTier === 'starter' && (
        <div style={{
          padding: '1.25rem',
          margin: '0 1rem 1.5rem 1rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.12) 0%, rgba(56, 142, 60, 0.12) 100%)',
          border: '1px solid rgba(76, 175, 80, 0.25)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>⚡</span>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', letterSpacing: '0.3px' }}>Upgrade Workspace</div>
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
            Unlock unlimited AI conversations, local Safaricom/MTN SIP trunks, and outbound dialer campaigns.
          </p>
          <Link 
            href="/dashboard/account?tab=upgrade"
            style={{
              display: 'block',
              textAlign: 'center',
              backgroundColor: '#4caf50',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: 600,
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Upgrade Now
          </Link>
        </div>
      )}

      {(billingTier === 'pro' || billingTier === 'team') && (
        <div style={{
          padding: '1rem',
          margin: '0 1rem 1.5rem 1rem',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>👑</span>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
              {billingTier === 'pro' ? 'Pro Workspace' : 'Team Workspace'}
            </div>
          </div>
          <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
            Enjoy premium localized telephony and deep app integrations.
          </p>
          <Link 
            href="/dashboard/account?tab=upgrade"
            style={{
              fontSize: '10px',
              color: '#a5b4fc',
              textDecoration: 'underline',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Modify subscription limits
          </Link>
        </div>
      )}

      {billingTier === 'enterprise' && (
        <div style={{
          padding: '1rem',
          margin: '0 1rem 1.5rem 1rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '18px' }}>🏢</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>Enterprise Active</div>
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>99.9% Support SLA</div>
          </div>
        </div>
      )}

      {/* ── User Profile Block ── */}
      <Link
        href="/dashboard/account"
        onClick={() => closeMobileMenu?.()}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '1rem 1.25rem',
          margin: '0 0 0 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          textDecoration: 'none',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '13px', flexShrink: 0,
        }}>
          {sidebarUser?.initials || '…'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {sidebarUser?.fullName || '…'}
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {sidebarUser?.email || ''}
          </div>
        </div>
        {sidebarUser?.role === 'admin' && (
          <span style={{
            fontSize: '9px', fontWeight: 700, color: '#4caf50',
            backgroundColor: 'rgba(76,175,80,0.15)',
            border: '1px solid rgba(76,175,80,0.3)',
            padding: '2px 5px', borderRadius: '4px', flexShrink: 0,
          }}>
            ADMIN
          </span>
        )}
      </Link>

      {/* ── Admin Demo Mode Toggle ── */}
      {sidebarUser?.role === 'admin' && (
        <div style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>🎭</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: isDemoMode ? '#f59e0b' : '#94a3b8' }}>
                {isDemoMode ? 'Demo Mode ON' : 'Demo Mode'}
              </div>
              <div style={{ fontSize: '9px', color: '#64748b' }}>Admin only · investor preview</div>
            </div>
          </div>
          <button
            onClick={toggleDemoMode}
            style={{
              width: '36px', height: '20px', borderRadius: '10px', border: 'none',
              backgroundColor: isDemoMode ? '#f59e0b' : 'rgba(255,255,255,0.15)',
              cursor: 'pointer', position: 'relative', transition: 'background 0.2s ease',
              flexShrink: 0,
            }}
          >
            <span style={{
              position: 'absolute', top: '2px',
              left: isDemoMode ? '18px' : '2px',
              width: '16px', height: '16px', borderRadius: '8px',
              backgroundColor: '#ffffff',
              transition: 'left 0.2s ease',
              display: 'block',
            }} />
          </button>
        </div>
      )}

      {/* ── Logout ── */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          padding: '0.85rem 1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'none',
          cursor: 'pointer',
          textAlign: 'left' as const,
          transition: 'background 0.15s ease',
          color: '#94a3b8',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)';
          e.currentTarget.style.color = '#f87171';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#94a3b8';
        }}
      >
        {/* Door/exit SVG icon */}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span style={{ fontSize: '12px', fontWeight: 500 }}>Log Out</span>
      </button>

    </aside>

  );
}
