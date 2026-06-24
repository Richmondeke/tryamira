'use server';

import { createClient } from '@/utils/supabase/server';

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { error: 'Not authenticated' };

  const companyName = formData.get('companyName') as string;
  const industry = formData.get('industry') as string;
  const useCase = formData.get('useCase') as string;

  // 1. Get workspace member link
  const { data: memberData } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', userData.user.id)
    .limit(1)
    .maybeSingle();

  let workspaceId = memberData?.workspace_id;

  if (workspaceId) {
    // Update existing workspace name
    await supabase
        .from('workspaces')
        .update({ name: companyName })
        .eq('id', workspaceId);
  } else {
    // Missing workspace! (e.g. trigger failed or user existed before trigger)
    // Create the workspace and member link manually
    const { data: newWorkspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({ name: companyName })
        .select('id')
        .single();
        
    if (newWorkspace) {
        workspaceId = newWorkspace.id;
        await supabase
            .from('workspace_members')
            .insert({
                workspace_id: workspaceId,
                user_id: userData.user.id,
                role: 'owner'
            });
    }
  }

  // 2. Upsert user profile to ensure it exists, set onboarding_completed and save workspace_id
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ 
        id: userData.user.id,
        onboarding_completed: true,
        workspace_id: workspaceId,
        full_name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.first_name || userData.user.email
    });

  if (profileError) return { error: profileError.message };

  return { success: true };
}

