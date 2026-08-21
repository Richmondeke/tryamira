import { describe, it, expect } from 'vitest';
import { generate100Voices, namesList, providersList } from '@/lib/voices';

describe('src/lib/voices.ts', () => {
  it('generates an exact inventory of 100 unique voices', () => {
    const voices = generate100Voices();
    expect(voices).toHaveLength(100);
  });

  it('includes core anchor voices with proper metadata', () => {
    const voices = generate100Voices();
    const rachel = voices.find(v => v.id === 'rachel');
    expect(rachel).toBeDefined();
    expect(rachel?.provider).toBe('ElevenLabs');
    expect(rachel?.gender).toBe('Female');
    expect(rachel?.accent).toBe('US Friendly');

    const kemi = voices.find(v => v.id === 'kemi');
    expect(kemi).toBeDefined();
    expect(kemi?.accent).toContain('Nigerian');
  });

  it('ensures all 100 voices have valid non-empty fields and preview URLs', () => {
    const voices = generate100Voices();
    for (const voice of voices) {
      expect(voice.id).toBeTruthy();
      expect(voice.name).toBeTruthy();
      expect(voice.provider).toBeTruthy();
      expect(voice.previewUrl).toMatch(/^\/audio\/voices\/.+\.mp3$/);
      expect(voice.text).toBeTruthy();
    }
  });

  it('verifies unique voice IDs across the full list', () => {
    const voices = generate100Voices();
    const ids = voices.map(v => v.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(100);
  });
});
