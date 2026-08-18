'use server';

import { createClient } from '@/utils/supabase/server';

export interface BroadcastNotificationPayload {
  title: string;
  body: string;
  type?: string;
  metadata?: Record<string, any>;
  url?: string;
}

export async function sendBroadcastNotification(payload: BroadcastNotificationPayload) {
  const supabase = await createClient();

  const title = payload.title || 'Amira System Alert';
  const body = payload.body || 'New operational update from Amira.';
  const type = payload.type || 'system_alert';
  const metadata = payload.metadata || { url: payload.url || '/dashboard/v3' };

  try {
    // 1. Get all active workspaces
    const { data: workspaces } = await supabase
      .from('workspaces')
      .select('id');

    if (workspaces && workspaces.length > 0) {
      const inserts = workspaces.map(w => ({
        workspace_id: w.id,
        type,
        title,
        body,
        metadata,
        read: false,
        created_at: new Date().toISOString()
      }));

      await supabase.from('notifications').insert(inserts);
    } else {
      // Insert for public / default workspace
      await supabase.from('notifications').insert({
        workspace_id: 'default-workspace',
        type,
        title,
        body,
        metadata,
        read: false,
        created_at: new Date().toISOString()
      });
    }

    return {
      success: true,
      message: 'Broadcast notification sent successfully to all users.',
      notification: {
        title,
        body,
        type,
        metadata,
        created_at: new Date().toISOString()
      }
    };
  } catch (err: any) {
    console.error('Error sending broadcast notification:', err);
    return {
      success: false,
      error: err.message || 'Failed to dispatch notification'
    };
  }
}
