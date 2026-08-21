import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateInboundAgent, getElevenLabsVoices, syncVapiRAG } from '@/app/actions/vapi';

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
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: 'vec-123' }, error: null }),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })),
    })),
  })),
}));

describe('src/app/actions/vapi.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns false when VAPI_PRIVATE_API_KEY is not configured', async () => {
    delete process.env.VAPI_PRIVATE_API_KEY;
    const res = await updateInboundAgent('ast-123', 'rachel', 'Hello prompt', 'Welcome', 'en');
    expect(res.success).toBe(false);
    expect(res.error).toContain('Vapi is not configured');
  });

  it('handles ElevenLabs dynamic voices fallback gracefully when key is missing', async () => {
    delete process.env.ELEVEN_LABS_API_KEY;
    delete process.env.ELEVENLABS_API_KEY;
    const res = await getElevenLabsVoices();
    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('handles RAG knowledge base synchronization', async () => {
    process.env.VAPI_PRIVATE_API_KEY = 'mock_vapi_key';
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'file-123', name: 'KnowledgeDoc.pdf' }),
    } as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'kb-123', name: 'KnowledgeDoc KB' }),
    } as any);

    const res = await syncVapiRAG('Support FAQ content', 'KnowledgeDoc.pdf', 'ast-123');
    expect(res.success).toBe(true);
    expect(res.vapiKbId).toBe('kb-123');
  });
});
