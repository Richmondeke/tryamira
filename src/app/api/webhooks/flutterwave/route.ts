import { NextResponse } from 'next/server';
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
    const verifHash = req.headers.get('verif-hash');
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;

    // ── 1. Verify webhook secret hash ─────────────────────────────────────
    if (secretHash && verifHash) {
      if (verifHash !== secretHash) {
        console.error('Flutterwave webhook: invalid verif-hash');
        return NextResponse.json({ status: false, message: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const { event: eventType, data } = event;

    // ── 2. Only act on successful charges ─────────────────────────────────
    if (eventType !== 'charge.completed') {
      return NextResponse.json({ status: true, message: 'Event type ignored' });
    }

    // Verify charge status is successful
    if (data.status !== 'successful') {
      console.log(`Flutterwave webhook: transaction status is ${data.status}, ignoring`);
      return NextResponse.json({ status: true, message: 'Transaction not successful' });
    }

    const reference = data.tx_ref;
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
      console.warn(`Flutterwave webhook: no invoice found for reference ${reference}`);
    }

    const userId = invoice?.user_id || extractUserIdFromRef(reference);
    if (!userId) {
      console.error('Flutterwave webhook: could not determine user_id from reference', reference);
      return NextResponse.json({ status: true }); // don't 4xx — Flutterwave will retry
    }

    // ── 4. Handle based on payment type ──────────────────────────────────
    const refType = invoice?.type || inferTypeFromRef(reference);
    const planTier = invoice?.plan || extractPlanFromRef(reference);

    if (refType === 'subscription' && planTier) {
      // Determine credits to add based on plan tier
      let creditsToAdd = 0;
      if (planTier === 'pro') creditsToAdd = 50;
      else if (planTier === 'team') creditsToAdd = 150;
      else if (planTier === 'enterprise') creditsToAdd = 500;

      // Fetch current credits
      const { data: profile } = await supa
        .from('profiles')
        .select('call_credits')
        .eq('id', userId)
        .single();
      
      const currentCredits = profile?.call_credits ?? 0;

      // Update user's plan, mark subscription active, and add credits
      await supa.from('profiles').update({
        plan: planTier,
        subscription_status: 'active',
        call_credits: parseFloat((currentCredits + creditsToAdd).toFixed(2)),
      }).eq('id', userId);

      console.log(`Flutterwave webhook: upgraded user ${userId} to ${planTier} and added $${creditsToAdd} credits`);

    } else if (refType === 'topup') {
      // Convert NGN amount to USD call credits (approx rate: ₦1,500 = $1)
      const amountNGN = invoice?.amount ?? data.amount;
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

      console.log(`Flutterwave webhook: added $${creditsToAdd} credits to user ${userId}`);
    }

    return NextResponse.json({ status: true });
  } catch (err: any) {
    console.error('Flutterwave webhook error:', err);
    // Return 200/500 depending on nature, but return 500 for server issues so we track them
    return NextResponse.json({ status: false, message: 'Internal error' }, { status: 500 });
  }
}

// ─── Reference parsing helpers ─────────────────────────────────────────────
// Reference formats:
//   flwplan{tier}{cleanUserId}{timestamp}
//   flwtopup{amountNGN}usr{cleanUserId}ts{timestamp}

function inferTypeFromRef(ref: string): 'subscription' | 'topup' {
  if (ref.startsWith('flwtopup')) return 'topup';
  return 'subscription';
}

function extractPlanFromRef(ref: string): string | null {
  if (ref.startsWith('flwplan')) {
    if (ref.includes('enterprise')) return 'enterprise';
    if (ref.includes('team')) return 'team';
    if (ref.includes('pro')) return 'pro';
  }
  return null;
}

function extractUserIdFromRef(ref: string): string | null {
  // 1. Subscription format: flwplan{tier}{cleanUserId}{timestamp}
  if (ref.startsWith('flwplan')) {
    let tierStr = '';
    if (ref.includes('enterprise')) tierStr = 'enterprise';
    else if (ref.includes('team')) tierStr = 'team';
    else if (ref.includes('pro')) tierStr = 'pro';

    if (tierStr) {
      const prefix = `flwplan${tierStr}`;
      const cleanUserId = ref.slice(prefix.length, prefix.length + 32);
      if (cleanUserId.length === 32) {
        return cleanUserId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
      }
    }
  }

  // 2. Top-up format: flwtopup{amountNGN}usr{cleanUserId}ts{timestamp}
  if (ref.startsWith('flwtopup')) {
    const usrIndex = ref.indexOf('usr');
    if (usrIndex !== -1) {
      const cleanUserId = ref.slice(usrIndex + 3, usrIndex + 3 + 32);
      if (cleanUserId.length === 32) {
        return cleanUserId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
      }
    }
  }

  return null;
}
