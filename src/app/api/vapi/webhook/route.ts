import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * VAPI Webhook endpoint — receives call lifecycle events.
 * Configure this URL in your VAPI dashboard under Settings → Webhooks:
 *   https://heyamira.com/api/vapi/webhook
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) return NextResponse.json({ ok: true });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { type, call } = message;

    if (!call) return NextResponse.json({ ok: true });

    // Resolve workspace_id from the assistant metadata or fallback to orgId
    const workspaceId = call?.metadata?.workspace_id || call?.orgId || null;

    // Store call record in Supabase for analytics
    if (type === 'end-of-call-report') {
      // Upsert the call into vapi_calls table for per-workspace scoping
      await supabase.from('vapi_calls').upsert({
        id: call.id,
        workspace_id: workspaceId,
        assistant_id: call.assistantId,
        status: call.status,
        started_at: call.startedAt,
        ended_at: call.endedAt,
        duration_seconds: call.endedAt && call.startedAt
          ? Math.round((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)
          : 0,
        cost: call.cost || 0,
        ended_reason: call.endedReason,
        transcript: call.transcript,
        recording_url: call.recordingUrl,
        analysis: call.analysis,
        raw: call,
        created_at: call.createdAt || new Date().toISOString(),
      }, { onConflict: 'id' });

      // Fire notification
      if (workspaceId) {
        const isSuccess = call.analysis?.successEvaluation === true;
        const durationSec = call.endedAt && call.startedAt
          ? Math.round((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)
          : 0;
        const mins = Math.floor(durationSec / 60);
        const secs = durationSec % 60;

        await supabase.from('notifications').insert({
          workspace_id: workspaceId,
          type: isSuccess ? 'call_completed' : 'call_failed',
          title: isSuccess ? 'Call completed successfully' : `Call ended — ${call.endedReason?.replace(/-/g, ' ') || 'unknown reason'}`,
          body: `Duration: ${mins}m ${secs}s · Cost: $${(call.cost || 0).toFixed(4)}`,
          metadata: { call_id: call.id, assistant_id: call.assistantId },
          read: false,
        });
      }
    }

    if (type === 'call-started') {
      if (workspaceId) {
        await supabase.from('notifications').insert({
          workspace_id: workspaceId,
          type: 'call_started',
          title: 'Incoming call started',
          body: call.customer?.number ? `Caller: ${call.customer.number}` : undefined,
          metadata: { call_id: call.id },
          read: false,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[vapi/webhook] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
