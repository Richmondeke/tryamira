import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/v1/chat/route';
import { NextRequest } from 'next/server';

describe('/api/v1/chat API route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects empty message with 400', async () => {
    const req = new NextRequest('https://heyamira.com/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify({ message: '' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Message is required');
  });

  it('responds with fallback platform knowledge when no external model key is configured', async () => {
    const req = new NextRequest('https://heyamira.com/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'What countries can Amira call?' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('success');
    expect(json.reply).toContain('100+ countries');
  });

  it('responds accurately to pricing questions', async () => {
    const req = new NextRequest('https://heyamira.com/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'How much does your Pro plan cost?' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('success');
    expect(json.reply).toContain('Pro Plan');
  });

  it('responds accurately to agent creation questions', async () => {
    const req = new NextRequest('https://heyamira.com/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'How do I create a new voice agent?' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('success');
    expect(json.reply).toContain('/dashboard/v3/agents');
  });
});
