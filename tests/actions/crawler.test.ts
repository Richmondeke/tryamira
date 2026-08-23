import { describe, it, expect, vi, beforeEach } from 'vitest';
import { crawlAndTrainFromWebsite } from '@/app/actions/crawler';

vi.mock('@/app/actions/vapi', () => ({
  syncVapiRAG: vi.fn().mockResolvedValue({
    success: true,
    vapiKbId: 'kb-crawled-123',
    vapiFileId: 'file-crawled-456',
  }),
}));

describe('src/app/actions/crawler.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.APIFY_API_KEY = 'test_apify_key';
  });

  it('rejects empty or invalid website URLs', async () => {
    const res = await crawlAndTrainFromWebsite('');
    expect(res.success).toBe(false);
    expect(res.error).toBe('Please provide a valid website URL.');
  });

  it('crawls website via Apify Actor and compiles knowledge base', async () => {
    // 1. Mock Apify Actor Run initiation
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { defaultDatasetId: 'dataset-123' } }),
      } as any)
      // 2. Mock Apify Dataset Items fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            url: 'https://apexmedspas.com/pricing',
            title: 'Pricing & Treatment Menu',
            markdown: 'Botox is $12/unit. Laser resurfacing is $450/session.',
          },
          {
            url: 'https://apexmedspas.com/faq',
            title: 'Frequently Asked Questions',
            markdown: 'Appointments can be booked 24/7 online or over the phone.',
          },
        ],
      } as any);

    const res = await crawlAndTrainFromWebsite('https://apexmedspas.com', 5, 'ast-123');
    expect(res.success).toBe(true);
    expect(res.pagesCrawled).toBe(2);
    expect(res.vapiKbId).toBe('kb-crawled-123');
    expect(res.pages.length).toBe(2);
    expect(res.pages[0].title).toBe('Pricing & Treatment Menu');
  });

  it('falls back to direct web fetch when Apify is unavailable', async () => {
    process.env.APIFY_API_KEY = '';

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      text: async () => `
        <html>
          <head><title>Acme Plumbing Services</title></head>
          <body>
            <h1>Emergency 24/7 Plumbing</h1>
            <p>Call us anytime for pipe leak repairs, drain cleaning, and boiler installations.</p>
          </body>
        </html>
      `,
    } as any);

    const res = await crawlAndTrainFromWebsite('acmeplumbing.com', 3);
    expect(res.success).toBe(true);
    expect(res.pagesCrawled).toBe(1);
    expect(res.pages[0].title).toBe('Acme Plumbing Services');
  });
});
