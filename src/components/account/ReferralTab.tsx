'use client';

import React from 'react';

export interface ReferralTabProps {
  refLink: string;
  refClicks: number;
  refSignups: number;
  refEarned: number;
  onCopyLink: () => void;
}

export function ReferralTab({
  refLink,
  refClicks,
  refSignups,
  refEarned,
  onCopyLink
}: ReferralTabProps) {
  return (
    <div>
      <div style={{ maxWidth: '640px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>
          Affiliate & Partner Program
        </h2>
        <p style={{ color: 'var(--stripe-body)', fontSize: '13px', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Earn 20% recurring monthly commission on every paid workspace referral. Commission is credited straight to your bank account or platform wallet.
        </p>

        <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--stripe-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
            Your Unique Referral Link
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              readOnly 
              value={refLink} 
              style={{ flex: 1, padding: '0.55rem 0.75rem', fontSize: '12px', border: '1px solid var(--stripe-border)', borderRadius: '4px', backgroundColor: '#ffffff', color: 'var(--stripe-navy)' }} 
            />
            <button 
              onClick={onCopyLink} 
              style={{ padding: '0.55rem 1rem', backgroundColor: '#4caf50', color: '#ffffff', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid var(--stripe-border)', paddingTop: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)' }}>{refClicks}</div>
            <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>Link Clicks</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)' }}>{refSignups}</div>
            <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>Signups</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-success-text)' }}>${refEarned}</div>
            <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
}
