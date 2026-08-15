'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { createClient } from '@/utils/supabase/client';
import { GlowIcon } from '@/components/ui/GlowIcon';

const V2_NAV_ITEMS = [
  { name: 'Home',           href: '/dashboard',             iconName: 'home-outline' },
  { name: 'Today',          href: '/dashboard/today',       iconName: 'calendar-outline' },
  { name: 'Voice Agents',   href: '/dashboard/agents',      iconName: 'headphones-outline' },
  { name: 'Your Decisions', href: '/dashboard/decisions',   iconName: 'zap-outline', badge: '3' },
  { name: 'Workflows',      href: '/dashboard/workflows',   iconName: 'layers-outline' },
  { name: 'Projects',       href: '/dashboard/projects',    iconName: 'folder-outline' },
  { name: 'Knowledge',      href: '/dashboard/knowledge',   iconName: 'search-outline' },
  { name: 'Integrations',   href: '/dashboard/integrations',iconName: 'link-outline' },
  { name: 'Settings',       href: '/dashboard/settings',    iconName: 'gear-outline' },
];

const V3_NAV_CATEGORIES = [
  {
    name: 'Home',
    items: [
      { name: 'Overview', href: '/dashboard/v3', iconName: 'grid-outline' },
      { name: 'Analytics', href: '/dashboard/v3/analytics', iconName: 'chart-up-outline' },
    ]
  },
  {
    name: 'Setup Agent',
    items: [
      { name: 'Voice Agents', href: '/dashboard/v3/agents', iconName: 'headphones-outline' },
      { name: 'Knowledge Base (RAG)', href: '/dashboard/knowledge', iconName: 'book-open-outline' },
      { name: 'Lead Forms', href: '/dashboard/forms', iconName: 'doc-outline' },
      { name: 'Webchat Widget', href: '/dashboard/webchat-setup', iconName: 'code-outline' },
    ]
  },
  {
    name: 'Call Operations',
    items: [
      { name: 'Amira Outreach', href: '/dashboard/v3/outreach', iconName: 'phone-outgoing-outline', badge: '🔒 Admin' },
      { name: 'Phone Numbers', href: '/dashboard/v3/phone', iconName: 'phone-outline' },
      { name: 'Calls & Transcripts', href: '/dashboard/v3/calls', iconName: 'phone-incoming-outline' },
      { name: 'Campaign Auto-Dialer', href: '/dashboard/leads', iconName: 'users-outline' },
      { name: 'Decision Escalations', href: '/dashboard/decisions', iconName: 'zap-outline', badge: '3' },
    ]
  },
  {
    name: 'Channels & Messages',
    items: [
      { name: 'Omnichannel Chat', href: '/dashboard/chat/inbox', iconName: 'message-square-outline' },
      { name: 'Workspace Actions', href: '/dashboard/v3/actions', iconName: 'checkmark-circle-outline' },
    ]
  },
  {
    name: 'Integrations & Config',
    items: [
      { name: 'Workflows', href: '/dashboard/v3/workflows', iconName: 'layers-outline' },
      { name: 'Integrations', href: '/dashboard/v3/integrations', iconName: 'link-alt-outline' },
      { name: 'Billing', href: '/dashboard/v3/billing', iconName: 'credit-card-outline' },
      { name: 'Settings', href: '/dashboard/v3/settings', iconName: 'gear-outline' },
    ]
  }
];

