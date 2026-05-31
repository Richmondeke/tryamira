"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import NotificationDrawer from '@/components/ui/NotificationDrawer';
import styles from './Topbar.module.css';

interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  initials: string;
  plan: string;
  workspaceId: string;
}

export function Topbar({ toggleMobileMenu }: { toggleMobileMenu?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [currentLang, setCurrentLang] = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<UserInfo | null>(null);

  const languagesList = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'yo', label: 'Yoruba', flag: '🇳🇬' },
    { code: 'ig', label: 'Igbo', flag: '🇳🇬' },
    { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
    { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
  ];

  // Load real auth user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) return;
      // Try to get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, plan, workspace_id')
        .eq('id', authUser.id)
        .single();

      const fullName =
        profile?.full_name ||
        authUser.user_metadata?.full_name ||
        authUser.email?.split('@')[0] ||
        'User';
      const initials = fullName
        .split(' ')
        .slice(0, 2)
        .map((w: string) => w[0]?.toUpperCase() || '')
        .join('');

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        fullName,
        initials,
        plan: profile?.plan || 'Starter',
        workspaceId: profile?.workspace_id || authUser.id,
      });

      // Fetch unread notification count
      const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('workspace_id', profile?.workspace_id || authUser.id)
        .eq('read', false);
      setUnreadCount(count || 0);
    });
  }, []);

  // Real-time unread badge
  useEffect(() => {
    if (!user?.workspaceId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`notif-badge:${user.workspaceId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `workspace_id=eq.${user.workspaceId}`,
      }, () => setUnreadCount(prev => prev + 1))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.workspaceId]);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    const trans = getCookie('googtrans');
    if (trans) {
      const code = trans.split('/').pop();
      if (code) setCurrentLang(code);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    if (langCode === 'en') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=` + window.location.hostname;
    }
    window.location.reload();
  };

  const getPageTitle = () => {
    if (pathname === '/') return 'Overview';
    if (pathname === '/leads') return 'Leads';
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'dashboard') {
      const section = parts[1];
      if (section === 'ai-agent') return 'AI Agent';
      if (section === 'webchat-setup') return 'Webchat Setup';
      const formattedSection = section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      if (parts.length >= 3) {
        const subSection = parts[2];
        if (subSection.length > 15 || !isNaN(Number(subSection))) return formattedSection;
        const formattedSub = subSection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return `${formattedSection} - ${formattedSub}`;
      }
      return formattedSection;
    }
    return pathname.substring(1).charAt(0).toUpperCase() + pathname.substring(2);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleNotifOpen = () => {
    setNotifOpen(true);
    setUnreadCount(0); // Reset badge optimistically
  };

  return (
    <>
      <header className={styles.topbar}>
        <style dangerouslySetInnerHTML={{__html: `
          .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            color: var(--stripe-navy);
            cursor: pointer;
            padding: 0;
            margin-right: 1rem;
          }
          @media (max-width: 768px) {
            .mobile-menu-btn {
              display: flex;
              align-items: center;
            }
          }
        `}} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 className={styles.title}>{getPageTitle()}</h1>
        </div>

        <div className={styles.actions}>
          {/* Notification Bell */}
          <button
            className={styles.iconBtn}
            onClick={handleNotifOpen}
            style={{ position: 'relative' }}
            title="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                backgroundColor: '#ef4444', color: '#fff',
                fontSize: '9px', fontWeight: 700,
                minWidth: '16px', height: '16px',
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 3px', lineHeight: 1,
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button className={styles.iconBtn} onClick={toggleTheme}>
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
          </button>

          {/* Language Selector */}
          <div style={{ position: 'relative', marginRight: '0.25rem' }}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '12px', fontWeight: 500, padding: '6px 12px',
                borderRadius: '6px', border: '1px solid var(--stripe-border)',
                backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'border-color 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#4caf50'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--stripe-border)'}
            >
              <span style={{ fontSize: '15px' }}>{languagesList.find(l => l.code === currentLang)?.flag || '🇺🇸'}</span>
              <span>{languagesList.find(l => l.code === currentLang)?.label || 'English'}</span>
              <span style={{ fontSize: '9px', opacity: 0.7 }}>▼</span>
            </button>
            {showLangMenu && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '6px',
                backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)',
                borderRadius: '8px', boxShadow: '0 10px 25px rgba(6,27,49,0.12)',
                zIndex: 9999, minWidth: '150px', display: 'flex', flexDirection: 'column', padding: '6px'
              }}>
                {languagesList.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { changeLanguage(lang.code); setShowLangMenu(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '8px 12px', width: '100%', border: 'none',
                      background: 'none', borderRadius: '6px', fontSize: '12px',
                      color: 'var(--stripe-navy)', cursor: 'pointer', textAlign: 'left',
                      fontWeight: currentLang === lang.code ? 600 : 400,
                      backgroundColor: currentLang === lang.code ? '#f8fafc' : 'transparent',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = currentLang === lang.code ? '#f8fafc' : 'transparent'}
                  >
                    <span style={{ fontSize: '14px' }}>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Notifications Right Drawer */}
      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        workspaceId={user?.workspaceId}
      />
    </>
  );
}
