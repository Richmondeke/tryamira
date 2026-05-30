-- Add referral tracking columns to public.profiles table
ALTER TABLE public.profiles
ADD COLUMN referral_code TEXT UNIQUE,
ADD COLUMN referral_clicks INTEGER DEFAULT 12,
ADD COLUMN referral_signups INTEGER DEFAULT 3,
ADD COLUMN referral_earnings INTEGER DEFAULT 150;

-- Update profiles table default values for existing records
UPDATE public.profiles
SET referral_code = LOWER(SPLIT_PART(full_name, ' ', 1)) || SUBSTRING(id::text, 1, 4)
WHERE referral_code IS NULL;

-- Update public.handle_new_user() to populate referral_code dynamically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_workspace_id UUID;
  custom_ref_code TEXT;
BEGIN
  -- Generate unique referral code using first name + short ID
  custom_ref_code := LOWER(REPLACE(COALESCE(new.raw_user_meta_data->>'first_name', 'user'), ' ', '')) || SUBSTRING(new.id::text, 1, 4);

  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, referral_code, referral_clicks, referral_signups, referral_earnings)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(new.raw_user_meta_data->>'last_name', ''),
    custom_ref_code,
    12,
    3,
    150
  );

  -- Create default workspace
  INSERT INTO public.workspaces (name)
  VALUES (COALESCE(new.raw_user_meta_data->>'company_name', 'My Workspace'))
  RETURNING id INTO default_workspace_id;

  -- Add user to workspace
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (default_workspace_id, new.id, 'owner');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
