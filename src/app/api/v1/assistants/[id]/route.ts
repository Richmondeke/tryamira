import { NextRequest, NextResponse } from 'next/server';

function getVapiApiKey(): string {
  return process.env.VAPI_PRIVATE_API_KEY || '';
}

// GET /api/v1/assistants/[id] — Fetch Assistant Details
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Missing or invalid Authorization header.' }, { status: 401 });
  }

  const { id } = params;
  const apiKey = getVapiApiKey();
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'Amira Telephony Key not configured.' }, { status: 500 });
  }

  try {
    const vapiRes = await fetch(`https://api.vapi.ai/assistant/${id}`, {
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
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH /api/v1/assistants/[id] — Update Assistant Parameters
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Missing or invalid Authorization header.' }, { status: 401 });
  }

  const { id } = params;
  const apiKey = getVapiApiKey();
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'Amira Telephony Key not configured.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { name, firstMessage, systemPrompt, voiceId, voiceProvider, language, stability, similarityBoost } = body;

    const patchPayload: any = {};
    if (name) patchPayload.name = name;
    if (firstMessage) patchPayload.firstMessage = firstMessage;
    if (systemPrompt) {
      patchPayload.model = {
        messages: [{ role: 'system', content: systemPrompt }]
      };
    }

    if (voiceId || voiceProvider) {
      const actualProvider = voiceProvider || '11labs';
      patchPayload.voice = {
        provider: actualProvider,
        voiceId: voiceId || '21m00Tcm4TlvDq8ikWAM',
        ...(actualProvider === '11labs' && {
          model: 'eleven_multilingual_v2',
          stability: stability ?? 0.5,
          similarityBoost: similarityBoost ?? 0.75
        })
      };
    }

    if (language) {
      patchPayload.transcriber = {
        provider: 'deepgram',
        model: 'nova-2',
        language: language
      };
    }

    const vapiRes = await fetch(`https://api.vapi.ai/assistant/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patchPayload)
    });

    if (!vapiRes.ok) {
      const errText = await vapiRes.text();
      return NextResponse.json({ success: false, error: errText }, { status: vapiRes.status });
    }

    const data = await vapiRes.json();
    return NextResponse.json({ success: true, message: 'Assistant updated successfully.', data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/v1/assistants/[id] — Delete Assistant
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Missing or invalid Authorization header.' }, { status: 401 });
  }

  const { id } = params;
  const apiKey = getVapiApiKey();
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'Amira Telephony Key not configured.' }, { status: 500 });
  }

  try {
    const vapiRes = await fetch(`https://api.vapi.ai/assistant/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!vapiRes.ok) {
      const errText = await vapiRes.text();
      return NextResponse.json({ success: false, error: errText }, { status: vapiRes.status });
    }

    return NextResponse.json({ success: true, message: `Assistant ${id} deleted successfully.` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
