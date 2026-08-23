'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { crawlAndTrainFromWebsite, CrawlWebsiteResult } from '@/app/actions/crawler';

export interface WebsiteCrawlerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: CrawlWebsiteResult, domain: string) => void;
  assistantId?: string;
}

export function WebsiteCrawlerModal({
  isOpen,
  onClose,
  onSuccess,
  assistantId,
}: WebsiteCrawlerModalProps) {
  const [url, setUrl] = useState('');
  const [maxPages, setMaxPages] = useState(5);
  const [loading, setLoading] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setCrawlProgress('Initializing Apify Website Content Crawler...');

    const timer1 = setTimeout(() => setCrawlProgress('Extracting and cleaning website text to Markdown...'), 2500);
    const timer2 = setTimeout(() => setCrawlProgress('Vectorizing embeddings and synchronizing with Vapi RAG...'), 5500);

    try {
      const res = await crawlAndTrainFromWebsite(url, maxPages, assistantId);
      clearTimeout(timer1);
      clearTimeout(timer2);

      if (res.success) {
        let domain = url;
        try {
          domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '');
        } catch {}
        onSuccess(res, domain);
        onClose();
      } else {
        setError(res.error || 'Failed to crawl website. Please check the URL.');
      }
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setError(err?.message || 'Unexpected crawling error.');
    } finally {
      setLoading(false);
      setCrawlProgress(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => !loading && onClose()} title="Train AI Agent from Website URL">
      <form onSubmit={handleCrawl} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f0fdf4', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <span style={{ fontSize: '20px' }}>🌐</span>
          <div style={{ fontSize: '12px', color: '#166534', lineHeight: 1.4 }}>
            Enter your business website URL. Amira will crawl subpages, extract pricing and FAQs, and automatically train your Voice AI in seconds.
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--stripe-navy)', marginBottom: '0.4rem' }}>
            Website URL
          </label>
          <input
            type="text"
            placeholder="https://yourbusiness.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            required
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              fontSize: '13px',
              border: '1px solid var(--stripe-border)',
              borderRadius: '6px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--stripe-navy)' }}>
              Max Pages to Crawl
            </label>
            <span style={{ fontSize: '12px', color: 'var(--stripe-muted)', fontWeight: 600 }}>{maxPages} pages</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={maxPages}
            onChange={(e) => setMaxPages(Number(e.target.value))}
            disabled={loading}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        {crawlProgress && (
          <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '18px', height: '18px', border: '2px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{crawlProgress}</span>
          </div>
        )}

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', color: '#b91c1c' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={loading || !url.trim()}
            style={{ backgroundColor: '#10b981', color: '#fff' }}
          >
            {loading ? 'Crawling & Training...' : 'Start 1-Click Training 🚀'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
