import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getWorkspaceWorkflows, saveWorkflowRecipe, toggleWorkflowStatus, deleteWorkflowRecipe } from '@/app/actions/workflows';

vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'usr-123' } }, error: null }),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        })),
      })),
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  })),
}));

describe('src/app/actions/workflows.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches workflows list', async () => {
    const res = await getWorkspaceWorkflows();
    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('creates a new automated workflow recipe', async () => {
    const res = await saveWorkflowRecipe({
      title: 'Inbound Call Lead Qualification',
      triggerEvent: 'call_completed',
      agentId: 'agent-123',
      agentName: 'Amira Qualifier',
      useKnowledgeBase: true,
      intentCondition: 'all',
      actionType: 'auto_reply',
      status: 'active',
    });
    expect(res.success).toBe(true);
    expect(res.data?.title).toBe('Inbound Call Lead Qualification');
  });

  it('toggles workflow active status', async () => {
    const res = await toggleWorkflowStatus('wf-default-1');
    expect(res.success).toBe(true);
  });

  it('deletes a workflow recipe', async () => {
    const res = await deleteWorkflowRecipe('wf-default-1');
    expect(res.success).toBe(true);
  });
});
