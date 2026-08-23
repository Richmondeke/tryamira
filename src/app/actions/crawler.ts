'use server';

import { syncVapiRAG } from './vapi';

export interface CrawledPage {
  url: string;
  title: string;
  text: string;
  markdown?: string;
  crawlDepth?: number;
}

export interface CrawlWebsiteResult {
  success: boolean;
  pagesCrawled: number;
  vapiKbId?: string;
  vapiFileId?: string;
  pages: { url: string; title: string; length: number }[];
  error?: string;
  combinedTextLength: number;
}

/**
 * Crawls a website using Apify's Website Content Crawler (apify/website-content-crawler, ID: aYG0l9s7dbB7j3gbS)
 * and automatically synchronizes the extracted content into Vapi RAG and pgvector knowledge base.
 */
export async function crawlAndTrainFromWebsite(
  targetUrl: string,
  maxCrawlPages: number = 5,
  assistantId?: string
): Promise<CrawlWebsiteResult> {
  if (!targetUrl || !targetUrl.trim()) {
    return {
      success: false,
      pagesCrawled: 0,
      pages: [],
      error: 'Please provide a valid website URL.',
      combinedTextLength: 0,
    };
  }

  // Ensure URL has protocol
  let normalizedUrl = targetUrl.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    new URL(normalizedUrl);
  } catch {
    return {
      success: false,
      pagesCrawled: 0,
      pages: [],
      error: 'Invalid website URL format.',
      combinedTextLength: 0,
    };
  }

  const apifyApiKey = process.env.APIFY_API_KEY;
  const ACTOR_ID = process.env.APIFY_CRAWLER_ACTOR_ID || 'aYG0l9s7dbB7j3gbS'; // apify/website-content-crawler

  let extractedPages: CrawledPage[] = [];

  // 1. Attempt Apify Actor Execution if configured
  if (apifyApiKey && apifyApiKey !== 'undefined' && apifyApiKey !== 'null' && apifyApiKey.trim() !== '') {
    try {
      console.log(`🌐 [AMIRA CRAWLER] Starting Apify Website Crawler for ${normalizedUrl} (max ${maxCrawlPages} pages)...`);
      
      const runRes = await fetch(`https://api.apify.com/v2/acts/${ACTOR_ID}/runs?waitForFinish=120`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apifyApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startUrls: [{ url: normalizedUrl }],
          maxCrawlPages: Math.min(maxCrawlPages, 10),
          crawlerType: 'cheerio', // Fast lightweight mode for sub-minute RAG ingest
          saveMarkdown: true,
          saveHtml: false,
          saveScreenshots: false,
          removeElementsCssSelector: 'nav, footer, script, style, noscript, svg, .ad, .cookie-banner',
        }),
      });

      if (runRes.ok) {
        const runData = await runRes.json();
        const datasetId = runData.data?.defaultDatasetId;

        if (datasetId) {
          const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?clean=true&limit=${maxCrawlPages}`, {
            headers: { 'Authorization': `Bearer ${apifyApiKey}` },
          });

          if (datasetRes.ok) {
            const items = await datasetRes.json();
            extractedPages = (items || []).map((item: any) => ({
              url: item.url || normalizedUrl,
              title: item.title || item.metadata?.title || 'Website Page',
              text: item.markdown || item.text || '',
              markdown: item.markdown || '',
            })).filter((p: CrawledPage) => p.text.trim().length > 50);
          }
        }
      }
    } catch (apifyErr) {
      console.warn('Apify crawler run notice, falling back to direct web fetch:', apifyErr);
    }
  }

  // 2. Fallback direct web fetcher if Apify is pending or offline
  if (extractedPages.length === 0) {
    try {
      console.log(`🌐 [AMIRA CRAWLER] Using direct web fetcher fallback for ${normalizedUrl}...`);
      const directRes = await fetch(normalizedUrl, {
        headers: { 'User-Agent': 'AmiraBot/1.0 (+https://heyamira.com)' },
      });
      if (directRes.ok) {
        const html = await directRes.text();
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : 'Company Homepage';
        
        // Strip scripts, styles, HTML tags
        const cleanedText = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        extractedPages.push({
          url: normalizedUrl,
          title,
          text: cleanedText.slice(0, 8000),
        });
      }
    } catch (directErr) {
      console.error('Direct fetcher error:', directErr);
    }
  }

  if (extractedPages.length === 0) {
    return {
      success: false,
      pagesCrawled: 0,
      pages: [],
      error: 'Could not extract readable text content from the provided website URL.',
      combinedTextLength: 0,
    };
  }

  // 3. Compile structured knowledge document
  const domainName = new URL(normalizedUrl).hostname.replace('www.', '');
  const combinedMarkdown = `# Knowledge Base for ${domainName}\nSource Website: ${normalizedUrl}\nCrawled At: ${new Date().toISOString()}\n\n` +
    extractedPages
      .map(
        (p, idx) =>
          `## Section ${idx + 1}: ${p.title}\nSource: ${p.url}\n\n${p.text}\n\n---\n`
      )
      .join('\n');

  // 4. Synchronize directly into Vapi RAG & pgvector knowledge store
  const ragTitle = `${domainName}_Knowledge.md`;
  let vapiKbId: string | undefined;
  let vapiFileId: string | undefined;

  try {
    const syncRes = await syncVapiRAG(combinedMarkdown, ragTitle, assistantId || '');
    if (syncRes?.success) {
      vapiKbId = syncRes.vapiKbId;
      vapiFileId = syncRes.vapiFileId;
    }
  } catch (syncErr) {
    console.warn('Vapi RAG sync note:', syncErr);
  }

  return {
    success: true,
    pagesCrawled: extractedPages.length,
    vapiKbId,
    vapiFileId,
    pages: extractedPages.map(p => ({
      url: p.url,
      title: p.title,
      length: p.text.length,
    })),
    combinedTextLength: combinedMarkdown.length,
  };
}
