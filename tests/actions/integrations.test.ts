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

  it('returns curated Sales, CRM & Lead Management integrations when fallback is active', async () => {
    delete process.env.COMPOSIO_API_KEY;
    const res = await getComposioApps();
    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
    
    // Asserts sales & CRM tools are included
    expect(res.data.some((app: any) => app.id === 'hubspot')).toBe(true);
    expect(res.data.some((app: any) => app.id === 'salesforce')).toBe(true);
    expect(res.data.some((app: any) => app.id === 'apollo')).toBe(true);
    expect(res.data.some((app: any) => app.id === 'googlesheets')).toBe(true);
    expect(res.data.some((app: any) => app.id === 'calendly')).toBe(true);
    expect(res.data.some((app: any) => app.id === 'zendesk')).toBe(true);

    // Asserts dev noise is excluded
    expect(res.data.some((app: any) => app.id === 'github')).toBe(false);
    expect(res.data.some((app: any) => app.id === 'docker')).toBe(false);
    expect(res.data.some((app: any) => app.id === 'kubernetes')).toBe(false);
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