export function Sidebar({ closeMobileMenu }: { closeMobileMenu?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useUserProfile();
  const [theme, setTheme] = useState('light');
  const [focusUntil, setFocusUntil] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (catName: string) => {
    setCollapsedCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  // Default to V3 OS sidebar experience across all dashboard routes unless explicitly on /dashboard/v2
  const isV3 = !pathname.startsWith('/dashboard/v2');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const focusVal = localStorage.getItem('amira_focus_mode');
    if (focusVal) setFocusUntil(focusVal);

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(currentTheme);

    const observer = new MutationObserver(() => {
      const updatedTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(updatedTheme);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const toggleFocusMode = () => {
    if (focusUntil) {
      setFocusUntil(null);
      localStorage.removeItem('amira_focus_mode');
    } else {
      const until = '2:00 PM';
      setFocusUntil(until);
      localStorage.setItem('amira_focus_mode', until);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {}
    if (typeof window !== 'undefined') {
      document.cookie = 'amira_demo_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    router.push('/login');
  };

  const sidebarUser = profile ? {
    fullName: profile.full_name || profile.email.split('@')[0],
    initials: profile.initials,
    email: profile.email,
    plan: profile.plan,
  } : null;

    // V3.0 SIDEBAR
  if (isV3) {
    const isDark = theme === 'dark';
    return (
      <aside style={{
        width: '255px',
        height: '100vh',
        background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Satoshi', sans-serif",
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        transition: 'all 0.2s ease'
      }}>
        {/* Brand Header */}
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          <Link href="/dashboard/v3" onClick={() => closeMobileMenu?.()} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <img src="/amira-logo.svg" alt="AMIRA" style={{ height: '24px', width: 'auto' }} />
          </Link>
        </div>

        {/* Categorized Collapsible Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.85rem 0.65rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {V3_NAV_CATEGORIES.map(cat => {
              const isCollapsed = collapsedCategories[cat.name] || false;
              const hasActiveChild = cat.items.some(item => 
                pathname === item.href || (item.href !== '/dashboard/v3' && pathname.startsWith(item.href))
              );

              return (
                <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {/* Collapsible Category Parent Header */}
                  <button
                    onClick={() => toggleCategory(cat.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.45rem 0.6rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: hasActiveChild ? '#10b981' : 'rgba(255, 255, 255, 0.7)',
                      transition: 'color 0.15s ease'
                    }}
                  >
                    <span>{cat.name}</span>
                    <span style={{ fontSize: '10px', opacity: 0.7 }}>{isCollapsed ? '►' : '▼'}</span>
                  </button>

                  {/* Category Children Links */}
                  {!isCollapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingLeft: '0.25rem' }}>
                      {cat.items.map(item => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard/v3' && pathname.startsWith(item.href));

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => closeMobileMenu?.()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              padding: '0.55rem 0.75rem',
                              color: isActive ? '#10b981' : '#ffffff',
                              textDecoration: 'none',
                              fontSize: '13px',
                              fontWeight: isActive ? 700 : 500,
                              borderRadius: '8px',
                              backgroundColor: isActive ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                              border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <GlowIcon
                              name={item.iconName}
                              size={15}
                              color={isActive ? '#10b981' : 'rgba(255, 255, 255, 0.85)'}
                            />
                            <span style={{ flex: 1 }}>{item.name}</span>
                            {item.badge && (
                              <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '99px', backgroundColor: '#10b981', color: '#ffffff' }}>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Enterprise Plan Card Widget */}
        <div style={{ padding: '0.75rem 0.85rem' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '12px',
            padding: '0.95rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '14px' }}>💎</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Enterprise Plan</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.85)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Unlimited Agents
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> 10,000 mins / month
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> 100+ Countries
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Priority Support
              </div>
            </div>

            <Link
              href="/dashboard/v3/billing"
              style={{
                marginTop: '0.25rem',
                padding: '0.45rem',
                borderRadius: '8px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                textAlign: 'center',
                textDecoration: 'none'
              }}
            >
              Manage Plan
            </Link>
          </div>
        </div>

        {/* User Profile Footer Widget */}
        <div style={{ padding: '0.75rem', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0.5rem',
            borderRadius: '10px',
            backgroundColor: isDark ? '#191e32' : '#f8fafc',
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)'
          }}>
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="User Avatar"
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute', bottom: '0', right: '0', width: '9px', height: '9px',
                borderRadius: '50%', backgroundColor: '#10b981', border: isDark ? '2px solid #191e32' : '2px solid #ffffff'
              }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {sidebarUser?.fullName || 'David O.'}
              </div>
              <div style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b' }}>
                Admin
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log Out"
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
            >
              <GlowIcon name="power-outline" size={15} color="#94a3b8" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // ── V2.0 DARK SIDEBAR ───────────────────────────────────────────────────
  return (
    <aside style={{ 
      width: '245px', 
      height: '100vh', 
      background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: "'Satoshi', sans-serif",
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{ 
        height: '64px', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <Link href="/dashboard" onClick={() => closeMobileMenu?.()} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <img src="/amira-logo.svg" alt="Amira" style={{ height: '24px', width: 'auto' }} />
        </Link>
      </div>

      {/* Focus Mode Banner with Robot Mascot */}
      <div style={{ padding: '0.85rem 1rem 0.35rem 1rem' }}>
        <button
          onClick={toggleFocusMode}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.55rem 0.75rem',
            borderRadius: '10px',
            border: focusUntil ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)',
            background: focusUntil ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
            color: focusUntil ? '#10b981' : '#9299ab',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/robot-mascot.png" alt="Robot Mascot" style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'cover' }} />
            <span>{focusUntil ? `Focus until ${focusUntil}` : 'Focus Mode'}</span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 700, opacity: 0.8 }}>{focusUntil ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Primary PRD Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {V2_NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}`));

            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => closeMobileMenu?.()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.55rem 0.75rem',
                  color: isActive ? '#ffffff' : '#9299ab',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(27,90,146, 0.22)' : 'transparent',
                  border: isActive ? '1px solid rgba(27,90,146, 0.4)' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <GlowIcon
                  name={item.iconName}
                  size={16}
                  color={isActive ? '#ffffff' : '#9299ab'}
                />
                <span style={{ flex: 1 }}>{item.name}</span>
                {item.badge && (
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: 700, 
                    padding: '1px 6px', 
                    borderRadius: '99px', 
                    background: '#1b5a92', 
                    color: '#ffffff' 
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile Footer */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0.5rem',
          borderRadius: '8px',
          backgroundColor: 'rgba(255,255,255,0.03)',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: '#1b5a92',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '12px', flexShrink: 0,
          }}>
            {sidebarUser?.initials || 'RA'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {sidebarUser?.fullName || 'Richmond'}
            </div>
            <div style={{ fontSize: '10px', color: '#9299ab', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {sidebarUser?.email || 'richmond@heyamira.com'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            style={{
              background: 'none',
              border: 'none',
              color: '#9299ab',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GlowIcon name="power-outline" size={15} color="#9299ab" />
          </button>
        </div>
      </div>
    </aside>
  );
}
