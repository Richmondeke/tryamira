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
    const result = await signup(formData);

    if (result?.error) {
      setToast({ message: result.error, type: 'error' });
      setLoading(false);
    } else {
      setToast({ message: 'Account created successfully!', type: 'success' });
      // Small delay to show the toast
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
  };

  const handleGoogleSignup = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setToast({ message: error.message, type: 'error' });
    }
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
      
      <div className={styles.header}>
        <h2 className={styles.title}>Create your account</h2>
        <p className={styles.subtitle}>Free forever. Upgrade when you&apos;re ready.</p>
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        fullWidth 
        onClick={handleGoogleSignup}
        style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign up with Google
      </Button>

      <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }}></div>
        <span style={{ padding: '0 1rem' }}>Or continue with email</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }}></div>
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
