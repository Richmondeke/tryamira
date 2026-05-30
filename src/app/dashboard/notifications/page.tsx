'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectNotificationsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/account?tab=notifications');
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--stripe-navy)', fontSize: '13px' }}>
      Loading notification preferences...
    </div>
  );
}
