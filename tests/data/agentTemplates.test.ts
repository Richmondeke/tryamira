import { describe, it, expect } from 'vitest';
import { templatesData } from '@/data/agentTemplates';

describe('src/data/agentTemplates.ts', () => {
  it('contains valid pre-configured agent templates', () => {
    expect(templatesData.length).toBeGreaterThanOrEqual(5);
  });

  it('ensures each template has valid required properties', () => {
    for (const template of templatesData) {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.category).toBeTruthy();
      expect(template.desc).toBeTruthy();
      expect(template.capabilities.length).toBeGreaterThan(0);
      expect(template.requiredIntegrations.length).toBeGreaterThan(0);
      expect(template.prompt).toBeTruthy();
      expect(template.voice).toBeTruthy();
    }
  });

  it('has unique IDs across all templates', () => {
    const ids = templatesData.map(t => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});
