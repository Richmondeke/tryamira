import React from 'react';
import { AmiraLogo } from '../ui/AmiraLogo';
import styles from './AuthLayout.module.css';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logo}>
          <AmiraLogo size={42} style={{ color: '#ffffff' }} />
        </div>
        <div className={styles.marketingCopy}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.2)',
            color: '#ffffff',
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '20px'
          }}>
            <span>⚡</span> Amira v3.0 Autonomous OS
          </div>
          <h1 className={styles.title} style={{ color: '#ffffff', fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.25, marginBottom: '1.2rem' }}>
            Your global AI voice workforce command center.
          </h1>
          <p className={styles.subtitle} style={{ color: 'rgba(255,255,255,0.92)', fontSize: '1.05rem', lineHeight: 1.55, marginBottom: '2rem' }}>
            Deploy multi-model AI voice agents across 100+ countries to handle inbound & outbound calls, qualify leads, and execute real-time workspace actions in your CRM.
          </p>
          <div className={styles.featureList}>
            <div className={styles.featureItem} style={{ color: '#ffffff', fontSize: '0.95rem' }}>
              <span className={styles.featureIcon} style={{ background: 'rgba(255,255,255,0.25)', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, flexShrink: 0 }}>✓</span>
              Multi-model voice engine (ElevenLabs + Cartesia + OpenAI Realtime)
            </div>
            <div className={styles.featureItem} style={{ color: '#ffffff', fontSize: '0.95rem' }}>
              <span className={styles.featureIcon} style={{ background: 'rgba(255,255,255,0.25)', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, flexShrink: 0 }}>✓</span>
              Local phone DIDs in 100+ countries with 1-click binding
            </div>
            <div className={styles.featureItem} style={{ color: '#ffffff', fontSize: '0.95rem' }}>
              <span className={styles.featureIcon} style={{ background: 'rgba(255,255,255,0.25)', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, flexShrink: 0 }}>✓</span>
              Autonomous tool execution in HubSpot, Salesforce, Sheets & Gmail
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: 'auto' }}>
          © Amira Inc. · heyamira.com
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.rightPanelContent}>
          {children}
        </div>
      </div>
    </div>
  );
}
