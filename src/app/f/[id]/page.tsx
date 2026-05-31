/**
 * Public Form Page — Server Component with ISR
 *
 * BEFORE: 'use client' — every visitor triggers a cold Supabase fetch from their browser.
 *         - First load: wait for JS bundle + Supabase query (~600ms)
 *         - No edge caching: every visitor = 1 DB query
 *
 * AFTER: Server Component with revalidate = 60s (ISR)
 *        - Page is generated server-side and served from Vercel Edge cache
 *        - First visitor after 60s revalidation window triggers regen
 *        - All other visitors get instant HTML from edge (~50ms)
 *        - Form config is stable; views/submission counts are updated via action
 */
import { createClient } from '@/utils/supabase/server';
import PublicFormClient from './PublicFormClient';
import { Metadata } from 'next';

// ISR: Regenerate this page at most once per 60 seconds.
// If the form config changes (title, fields, color), it'll be live within 60s.
export const revalidate = 60;

interface Props {
  params: { id: string };
}

// ── SEO Metadata ────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const supabase = await createClient();
    const { data: form } = await supabase
      .from('lead_capture_forms')
      .select('name, config')
      .eq('id', params.id)
      .eq('status', 'published')
      .single();

    if (!form) return { title: 'Form | Amira Voice AI' };

    const config = form.config || {};
    return {
      title: config.title || form.name || 'Form | Amira Voice AI',
      description: config.description || 'Fill out this form to get in touch with us.',
    };
  } catch {
    return { title: 'Form | Amira Voice AI' };
  }
}

// ── Page Server Component ────────────────────────────────────────────────────
export default async function PublicFormPage({ params }: Props) {
  // Server-side fetch — runs at build time and every 60s (ISR)
  let formData: any = null;
  let errorMsg: string | null = null;

  try {
    const supabase = await createClient();
    const { data: form, error } = await supabase
      .from('lead_capture_forms')
      .select('*')
      .eq('id', params.id)
      .eq('status', 'published')
      .single();

    if (error || !form) {
      errorMsg = 'This form does not exist or has been deactivated.';
    } else {
      formData = form;
    }
  } catch (err: any) {
    errorMsg = err.message || 'Failed to load form.';
  }

  // Track view increment happens client-side (below) to avoid blocking SSR render
  return (
    <PublicFormClient
      formId={params.id}
      initialForm={formData}
      initialError={errorMsg}
    />
  );
}
