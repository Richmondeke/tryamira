"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Topbar.module.css';

export function Topbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('light');
  
  const getPageTitle = () => {
    if (pathname === '/') return 'Overview';
    if (pathname === '/leads') return 'Leads';
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
      <h1 className={styles.title}>{getPageTitle()}</h1>
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
