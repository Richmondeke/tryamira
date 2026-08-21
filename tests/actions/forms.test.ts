import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getForms, getFormById, submitFormAnswer, incrementFormViews } from '@/app/actions/forms';

vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'usr-123' } }, error: null }),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({ data: [{ id: 'form-1', name: 'Contact Form' }], error: null }),
          single: vi.fn().mockResolvedValue({ data: { id: '00000000-0000-0000-0000-000000000001', name: 'Real Estate Form' }, error: null }),
          limit: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: { workspace_id: 'ws-123' }, error: null }),
          })),
        })),
        limit: vi.fn().mockResolvedValue({ data: [{ id: 'ws-123' }], error: null }),
      })),
      insert: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })),
    })),
  })),
}));

describe('src/app/actions/forms.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves forms for authenticated workspace', async () => {
    const res = await getForms();
    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('handles mock and demo form lookups gracefully', async () => {
    const res = await getFormById('demo');
    expect(res.success).toBe(true);
    expect(res.data.name).toBeTruthy();
  });

  it('increments form views without throwing', async () => {
    const res = await incrementFormViews('form-mock-1');
    expect(res.success).toBe(true);
  });

  it('submits form answers successfully', async () => {
    const res = await submitFormAnswer('form-mock-1', {
      firstName: 'Jane',
      email: 'jane@example.com',
      phone: '+1234567890',
    });
    expect(res.success).toBe(true);
  });
});
