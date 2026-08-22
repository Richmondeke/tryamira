import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/v1/assistants/route';
import { NextRequest } from 'next/server';

describe('/api/v1/assistants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.VAPI_PRIVATE_API_KEY = 'mock_vapi_private_key';
  });

  it('rejects unauthenticated requests without Bearer header', async () => {
    const req = new NextRequest('https://heyamira.com/api/v1/assistants');
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('lists assistants when valid authorization is provided', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 'ast-1', name: 'Support Rep' }],
    } as any);

    const req = new NextRequest('https://heyamira.com/api/v1/assistants', {
      headers: { authorization: 'Bearer test_api_token' },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.count).toBe(1);
    expect(json.data[0].id).toBe('ast-1');
  });

  it('creates an assistant via POST successfully', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'ast-new-123', name: 'Custom Booking AI' }),
    } as any);

    const req = new NextRequest('https://heyamira.com/api/v1/assistants', {
      method: 'POST',
      headers: { authorization: 'Bearer test_api_token' },
      body: JSON.stringify({
        name: 'Custom Booking AI',
        firstMessage: 'Welcome to Apex MedSpa',
        systemPrompt: 'You are booking appointments.',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.id).toBe('ast-new-123');
  });
});
