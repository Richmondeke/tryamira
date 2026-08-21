import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSuggestedWorkflows, getAutonomousInsights } from '@/app/actions/agent';

// Mock integrations actions
vi.mock('@/app/actions/integrations', () => ({
  getComposioStatus: vi.fn(),
  executeComposioAction: vi.fn(),
}));

// Mock Supabase server client
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(() => ({
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

import { getComposioStatus, executeComposioAction } from '@/app/actions/integrations';

describe('src/app/actions/agent.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSuggestedWorkflows()', () => {
    it('returns default workflows when Composio status fails or returns empty', async () => {
      (getComposioStatus as any).mockResolvedValueOnce({
        success: false,
        data: null,
      });

      const result = await getSuggestedWorkflows();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.workflows)).toBe(true);
      expect(result.workflows.length).toBeGreaterThanOrEqual(2);

      // Default activeApps include gmail, googlecalendar, googlesheets
      const workflowIds = result.workflows.map((w: any) => w.id);
      expect(workflowIds).toContain('wf-sheets-gmail');
      expect(workflowIds).toContain('wf-gmail-calendar');
    });

    it('branches correctly when Gmail and Google Sheets are active', async () => {
      (getComposioStatus as any).mockResolvedValueOnce({
        success: true,
        data: [
          { provider: 'gmail', status: 'active' },
          { provider: 'googlesheets', status: 'active' },
        ],
      });

      const result = await getSuggestedWorkflows();
      expect(result.success).toBe(true);
      const workflowIds = result.workflows.map((w: any) => w.id);
      expect(workflowIds).toContain('wf-sheets-gmail');
      expect(workflowIds).not.toContain('wf-hubspot-gmail');
    });

    it('branches correctly when HubSpot and Gmail are active', async () => {
      (getComposioStatus as any).mockResolvedValueOnce({
        success: true,
        data: [
          { provider: 'hubspot', status: 'active' },
          { provider: 'gmail', status: 'active' },
        ],
      });

      const result = await getSuggestedWorkflows();
      expect(result.success).toBe(true);
      const workflowIds = result.workflows.map((w: any) => w.id);
      expect(workflowIds).toContain('wf-hubspot-gmail');
    });

    it('branches correctly when Calendar and Slack are active', async () => {
      (getComposioStatus as any).mockResolvedValueOnce({
        success: true,
        data: [
          { provider: 'googlecalendar', status: 'active' },
          { provider: 'slack', status: 'active' },
        ],
      });

      const result = await getSuggestedWorkflows();
      expect(result.success).toBe(true);
      const workflowIds = result.workflows.map((w: any) => w.id);
      expect(workflowIds).toContain('wf-calendar-slack');
    });

    it('includes doc summary fallback when fewer than 3 workflows are generated', async () => {
      (getComposioStatus as any).mockResolvedValueOnce({
        success: true,
        data: [{ provider: 'slack', status: 'active' }],
      });

      const result = await getSuggestedWorkflows();
      expect(result.success).toBe(true);
      const workflowIds = result.workflows.map((w: any) => w.id);
      expect(workflowIds).toContain('wf-doc-summary');
    });
  });

  describe('getAutonomousInsights()', () => {
    it('returns connect prompt when no email or calendar integrations are connected', async () => {
      (getComposioStatus as any).mockResolvedValueOnce({
        success: true,
        data: [],
      });

      const result = await getAutonomousInsights();
      expect(result.success).toBe(true);
      expect(result.insights.length).toBeGreaterThan(0);
      expect(result.insights[0].id).toBe('ins-gen-1');
      expect(result.insights[0].actionType).toBe('connect');
    });

    it('processes Gmail emails and returns prioritized insights', async () => {
      (getComposioStatus as any).mockResolvedValueOnce({
        success: true,
        data: [{ provider: 'gmail', status: 'active' }],
      });

      (executeComposioAction as any).mockResolvedValueOnce({
        success: true,
        data: {
          messages: [
            {
              messageId: 'msg-99',
              sender: 'Sarah Partner <sarah@partnercorp.com>',
              subject: 'Urgent: Strategy Sync & Meet link',
              snippet: 'Here is the google meet link for our sync: https://meet.google.com/abc-def-ghi',
            },
          ],
        },
      });

      const result = await getAutonomousInsights();
      expect(result.success).toBe(true);
      expect(result.insights.length).toBeGreaterThan(0);
      const insight = result.insights[0];
      expect(insight.actionType).toBe('join_call');
      expect(insight.urgent).toBe(true);
    });

    it('handles Google Calendar integration insights', async () => {
      (getComposioStatus as any).mockResolvedValueOnce({
        success: true,
        data: [{ provider: 'googlecalendar', status: 'active' }],
      });

      (executeComposioAction as any).mockResolvedValueOnce({
        success: true,
        data: {
          calendar_data: {
            id: 'primary',
            timeZone: 'America/New_York',
          },
        },
      });

      const result = await getAutonomousInsights();
      expect(result.success).toBe(true);
      expect(result.insights.some((i: any) => i.id === 'ins-cal-live-1')).toBe(true);
    });
  });
});
