-- Create workspaces table
CREATE TABLE public.workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  referral_code TEXT UNIQUE,
  referral_clicks INTEGER DEFAULT 12,
  referral_signups INTEGER DEFAULT 3,
  referral_earnings INTEGER DEFAULT 150,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create workspace_members table
CREATE TABLE public.workspace_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(workspace_id, user_id)
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'New' NOT NULL,
  source TEXT DEFAULT 'Manual' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads ON DELETE SET NULL,
  status TEXT DEFAULT 'Active' NOT NULL,
  channel TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations ON DELETE CASCADE NOT NULL,
  sender_type TEXT NOT NULL, -- 'user', 'lead', 'ai'
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'Draft' NOT NULL,
  channel TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create webchat_configs table
CREATE TABLE public.webchat_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces ON DELETE CASCADE NOT NULL UNIQUE,
  greeting TEXT DEFAULT 'Hi there! How can I help you today?',
  brand_color TEXT DEFAULT '#7c3aed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webchat_configs ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for testing (Requires authentication)
-- (In a real production app, these would check workspace_members table)
CREATE POLICY "Allow authenticated full access to workspaces" ON public.workspaces FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to profiles" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to workspace_members" ON public.workspace_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to leads" ON public.leads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to conversations" ON public.conversations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to messages" ON public.messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to campaigns" ON public.campaigns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to webchat_configs" ON public.webchat_configs FOR ALL USING (auth.role() = 'authenticated');

-- Create activities table
CREATE TABLE public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  action_text TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  reference_id UUID,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated full access to activities" ON public.activities FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger function for new leads
CREATE OR REPLACE FUNCTION log_new_lead_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activities (workspace_id, event_type, action_text, entity_name, reference_id)
  VALUES (NEW.workspace_id, 'lead_captured', 'New lead captured', NEW.name, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on leads table
CREATE TRIGGER on_lead_created
  AFTER INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION log_new_lead_activity();

-- Create trigger function for campaigns
CREATE OR REPLACE FUNCTION log_campaign_finished()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Finished' AND OLD.status != 'Finished' THEN
    INSERT INTO public.activities (workspace_id, event_type, action_text, entity_name, reference_id)
    VALUES (NEW.workspace_id, 'campaign_finished', 'Campaign finished', NEW.name, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on campaigns table
CREATE TRIGGER on_campaign_updated
  AFTER UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION log_campaign_finished();
-- Create whatsapp_drips table
CREATE TABLE public.whatsapp_drips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  steps INTEGER DEFAULT 1,
  conversion_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create email_inboxes table
CREATE TABLE public.email_inboxes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces ON DELETE CASCADE NOT NULL,
  email_address TEXT NOT NULL,
  status TEXT DEFAULT 'Connected',
  auto_reply_enabled BOOLEAN DEFAULT false,
  auto_reply_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create lead_capture_forms table
CREATE TABLE public.lead_capture_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  submissions INTEGER DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.whatsapp_drips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_inboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_capture_forms ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for testing (Requires authentication)
CREATE POLICY "Allow authenticated full access to whatsapp_drips" ON public.whatsapp_drips FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to email_inboxes" ON public.email_inboxes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to lead_capture_forms" ON public.lead_capture_forms FOR ALL USING (auth.role() = 'authenticated');
CREATE TABLE public.workspace_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  template_id TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.workspace_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their workspace agents"
  ON public.workspace_agents FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert agents in their workspace"
  ON public.workspace_agents FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their workspace agents"
  ON public.workspace_agents FOR UPDATE
  USING (workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their workspace agents"
  ON public.workspace_agents FOR DELETE
  USING (workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  ));
-- Create profile and default workspace on signup
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

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Alter lead_capture_forms table to support detailed config
ALTER TABLE public.lead_capture_forms 
ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}'::jsonb NOT NULL;

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES public.lead_capture_forms ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on form_submissions
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Allow public inserts into form_submissions" 
ON public.form_submissions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow authenticated select of form_submissions" 
ON public.form_submissions FOR SELECT 
USING (
  form_id IN (
    SELECT id FROM public.lead_capture_forms 
    WHERE workspace_id IN (
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Allow public select of lead_capture_forms" 
ON public.lead_capture_forms FOR SELECT 
USING (true);

