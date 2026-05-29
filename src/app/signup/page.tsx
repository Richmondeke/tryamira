import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import styles from '../login/page.module.css';

export default function SignupPage() {
  return (
    <AuthLayout>
      <div className={styles.header}>
        <h2 className={styles.title}>Create your account</h2>
        <p className={styles.subtitle}>Free forever. Upgrade when you&apos;re ready.</p>
      </div>
      <form className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Input label="First Name" placeholder="Ashley" required />
          <Input label="Last Name" placeholder="Okoye" required />
        </div>
        <Input label="Company Name" placeholder="TryAmira" required />
        <Input label="Email" type="email" placeholder="you@example.com" required />
        <Input label="Phone Number" type="tel" placeholder="902076453" required />
        <Input label="Password" type="password" placeholder="••••••••" required />
        <Input label="Referral Code (optional)" placeholder="E.G. ABC123" />
        
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">I agree to the <Link href="#" style={{ color: 'var(--brand-primary)' }}>Terms of Service</Link> and <Link href="#" style={{ color: 'var(--brand-primary)' }}>Privacy Policy</Link>.</label>
        </div>

        <Button type="submit" fullWidth size="lg">Create free account →</Button>
      </form>
      <div className={styles.links}>
        <span style={{ color: 'var(--text-secondary)' }}>Already have an account?</span>
        <Link href="/login" className={styles.link}>Sign in</Link>
      </div>
    </AuthLayout>
  );
}
