'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OverviewPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/v3');
  }, [router]);

  return (
    <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>
      Redirecting to Amira 3.0 Command Center...
    </div>
  );
}
