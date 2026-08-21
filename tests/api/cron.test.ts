import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/cron/keep-active/route';
import { NextRequest } from 'next/server';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        or: vi.fn().mockResolvedValue({ data: [{ email: 'admin@example.com' }], error: null }),
        gte: vi.fn().mockResolvedValue({ data: [], error: null, count: 5 }),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
      upsert: vi.fn().mockResolvedValue({ error: null }),
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
    auth: {
      admin: {
        listUsers: vi.fn().mockResolvedValue({ data: { users: [] }, error: null }),
      },
    },
  })),
}));

describe('GET /api/cron/keep-active', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = 'test_cron_secret';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock_service_key';
    delete process.env.RESEND_API_KEY;
  });

  it('rejects unauthorized requests in production when secret is wrong', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const req = new NextRequest('https://heyamira.com/api/cron/keep-active', {
      headers: { authorization: 'Bearer wrong_token' },
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('authorizes and executes keep-alive queries with correct secret', async () => {
    const req = new NextRequest('https://heyamira.com/api/cron/keep-active?secret=test_cron_secret');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.databaseKeepAlive).toBe('active_read_write_succeeded');
    expect(json.metrics).toBeDefined();
  });
});
