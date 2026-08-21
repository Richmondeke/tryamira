import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getComposioStatus, getComposioApps, initiateComposioConnection } from '@/app/actions/integrations';

vi.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
}));

vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'usr-123' } }, error: null }),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          limit: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: { workspace_id: 'ws-123' }, error: null }),
          })),
        })),
      })),
    })),
  })),
}));

describe('src/app/actions/integrations.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns fallback mock integrations when COMPOSIO_API_KEY is not set', async () => {
    delete process.env.COMPOSIO_API_KEY;
    const res = await getComposioApps();
    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThanOrEqual(10);
    expect(res.data.some((app: any) => app.id === 'gmail')).toBe(true);
  });

  it('returns structured connection status for active integrations', async () => {
    delete process.env.COMPOSIO_API_KEY;
    const res = await getComposioStatus();
    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('initiates OAuth redirect connection flow gracefully', async () => {
    delete process.env.COMPOSIO_API_KEY;
    const res = await initiateComposioConnection('gmail');
    expect(res.success).toBe(true);
    expect(res.redirectUrl).toBeTruthy();
  });
});
