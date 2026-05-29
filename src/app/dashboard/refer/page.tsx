'use client';

import { useState } from 'react';
import Toast from '../../../components/ui/Toast';

export default function ReferPage() {
  const [toast, setToast] = useState<string | null>(null);
  
  const referralLink = "https://heyamira.com/ref/ashley99";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setToast('Referral link copied to clipboard!');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div style={{ marginBottom: '3rem', marginTop: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 1rem 0' }}>Give $50, Get $50</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: '0 auto', maxWidth: '600px' }}>
          Invite your friends to Amira. They get $50 in credits when they sign up, and you get $50 applied to your next bill.
        </p>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '3rem', boxShadow: 'var(--stripe-shadow-ambient)', maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Your unique referral link</h3>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input type="text" readOnly value={referralLink} style={{ flex: 1, padding: '1rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px', color: 'var(--stripe-navy)', backgroundColor: '#f6f9fc', outline: 'none' }} />
          <button onClick={handleCopy} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0 1.5rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>Copy Link</button>
        </div>

        <div style={{ borderTop: '1px solid var(--stripe-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)' }}>12</div>
            <div style={{ fontSize: '13px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>Clicks</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)' }}>3</div>
            <div style={{ fontSize: '13px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>Signups</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-success-text)' }}>$150</div>
            <div style={{ fontSize: '13px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
}
