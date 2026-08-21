import { describe, it, expect } from 'vitest';
import { sanitizeUIText } from '@/utils/sanitizer';

describe('src/utils/sanitizer.ts', () => {
  it('returns empty string for null or undefined input', () => {
    expect(sanitizeUIText(null)).toBe('');
    expect(sanitizeUIText(undefined)).toBe('');
    expect(sanitizeUIText('')).toBe('');
  });

  it('replaces internal vendor name Composio with Amira Engine', () => {
    const raw = 'Executed action via Composio API using Composio OAuth.';
    const sanitized = sanitizeUIText(raw);
    expect(sanitized).not.toContain('Composio');
    expect(sanitized).toContain('Amira Work Engine');
    expect(sanitized).toContain('Amira OAuth');
  });

  it('strips generic AI limitation disclaimers', () => {
    const raw = 'As an AI language model, I cannot send real emails. Your email was queued.';
    const sanitized = sanitizeUIText(raw);
    expect(sanitized).not.toContain('As an AI language model');
    expect(sanitized).not.toContain('I cannot send real emails');
    expect(sanitized).toContain('Your email was queued.');
  });
});
