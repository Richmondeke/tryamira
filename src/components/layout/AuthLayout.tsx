import React from 'react';
import styles from './AuthLayout.module.css';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          TryAmira
        </div>
        <div className={styles.marketingCopy}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', marginBottom: '16px' }}>
            Welcome back
          </div>
          <h1 className={styles.title}>Your messaging command centre.</h1>
          <p className={styles.subtitle}>Sign in to manage WhatsApp, Instagram, Messenger and Email conversations from a single dashboard.</p>
          <div className={styles.featureList}>
            <div className={styles.featureItem}><span className={styles.featureIcon}>✓</span> One unified inbox across every channel</div>
            <div className={styles.featureItem}><span className={styles.featureIcon}>✓</span> AI agent replies in seconds, day or night</div>
            <div className={styles.featureItem}><span className={styles.featureIcon}>✓</span> Built for ambitious businesses</div>
          </div>
        </div>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>© TryAmira · app.tryamira.com</div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.rightPanelContent}>
          {children}
        </div>
      </div>
    </div>
  );
}
