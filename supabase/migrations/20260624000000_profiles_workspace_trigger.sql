-- Update handle_new_user() trigger function to populate workspace_id in profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_workspace_id UUID;
  custom_ref_code TEXT;
BEGIN
  -- Generate unique referral code using first name + short ID
  custom_ref_code := LOWER(REPLACE(COALESCE(new.raw_user_meta_data->>'first_name', 'user'), ' ', '')) || SUBSTRING(new.id::text, 1, 4);

  -- Create default workspace
  INSERT INTO public.workspaces (name)
  VALUES (COALESCE(new.raw_user_meta_data->>'company_name', 'My Workspace'))
  RETURNING id INTO default_workspace_id;

  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, referral_code, referral_clicks, referral_signups, referral_earnings, role, plan, workspace_id)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(new.raw_user_meta_data->>'last_name', ''),
    custom_ref_code,
    12,
    3,
    150,
    'user',
    'starter',
    default_workspace_id
  );

  -- Add user to workspace
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (default_workspace_id, new.id, 'owner');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill workspace_id for existing profiles
UPDATE public.profiles p
SET workspace_id = (
  SELECT workspace_id 
  FROM public.workspace_members m 
  WHERE m.user_id = p.id 
  LIMIT 1
)
WHERE workspace_id IS NULL;
