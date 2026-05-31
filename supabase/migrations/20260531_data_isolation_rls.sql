-- ============================================================================
-- DATA ISOLATION: Row-Level Security for all workspace-scoped tables
-- Run this in Supabase SQL editor or via: supabase db push
-- 
-- Pattern: users can only access rows where workspace_id is in THEIR workspaces
-- The VAPI webhook uses service_role key (bypasses RLS) and passes workspace_id
-- from call.metadata.workspace_id (tagged at call creation time).
-- ============================================================================

-- Helper function to get all workspace_ids for the current user
-- (Users can be members of multiple workspaces in future)
CREATE OR REPLACE FUNCTION auth.user_workspace_ids()
RETURNS SETOF uuid LANGUAGE sql STABLE AS $$
  SELECT workspace_id::uuid
  FROM public.workspace_members
  WHERE user_id = auth.uid()
$$;

-- ── 1. workspace_agents ────────────────────────────────────────────────────
ALTER TABLE public.workspace_agents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "workspace_agents_own_workspace" ON public.workspace_agents;
CREATE POLICY "workspace_agents_own_workspace" ON public.workspace_agents
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

-- ── 2. campaigns ───────────────────────────────────────────────────────────
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "campaigns_own_workspace" ON public.campaigns;
CREATE POLICY "campaigns_own_workspace" ON public.campaigns
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

-- ── 3. workspace_integrations ──────────────────────────────────────────────
ALTER TABLE public.workspace_integrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "integrations_own_workspace" ON public.workspace_integrations;
CREATE POLICY "integrations_own_workspace" ON public.workspace_integrations
  FOR ALL USING (
    workspace_id::text IN (
      SELECT workspace_id::text FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

-- ── 4. workspace_vectors (knowledge base / RAG) ────────────────────────────
ALTER TABLE public.workspace_vectors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "vectors_own_workspace" ON public.workspace_vectors;
CREATE POLICY "vectors_own_workspace" ON public.workspace_vectors
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

-- ── 5. conversations ───────────────────────────────────────────────────────
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "conversations_own_workspace" ON public.conversations;
CREATE POLICY "conversations_own_workspace" ON public.conversations
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

-- ── 6. leads ───────────────────────────────────────────────────────────────
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "leads_own_workspace" ON public.leads;
CREATE POLICY "leads_own_workspace" ON public.leads
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

-- ── 7. activities ──────────────────────────────────────────────────────────
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activities_own_workspace" ON public.activities;
CREATE POLICY "activities_own_workspace" ON public.activities
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

-- ── 8. forms ───────────────────────────────────────────────────────────────
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "forms_own_workspace" ON public.forms;
CREATE POLICY "forms_own_workspace" ON public.forms
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

-- ── 9. workspace_members (users can see their own memberships) ─────────────
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members_own_rows" ON public.workspace_members;
CREATE POLICY "members_own_rows" ON public.workspace_members
  FOR ALL USING (user_id = auth.uid());

-- ── 10. workspaces (users can see workspaces they belong to) ───────────────
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "workspaces_member_access" ON public.workspaces;
CREATE POLICY "workspaces_member_access" ON public.workspaces
  FOR ALL USING (
    id IN (
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  );

-- ── Service-role bypass note ───────────────────────────────────────────────
-- The VAPI webhook at /api/vapi/webhook/route.ts uses SUPABASE_SERVICE_ROLE_KEY
-- which bypasses RLS. It must always pass the correct workspace_id from
-- call.metadata.workspace_id (set at call creation time in triggerCampaignDialer).
-- This is already implemented in route.ts.
