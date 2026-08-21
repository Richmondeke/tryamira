import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLocalPricing } from '@/hooks/useLocalPricing';

describe('src/hooks/useLocalPricing.ts', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults to USD price formatting on successful mount', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ currency: 'USD' }),
    } as any);

    const { result } = renderHook(() => useLocalPricing(49));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.price).toBe('$49');
  });
});
