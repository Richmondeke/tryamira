'use server';

import { createClient } from '@/utils/supabase/server';

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { error: 'Not authenticated' };

  const companyName = formData.get('companyName') as string;
  const industry = formData.get('industry') as string;
  const useCase = formData.get('useCase') as string;

  // 1. Upsert user profile to ensure it exists and set onboarding_completed
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ 
        id: userData.user.id,
        onboarding_completed: true,
        full_name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.first_name || userData.user.email
    });

  if (profileError) return { error: profileError.message };

  // 2. Get workspace member link
  const { data: memberData } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', userData.user.id)
    .limit(1)
    .single();

  if (memberData) {
    // Update existing workspace name
    await supabase
        .from('workspaces')
        .update({ name: companyName })
        .eq('id', memberData.workspace_id);
  } else {
    // Missing workspace! (e.g. trigger failed or user existed before trigger)
    // Create the workspace and member link manually
    const { data: newWorkspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({ name: companyName })
        .select('id')
        .single();
        
    if (newWorkspace) {
        await supabase
            .from('workspace_members')
            .insert({
                workspace_id: newWorkspace.id,
                user_id: userData.user.id,
                role: 'owner'
            });
    }
  }

  return { success: true };
}
