'use server';

export async function updateInboundAgent(
  assistantId: string,
  voice: string,
  prompt: string,
  firstMessage: string,
  language: string
) {
  const apiKey = process.env.VAPI_PRIVATE_API_KEY;

  if (!apiKey || !assistantId) {
    console.warn('VAPI_PRIVATE_API_KEY or VAPI_ASSISTANT_ID is not set in environment variables.');
    return { success: false, error: 'Vapi is not configured.' };
  }

  // Map our UI voice options to actual Vapi voice configurations
  let voiceProvider = 'playht';
  let voiceId = 'jennifer'; // default
  
  if (voice === 'professional') {
    voiceId = 'jennifer';
  } else if (voice === 'friendly') {
    voiceId = 'marcus';
  } else if (voice === 'enthusiastic') {
    voiceId = 'sarah';
  }

  try {
    const response = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstMessage: firstMessage || 'Hello, how can I help you today?',
        model: {
          messages: [
            {
              role: 'system',
              content: prompt,
            },
          ],
        },
        voice: {
          provider: voiceProvider,
          voiceId: voiceId,
        },
        transcriber: {
          provider: 'deepgram',
          language: language || 'en',
          model: 'nova-2'
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update Vapi assistant:', errorText);
      return { success: false, error: 'Failed to update Vapi assistant.' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Vapi updateInboundAgent error:', err);
    return { success: false, error: err.message };
  }
}

export async function getVapiCalls() {
  const apiKey = process.env.VAPI_PRIVATE_API_KEY;
  if (!apiKey) {
    console.warn('VAPI_PRIVATE_API_KEY is not set. Returning mock calls.');
    return [];
  }

  try {
    const res = await fetch('https://api.vapi.ai/call', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Vapi API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (err) {
    console.error('Error fetching Vapi calls:', err);
    return [];
  }
}

export async function triggerOutboundCall(
  assistantId: string,
  phoneNumberId: string,
  customerNumber: string,
  prompt: string,
  scheduledTime?: string
) {
  const apiKey = process.env.VAPI_PRIVATE_API_KEY;

  if (!apiKey || !assistantId || !phoneNumberId) {
    console.warn('VAPI_PRIVATE_API_KEY, VAPI_ASSISTANT_ID, or VAPI_PHONE_NUMBER_ID is not set.');
    return { success: false, error: 'Vapi is not configured.' };
  }

  try {
    const response = await fetch(`https://api.vapi.ai/call`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumberId: phoneNumberId,
        customer: {
          number: customerNumber,
        },
        assistantId: assistantId,
        // We override the assistant's prompt for this specific outbound call
        assistant: {
          model: {
            messages: [
              {
                role: 'system',
                content: prompt,
              },
            ],
          },
        },
        // If scheduledTime is provided, we tell Vapi to wait until then
        ...(scheduledTime && { schedulePlan: { earliestAt: new Date(scheduledTime).toISOString() } })
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to trigger Vapi outbound call:', errorText);
      return { success: false, error: 'Failed to trigger outbound call.' };
    }

    const data = await response.json();
    return { success: true, callId: data.id };
  } catch (err: any) {
    console.error('Vapi triggerOutboundCall error:', err);
    return { success: false, error: err.message };
  }
}
