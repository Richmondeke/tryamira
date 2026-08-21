import { describe, it, expect } from 'vitest';
import { GET, POST } from '@/app/api/admin/leads/source/route';
import { NextRequest } from 'next/server';

describe('GET /api/admin/leads/source', () => {
  it('returns pipeline status and available niches', async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.actorId).toBe('IoSHqwTR9YGhzccez');
    expect(Array.isArray(json.availableNiches)).toBe(true);
    expect(json.availableNiches.length).toBeGreaterThan(0);
  });
});

describe('POST /api/admin/leads/source', () => {
  it('triggers actor sourcing simulation or live fetch successfully', async () => {
    const req = new NextRequest('https://heyamira.com/api/admin/leads/source', {
      method: 'POST',
      body: JSON.stringify({ niche: 'healthcare', count: 5 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.leads)).toBe(true);
    expect(json.leads.length).toBeGreaterThan(0);
    expect(json.leads[0].score).toBeGreaterThanOrEqual(80);
  });
});
