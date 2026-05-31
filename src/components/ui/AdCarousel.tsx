'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface AdSlide {
  title: string;
  description: string;
  cta: {
    free: string;
    paid: string;
  };
  link: {
    free: string;
    paid: string;
  };
}

const ads: AdSlide[] = [
  {
    title: 'Unlock Amira Pro',
    description: 'Get advanced analytics, unlimited active campaigns, and limitless AI agent capabilities.',
    cta: { free: 'Upgrade Now →', paid: 'View Your Plan →' },
    link: { free: '/dashboard/account?tab=upgrade', paid: '/dashboard/account?tab=billing' },
  },
  {
    title: 'Connect 1,000+ Integrations',
    description: 'Plug Amira into your CRM, WhatsApp, email, calendar, and every tool your team already uses.',
    cta: { free: 'Upgrade to Unlock →', paid: 'Explore Integrations →' },
    link: { free: '/dashboard/account?tab=upgrade', paid: '/dashboard/integrations/apps' },
  },
];

// Green burst stripes in Amira brand palette
const STRIPES = [
  { rotate: 12,  translate: '80px, -20px', w: 130, h: 24, color: 'rgba(76,175,80,0.85)' },
  { rotate: 38,  translate: '90px, 10px',  w: 150, h: 28, color: 'rgba(56,142,60,0.85)' },
  { rotate: 72,  translate: '100px, 30px', w: 115, h: 22, color: 'rgba(76,175,80,0.85)' },
  { rotate: 108, translate: '95px, 20px',  w: 140, h: 26, color: 'rgba(46,125,50,0.85)' },
  { rotate: 148, translate: '80px, 0px',   w: 120, h: 24, color: 'rgba(76,175,80,0.85)' },
  { rotate: 185, translate: '95px, -15px', w: 160, h: 28, color: 'rgba(56,142,60,0.85)' },
  { rotate: 232, translate: '90px, 10px',  w: 110, h: 22, color: 'rgba(76,175,80,0.85)' },
  { rotate: 268, translate: '100px, -5px', w: 130, h: 26, color: 'rgba(46,125,50,0.85)' },
  { rotate: 308, translate: '85px, -20px', w: 140, h: 24, color: 'rgba(76,175,80,0.85)' },
  { rotate: 342, translate: '90px, -10px', w: 150, h: 28, color: 'rgba(56,142,60,0.85)' },
];

export default function AdCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    // Determine plan from Supabase
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();
      const plan = (profile?.plan || 'starter').toLowerCase();
      setIsPaid(plan !== 'starter' && plan !== 'free' && plan !== '');
    });

    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const ad = ads[current];
  const ctaText = isPaid ? ad.cta.paid : ad.cta.free;
  const ctaLink = isPaid ? ad.link.paid : ad.link.free;

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Section label above carousel */}
      <p style={{
        fontSize: '11.5px',
        fontWeight: 600,
        color: 'var(--stripe-muted)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '0.6rem',
      }}>
        What&apos;s New
      </p>

      <div style={{
        position: 'relative',
        width: '100%',
        height: '200px',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        background: '#0d1b2a',
        border: '1px solid rgba(76, 175, 80, 0.18)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
      }}>
        {ads.map((slide, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            opacity: current === i ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
            display: 'flex',
            zIndex: current === i ? 1 : 0,
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2rem 3rem',
          }}>
            {/* Left — Text content */}
            <div style={{
              position: 'relative',
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxWidth: '52%',
            }}>
              <h2 style={{
                color: '#ffffff',
                margin: '0 0 0.6rem 0',
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                textShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }}>{slide.title}</h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.75)',
                margin: 0,
                fontSize: '13px',
                lineHeight: 1.65,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}>{slide.description}</p>
            </div>

            {/* Right — Burst + CTA */}
            <div style={{
              position: 'relative',
              width: '40%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
            }}>
              {/* Radiating green stripes */}
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%', height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
              }}>
                {STRIPES.map((s, idx) => (
                  <div key={idx} style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transformOrigin: '0% 50%',
                    transform: `rotate(${s.rotate}deg) translate(${s.translate})`,
                    width: `${s.w}px`,
                    height: `${s.h}px`,
                    backgroundColor: s.color,
                    borderRadius: '4px',
                  }} />
                ))}
              </div>

              {/* CTA button */}
              <Link href={isPaid ? slide.link.paid : slide.link.free} style={{
                position: 'relative',
                zIndex: 10,
                backgroundColor: '#f1f5f9',
                color: '#0d1b2a',
                padding: '0.75rem 1.75rem',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '180px',
                whiteSpace: 'nowrap',
                clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)',
                transition: 'background-color 0.2s ease, transform 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.transform = 'scale(1)';
              }}>
                {isPaid ? slide.cta.paid : slide.cta.free}
              </Link>
            </div>
          </div>
        ))}

        {/* Dot indicators */}
        <div style={{
          position: 'absolute',
          bottom: '1.25rem',
          left: '3rem',
          display: 'flex',
          gap: '0.4rem',
          zIndex: 10,
        }}>
          {ads.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: current === i ? '20px' : '7px',
                height: '7px',
                borderRadius: '4px',
                backgroundColor: current === i ? '#4caf50' : 'rgba(255,255,255,0.35)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
