'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ads = [
  {
    title: 'Unlock Amira Pro',
    description: 'Get advanced analytics, unlimited contacts, and limitless A.I agent capabilities.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    link: '/dashboard/upgrade'
  },
  {
    title: 'New Integration: WhatsApp',
    description: 'Connect with your customers instantly on the most popular messaging app in the world.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
    link: '/dashboard/integrations'
  },
  {
    title: 'Supercharge Your Leads',
    description: 'Our new A.I powered lead qualification workflow is here to instantly boost your conversions.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    link: '/dashboard/leads'
  }
];

export default function AdCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem', display: 'flex', boxShadow: 'var(--stripe-shadow-ambient)' }}>
      {ads.map((ad, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: current === i ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          display: 'flex',
          zIndex: current === i ? 1 : 0
        }}>
          {/* Background image filling container */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${ad.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -2
          }} />
          
          {/* Black to fade gradient (left to right) */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to right, rgba(10,17,40,1) 0%, rgba(10,17,40,0.8) 40%, rgba(10,17,40,0) 100%)',
            zIndex: -1
          }} />

          {/* Ad Content */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            padding: '2.5rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            maxWidth: '60%'
          }}>
            <h2 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '24px', fontWeight: 600, fontFeatureSettings: '"ss01"' }}>{ad.title}</h2>
            <p style={{ color: '#cbd5e1', margin: '0 0 1.5rem 0', fontSize: '14px', lineHeight: 1.5, fontFeatureSettings: '"ss01"' }}>{ad.description}</p>
            <div>
              <Link href={ad.link} style={{
                backgroundColor: 'var(--stripe-purple)',
                color: '#fff',
                padding: '0.6rem 1.25rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500,
                display: 'inline-block',
                transition: 'background-color 0.2s',
                fontFeatureSettings: '"ss01"'
              }}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {/* Carousel Indicators */}
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '3rem', display: 'flex', gap: '0.5rem', zIndex: 2 }}>
        {ads.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: current === i ? '#ffffff' : 'rgba(255,255,255,0.3)',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }} />
        ))}
      </div>
    </div>
  );
}
