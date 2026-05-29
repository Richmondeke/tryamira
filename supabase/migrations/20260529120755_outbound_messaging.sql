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
