"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Topbar.module.css';

export function Topbar({ toggleMobileMenu }: { toggleMobileMenu?: () => void }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState('light');
  const [currentLang, setCurrentLang] = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);

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
      
      // Clean up the section name
      const formattedSection = section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      // If there's a 3rd part to the URL
      if (parts.length >= 3) {
        const subSection = parts[2];
        // If the subsection is a long string (like a UUID) or a number, ignore it
        if (subSection.length > 15 || !isNaN(Number(subSection))) {
          return formattedSection;
        }
        // Otherwise, format and append the subsection (e.g. /integrations/apps -> "Integrations Apps")
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

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
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
        <button className={styles.iconBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span className={styles.badge} />
        </button>
        <button className={styles.iconBtn} onClick={toggleTheme}>
          {theme === 'light' ? (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          )}
        </button>
        {/* Language Selector Dropdown */}
        <div style={{ position: 'relative', marginRight: '0.25rem' }}>
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              fontSize: '12px', 
              fontWeight: 500, 
              padding: '6px 12px', 
              borderRadius: '6px', 
              border: '1px solid var(--stripe-border)', 
              backgroundColor: '#fff', 
              color: 'var(--stripe-navy)',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'border-color 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#533afd'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--stripe-border)'}
          >
            <span style={{ fontSize: '15px' }}>
              {languagesList.find(l => l.code === currentLang)?.flag || '🇺🇸'}
            </span>
            <span>
              {languagesList.find(l => l.code === currentLang)?.label || 'English'}
            </span>
            <span style={{ fontSize: '9px', opacity: 0.7 }}>▼</span>
          </button>
          
          {showLangMenu && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              right: 0, 
              marginTop: '6px', 
              backgroundColor: '#ffffff', 
              border: '1px solid var(--stripe-border)', 
              borderRadius: '8px', 
              boxShadow: '0 10px 25px rgba(6, 27, 49, 0.12)', 
              zIndex: 9999, 
              minWidth: '150px',
              display: 'flex',
              flexDirection: 'column',
              padding: '6px'
            }}>
              {languagesList.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '8px 12px',
                    width: '100%',
                    border: 'none',
                    background: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: 'var(--stripe-navy)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: currentLang === lang.code ? 600 : 400,
                    backgroundColor: currentLang === lang.code ? '#f8fafc' : 'transparent',
                    transition: 'background-color 0.1s ease'
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

        <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--stripe-border)', margin: '0 0.5rem' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--stripe-navy)', lineHeight: 1 }}>Ashley Okoye</span>
            <span style={{ fontSize: '11px', color: 'var(--stripe-body)', marginTop: '2px' }}>Free Plan</span>
          </div>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '6px', 
            background: 'var(--stripe-purple)', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 'bold',
            fontSize: '12px'
          }}>
            AO
          </div>
        </div>
      </div>
    </header>
  );
}
