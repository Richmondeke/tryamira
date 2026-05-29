import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import styles from './page.module.css';
import { login } from '../actions/auth';

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className={styles.header}>
        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>Sign in to your agent dashboard</p>
      </div>
      <form action={login} className={styles.form}>
        <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
        <Input label="Password" name="password" type="password" placeholder="••••••••" required />
        <Button type="submit" fullWidth size="lg">Sign In</Button>
      </form>
      <div className={styles.links}>
        <Link href="#" className={styles.link}>Forgot password?</Link>
        <span className={styles.divider}>·</span>
        <Link href="/signup" className={styles.link}>Create account</Link>
      </div>
    </AuthLayout>
  );
}
