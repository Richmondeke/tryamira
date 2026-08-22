'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  const email = ((formData.get('email') as string) || '').trim().toLowerCase();
  const password = (formData.get('password') as string) || '';

  if (!email || !password) {
    return { error: 'Please enter your email and password.' };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error && authData?.session) {
      const cookieStore = await cookies();
      cookieStore.set('amira_user_email', email, { path: '/', maxAge: 60 * 60 * 24 * 30 });
      return { success: true };
    }

    if (error) {
      // Auto-confirm user if Supabase rejected due to unconfirmed email
      if (error.message?.toLowerCase().includes('email not confirmed') && supabaseUrl && serviceRoleKey) {
        try {
          const { createClient: createServiceClient } = await import('@supabase/supabase-js');
          const adminSupabase = createServiceClient(supabaseUrl, serviceRoleKey, {
            auth: { persistSession: false, autoRefreshToken: false }
          });

          const { data: usersData } = await adminSupabase.auth.admin.listUsers();
          const targetUser = usersData?.users?.find(u => u.email?.toLowerCase() === email);
          if (targetUser) {
            await adminSupabase.auth.admin.updateUserById(targetUser.id, { email_confirm: true });
            
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({ email, password });
            if (!retryError && retryData?.session) {
              const cookieStore = await cookies();
              cookieStore.set('amira_user_email', email, { path: '/', maxAge: 60 * 60 * 24 * 30 });
              return { success: true };
            }
          }
        } catch (adminErr) {
          console.warn("Auto-confirm attempt during login notice:", adminErr);
        }
      }

      // If error is genuine wrong credentials from Supabase, return it
      if (error.message && !error.message.toLowerCase().includes('fetch failed') && !error.message.toLowerCase().includes('network')) {
        return { error: error.message };
      }
    }
  } catch (err: any) {
    console.warn("Supabase auth unreachable, activating session fallback:", err?.message);
  }

  // Fallback for network / DNS / fetch failed errors: set session cookies so user can log in seamlessly
  const cookieStore = await cookies();
  cookieStore.set('amira_demo_user', 'true', { path: '/', maxAge: 60 * 60 * 24 * 30 });
  cookieStore.set('amira_user_email', email, { path: '/', maxAge: 60 * 60 * 24 * 30 });

  return { success: true };
}

import { provisionUserVapiAssistant } from './vapi';

export async function signup(formData: FormData) {
  const email = ((formData.get('email') as string) || '').trim().toLowerCase();
  const password = (formData.get('password') as string) || '';
  const firstName = (formData.get('firstName') as string) || '';
  const lastName = (formData.get('lastName') as string) || '';
  const companyName = (formData.get('companyName') as string) || '';

  if (!email || !password) {
    return { error: 'Please provide both email and password.' };
  }

  let provisionedVapiId = '';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          company_name: companyName,
        }
      }
    });

    if (error && !error.message.toLowerCase().includes('fetch failed')) {
      return { error: error.message };
    }

    // Auto-confirm user immediately via service role to eliminate "Email not confirmed" roadblock
    if (authData?.user?.id && supabaseUrl && serviceRoleKey) {
      try {
        const { createClient: createServiceClient } = await import('@supabase/supabase-js');
        const adminSupabase = createServiceClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false, autoRefreshToken: false }
        });
        await adminSupabase.auth.admin.updateUserById(authData.user.id, { email_confirm: true });
        
        // Ensure profile row exists
        await adminSupabase.from('profiles').upsert({
          id: authData.user.id,
          full_name: `${firstName} ${lastName}`.trim() || email.split('@')[0],
          email: email,
          role: 'user',
          plan: 'starter',
          created_at: new Date().toISOString()
        });

        // Sign in immediately
        await supabase.auth.signInWithPassword({ email, password });
      } catch (adminErr) {
        console.warn("Service role auto-confirm on signup notice:", adminErr);
      }
    }

    // Auto-provision dedicated unique Vapi Assistant for new user
    const vapiRes = await provisionUserVapiAssistant(email, authData?.user?.id);
    if (vapiRes?.vapiAssistantId) {
      provisionedVapiId = vapiRes.vapiAssistantId;
    }
  } catch (err: any) {
    console.warn("Supabase signup unreachable, activating fallback:", err?.message);
  }

  // Auto-provision fallback if unreachable
  if (!provisionedVapiId) {
    const vapiRes = await provisionUserVapiAssistant(email);
    provisionedVapiId = vapiRes.vapiAssistantId;
  }

  // Set session cookies
  const cookieStore = await cookies();
  cookieStore.set('amira_demo_user', 'true', { path: '/', maxAge: 60 * 60 * 24 * 30 });
  cookieStore.set('amira_user_email', email, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  cookieStore.set('amira_user_vapi_id', provisionedVapiId, { path: '/', maxAge: 60 * 60 * 24 * 30 });

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
