import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

function getVapiApiKey(): string {
  return process.env.VAPI_PRIVATE_API_KEY || '';
}

// GET /api/v1/assistants — List all assistants
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Missing or invalid Authorization header.' }, { status: 401 });
  }

  const apiKey = getVapiApiKey();
  if (!apiKey) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const vapiRes = await fetch('https://api.vapi.ai/assistant', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!vapiRes.ok) {
      const errText = await vapiRes.text();
      return NextResponse.json({ success: false, error: errText }, { status: vapiRes.status });
    }

    const data = await vapiRes.json();
    const assistants = Array.isArray(data) ? data : data.results || [];
    return NextResponse.json({ success: true, count: assistants.length, data: assistants });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/v1/assistants — Create a new Amira AI Assistant
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Missing or invalid Authorization header.' }, { status: 401 });
  }

  const apiKey = getVapiApiKey();
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'Amira API Telephony Key not configured.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { name, firstMessage, systemPrompt, voiceId, voiceProvider, language } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Field "name" is required.' }, { status: 400 });
    }

    let actualProvider = voiceProvider || '11labs';
    let actualVoiceId = voiceId || '21m00Tcm4TlvDq8ikWAM';

    const vapiPayload = {
      name: name,
      firstMessage: firstMessage || 'Hello! How can I help you today?',
      model: {
        provider: 'openai',
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt || 'You are Amira, an intelligent AI support workforce agent.' }
        ]
      },
      voice: {
        provider: actualProvider,
        voiceId: actualVoiceId,
        ...(actualProvider === '11labs' && { model: 'eleven_multilingual_v2', stability: 0.5, similarityBoost: 0.75 })
      },
      transcriber: {
        provider: 'deepgram',
        model: 'nova-2',
        language: language || 'en'
      }
    };

    const vapiRes = await fetch('https://api.vapi.ai/assistant', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vapiPayload)
    });

    if (!vapiRes.ok) {
      const errText = await vapiRes.text();
      return NextResponse.json({ success: false, error: errText }, { status: vapiRes.status });
    }

    const createdData = await vapiRes.json();
    return NextResponse.json({
      success: true,
      message: 'Amira AI Assistant successfully provisioned.',
      data: {
        id: createdData.id,
        name: createdData.name,
        created_at: createdData.createdAt || new Date().toISOString()
      }
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
