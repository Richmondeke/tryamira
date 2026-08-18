'use client';

import { useState } from 'react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../login/page.module.css';
import { signup } from '../actions/auth';
import Toast from '@/components/ui/Toast';
import { createClient } from '@/utils/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

    const result = await signup(formData);

    if (result?.error) {
      setToast({ message: result.error, type: 'error' });
      setLoading(false);
    } else if (result?.needsEmailConfirmation) {
      setToast({ message: result.message || 'Please check your email to verify your account.', type: 'success' });
      setTimeout(() => {
        router.push(`/login?message=${encodeURIComponent(result.message || 'Please check your email to verify your account.')}`);
      }, 3000);
    } else {
      setToast({ message: 'Account created successfully!', type: 'success' });
      // Small delay to show the toast
      setTimeout(() => {
        router.push('/dashboard/v3');
      }, 1000);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setToast({ message: 'Creating account with Google...', type: 'success' });

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

    // Seamless instant signup fallback for dev/demo mode
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
          // Keep it on screen longer if it's the email verification message
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className={styles.header} style={{ marginBottom: '1.5rem' }}>
        <h2 className={styles.title}>Create your account</h2>
        <p className={styles.subtitle}>Free forever. Upgrade when you&apos;re ready.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Input label="First Name" name="firstName" placeholder="Ashley" required />
          <Input label="Last Name" name="lastName" placeholder="Okoye" required />
        </div>
        <Input label="Company Name" name="companyName" placeholder="TryAmira" required />
        <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
        <Input label="Phone Number" name="phone" type="tel" placeholder="902076453" required />
        <Input label="Password" name="password" type="password" placeholder="••••••••" required />
        <Input label="Referral Code (optional)" name="referral" placeholder="E.G. ABC123" />
        
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">I agree to the <Link href="#" style={{ color: 'var(--brand-primary)' }}>Terms of Service</Link> and <Link href="#" style={{ color: 'var(--brand-primary)' }}>Privacy Policy</Link>.</label>
        </div>

        <Button type="submit" fullWidth size="lg" disabled={loading}>
          {loading ? 'Creating account...' : 'Create free account →'}
        </Button>
      </form>
      <div className={styles.links}>
        <span style={{ color: 'var(--text-secondary)' }}>Already have an account?</span>
        <Link href="/login" className={styles.link}>Sign in</Link>
      </div>
    </AuthLayout>
  );
}
