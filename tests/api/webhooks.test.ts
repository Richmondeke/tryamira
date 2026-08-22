import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/webhooks/korapay/route';
import crypto from 'crypto';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: { user_id: 'usr-123', type: 'subscription', plan: 'pro', amount: 45000 },
              error: null,
            }),
          })),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { call_credits: 10 }, error: null }),
        })),
      })),
    })),
  })),
}));

describe('POST /api/webhooks/korapay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.KORAPAY_SECRET_KEY = 'test_secret_key';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock_service_key';
  });

  it('rejects payload with invalid HMAC signature', async () => {
    const rawBody = JSON.stringify({ event: 'charge.success', data: { reference: 'plan_pro_usr_1' } });
    const req = new Request('https://heyamira.com/api/webhooks/korapay', {
      method: 'POST',
      headers: {
        'x-korapay-signature': 'invalid_signature_hash',
      },
      body: rawBody,
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('processes valid charge.success event and updates invoice', async () => {
    const rawBody = JSON.stringify({
      event: 'charge.success',
      data: {
        reference: 'plan_pro_usr-123_1700000000000',
        amount: 45000,
        currency: 'NGN',
      },
    });

    const signature = crypto
      .createHmac('sha256', 'test_secret_key')
      .update(rawBody)
      .digest('hex');

    const req = new Request('https://heyamira.com/api/webhooks/korapay', {
      method: 'POST',
      headers: {
        'x-korapay-signature': signature,
      },
      body: rawBody,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe(true);
  });
});
