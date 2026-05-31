-- Billing schema: call credits, invoices, plan tracking
-- Safe to run multiple times (idempotent)

-- 1. Add billing columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'starter',
  ADD COLUMN IF NOT EXISTS call_credits NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'inactive';

-- 2. Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id INTEGER,
  reference TEXT NOT NULL UNIQUE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  type TEXT NOT NULL DEFAULT 'subscription',  -- 'subscription' | 'topup'
  plan TEXT,                                   -- plan tier if subscription
  status TEXT NOT NULL DEFAULT 'pending',      -- 'pending' | 'paid' | 'failed'
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Index for fast lookups
CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS invoices_reference_idx ON public.invoices(reference);

-- 4. Row-level security on invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own invoices" ON public.invoices;
CREATE POLICY "Users can read own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert/update (used by webhook)
DROP POLICY IF EXISTS "Service role full access invoices" ON public.invoices;
CREATE POLICY "Service role full access invoices"
  ON public.invoices FOR ALL
  USING (auth.role() = 'service_role');
