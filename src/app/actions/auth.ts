'use server';

import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const referralCode = formData.get('referral') as string | null;

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        company_name: formData.get('companyName') as string,
      }
    }
  };

  const { data: authData, error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  // If signup succeeded and referral code was provided, increment the referrer's statistics!
  if (authData?.user && referralCode) {
    const cleanCode = referralCode.toLowerCase().trim();
    const { data: referrerProfile } = await supabase
      .from('profiles')
      .select('id, referral_signups, referral_earnings')
      .eq('referral_code', cleanCode)
      .maybeSingle();

    if (referrerProfile) {
      const newSignups = (referrerProfile.referral_signups || 0) + 1;
      const newEarnings = (referrerProfile.referral_earnings || 0) + 50;

      await supabase
        .from('profiles')
        .update({
          referral_signups: newSignups,
          referral_earnings: newEarnings
        })
        .eq('id', referrerProfile.id);
    }
  }

  // If email confirmation is required, session will be null
  if (authData?.user && !authData?.session) {
    return { needsEmailConfirmation: true, message: "Please check your email to verify your account before logging in." };
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}
