import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PLANS, createPlanCheckout, createTopupCheckout } from '@/app/actions/billing';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { call_credits: 50, plan: 'pro' }, error: null }),
        })),
      })),
    })),
  })),
}));

describe('src/app/actions/billing.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.KORAPAY_SECRET_KEY = 'sk_test_mock_korapay';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock_secret_key';
  });

  it('defines structured plan amounts in NGN and USD', () => {
    expect(PLANS.pro.amountUSD).toBe(49);
    expect(PLANS.team.amountUSD).toBe(149);
    expect(PLANS.enterprise.amountUSD).toBe(499);
    expect(PLANS.pro.amountNGN).toBeGreaterThan(0);
  });

  it('initiates Korapay plan subscription checkout', async () => {
    const mockCheckoutUrl = 'https://checkout.korapay.com/pay/mock_ref_123';
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: true,
        data: {
          checkout_url: mockCheckoutUrl,
          reference: 'plan_pro_user_123',
        },
      }),
    } as any);

    const res = await createPlanCheckout('pro', 'richmond@example.com', 'usr-12345');
    expect(res.url).toBe(mockCheckoutUrl);
  });

  it('initiates Korapay credit top-up checkout', async () => {
    const mockTopupUrl = 'https://checkout.korapay.com/pay/mock_topup_456';
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: true,
        data: {
          checkout_url: mockTopupUrl,
          reference: 'topup_5000_user_123',
        },
      }),
    } as any);

    const res = await createTopupCheckout(5000, 'richmond@example.com', 'usr-12345');
    expect(res.url).toBe(mockTopupUrl);
  });
});
