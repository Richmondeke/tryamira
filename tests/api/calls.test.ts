import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/v1/calls/route';
import { NextRequest } from 'next/server';

describe('/api/v1/calls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.VAPI_PRIVATE_API_KEY = 'mock_vapi_private_key';
    process.env.NEXT_PUBLIC_VAPI_PHONE_NUMBER_ID = 'mock_phone_num_id';
  });

  it('rejects unauthorized requests', async () => {
    const req = new NextRequest('https://heyamira.com/api/v1/calls');
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('fetches call logs when authenticated', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 'call-101', status: 'ended', durationMinutes: 2.5 }],
    } as any);

    const req = new NextRequest('https://heyamira.com/api/v1/calls', {
      headers: { authorization: 'Bearer test_api_token' },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.count).toBe(1);
    expect(json.data[0].id).toBe('call-101');
  });

  it('dispatches outbound call successfully via POST', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'call-dispatch-999', status: 'queued' }),
    } as any);

    const req = new NextRequest('https://heyamira.com/api/v1/calls', {
      method: 'POST',
      headers: { authorization: 'Bearer test_api_token' },
      body: JSON.stringify({
        customerNumber: '+14155552671',
        customerName: 'Marcus Vance',
        assistantId: 'ast-123',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.id).toBe('call-dispatch-999');
  });
});
