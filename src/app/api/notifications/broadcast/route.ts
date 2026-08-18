import { NextRequest, NextResponse } from 'next/server';
import { sendBroadcastNotification } from '@/app/actions/notifications';
import { emitServerNotification } from '@/app/api/notifications/stream/route';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const title = body.title || '🚀 Amira System Update';
    const message = body.body || body.message || 'Amira 3.0 Autonomous OS is now active across all channels and phone lines.';
    const type = body.type || 'system_alert';

    const result = await sendBroadcastNotification({
      title,
      body: message,
      type,
      url: body.url || '/dashboard/v3'
    });

    if (result.success && result.notification) {
      emitServerNotification(result.notification);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    endpoint: '/api/notifications/broadcast',
    usage: 'POST with { title, body, type, url } to dispatch real-time notifications to all users'
  });
}
