'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Inbox', href: '/dashboard/chat/inbox' },
    { name: 'WhatsApp', href: '/dashboard/chat/whatsapp' },
    { name: 'Webchat', href: '/dashboard/chat/webchat' },
    { name: 'Email Agent', href: '/dashboard/chat/email' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header & Tab Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>Omnichannel Hub</h1>
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>Manage all your conversational channels in one place.</p>
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

      {/* Render the specific channel page below */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {children}
      </div>

    </div>
  );
}
