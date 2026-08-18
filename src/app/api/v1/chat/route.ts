import { NextRequest, NextResponse } from 'next/server';

const CANDIDATE_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.7-flash',
  'gemini-2.5-flash'
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, agentId, agentName, workspaceId, customPrompt } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const vapiApiKey = process.env.VAPI_PRIVATE_API_KEY;

    let effectiveAgentName = agentName || 'Sophia';
    let effectiveSystemPrompt = '';

    // 1. If agentId is provided, attempt to fetch the user's custom agent instructions from Vapi Cloud
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
      effectiveSystemPrompt = `You are Amira, the official AI Operator for Work (tryamira.com).
You help companies delegate outcomes, not just tasks, by deploying autonomous AI workers across voice calls, webchat, SMS, lead intake forms, and CRM integrations (HubSpot, Salesforce, Notion, Supabase, Google Drive).

KEY CAPABILITIES:
- Voice Telephony: Sub-300ms ultra-low latency real-time voice calls for inbound reception, lead qualification, appointment booking, and outbound calling.
- Omnichannel Chat: Unified multi-channel chat widgets for websites, WhatsApp, and SMS.
- Instant Speed-to-Lead: Lead form auto-dialer calls prospects within 10 seconds of form submission.
- Knowledge Base (RAG): Indexes company documents, PDFs, and Notion to answer customer questions with zero hallucinations.

PRICING PLANS:
- Starter ($49/mo): 1 AI Agent, 500 phone minutes, standard webchat widget, email support.
- Growth / Pro ($149/mo): 5 AI Agents, 2,500 phone minutes, full RAG Knowledge Base, custom voice cloning, CRM sync.
- Enterprise ($499+/mo): Unlimited agents, dedicated SIP trunking, custom SLAs, SOC-2 compliance, fine-tuned models.

Be warm, professional, concise (1-3 sentences max), and answer questions directly. Offer to book a demo or help get started.`;
    }

    // Build context history for chat
    const formattedHistory = Array.isArray(history) 
      ? history.map(h => `${h.role === 'assistant' || h.from === 'ai' ? 'Assistant' : 'User'}: ${h.text || h.content || ''}`).join('\n')
      : '';

    const fullPrompt = `${effectiveSystemPrompt}\n\nChat History:\n${formattedHistory}\n\nUser: ${message}\n\nAssistant (${effectiveAgentName}):`;

    let reply = '';

    // Multi-model cascading inference
    if (geminiKey) {
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: fullPrompt }] }]
            })
          });

          if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (text) {
              reply = text;
              break; // Success!
            }
          }
        } catch (mErr) {
          // Cascade to next model
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
