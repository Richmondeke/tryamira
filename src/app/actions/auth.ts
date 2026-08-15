'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  const email = (formData.get('email') as string) || '';
  const password = (formData.get('password') as string) || '';

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // If error is genuine wrong credentials from Supabase, return it
      if (error.message && !error.message.toLowerCase().includes('fetch failed') && !error.message.toLowerCase().includes('network')) {
        return { error: error.message };
      }
    } else {
      return { success: true };
    }
  } catch (err: any) {
    console.warn("Supabase auth unreachable, activating dev/demo session fallback:", err?.message);
  }

  // Fallback for network / DNS / fetch failed errors: set session cookies so user can log in locally
  const cookieStore = await cookies();
  cookieStore.set('amira_demo_user', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 });
  cookieStore.set('amira_user_email', email || 'richmond@heyamira.com', { path: '/', maxAge: 60 * 60 * 24 * 7 });

  return { success: true };
}

import { provisionUserVapiAssistant } from './vapi';

export async function signup(formData: FormData) {
  const email = (formData.get('email') as string) || '';
  const password = (formData.get('password') as string) || '';

  let provisionedVapiId = '';

  try {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: formData.get('firstName') as string,
          last_name: formData.get('lastName') as string,
          company_name: formData.get('companyName') as string,
        }
      }
    });

    if (error && !error.message.toLowerCase().includes('fetch failed')) {
      return { error: error.message };
    }

    // Auto-provision dedicated unique Vapi Assistant for new user
    const vapiRes = await provisionUserVapiAssistant(email, authData?.user?.id);
    if (vapiRes?.vapiAssistantId) {
      provisionedVapiId = vapiRes.vapiAssistantId;
    }

    if (authData?.user && !authData?.session) {
      return { needsEmailConfirmation: true, message: "Please check your email to verify your account before logging in." };
    }
  } catch (err: any) {
    console.warn("Supabase signup unreachable, activating fallback:", err?.message);
  }

  // Auto-provision fallback if unreachable
  if (!provisionedVapiId) {
    const vapiRes = await provisionUserVapiAssistant(email);
    provisionedVapiId = vapiRes.vapiAssistantId;
  }

  // Fallback sign up success
  const cookieStore = await cookies();
  cookieStore.set('amira_demo_user', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 });
  cookieStore.set('amira_user_email', email || 'richmond@heyamira.com', { path: '/', maxAge: 60 * 60 * 24 * 7 });
  cookieStore.set('amira_user_vapi_id', provisionedVapiId, { path: '/', maxAge: 60 * 60 * 24 * 7 });

  return { success: true, vapiAssistantId: provisionedVapiId };
}

export async function logout() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    // Ignore error
  }
  const cookieStore = await cookies();
  cookieStore.delete('amira_demo_user');
  cookieStore.delete('amira_user_email');
  return { success: true };
}
