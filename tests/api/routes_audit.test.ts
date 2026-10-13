import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getCalls, POST as postCalls } from '@/app/api/v1/calls/route';
import { GET as getAssistant, PATCH as patchAssistant, DELETE as deleteAssistant } from '@/app/api/v1/assistants/[id]/route';
import { POST as postFile } from '@/app/api/v1/files/route';
import { GET as getBroadcast, POST as postBroadcast } from '@/app/api/notifications/broadcast/route';
import { POST as postVapiWebhook } from '@/app/api/vapi/webhook/route';
import { POST as postVapiTool } from '@/app/api/vapi/tool/route';

describe('Platform API Endpoints Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.VAPI_PRIVATE_API_KEY = 'mock_vapi_private_key';
  });

  describe('/api/v1/calls', () => {
    it('rejects unauthenticated GET requests', async () => {
      const req = new NextRequest('https://heyamira.com/api/v1/calls');
      const res = await getCalls(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('returns calls list with valid bearer token', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 'call_1', status: 'completed' }],
      } as any);

      const req = new NextRequest('https://heyamira.com/api/v1/calls', {
        headers: { authorization: 'Bearer test_api_token' },
      });
      const res = await getCalls(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.count).toBe(1);
    });

    it('validates required fields on outbound call dispatch', async () => {
      const req = new NextRequest('https://heyamira.com/api/v1/calls', {
        method: 'POST',
        headers: { authorization: 'Bearer test_api_token' },
        body: JSON.stringify({ customerNumber: '+1234567890' }), // missing assistantId
      });
      const res = await postCalls(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('successfully dispatches outbound voice call', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'call_99', status: 'queued', customer: { number: '+1234567890' } }),
      } as any);

      const req = new NextRequest('https://heyamira.com/api/v1/calls', {
        method: 'POST',
        headers: { authorization: 'Bearer test_api_token' },
        body: JSON.stringify({
          assistantId: 'asst_123',
          customerNumber: '+1234567890',
          customerName: 'Sarah Connor',
        }),
      });
      const res = await postCalls(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.id).toBe('call_99');
    });
  });

  describe('/api/v1/assistants/[id]', () => {
    it('rejects unauthenticated requests', async () => {
      const req = new NextRequest('https://heyamira.com/api/v1/assistants/ast_1');
      const res = await getAssistant(req, { params: Promise.resolve({ id: 'ast_1' }) });
      expect(res.status).toBe(401);
    });

    it('fetches assistant details by id', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'ast_1', name: 'Front Desk AI' }),
      } as any);

      const req = new NextRequest('https://heyamira.com/api/v1/assistants/ast_1', {
        headers: { authorization: 'Bearer test_api_token' },
      });
      const res = await getAssistant(req, { params: Promise.resolve({ id: 'ast_1' }) });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.name).toBe('Front Desk AI');
    });

    it('updates assistant parameters via PATCH', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'ast_1', name: 'Updated Desk AI' }),
      } as any);

      const req = new NextRequest('https://heyamira.com/api/v1/assistants/ast_1', {
        method: 'PATCH',
        headers: { authorization: 'Bearer test_api_token' },
        body: JSON.stringify({ name: 'Updated Desk AI' }),
      });
      const res = await patchAssistant(req, { params: Promise.resolve({ id: 'ast_1' }) });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });

    it('deletes assistant via DELETE', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: async () => '',
      } as any);

      const req = new NextRequest('https://heyamira.com/api/v1/assistants/ast_1', {
        method: 'DELETE',
        headers: { authorization: 'Bearer test_api_token' },
      });
      const res = await deleteAssistant(req, { params: Promise.resolve({ id: 'ast_1' }) });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });

  describe('/api/v1/files', () => {
    it('rejects unauthenticated requests', async () => {
      const req = new NextRequest('https://heyamira.com/api/v1/files', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: 'KB', content: 'Doc' }),
      });
      const res = await postFile(req);
      expect(res.status).toBe(401);
    });

    it('validates missing title or content in JSON upload', async () => {
      const req = new NextRequest('https://heyamira.com/api/v1/files', {
        method: 'POST',
        headers: {
          authorization: 'Bearer test_api_token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ title: 'Only Title' }),
      });
      const res = await postFile(req);
      expect(res.status).toBe(400);
    });
  });

  describe('/api/notifications/broadcast', () => {
    it('returns status ready on GET', async () => {
      const res = await getBroadcast();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.status).toBe('ready');
    });
  });

  describe('/api/vapi/webhook', () => {
    it('gracefully handles webhooks even without Supabase config', async () => {
      const req = new NextRequest('https://heyamira.com/api/vapi/webhook', {
        method: 'POST',
        body: JSON.stringify({
          message: {
            type: 'call-started',
            call: { id: 'call_abc', customer: { number: '+1234' } },
          },
        }),
      });
      const res = await postVapiWebhook(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ok).toBe(true);
    });
  });

  describe('/api/vapi/tool', () => {
    it('returns graceful fallback when Composio key is unconfigured', async () => {
      delete process.env.COMPOSIO_API_KEY;

      const req = new NextRequest('https://heyamira.com/api/vapi/tool', {
        method: 'POST',
        body: JSON.stringify({
          message: {
            type: 'tool-calls',
            toolCalls: [
              { id: 'tool_1', function: { name: 'send_email', arguments: { to: 'a@b.com' } } },
            ],
          },
        }),
      });
      const res = await postVapiTool(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.results).toBeDefined();
      expect(json.results[0].toolCallId).toBe('tool_1');
      expect(json.results[0].result).toContain('Amira Dashboard');
    });
  });
});
