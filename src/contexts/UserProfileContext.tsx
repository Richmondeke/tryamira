'use client';

/**
 * UserProfileContext
 *
 * Fetched once at layout level, available everywhere via useUserProfile().
 * Includes fallback profile for dev/demo mode when Supabase is offline.
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
  vapi_assistant_id: string;
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
      if (user && !userError) {
        // 2. Get profile row
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, role, plan, workspace_id, vapi_assistant_id')
          .eq('id', user.id)
          .single();

        const full_name = profileData?.full_name || user.email?.split('@')[0] || 'User';
        const initials = full_name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        const vapi_assistant_id = profileData?.vapi_assistant_id || `vapi-ast-${user.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}`;

        const constructed: UserProfile = {
          id: user.id,
          email: user.email || '',
          full_name,
          role: profileData?.role || 'user',
          plan: profileData?.plan || 'pro',
          workspace_id: profileData?.workspace_id || null,
          vapi_assistant_id,
          initials,
        };

        setProfile(constructed);

        if (typeof window !== 'undefined') {
          if (constructed.workspace_id) {
            localStorage.setItem('amira_workspace_id', constructed.workspace_id);
          }
          if (constructed.plan) {
            localStorage.setItem('amira_billing_tier', constructed.plan);
          }
          localStorage.setItem('amira_user_vapi_id', vapi_assistant_id);
        }
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('[UserProfileContext] Supabase fetch error, using local profile context');
    }

    // Fallback profile for dev/demo mode
    const demoProfile: UserProfile = {
      id: 'demo-user-1',
      email: 'richmond@heyamira.com',
      full_name: 'Richmond (Amira Operator)',
      role: 'admin',
      plan: 'pro',
      workspace_id: 'demo-workspace-id',
      vapi_assistant_id: 'ae0f0250-c62c-4c65-916e-85af7d7288b7',
      initials: 'RA',
    };

    setProfile(demoProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('amira_workspace_id', 'demo-workspace-id');
      localStorage.setItem('amira_billing_tier', 'pro');
      localStorage.setItem('amira_is_admin', 'true');
      localStorage.setItem('amira_user_vapi_id', 'ae0f0250-c62c-4c65-916e-85af7d7288b7');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          fetchProfile();
        }
      });
      return () => subscription.unsubscribe();
    } catch (e) {
      // Supabase listener error ignored
    }
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
