'use server';

import { createClient } from '@/utils/supabase/server';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  plan?: string;
  workspace_id?: string;
}

/**
 * Get the current authenticated user's profile from public.profiles.
 * Falls back gracefully if no profile row exists yet.
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return null;

    // Fetch extended profile from public.profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, role, plan, workspace_id')
      .eq('id', user.id)
      .single();

    if (profile) {
      return {
        id: profile.id,
        email: profile.email || user.email || '',
        full_name: profile.full_name || user.user_metadata?.full_name || '',
        avatar_url: profile.avatar_url || user.user_metadata?.avatar_url || '',
        role: profile.role || 'user',
        plan: profile.plan || 'starter',
        workspace_id: profile.workspace_id || user.id,
      };
    }

    // No profile row — return minimal info from auth user
    return {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      avatar_url: user.user_metadata?.avatar_url || '',
      role: 'user',
      plan: 'starter',
      workspace_id: user.id,
    };
  } catch {
    return null;
  }
}

/**
 * Check if the currently logged-in user has admin role.
 */
export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.role === 'admin';
}

/**
 * Create a notification in public.notifications for a workspace.
 */
export async function createNotification({
  workspaceId,
  type,
  title,
  body,
  metadata = {},
}: {
  workspaceId: string;
  type: string;
  title: string;
  body?: string;
  metadata?: Record<string, any>;
}) {
  try {
    const supabase = await createClient();
    await supabase.from('notifications').insert({
      workspace_id: workspaceId,
      type,
      title,
      body: body || null,
      metadata,
      read: false,
    });
  } catch (err) {
    // Non-fatal — never block main action for notification failure
    console.warn('[notifications] Failed to create notification:', err);
  }
}
