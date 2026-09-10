'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function MobileAppRouter() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function routeMobileSession() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Returning user with active session -> direct to dashboard
          router.replace('/dashboard/v3');
        } else {
          // Unauthenticated mobile user -> direct to login
          router.replace('/login?source=mobile_app');
        }
      } catch (err) {
        console.warn('Session check fallback:', err);
        router.replace('/login?source=mobile_app');
      } finally {
        setChecking(false);
      }
    }

    routeMobileSession();
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#061b31',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Brand Icon with Glow */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 24,
        background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)',
        marginBottom: 28,
        animation: 'pulse 2s infinite'
      }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="22"></line>
        </svg>
      </div>

      {/* Loading Shimmer Skeleton */}
      <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 140,
          height: 18,
          borderRadius: 8,
          background: 'linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite linear'
        }} />
        <div style={{
          width: 220,
          height: 12,
          borderRadius: 6,
          background: 'linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite linear'
        }} />
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.85; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
