'use client';

import React from 'react';

interface ResultItem {
  id: string;
  type: 'reddit' | 'sheet' | 'crm' | 'github' | 'email' | 'generic_link';
  title: string;
  subtitle?: string;
  meta?: string;
  url: string;
  domain?: string;
  icon?: string;
}

export function AmiraResultEmbed({ feedback }: { feedback: string }) {
  if (!feedback) return null;

  // 1. Detect Reddit Threads in Feedback
  const redditPattern = /(?:r\/[\w-]+|📌)\s*—\s*"([^"]+)"[\s\S]*?(?:Subreddit|•):\s*([\w\/]+)[\s\S]*?Direct Link:\s*(https?:\/\/[^\s]+)/gi;
  const redditMatches: ResultItem[] = [];
  let match;

  while ((match = redditPattern.exec(feedback)) !== null) {
    redditMatches.push({
      id: `rd-${redditMatches.length}`,
      type: 'reddit',
      title: match[1],
      subtitle: `Community: ${match[2]}`,
      url: match[3],
      domain: 'reddit.com',
      icon: 'https://logos.composio.dev/api/reddit'
    });
  }

  // 2. Generic Link Extractor if no specific pattern matched
  const urlRegex = /(https?:\/\/[^\s\)\>]+)/g;
  const allUrls = feedback.match(urlRegex) || [];
  
  const genericLinks: ResultItem[] = [];
  if (redditMatches.length === 0 && allUrls.length > 0) {
    allUrls.forEach((url, idx) => {
      try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace('www.', '');
        let title = `${host} link`;
        let type: ResultItem['type'] = 'generic_link';

        if (host.includes('reddit')) {
          title = 'Reddit Discussion Thread';
          type = 'reddit';
        } else if (host.includes('github')) {
          title = 'GitHub Repository / Commit';
          type = 'github';
        } else if (host.includes('google.com') || host.includes('sheets')) {
          title = 'Google Workspace Document / Sheet';
          type = 'sheet';
        } else if (host.includes('hubspot') || host.includes('salesforce')) {
          title = 'CRM Deal / Prospect Record';
          type = 'crm';
        }

        genericLinks.push({
          id: `link-${idx}`,
          type,
          title,
          subtitle: parsed.pathname.slice(0, 40) + '...',
          url,
          domain: host,
          icon: `https://logos.composio.dev/api/${host.split('.')[0]}`
        });
      } catch (e) {}
    });
  }

  const items = redditMatches.length > 0 ? redditMatches : genericLinks;

  // Clean description text without raw URLs
  const cleanBodyText = feedback
    .replace(/Direct Link:\s*https?:\/\/[^\s]+/gi, '')
    .replace(/https?:\/\/[^\s]+/gi, '')
    .trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Primary Execution Summary Text */}
      {cleanBodyText && (
        <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
          ⚡ {cleanBodyText}
        </div>
      )}

      {/* Structured Rich Embed Cards Grid */}
      {items.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-card, #ffffff)',
                border: '1px solid var(--border-subtle, rgba(0,0,0,0.12))',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.75rem',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <div>
                {/* Embed Header Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px',
                    backgroundColor: '#1b5a9215', color: '#1b5a92', display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
                  }}>
                    {item.type === 'reddit' ? '🔴 Reddit Thread' :
                     item.type === 'github' ? '🐙 GitHub Repo' :
                     item.type === 'sheet' ? '📊 Google Sheet' :
                     item.type === 'crm' ? '🟧 CRM Record' : '🔗 Integration Link'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                    {item.domain}
                  </span>
                </div>

                {/* Title */}
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem 0', lineHeight: 1.4 }}>
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => window.open(item.url, '_blank')}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: '#1b5a92',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 8px rgba(27,90,146,0.25)',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#5835e0'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1b5a92'; }}
              >
                <span>Open {item.type === 'reddit' ? 'Reddit Thread' : 'Resource'}</span>
                <span style={{ fontSize: '11px' }}>↗</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
