'use server';

import { createClient } from '@/utils/supabase/server';

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { error: 'Not authenticated' };

  const companyName = formData.get('companyName') as string;
  const industry = formData.get('industry') as string;
  const useCase = formData.get('useCase') as string;

  // 1. Update user profile to set onboarding_completed
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', userData.user.id);

  if (profileError) return { error: profileError.message };

  // 2. Get workspace and update its name
  const { data: memberData } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', userData.user.id)
    .limit(1)
    .single();

  if (memberData) {
    await supabase
        .from('workspaces')
        .update({ name: companyName })
        .eq('id', memberData.workspace_id);
  }

  return { success: true };
}
