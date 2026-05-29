import os

base_dir = "/Users/mac/.gemini/antigravity/scratch/tryamira/src/app/dashboard"

# 1. Update /dashboard/upgrade/page.tsx
upgrade_content = """'use client';

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';

export default function UpgradePage() {
  const [toast, setToast] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgradeClick = () => {
    setShowModal(True);
  };

  const processUpgrade = () => {
    setIsProcessing(True);
    setTimeout(() => {
      setIsProcessing(False);
      setShowModal(False);
      setToast('Successfully upgraded to the Pro Plan!');
    }, 2500);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showModal} onClose={() => !isProcessing && setShowModal(False)} title="Upgrade to Pro Plan">
        {isProcessing ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ color: 'var(--stripe-purple)', fontSize: '18px', fontWeight: 500 }}>Processing Payment...</div>
            <p style={{ color: 'var(--stripe-muted)', fontSize: '14px', marginTop: '0.5rem' }}>Securely processing via Stripe.</p>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--stripe-body)', fontSize: '14px', marginBottom: '1.5rem' }}>
              You are about to upgrade your workspace to the Pro Plan for $49/mo. Your card ending in 4242 will be charged immediately.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(False)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={processUpgrade} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: 'var(--stripe-purple)', color: '#fff', cursor: 'pointer' }}>Confirm Payment</button>
            </div>
          </div>
        )}
      </Modal>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>Upgrade your plan</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0 }}>Unlock advanced AI features and remove limits.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '2rem', width: '350px', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 500 }}>Starter</h3>
          <div style={{ fontSize: '32px', color: 'var(--stripe-navy)', fontWeight: 300, marginBottom: '1.5rem' }}>$0<span style={{ fontSize: '14px', color: 'var(--stripe-muted)' }}>/mo</span></div>
          <button disabled style={{ width: '100%', padding: '0.75rem', backgroundColor: '#f6f9fc', color: 'var(--stripe-muted)', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontWeight: 500, marginBottom: '2rem', cursor: 'not-allowed' }}>Current Plan</button>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ fontSize: '14px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> 100 Chats / month</li>
            <li style={{ fontSize: '14px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> 1 AI Agent</li>
            <li style={{ fontSize: '14px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Standard Support</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '2px solid var(--stripe-purple)', borderRadius: '8px', padding: '2rem', width: '350px', boxShadow: '0 12px 24px rgba(83,58,253,0.15)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '12px' }}>MOST POPULAR</div>
          <h3 style={{ fontSize: '18px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 500 }}>Pro</h3>
          <div style={{ fontSize: '32px', color: 'var(--stripe-navy)', fontWeight: 300, marginBottom: '1.5rem' }}>$49<span style={{ fontSize: '14px', color: 'var(--stripe-muted)' }}>/mo</span></div>
          <button onClick={handleUpgradeClick} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', fontWeight: 500, marginBottom: '2rem', cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>Upgrade to Pro</button>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ fontSize: '14px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Unlimited Chats</li>
            <li style={{ fontSize: '14px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> 5 AI Agents</li>
            <li style={{ fontSize: '14px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Custom Integrations</li>
            <li style={{ fontSize: '14px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Priority 24/7 Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
""".replace("True", "true").replace("False", "false")

with open(os.path.join(base_dir, "upgrade", "page.tsx"), "w") as f:
    f.write(upgrade_content)

# 2. Update /dashboard/refer/page.tsx
refer_content = """'use client';

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
""".replace("True", "true").replace("False", "false")

with open(os.path.join(base_dir, "refer", "page.tsx"), "w") as f:
    f.write(refer_content)

print("Phase 4 pages successfully updated.")
