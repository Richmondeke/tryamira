import { NextRequest, NextResponse } from 'next/server';
import { Composio } from '@composio/core';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[vapi/tool] Received tool call request:', JSON.stringify(body, null, 2));

    const { message } = body;
    if (!message || message.type !== 'tool-calls') {
      return NextResponse.json({ error: 'Unsupported message type' }, { status: 400 });
    }

    const toolCalls = message.toolCalls || [];
    const results = [];

    // Fallback user ID who has the active Gmail account connection
    const defaultUserId = '79ce9d25-e98c-4a87-8119-6941ebb39daa';

    // Retrieve API key from environment
    const apiKey = process.env.COMPOSIO_API_KEY;
    if (!apiKey) {
      console.error('[vapi/tool] COMPOSIO_API_KEY is not set');
      return NextResponse.json({ error: 'Composio is not configured' }, { status: 500 });
    }

    const composio = new Composio({ apiKey });

    for (const toolCall of toolCalls) {
      const { id: toolCallId, function: fn } = toolCall;
      if (!fn) continue;

      const { name, arguments: args } = fn;

      if (name === 'send_email') {
        const recipient = args.recipient_email || args.to || args.recipient;
        const subject = args.subject || 'Introduction from Amira';
        const emailBody = args.body || args.message || 'Hello, I am Amira!';

        if (!recipient) {
          results.push({
            toolCallId,
            result: 'Failed: recipient email is missing.',
          });
          continue;
        }

        try {
          console.log(`[vapi/tool] Executing GMAIL_SEND_EMAIL for ${recipient}...`);
          const result = await composio.tools.execute(
            'GMAIL_SEND_EMAIL',
            {
              userId: defaultUserId,
              dangerouslySkipVersionCheck: true,
              arguments: {
                userId: 'me',
                recipient_email: recipient,
                subject: subject,
                body: emailBody,
              },
            }
          );

          console.log('[vapi/tool] Gmail send result:', JSON.stringify(result, null, 2));

          if (result.successful) {
            results.push({
              toolCallId,
              result: `Email successfully sent to ${recipient} via Gmail. Thread ID: ${result.data?.threadId || 'N/A'}.`,
            });
          } else {
            results.push({
              toolCallId,
              result: `Failed to send email: ${result.error || 'Unknown error'}.`,
            });
          }
        } catch (execErr: any) {
          console.error('[vapi/tool] Error executing Composio tool:', execErr);
          results.push({
            toolCallId,
            result: `Failed to send email: ${execErr.message || execErr}`,
          });
        }
      } else {
        results.push({
          toolCallId,
          result: `Function ${name} is not supported.`,
        });
      }
    }

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error('[vapi/tool] General route error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
