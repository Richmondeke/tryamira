-- ============================================================
-- Amira Dashboard — Production Schema Migration
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add role column to profiles (if not exists)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'starter',
  ADD COLUMN IF NOT EXISTS workspace_id UUID,
  ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 2. Make ekerichmond@gmail.com an admin
--    profiles has no email column — email lives in auth.users.
--    We look up the UUID from auth.users, then update profiles by id.
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'ekerichmond@gmail.com' LIMIT 1
);


-- 3. Notifications table for real-time event tracking
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL,
  type TEXT NOT NULL,
  -- Types: call_completed, call_failed, call_started, lead_captured, form_submission,
  --        agent_updated, integration_connected, campaign_started, campaign_completed, team_invite
  title TEXT NOT NULL,
  body TEXT,
  metadata JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast workspace queries
CREATE INDEX IF NOT EXISTS idx_notifications_workspace_read 
  ON public.notifications(workspace_id, read, created_at DESC);

-- Enable Realtime on notifications (run this in Supabase Dashboard → Database → Replication)
-- ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 4. VAPI calls table — per-workspace call storage from webhook
CREATE TABLE IF NOT EXISTS public.vapi_calls (
  id TEXT PRIMARY KEY,
  workspace_id UUID,
  assistant_id TEXT,
  status TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  cost DECIMAL(10,6) DEFAULT 0,
  ended_reason TEXT,
  transcript TEXT,
  recording_url TEXT,
  analysis JSONB,
  raw JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vapi_calls_workspace 
  ON public.vapi_calls(workspace_id, created_at DESC);

-- 5. Add status / draft columns to lead_capture_forms
ALTER TABLE public.lead_capture_forms
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
  -- Values: 'draft', 'published', 'archived'
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Set all existing forms without status to 'published' (they were already live)
UPDATE public.lead_capture_forms 
SET status = 'published', published_at = created_at
WHERE status IS NULL OR status = '';

-- 6. Webchat widget configuration per workspace
CREATE TABLE IF NOT EXISTS public.webchat_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL UNIQUE,
  agent_id TEXT,
  theme TEXT DEFAULT 'light',
  position TEXT DEFAULT 'bottom-right',
  welcome_message TEXT DEFAULT 'Hi! How can I help you today?',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Row Level Security policies

-- Notifications: users can only see their own workspace notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users see own notifications" ON public.notifications;
CREATE POLICY "Users see own notifications"
  ON public.notifications FOR SELECT
  USING (workspace_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Service role inserts notifications" ON public.notifications;
CREATE POLICY "Service role inserts notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  USING (workspace_id = auth.uid());

-- VAPI calls: own workspace only
ALTER TABLE public.vapi_calls ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users see own calls" ON public.vapi_calls;
CREATE POLICY "Users see own calls"
  ON public.vapi_calls FOR ALL
  USING (workspace_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Webchat configs: own workspace
ALTER TABLE public.webchat_configs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own webchat config" ON public.webchat_configs;
CREATE POLICY "Users manage own webchat config"
  ON public.webchat_configs FOR ALL
  USING (workspace_id = auth.uid());

-- ============================================================
-- NOTES FOR VAPI WEBHOOK SETUP:
-- 1. Go to VAPI Dashboard → Settings → Server URL
-- 2. Set: https://heyamira.com/api/vapi/webhook
-- 3. Enable events: call-started, end-of-call-report
-- 4. In each assistant's metadata, set: { "workspace_id": "<user_uuid>" }
--    (This allows the webhook to route calls to the right workspace)
-- ============================================================
