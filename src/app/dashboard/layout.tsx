import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--stripe-bg)' }}>
        {/* Topbar */}
        <header style={{ 
          height: '64px', 
          borderBottom: '1px solid var(--stripe-border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          padding: '0 2rem',
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--stripe-navy)', fontSize: '12px', fontWeight: 500, fontFeatureSettings: '"ss01"' }}>ashley@amira.com</span>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--stripe-purple)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px'
            }}>
              A
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', backgroundColor: 'var(--stripe-bg)', color: 'var(--stripe-body)', fontFeatureSettings: '"ss01"' }}>
          {children}
        </main>
      </div>
    </DashboardLayout>
  );
}
