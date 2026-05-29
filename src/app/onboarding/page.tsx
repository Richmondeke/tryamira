import { completeOnboarding } from '../actions/onboarding';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function OnboardingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '2rem' }}>
      <div style={{ maxWidth: '480px', width: '100%', backgroundColor: '#ffffff', borderRadius: '12px', padding: '3rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(83,58,253,0.1)', color: 'var(--stripe-purple)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 1.5rem auto' }}>
            🚀
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Welcome to Amira</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>Let's get your AI workspace set up. This only takes a minute.</p>
        </div>

        <form action={completeOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input label="Company Name" name="companyName" placeholder="Acme Inc." required />
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>Industry</label>
            <select name="industry" required style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#fff', color: '#334155' }}>
              <option value="">Select an industry...</option>
              <option value="real_estate">Real Estate</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="healthcare">Healthcare</option>
              <option value="saas">SaaS / Software</option>
              <option value="agency">Agency / Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#334155', fontWeight: 500, marginBottom: '6px' }}>Primary Use Case</label>
            <select name="useCase" required style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#fff', color: '#334155' }}>
              <option value="">What do you want Amira to do?</option>
              <option value="inbound">Inbound Customer Support</option>
              <option value="outbound">Outbound Lead Generation</option>
              <option value="booking">Appointment Booking</option>
              <option value="internal">Internal Team Assistant</option>
            </select>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Button type="submit" fullWidth size="lg">Complete Setup →</Button>
          </div>
        </form>

      </div>
    </div>
  );
}
