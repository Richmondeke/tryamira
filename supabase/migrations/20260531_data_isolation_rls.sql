-- ============================================================================
-- DATA ISOLATION & MISSING TABLES FIX
-- Run this in Supabase SQL editor
-- ============================================================================

-- ── A. Create Missing Tables ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workspace_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  entity_id TEXT,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workspace_vectors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces ON DELETE CASCADE NOT NULL,
  agent_id TEXT,
  document_name TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── B. Apply Data Isolation RLS ─────────────────────────────────────────────

-- 1. workspace_agents
ALTER TABLE public.workspace_agents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "workspace_agents_own_workspace" ON public.workspace_agents;
CREATE POLICY "workspace_agents_own_workspace" ON public.workspace_agents
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

-- 2. campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "campaigns_own_workspace" ON public.campaigns;
CREATE POLICY "campaigns_own_workspace" ON public.campaigns
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

-- 3. workspace_integrations
ALTER TABLE public.workspace_integrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "integrations_own_workspace" ON public.workspace_integrations;
CREATE POLICY "integrations_own_workspace" ON public.workspace_integrations
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

-- 4. workspace_vectors
ALTER TABLE public.workspace_vectors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "vectors_own_workspace" ON public.workspace_vectors;
CREATE POLICY "vectors_own_workspace" ON public.workspace_vectors
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

-- 5. conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "conversations_own_workspace" ON public.conversations;
CREATE POLICY "conversations_own_workspace" ON public.conversations
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

-- 6. leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "leads_own_workspace" ON public.leads;
CREATE POLICY "leads_own_workspace" ON public.leads
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

-- 7. activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activities_own_workspace" ON public.activities;
CREATE POLICY "activities_own_workspace" ON public.activities
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

-- 8. lead_capture_forms
ALTER TABLE public.lead_capture_forms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "forms_own_workspace" ON public.lead_capture_forms;
CREATE POLICY "forms_own_workspace" ON public.lead_capture_forms
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

-- 9. workspace_members
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members_own_rows" ON public.workspace_members;
CREATE POLICY "members_own_rows" ON public.workspace_members
  FOR ALL USING (user_id = auth.uid());

-- 10. workspaces
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "workspaces_member_access" ON public.workspaces;
CREATE POLICY "workspaces_member_access" ON public.workspaces
  FOR ALL USING (
    id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );
