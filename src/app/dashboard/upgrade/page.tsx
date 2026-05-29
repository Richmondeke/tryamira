'use client';

import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';

export default function UpgradePage() {
  const [toast, setToast] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgradeClick = () => {
    setShowModal(true);
  };

  const processUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowModal(false);
      setToast('Successfully upgraded to the Pro Plan!');
    }, 2500);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showModal} onClose={() => !isProcessing && setShowModal(false)} title="Upgrade to Pro Plan">
        {isProcessing ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ color: 'var(--stripe-purple)', fontSize: '12px', fontWeight: 500 }}>Processing Payment...</div>
            <p style={{ color: 'var(--stripe-muted)', fontSize: '12px', marginTop: '0.5rem' }}>Securely processing via Stripe.</p>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--stripe-body)', fontSize: '12px', marginBottom: '1rem' }}>
              You are about to upgrade your workspace to the Pro Plan for $49/mo. Your card ending in 4242 will be charged immediately.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={processUpgrade} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: 'var(--stripe-purple)', color: '#fff', cursor: 'pointer' }}>Confirm Payment</button>
            </div>
          </div>
        )}
      </Modal>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>Upgrade your plan</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0 }}>Unlock advanced AI features and remove limits.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.25rem', width: '350px', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <h3 style={{ fontSize: '12px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 500 }}>Starter</h3>
          <div style={{ fontSize: '20px', color: 'var(--stripe-navy)', fontWeight: 300, marginBottom: '1rem' }}>$0<span style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>/mo</span></div>
          <button disabled style={{ width: '100%', padding: '0.75rem', backgroundColor: '#f6f9fc', color: 'var(--stripe-muted)', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontWeight: 500, marginBottom: '1rem', cursor: 'not-allowed' }}>Current Plan</button>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> 100 Chats / month</li>
            <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> 1 AI Agent</li>
            <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Standard Support</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '2px solid var(--stripe-purple)', borderRadius: '8px', padding: '1.25rem', width: '350px', boxShadow: '0 12px 24px rgba(83,58,253,0.15)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '12px' }}>MOST POPULAR</div>
          <h3 style={{ fontSize: '12px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 500 }}>Pro</h3>
          <div style={{ fontSize: '20px', color: 'var(--stripe-navy)', fontWeight: 300, marginBottom: '1rem' }}>$49<span style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>/mo</span></div>
          <button onClick={handleUpgradeClick} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', fontWeight: 500, marginBottom: '1rem', cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>Upgrade to Pro</button>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Unlimited Chats</li>
            <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> 5 AI Agents</li>
            <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Custom Integrations</li>
            <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Priority 24/7 Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
