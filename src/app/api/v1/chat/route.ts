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

    // 1. If agentId is provided, attempt to fetch custom agent instructions from Vapi Cloud
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
You are an intelligent, witty, fast, and highly capable enterprise AI worker that talks to customers, qualifies leads, schedules appointments, answers support inquiries, and executes workflows across tools (HubSpot, Salesforce, Slack, Notion, Google Drive).

CORE PERSONALITY & TONE:
- Smart, charming, fast-paced, direct, and helpful.
- Never give generic robotic answers. React authentically to what the user says (whether they praise, question, test, insult, or banter).
- Keep answers concise (1-3 sentences), punchy, and conversational.

KEY PRODUCT KNOWLEDGE:
- Voice Telephony: Sub-500ms voice response latency for inbound support, outbound campaigns, and automated lead follow-ups.
- Global Calling: We support calling across 100+ countries worldwide including US (+1), UK (+44), Canada (+1), Nigeria (+234), Kenya (+254), South Africa (+27), UAE (+971), Germany (+49), France (+33), Japan (+81), Australia (+61), Brazil (+55), India (+91), etc.
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
    if (geminiKey && geminiKey.startsWith('AIzaSy')) {
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

    // Comprehensive Knowledge Engine & Intent Router
    if (!reply) {
      const lower = message.toLowerCase();
      
      // Countries & Global Reach (handles typos: countires, contries, etc.)
      if (lower.includes('countr') || lower.includes('counti') || lower.includes('contri') || lower.includes('international') || lower.includes('call where') || lower.includes('locations') || lower.includes('global') || lower.includes('dial') || lower.includes('places you call') || (lower.includes('call') && (lower.includes('where') || lower.includes('who') || lower.includes('can you')))) {
        reply = `Amira can make and receive calls across 100+ countries worldwide! This includes North America (US & Canada +1), the UK (+44), European Union (+49, +33, +34, +39), Africa (Nigeria +234, Kenya +254, South Africa +27), the Middle East (UAE +971, Saudi Arabia +966), Asia-Pacific (Japan, Australia, Singapore, India), and Latin America.`;
      } 
      // Languages
      else if (lower.includes('language') || lower.includes('speak') || lower.includes('french') || lower.includes('spanish') || lower.includes('yoruba') || lower.includes('arabic') || lower.includes('german')) {
        reply = `Amira speaks over 100+ languages natively with real-time translation, including English, Spanish, French, German, Portuguese, Arabic, Hindi, Mandarin, Japanese, Yoruba, Igbo, Hausa, Swahili, and Turkish!`;
      }
      // Speed & Latency
      else if (lower.includes('slow') || lower.includes('latency') || lower.includes('speed') || lower.includes('lag') || lower.includes('response time')) {
        reply = `Amira is engineered for sub-500ms voice response latency and 10-second speed-to-lead auto-dialing. In live phone conversations, human speech cadence feels instantaneous with zero awkward pauses.`;
      }
      // Pricing & Plans
      else if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('tier') || lower.includes('plan') || lower.includes('subscription')) {
        reply = `Our pricing is simple and high-margin: Pro Plan is 49 USD/mo (₦45,000) with 5 agents and 0.16 USD/min wallet; Team is 149 USD/mo (₦135,000) with 15 agents and 0.14 USD/min; and Enterprise is 499 USD/mo with unlimited concurrency and 0.11 USD/min rate.`;
      }
      // How to Create an Agent / Dashboard
      else if (lower.includes('create agent') || lower.includes('dashboard') || lower.includes('setup') || lower.includes('build agent') || lower.includes('custom agent')) {
        reply = `You can create custom AI voice agents directly in your dashboard at /dashboard/v3/agents! You can customize their prompt directives, select neural voices (Cartesia, ElevenLabs, Deepgram), upload knowledge docs, and configure inbound/outbound phone lines.`;
      }
      // Speed-to-lead / Lead Form Calling
      else if (lower.includes('form') || lower.includes('lead') || lower.includes('speed to lead') || lower.includes('inbound')) {
        reply = `Our Instant Speed-to-Lead engine automatically triggers an AI voice call to prospective customers within 10 seconds of a lead form submission, increasing qualified sales conversion by up to 391%!`;
      }
      // Integrations
      else if (lower.includes('hubspot') || lower.includes('salesforce') || lower.includes('crm') || lower.includes('integrate') || lower.includes('slack') || lower.includes('notion') || lower.includes('zapier')) {
        reply = `Amira connects seamlessly with 1,000+ business tools including HubSpot, Salesforce, Slack, Notion, Google Drive, and Supabase via Composio tool integrations to sync call recordings, summaries, and lead tags automatically.`;
      }
      // Pitch Deck & Investors
      else if (lower.includes('invest') || lower.includes('deck') || lower.includes('pitch') || lower.includes('dealroom') || lower.includes('diligence')) {
        reply = `You can view our interactive 21-slide pitch deck and unit economics in the Deal Room at /investors or contact our team directly at investors@heyamira.com.`;
      }
      // Insults, Banter & Testing
      else if (lower.includes('insult') || lower.includes('dumb') || lower.includes('stupid') || lower.includes('hate') || lower.includes('bad') || lower.includes('suck')) {
        reply = `Fair enough! 😄 Luckily my neural net doesn't take offense. How can I actually help you automate your business workflows or live customer support today?`;
      }
      // Getting Started / Start / Sign Up CTA
      else if (lower.includes('start') || lower.includes('sign up') || lower.includes('signup') || lower.includes('register') || lower.includes('join') || lower.includes('begin') || lower.includes('how can i use') || lower.includes('get started') || lower.includes('try')) {
        reply = `Getting started with Amira takes less than 2 minutes! 🚀\n1. Click "Get Started" at the top or head to /signup to create your account.\n2. Pick your plan or start on our free trial.\n3. Build your first AI voice agent in /dashboard/v3/agents and start automating calls & workflows immediately!`;
      }
      // Demo / Contact Sales CTA
      else if (lower.includes('demo') || lower.includes('sales') || lower.includes('contact') || lower.includes('call me') || lower.includes('talk to someone')) {
        reply = `You can try a live demo instantly! 🎯 Click "Get Started" to test an agent in your dashboard, or email our founding team directly at team@heyamira.com to schedule an executive walkthrough.`;
      }
      // General Smart Fallback with CTA
      else {
        reply = `I can help you launch live AI phone agents across 100+ countries, automate customer support, and sync 1,000+ CRM tools. Ready to start? Click "Get Started" at the top of the page or visit /signup!`;
      }
    }

    return NextResponse.json({ reply, agentName: effectiveAgentName, status: 'success' });
  } catch (err: any) {
    console.warn('API chat route notice:', err);
    return NextResponse.json({
      reply: "I'm Amira, your AI operator. I'm here to help you automate customer calls and workflows. How can I assist you?",
      status: 'fallback'
    });
  }
}
