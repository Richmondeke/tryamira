import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVoiceAudition } from '@/hooks/useVoiceAudition';
import { generate100Voices } from '@/lib/voices';

describe('src/hooks/useVoiceAudition.ts', () => {
  const mockVoices = generate100Voices();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with null playingVoiceId', () => {
    const { result } = renderHook(() => useVoiceAudition(mockVoices));
    expect(result.current.playingVoiceId).toBeNull();
  });

  it('stops audio playback cleanly', () => {
    const { result } = renderHook(() => useVoiceAudition(mockVoices));
    act(() => {
      result.current.stopAudio();
    });
    expect(result.current.playingVoiceId).toBeNull();
  });
});
