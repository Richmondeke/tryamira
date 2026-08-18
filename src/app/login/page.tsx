'use client';

import { useState, useEffect } from 'react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { login } from '../actions/auth';
import Toast from '@/components/ui/Toast';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const msg = params.get('message');
      if (msg) {
        setToast({ message: decodeURIComponent(msg), type: 'success' });
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    if (email && typeof window !== 'undefined') {
      document.cookie = `amira_user_email=${encodeURIComponent(email)}; path=/; max-age=2592000`;
      localStorage.setItem('amira_demo_mode', 'false');
    }

    const result = await login(formData);

    if (result?.error) {
      setToast({ message: result.error, type: 'error' });
      setLoading(false);
    } else {
      setToast({ message: 'Login successful!', type: 'success' });
      // Small delay to show the toast
      setTimeout(() => {
        router.push('/dashboard/v3');
      }, 1000);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setToast({ message: 'Signing in with Google...', type: 'success' });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isRealSupabase = !!supabaseUrl;

    if (isRealSupabase) {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (!error) return;
      } catch (err) {
        console.warn('OAuth attempt failed:', err);
      }
    }

    // Seamless instant login fallback for dev/demo mode
    if (typeof window !== 'undefined') {
      document.cookie = 'amira_demo_user=true; path=/; max-age=2592000';
    }
    setTimeout(() => {
      router.push('/dashboard/v3');
    }, 600);
  };

  return (
    <AuthLayout>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className={styles.header} style={{ marginBottom: '1.5rem' }}>
        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>Sign in to your Amira agent dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
        <Input label="Password" name="password" type="password" placeholder="••••••••" required />
        <Button type="submit" fullWidth size="lg" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      
      <div className={styles.links}>
        <Link href="#" className={styles.link}>Forgot password?</Link>
        <span className={styles.divider}>·</span>
        <Link href="/signup" className={styles.link}>Create account</Link>
      </div>
    </AuthLayout>
  );
}
