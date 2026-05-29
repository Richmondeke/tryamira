'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function WebchatSetupLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Webchat Hub', href: '/dashboard/webchat-setup/chat' },
    { name: 'Widget Configuration', href: '/dashboard/webchat-setup/widget' },
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      
      {/* Top Header & Tab Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>Webchat & Widget</h1>
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>Manage your website chat interactions and configure your floating widget.</p>
          </div>
        </div>
        
        {/* Sub-Navigation Tabs */}
        <div style={{ display: 'inline-flex', backgroundColor: '#f6f9fc', borderRadius: '6px', padding: '0.25rem', border: '1px solid var(--stripe-border)' }}>
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            return (
              <Link 
                key={tab.name}
                href={tab.href}
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '13px', 
                  fontWeight: 500, 
                  textDecoration: 'none',
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#fff' : 'transparent',
                  color: isActive ? 'var(--stripe-navy)' : 'var(--stripe-label)',
                  boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Render the specific tab below */}
      <div>
        {children}
      </div>

    </div>
  );
}
