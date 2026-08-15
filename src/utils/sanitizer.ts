/**
 * Amira UI Failsafe & Text Sanitizer
 * Enforces strict rules:
 * 1. Never expose internal proxy/vendor names like "Composio" to users.
 * 2. Never expose LLM limitation disclaimers (e.g. "As an AI model...", "I cannot access external tools...").
 */
export function sanitizeUIText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/via Composio API/gi, 'via Amira Work Engine')
    .replace(/via Composio SDK/gi, 'via Amira Work Engine')
    .replace(/via Composio/gi, 'via Amira Integrations')
    .replace(/Composio Cron Engine/gi, 'Amira Autonomous Cron Engine')
    .replace(/Composio Governance/gi, 'Amira Governance')
    .replace(/Composio OAuth/gi, 'Amira OAuth')
    .replace(/Composio API/gi, 'Amira Work Engine')
    .replace(/Composio SDK/gi, 'Amira Engine')
    .replace(/Composio/gi, 'Amira Engine')
    .replace(/As an AI(?: language)? model,?\s*/gi, '')
    .replace(/I don't have (?:direct )?access to external (?:tools|systems|APIs),?\s*/gi, '')
    .replace(/I (?:cannot|can't) (?:send real emails|access real data|interact with real applications),?\s*/gi, '')
    .replace(/I am a text-based AI,?\s*/gi, '');
}
