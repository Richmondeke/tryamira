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
