'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import styles from './DashboardLayout.module.css';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className={styles.layout}>
      <style dangerouslySetInnerHTML={{__html: `
        .global-sidebar-wrapper {
          display: block;
          z-index: 50;
        }
        @media (max-width: 768px) {
          .global-sidebar-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
          }
        }
      `}} />
      
      {isMobileMenuOpen && (
        <div 
          onClick={closeMobileMenu}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}
      
      <div 
        className="global-sidebar-wrapper"
        style={{ transform: isMobileMenuOpen ? 'translateX(0)' : undefined }}
      >
        <Sidebar closeMobileMenu={closeMobileMenu} />
      </div>
      
      <div className={styles.main}>
        <Topbar toggleMobileMenu={toggleMobileMenu} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
