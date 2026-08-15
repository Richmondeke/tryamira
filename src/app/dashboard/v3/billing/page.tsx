'use client';

import React, { useState } from 'react';
import { GlowIcon } from '@/components/ui/GlowIcon';
import { useDemoMode } from '@/contexts/DemoModeContext';

export default function V3BillingPage() {
  const { isDemoMode } = useDemoMode();
  const [activePlan, setActivePlan] = useState<'trial' | 'starter' | 'pro' | 'enterprise'>('trial');
  const [selectedTierModal, setSelectedTierModal] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Payment form state
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('•••');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const invoices = [
    { id: 'INV-2026-008', date: 'Aug 01, 2026', amount: '$149.00', status: 'Paid', plan: 'Growing Teams (Pro)' },
    { id: 'INV-2026-007', date: 'Jul 01, 2026', amount: '$149.00', status: 'Paid', plan: 'Growing Teams (Pro)' },
    { id: 'INV-2026-006', date: 'Jun 01, 2026', amount: '$149.00', status: 'Paid', plan: 'Growing Teams (Pro)' },
    { id: 'INV-2026-005', date: 'May 01, 2026', amount: '$49.00', status: 'Paid', plan: 'Small Businesses (Starter)' }
  ];

  const handleConfirmUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActivePlan(selectedTierModal);
      setShowUpgradeModal(false);
      const planName = selectedTierModal === 'starter' ? 'Small Businesses ($49/mo)' : selectedTierModal === 'pro' ? 'Growing Teams ($149/mo)' : 'Enterprise Custom';
      setSuccessToast(`Successfully upgraded to ${planName}! Your account features are now unlocked.`);
      setTimeout(() => setSuccessToast(null), 5000);
    }, 1200);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'AMIRA20' || promoCode.trim().toUpperCase() === 'LAUNCH') {
      setDiscountApplied(true);
      alert("Promo code applied! 20% discount added to your subscription.");
    } else {
      alert("Invalid promo code. Try 'AMIRA20' for 20% off.");
    }
  };

  return (
    <div className="v3-widget-animate delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>
      
      {/* Toast Notification */}
      {successToast && (
        <div style={{
          backgroundColor: '#10b981', color: '#ffffff', padding: '1rem 1.5rem', borderRadius: '12px',
          fontWeight: 700, fontSize: '14px', boxShadow: '0 10px 30px rgba(16,185,129,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <span>✓ {successToast}</span>
          <button onClick={() => setSuccessToast(null)} style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* ── FIRST-TIME USER PAYWALL BANNER ─────────────────────────────────── */}
      {activePlan === 'trial' && (
        <div style={{
          background: 'linear-gradient(135deg, #1b5a92 0%, #0f172a 100%)',
          borderRadius: '18px',
          padding: '2rem 2.25rem',
          color: '#ffffff',
          boxShadow: '0 12px 40px rgba(27, 90, 146, 0.3)',
          border: '1.5px solid rgba(16, 185, 129, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ flex: 1, minWidth: '280px', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#10b98125', border: '1px solid #10b981', color: '#10b981', fontSize: '11.5px', fontWeight: 800, padding: '3px 10px', borderRadius: '99px', marginBottom: '0.75rem' }}>
              ⚡ FIRST-TIME USER PAYWALL • 14-DAY FREE TRIAL ACTIVE
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 850, color: '#ffffff', margin: 0 }}>
              Unlock Unlimited AI Support Workforce Capabilities
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', margin: '0.5rem 0 0 0', maxWidth: '680px', lineHeight: 1.5 }}>
              Your account is currently on the <strong>14-Day Free Trial</strong> (3 days remaining). Upgrade your plan today to prevent support interruptions and keep your AI Voice Agents active 24/7.
            </p>
          </div>

          <button
            onClick={() => { setSelectedTierModal('pro'); setShowUpgradeModal(true); }}
            style={{
              padding: '0.9rem 2rem',
              borderRadius: '12px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              zIndex: 2
            }}
          >
            <GlowIcon name="crown-outline" size={18} color="#ffffff" />
            <span>Unlock Pro Plan ($149/mo) →</span>
          </button>
        </div>
      )}

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Plan & Billing Management</h1>
            <span style={{
              fontSize: '11px', fontWeight: 750, padding: '3px 10px', borderRadius: '99px',
              backgroundColor: activePlan === 'trial' ? '#f59e0b15' : '#10b98115',
              color: activePlan === 'trial' ? '#f59e0b' : '#10b981',
              border: activePlan === 'trial' ? '1px solid #f59e0b30' : '1px solid #10b98130'
            }}>
              ● {activePlan === 'trial' ? '14-Day Free Trial' : `${activePlan.toUpperCase()} Plan Active`}
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Manage monthly voice minutes, active agent capacity, payment methods, and invoices.
          </p>
        </div>

        {/* Manage Billing CTA */}
        <button
          onClick={() => { setSelectedTierModal('pro'); setShowUpgradeModal(true); }}
          style={{
            padding: '0.7rem 1.4rem',
            borderRadius: '12px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontSize: '13.5px',
            fontWeight: 750,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <GlowIcon name="credit-card-outline" size={16} color="#ffffff" />
          <span>Manage Subscription & Plan</span>
        </button>
      </div>

      {/* ── CURRENT USAGE METERS ───────────────────────────────────────────── */}
      <div style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GlowIcon name="credit-card-outline" size={22} color="#10b981" />
              <h3 style={{ fontSize: '18px', fontWeight: 750, color: 'var(--text-primary)', margin: 0 }}>
                {activePlan === 'trial' ? 'Free Trial Plan' : activePlan === 'starter' ? 'Small Businesses (Starter)' : activePlan === 'pro' ? 'Growing Teams Tier (Pro)' : 'Enterprise Custom Tier'}
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
              {activePlan === 'starter' ? '1 AI Agent • 500 mins/mo • Webchat & Phone' : activePlan === 'pro' || activePlan === 'trial' ? 'Up to 5 active AI Voice Agents • 2,500 mins/mo • Voice, WhatsApp, Webchat & Email' : 'Unlimited AI Agents • Unlimited mins/mo • Custom Knowledge Base'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Status: <strong>Active Subscription</strong></span>
            <button
              onClick={() => { setSelectedTierModal('pro'); setShowUpgradeModal(true); }}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #1b5a92',
                color: '#1b5a92',
                fontSize: '12.5px',
                fontWeight: 750,
                cursor: 'pointer'
              }}
            >
              Manage Subscription
            </button>
          </div>
        </div>

        {/* Progress meters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
          
          {/* Voice Minutes Meter */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle, #f8fafc)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              <span>Monthly Voice Minutes</span>
              <span style={{ color: '#10b981' }}>{isDemoMode ? '1,840 / 2,500 Mins' : '0 / 2,500 Mins'}</span>
            </div>
            <div style={{ width: '100%', height: '8px', borderRadius: '99px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ width: isDemoMode ? '73.6%' : '0%', height: '100%', borderRadius: '99px', backgroundColor: '#10b981', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* Active Agents Capacity */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle, #f8fafc)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              <span>Active AI Voice Agents</span>
              <span style={{ color: '#1b5a92' }}>{isDemoMode ? '3 / 5 Agents' : '1 / 5 Agents'}</span>
            </div>
            <div style={{ width: '100%', height: '8px', borderRadius: '99px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ width: isDemoMode ? '60%' : '20%', height: '100%', borderRadius: '99px', backgroundColor: '#1b5a92', transition: 'width 0.5s ease' }} />
            </div>
          </div>

        </div>
      </div>

      {/* ── PRICING TABLE SELECTION ─────────────────────────────────────────── */}
      <div style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SELECT PLAN</span>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0' }}>Upgrade or Switch Your Plan Tier</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Instant activation with 30-day money-back guarantee.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              id: 'starter',
              title: "For Small Businesses",
              price: "$49",
              period: "/month",
              desc: "Give your customers enterprise-level support without building a massive support team.",
              highlight: "More support. Less overhead.",
              features: [
                "500 AI Voice & Chat Minutes/mo",
                "1 Active AI Voice Agent",
                "Webchat & Phone Channels",
                "Basic CRM & Email Sync"
              ],
              popular: false,
              btnText: "Select Starter ($49/mo)"
            },
            {
              id: 'pro',
              title: "For Growing Teams",
              price: "$149",
              period: "/month",
              desc: "Automate repetitive conversations while your human agents focus on complex customer needs.",
              highlight: "AI handles volume. Team handles important stuff.",
              features: [
                "2,500 AI Voice & Chat Minutes/mo",
                "Up to 5 Active AI Voice Agents",
                "Voice, WhatsApp, Webchat & Email",
                "1,000+ Tool Integrations"
              ],
              popular: true,
              btnText: "Select Pro ($149/mo)"
            },
            {
              id: 'enterprise',
              title: "For Large Support Teams",
              price: "Custom",
              period: "",
              desc: "Deploy AI agents across your customer support operation without constantly increasing headcount.",
              highlight: "Scale your support without scaling workload.",
              features: [
                "Unlimited AI Voice & Chat Volume",
                "Unlimited Custom AI Agents",
                "Custom Knowledge Base & Webhooks",
                "Dedicated Account Manager & SLA"
              ],
              popular: false,
              btnText: "Contact Enterprise Sales"
            }
          ].map(tier => (
            <div key={tier.id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: activePlan === tier.id ? '2.5px solid #10b981' : '1px solid var(--border-subtle)',
              boxShadow: activePlan === tier.id ? '0 8px 30px rgba(16, 185, 129, 0.15)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.5rem',
              position: 'relative'
            }}>
              {tier.popular && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  backgroundColor: '#10b981', color: '#ffffff', fontSize: '10px', fontWeight: 800,
                  padding: '0.2rem 0.75rem', borderRadius: '99px', letterSpacing: '0.05em'
                }}>
                  MOST POPULAR
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1b5a92', margin: 0 }}>{tier.title}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', margin: '0.75rem 0 0.35rem 0' }}>
                  <span style={{ fontSize: '32px', fontWeight: 850, color: '#0f172a' }}>{tier.price}</span>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{tier.period}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{tier.desc}</p>

                <div style={{ marginTop: '1rem', padding: '0.65rem 0.85rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <p style={{ fontSize: '12px', fontWeight: 750, color: '#047857', margin: 0 }}>{tier.highlight}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem' }}>
                  {tier.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12.5px', color: '#334155' }}>
                      <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedTierModal(tier.id as any);
                  setShowUpgradeModal(true);
                }}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: 750,
                  border: activePlan === tier.id ? 'none' : '1.5px solid #1b5a92',
                  backgroundColor: activePlan === tier.id ? '#10b981' : '#ffffff',
                  color: activePlan === tier.id ? '#ffffff' : '#1b5a92',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                {activePlan === tier.id ? '● Current Active Plan' : tier.btnText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── BILLING & INVOICE HISTORY ───────────────────────────────────────── */}
      <div style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '1.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 750, color: 'var(--text-primary)', margin: 0 }}>Invoice & Payment History</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>Download PDF receipts and view past payments</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '13px', fontWeight: 650, color: 'var(--text-primary)', backgroundColor: 'var(--bg-subtle, #f8fafc)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <span>💳 Payment: <strong>Visa ending in 4242</strong></span>
            <button onClick={() => setShowUpgradeModal(true)} style={{ border: 'none', background: 'none', color: '#10b981', fontWeight: 750, cursor: 'pointer', fontSize: '12px' }}>Edit Card</button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Invoice ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Billing Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Plan Tier</th>
                <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={inv.id} style={{ borderBottom: i < invoices.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 750, color: 'var(--text-primary)' }}>{inv.id}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{inv.date}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)', fontWeight: 600 }}>{inv.plan}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 750, color: 'var(--text-primary)' }}>{inv.amount}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 750, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#f0fdf4', color: '#047857', border: '1px solid #bbf7d0' }}>
                      ✓ {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => alert(`Downloading Invoice ${inv.id} PDF...`)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-subtle, #f1f5f9)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12px',
                        fontWeight: 650,
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── INTERACTIVE CHECKOUT & PLAN UPGRADE MODAL ───────────────────────── */}
      {showUpgradeModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%', maxWidth: '640px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
            padding: '2rem',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowUpgradeModal(false)}
              style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem',
                backgroundColor: '#f1f5f9', border: 'none', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800, color: '#64748b'
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '20px' }}>⚡</span>
              <h2 style={{ fontSize: '22px', fontWeight: 850, color: '#0f172a', margin: 0 }}>Manage Subscription & Checkout</h2>
            </div>
            <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 1.5rem 0' }}>
              Select tier, enter payment method, and activate instant AI agent capacity.
            </p>

            {/* Plan Tier Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { id: 'starter', title: 'Starter', price: '$49/mo' },
                { id: 'pro', title: 'Pro Plan', price: '$149/mo' },
                { id: 'enterprise', title: 'Enterprise', price: 'Custom' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTierModal(t.id as any)}
                  style={{
                    padding: '0.85rem 0.5rem',
                    borderRadius: '12px',
                    border: selectedTierModal === t.id ? '2px solid #10b981' : '1px solid #e2e8f0',
                    backgroundColor: selectedTierModal === t.id ? '#f0fdf4' : '#ffffff',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: selectedTierModal === t.id ? '#047857' : '#0f172a' }}>{t.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '0.15rem' }}>{t.price}</div>
                </button>
              ))}
            </div>

            {/* Billing Cycle Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Annual Billing (Save 20%)</span>
              <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: '#e2e8f0', padding: '2px', borderRadius: '8px' }}>
                <button
                  onClick={() => setBillingCycle('monthly')}
                  style={{
                    padding: '0.35rem 0.75rem', fontSize: '12px', fontWeight: 750, borderRadius: '6px', border: 'none',
                    backgroundColor: billingCycle === 'monthly' ? '#ffffff' : 'transparent',
                    color: billingCycle === 'monthly' ? '#0f172a' : '#64748b', cursor: 'pointer'
                  }}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  style={{
                    padding: '0.35rem 0.75rem', fontSize: '12px', fontWeight: 750, borderRadius: '6px', border: 'none',
                    backgroundColor: billingCycle === 'annual' ? '#10b981' : 'transparent',
                    color: billingCycle === 'annual' ? '#ffffff' : '#64748b', cursor: 'pointer'
                  }}
                >
                  Annual (-20%)
                </button>
              </div>
            </div>

            {/* Payment Details Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 750, color: '#0f172a', margin: 0 }}>Credit Card Details</h4>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>CARD NUMBER</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>EXPIRY DATE</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>CVC CODE</label>
                  <input
                    type="password"
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Promo code */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Promo code (e.g. AMIRA20)"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                />
                <button
                  onClick={handleApplyPromo}
                  style={{ padding: '0.65rem 1rem', borderRadius: '8px', backgroundColor: '#1b5a92', color: '#ffffff', fontSize: '12.5px', fontWeight: 750, border: 'none', cursor: 'pointer' }}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Total Summary */}
            <div style={{ backgroundColor: '#f1f5f9', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>Total Billed Today:</span>
              <span style={{ fontSize: '20px', fontWeight: 850, color: '#10b981' }}>
                {selectedTierModal === 'starter' ? (discountApplied ? '$39.20/mo' : '$49.00/mo') : selectedTierModal === 'pro' ? (discountApplied ? '$119.20/mo' : '$149.00/mo') : 'Custom Quote'}
              </span>
            </div>

            <button
              onClick={handleConfirmUpgrade}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '12px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 800,
                border: 'none',
                cursor: isProcessing ? 'wait' : 'pointer',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                textAlign: 'center'
              }}
            >
              {isProcessing ? 'Processing Checkout...' : `Confirm & Subscribe to ${selectedTierModal.toUpperCase()} Plan →`}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
