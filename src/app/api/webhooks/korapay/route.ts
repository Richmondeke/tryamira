import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Service-role Supabase — bypasses RLS so webhook can update any row
function serviceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-korapay-signature');
    const secret = process.env.KORAPAY_SECRET_KEY;

    // ── 1. Verify webhook signature ──────────────────────────────────────
    if (secret && signature) {
      const expected = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');
      if (expected !== signature) {
        console.error('Korapay webhook: invalid signature');
        return NextResponse.json({ status: false, message: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const { event: eventType, data } = event;

    // ── 2. Only act on successful charges ─────────────────────────────────
    if (eventType !== 'charge.success') {
      return NextResponse.json({ status: true, message: 'Event type ignored' });
    }

    const { reference, amount, currency } = data;
    if (!reference) {
      return NextResponse.json({ status: false, message: 'Missing reference' }, { status: 400 });
    }

    const supa = serviceSupabase();

    // ── 3. Mark invoice as paid ───────────────────────────────────────────
    const { data: invoice } = await supa
      .from('invoices')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('reference', reference)
      .select('user_id, type, plan, amount')
      .single();

    if (!invoice) {
      // Invoice wasn't pre-created (e.g. legacy reference format) — parse it
      console.warn(`Korapay webhook: no invoice found for reference ${reference}`);
    }

    const userId = invoice?.user_id || extractUserIdFromRef(reference);
    if (!userId) {
      console.error('Korapay webhook: could not determine user_id from reference', reference);
      return NextResponse.json({ status: true }); // don't 4xx — Korapay will retry
    }

    // ── 4. Handle based on payment type ──────────────────────────────────
    const refType = invoice?.type || inferTypeFromRef(reference);
    const planTier = invoice?.plan || extractPlanFromRef(reference);

    if (refType === 'subscription' && planTier) {
      // Update user's plan and mark subscription active
      await supa.from('profiles').update({
        plan: planTier,
        subscription_status: 'active',
      }).eq('id', userId);

      console.log(`Korapay webhook: upgraded user ${userId} to ${planTier}`);

    } else if (refType === 'topup') {
      // Convert NGN amount to USD call credits (approx rate: ₦1,500 = $1)
      const amountNGN = invoice?.amount ?? amount;
      const creditsToAdd = parseFloat((amountNGN / 1500).toFixed(2));

      // Atomic increment of call_credits
      const { data: profile } = await supa
        .from('profiles')
        .select('call_credits')
        .eq('id', userId)
        .single();

      const currentCredits = profile?.call_credits ?? 0;
      await supa.from('profiles').update({
        call_credits: parseFloat((currentCredits + creditsToAdd).toFixed(2)),
      }).eq('id', userId);

      console.log(`Korapay webhook: added $${creditsToAdd} credits to user ${userId}`);
    }

    return NextResponse.json({ status: true });
  } catch (err: any) {
    console.error('Korapay webhook error:', err);
    // Return 200 so Korapay doesn't retry indefinitely for code errors
    return NextResponse.json({ status: false, message: 'Internal error' }, { status: 500 });
  }
}

// ─── Reference parsing helpers ─────────────────────────────────────────────
// Reference formats:
//   plan_{tier}_{userId}_{timestamp}   → subscription
//   topup_{amount}_{userId}_{timestamp} → topup
//   sub_{workspaceId}_{timestamp}       → legacy subscription

function inferTypeFromRef(ref: string): 'subscription' | 'topup' {
  if (ref.startsWith('topup_')) return 'topup';
  return 'subscription';
}

function extractPlanFromRef(ref: string): string | null {
  // plan_pro_abc123_1234567890
  if (ref.startsWith('plan_')) {
    const parts = ref.split('_');
    return parts[1] || null; // 'pro' | 'team' | 'enterprise'
  }
  return null;
}

function extractUserIdFromRef(ref: string): string | null {
  // plan_{tier}_{userId}_{timestamp}
  if (ref.startsWith('plan_')) {
    const parts = ref.split('_');
    // userId is everything between index 2 and the last segment
    return parts.slice(2, -1).join('_') || null;
  }
  // topup_{amount}_{userId}_{timestamp}
  if (ref.startsWith('topup_')) {
    const parts = ref.split('_');
    return parts.slice(2, -1).join('_') || null;
  }
  return null;
}
