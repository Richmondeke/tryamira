'use client';

/**
 * UserProfileContext
 *
 * BEFORE: auth.getUser() + profiles.select() called separately on:
 *   - Sidebar.tsx (every page render)
 *   - dashboard/page.tsx
 *   - dashboard/ai-agent/page.tsx
 *   - dashboard/analytics/page.tsx (server-side via getCurrentUserProfile())
 *
 * AFTER: Fetched once at layout level, available everywhere via useUserProfile().
 * Also persists workspace_id to localStorage to avoid repeated workspace_members lookups.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin' | string;
  plan: 'starter' | 'pro' | 'team' | 'enterprise' | string;
  workspace_id: string | null;
  initials: string;
}

interface UserProfileContextValue {
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const UserProfileContext = createContext<UserProfileContextValue>({
  profile: null,
  isLoading: true,
  isAdmin: false,
  refresh: async () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      // 1. Get auth user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      // 2. Get profile row
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, role, plan, workspace_id')
        .eq('id', user.id)
        .single();

      const full_name = profileData?.full_name || user.email?.split('@')[0] || 'User';
      const initials = full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const constructed: UserProfile = {
        id: user.id,
        email: user.email || '',
        full_name,
        role: profileData?.role || 'user',
        plan: profileData?.plan || 'starter',
        workspace_id: profileData?.workspace_id || null,
        initials,
      };

      setProfile(constructed);

      // 3. Persist workspace_id + billing tier to localStorage
      //    This avoids repeated workspace_members roundtrips in server actions.
      if (typeof window !== 'undefined') {
        if (constructed.workspace_id) {
          localStorage.setItem('amira_workspace_id', constructed.workspace_id);
        }
        if (constructed.plan) {
          localStorage.setItem('amira_billing_tier', constructed.plan);
        }
        if (constructed.role === 'admin') {
          localStorage.setItem('amira_is_admin', 'true');
        }
      }
    } catch (err) {
      console.error('[UserProfileContext] fetch error:', err);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    // Re-fetch on auth state change (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        fetchProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        isLoading,
        isAdmin: profile?.role === 'admin',
        refresh: fetchProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useUserProfile() {
  return useContext(UserProfileContext);
}
