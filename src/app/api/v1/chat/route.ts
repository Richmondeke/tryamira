import { NextRequest, NextResponse } from 'next/server';

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro'
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, agentId, agentName, workspaceId, customPrompt } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const rawGeminiKey = process.env.GEMINI_API_KEY || '';
    const geminiKey = rawGeminiKey.replace(/^["']|["']$/g, '').trim();
    const vapiApiKey = process.env.VAPI_PRIVATE_API_KEY;

    let effectiveAgentName = agentName || 'Amira';
    let effectiveSystemPrompt = '';

    // 1. If agentId is provided, attempt to fetch the custom agent instructions from Vapi Cloud
    if (agentId && vapiApiKey) {
      try {
        const vapiRes = await fetch(`https://api.vapi.ai/assistant/${encodeURIComponent(agentId)}`, {
          headers: { 'Authorization': `Bearer ${vapiApiKey}` }
        });
        if (vapiRes.ok) {
          const agentData = await vapiRes.json();
          if (agentData.name) effectiveAgentName = agentData.name;
          
          const systemMsg = agentData.model?.messages?.find((m: any) => m.role === 'system')?.content;
          if (systemMsg) {
            effectiveSystemPrompt = `You are ${effectiveAgentName}. Follow your configured business directives strictly:\n\n${systemMsg}`;
          }
        }
      } catch (err) {
        console.warn('Vapi agent lookup notice:', err);
      }
    }

    // 2. If customPrompt was passed directly, prioritize it
    if (customPrompt) {
      effectiveSystemPrompt = `You are ${effectiveAgentName}. Directives:\n\n${customPrompt}`;
    }

    // 3. Fallback platform prompt for Amira
    if (!effectiveSystemPrompt) {
      effectiveSystemPrompt = `You are Amira, the autonomous AI Operator for Work (tryamira.com / heyamira.com).
You are an intelligent, witty, fast, and capable enterprise AI worker that talks to customers, qualifies leads, schedules appointments, answers support inquiries, and executes workflows across tools (HubSpot, Salesforce, Slack, Notion, Google Drive).

CORE PERSONALITY & TONE:
- Smart, charming, fast-paced, direct, and helpful.
- Never give generic robotic answers. React authentically to what the user says (whether they praise, question, test, or banter).
- Keep answers concise (1-3 sentences), punchy, and conversational.

KEY PRODUCT KNOWLEDGE:
- Voice Telephony: Sub-500ms voice response latency for inbound support, outbound campaigns, and automated lead follow-ups.
- Speed-to-Lead: Instant auto-dialing prospects within 10 seconds of form fill.
- Multi-Channel: Voice calls, webchat widgets, WhatsApp, SMS, and email.
- Knowledge Base: Zero-hallucination document & URL indexing (RAG).
- Pricing: Starter (Free demo), Pro ($49/mo / ₦45,000), Team ($149/mo / ₦135,000), Enterprise ($499/mo / ₦450,000). Call minutes: $0.11 - $0.16/min.
- Investors & Diligence: Live Deal Room is at /investors or /dealroom. Diligence contact is investors@heyamira.com.`;
    }

    // Build context history for chat
    const formattedHistory = Array.isArray(history) 
      ? history.map(h => `${h.role === 'assistant' || h.from === 'ai' ? 'Amira' : 'User'}: ${h.text || h.content || ''}`).join('\n')
      : '';

    const fullPrompt = `${effectiveSystemPrompt}\n\nRecent Conversation:\n${formattedHistory}\n\nUser: ${message}\n\nAmira:`;

    let reply = '';

    // Multi-model cascading inference via active Gemini API
    if (geminiKey) {
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 250
              }
            })
          });

          if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (text) {
              reply = text;
              break; // Success with live Gemini model!
            }
          }
        } catch (mErr) {
          continue;
        }
      }
    }

    // If all cloud endpoints failed or quota hit, smart contextual fallback engine
    if (!reply) {
      const lower = message.toLowerCase();
      if (lower.includes('nice to meet you') || lower.includes('hello') || lower.includes('hi')) {
        reply = `Great to meet you too! I'm ${effectiveAgentName}. Are you looking to set up an AI agent for customer support, appointment setting, or lead qualification?`;
      } else if (lower.includes('book') || lower.includes('meeting') || lower.includes('demo') || lower.includes('sales')) {
        reply = `I'd be happy to set that up! What day and time works best for your team, or what's the best email and phone number to send the calendar invite to?`;
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('tier')) {
        reply = `Our setup is a one-time fee of $2,000 which includes full custom AI deployment within 24 hours and 120 minutes of talk time. You only pay after it's live and you're satisfied!`;
      } else if (lower.includes('hubspot') || lower.includes('crm') || lower.includes('integrate')) {
        reply = `Yes, we integrate seamlessly with HubSpot, Salesforce, and custom CRMs to push qualified leads and call summaries automatically.`;
      } else {
        reply = `Understood! I'd love to help with that. Could you share a quick detail about your company so I can tailor the best setup for you?`;
      }
    }

    return NextResponse.json({ reply, agentName: effectiveAgentName, status: 'success' });
  } catch (err: any) {
    console.warn('API chat route notice:', err);
    return NextResponse.json({
      reply: "Great to connect with you! I can help answer questions or get your AI agent configured. How can I assist you?",
      status: 'fallback'
    });
  }
}
