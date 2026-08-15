'use client';

import React from 'react';
import { useDemoMode } from '@/contexts/DemoModeContext';

export default function V3SettingsPage() {
  const { isDemoMode } = useDemoMode();

  return (
    <div className="v3-widget-animate delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>Settings & API Keys</h1>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#1b5a9215', color: '#1b5a92' }}>Global Config</span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>Configure default voice engines (Amira Voice Engine, Amira Ultra-Fast Engine, Amira Realtime Voice) and phone line settings.</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Default Voice Providers</h3>
        {[
          { name: 'Amira Voice Engine', key: 'sk_eleven_********************', status: '🟢 Connected' },
          { name: 'Amira Ultra-Fast Engine', key: 'sk_cartesia_****************', status: '🟢 Connected' },
          { name: 'Amira Realtime Voice', key: 'sk_openai_******************', status: '🟢 Connected' },
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace', marginTop: '0.2rem' }}>{item.key}</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#10b981' }}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
