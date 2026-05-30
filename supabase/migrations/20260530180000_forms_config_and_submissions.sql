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
-- Submissions can be written by ANYONE (public-facing form submission!)
DROP POLICY IF EXISTS "Allow public inserts into form_submissions" ON public.form_submissions;
CREATE POLICY "Allow public inserts into form_submissions" 
ON public.form_submissions FOR INSERT 
WITH CHECK (true);

-- Submissions can only be viewed by authenticated users in their workspace
DROP POLICY IF EXISTS "Allow authenticated select of form_submissions" ON public.form_submissions;
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

-- Public can select forms (need to render the forms publicly!)
DROP POLICY IF EXISTS "Allow public select of lead_capture_forms" ON public.lead_capture_forms;
CREATE POLICY "Allow public select of lead_capture_forms" 
ON public.lead_capture_forms FOR SELECT 
USING (true);
