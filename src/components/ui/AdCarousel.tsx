'use client';


import { useState, useEffect } from 'react';
import Link from 'next/link';

const ads = [
  {
    title: 'Like what you see?',
    description: 'Join our early stage Limited Beta and help form the future of AI voice employees.',
    linkText: 'Join limited Beta',
    link: '/dashboard/upgrade'
  },
  {
    title: 'Unlock Amira Pro',
    description: 'Get advanced analytics, unlimited active campaigns, and limitless A.I agent capabilities.',
    linkText: 'Upgrade to Pro',
    link: '/dashboard/upgrade'
  },
  {
    title: 'Connect WhatsApp API',
    description: 'Connect with your customers instantly on the most popular messaging app in the world.',
    linkText: 'Install Integration',
    link: '/dashboard/integrations'
  }
];

export default function AdCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '240px', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      marginBottom: '2rem', 
      display: 'flex', 
      background: '#090909',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)'
    }}>
      {ads.map((ad, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: current === i ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
          display: 'flex',
          zIndex: current === i ? 1 : 0,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2.5rem 3.5rem'
        }}>
          {/* Ad Content (Left Column) */}
          <div style={{
            position: 'relative',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            maxWidth: '52%',
            textAlign: 'left'
          }}>
            <h2 style={{ 
              color: '#ffffff', 
              margin: '0 0 0.75rem 0', 
              fontSize: '28px', 
              fontWeight: 500, 
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>{ad.title}</h2>
            
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              margin: '0', 
              fontSize: '13.5px', 
              lineHeight: 1.6, 
              fontFamily: 'Inter, system-ui, sans-serif',
              maxWidth: '420px'
            }}>{ad.description}</p>
          </div>

          {/* Radiating Stripes Burst & Beveled CTA (Right Column) */}
          <div style={{
            position: 'relative',
            width: '40%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3
          }}>
            {/* The Geometric Stripes Burst radiating outward from the button */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1
            }}>
              {/* Radial angled stripes radiating around the CTA button in our electric blue/indigo theme */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transformOrigin: '0% 50%', transform: 'rotate(12deg) translate(80px, -20px)', width: '130px', height: '24px', backgroundColor: 'rgba(83, 58, 253, 0.9)', borderRadius: '4px' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transformOrigin: '0% 50%', transform: 'rotate(38deg) translate(90px, 10px)', width: '150px', height: '28px', backgroundColor: 'rgba(0, 101, 255, 0.9)', borderRadius: '4px' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transformOrigin: '0% 50%', transform: 'rotate(72deg) translate(100px, 30px)', width: '115px', height: '22px', backgroundColor: 'rgba(83, 58, 253, 0.9)', borderRadius: '4px' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transformOrigin: '0% 50%', transform: 'rotate(108deg) translate(95px, 20px)', width: '140px', height: '26px', backgroundColor: 'rgba(0, 101, 255, 0.9)', borderRadius: '4px' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transformOrigin: '0% 50%', transform: 'rotate(148deg) translate(80px, 0px)', width: '120px', height: '24px', backgroundColor: 'rgba(83, 58, 253, 0.9)', borderRadius: '4px' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transformOrigin: '0% 50%', transform: 'rotate(185deg) translate(95px, -15px)', width: '160px', height: '28px', backgroundColor: 'rgba(0, 101, 255, 0.9)', borderRadius: '4px' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transformOrigin: '0% 50%', transform: 'rotate(232deg) translate(90px, 10px)', width: '110px', height: '22px', backgroundColor: 'rgba(83, 58, 253, 0.9)', borderRadius: '4px' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transformOrigin: '0% 50%', transform: 'rotate(268deg) translate(100px, -5px)', width: '130px', height: '26px', backgroundColor: 'rgba(0, 101, 255, 0.9)', borderRadius: '4px' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transformOrigin: '0% 50%', transform: 'rotate(308deg) translate(85px, -20px)', width: '140px', height: '24px', backgroundColor: 'rgba(83, 58, 253, 0.9)', borderRadius: '4px' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transformOrigin: '0% 50%', transform: 'rotate(342deg) translate(90px, -10px)', width: '150px', height: '28px', backgroundColor: 'rgba(0, 101, 255, 0.9)', borderRadius: '4px' }}></div>
            </div>

            {/* Beveled White Button matching the custom octagonal clip-path */}
            <Link href={ad.link} style={{
              position: 'relative',
              zIndex: 10,
              backgroundColor: '#f1f1f1',
              color: '#0c0c0c',
              padding: '0.8rem 2rem',
              fontSize: '13.5px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '175px',
              whiteSpace: 'nowrap',
              clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)',
              transition: 'background-color 0.2s ease, transform 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f1f1';
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              {ad.linkText}
            </Link>
          </div>
        </div>
      ))}
      
      {/* Carousel Indicators */}
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '3.5rem', display: 'flex', gap: '0.5rem', zIndex: 2 }}>
        {ads.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: current === i ? '#ffffff' : 'rgba(255,255,255,0.35)',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }} />
        ))}
      </div>
    </div>
  );
}
