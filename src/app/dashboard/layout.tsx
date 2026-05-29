import { DashboardLayout } from '@/components/layout/DashboardLayout';
import OnboardingModal from '@/components/ui/OnboardingModal';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <OnboardingModal />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--stripe-bg)' }}>
        {/* Main Content */}
        <main style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', backgroundColor: 'var(--stripe-bg)', color: 'var(--stripe-body)', fontFeatureSettings: '"ss01"' }}>
          {children}
        </main>
      </div>
    </DashboardLayout>
  );
}
