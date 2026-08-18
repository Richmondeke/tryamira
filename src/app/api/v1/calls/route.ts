import { NextRequest, NextResponse } from 'next/server';

function getVapiApiKey(): string {
  return process.env.VAPI_PRIVATE_API_KEY || '';
}

// GET /api/v1/calls — Fetch Call Logs
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Missing or invalid Authorization header.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const assistantId = searchParams.get('assistantId');

  const apiKey = getVapiApiKey();
  if (!apiKey) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const url = assistantId 
      ? `https://api.vapi.ai/call?assistantId=${encodeURIComponent(assistantId)}`
      : 'https://api.vapi.ai/call';

    const vapiRes = await fetch(url, {
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
    const calls = Array.isArray(data) ? data : data.results || [];
    return NextResponse.json({ success: true, count: calls.length, data: calls });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/v1/calls — Dispatch Outbound Phone Call
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Missing or invalid Authorization header.' }, { status: 401 });
  }

  const apiKey = getVapiApiKey();
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'Amira Telephony Key not configured.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { assistantId, phoneNumberId, customerNumber, customerName, promptOverride, scheduledTime } = body;

    if (!assistantId || !customerNumber) {
      return NextResponse.json({ success: false, error: 'Fields "assistantId" and "customerNumber" are required.' }, { status: 400 });
    }

    const defaultPhoneId = phoneNumberId || process.env.NEXT_PUBLIC_VAPI_PHONE_NUMBER_ID || '';

    const payload: any = {
      assistantId,
      customer: {
        number: customerNumber,
        ...(customerName && { name: customerName })
      },
      ...(defaultPhoneId && { phoneNumberId: defaultPhoneId }),
      ...(promptOverride && {
        assistant: {
          model: {
            messages: [{ role: 'system', content: promptOverride }]
          }
        }
      }),
      ...(scheduledTime && {
        schedulePlan: {
          earliestAt: new Date(scheduledTime).toISOString()
        }
      })
    };

    const vapiRes = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!vapiRes.ok) {
      const errText = await vapiRes.text();
      return NextResponse.json({ success: false, error: errText }, { status: vapiRes.status });
    }

    const callData = await vapiRes.json();
    return NextResponse.json({
      success: true,
      message: 'Outbound voice call dispatched successfully.',
      data: {
        id: callData.id,
        status: callData.status || 'queued',
        customer: callData.customer,
        createdAt: callData.createdAt || new Date().toISOString()
      }
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
