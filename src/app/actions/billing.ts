'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { createClient as createServiceClient } from '@supabase/supabase-js';

// ─── Plan definitions ──────────────────────────────────────────────────────
export const PLANS = {
  pro: {
    name: 'Pro Tier',
    amountNGN: 45000,   // ₦45,000/mo
    amountUSD: 49,
  },
  team: {
    name: 'Team Plan',
    amountNGN: 135000,  // ₦135,000/mo
    amountUSD: 149,
  },
  enterprise: {
    name: 'Enterprise Plan',
    amountNGN: 450000,  // ₦450,000/mo
    amountUSD: 499,
  },
} as const;

export type PlanTier = keyof typeof PLANS;

// ─── Helpers ───────────────────────────────────────────────────────────────
function serviceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── 1. Initiate plan subscription checkout ────────────────────────────────
//  Creates a Korapay checkout session for a subscription tier upgrade.
//  Reference format: plan_{tier}_{userId}_{timestamp}
export async function createPlanCheckout(tier: PlanTier, userEmail: string, userId: string) {
  const plan = PLANS[tier];
  const secretKey = process.env.KORAPAY_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://heyamira.com';

  if (!secretKey) {
    // Demo/dev fallback — record a pending invoice and redirect to success
    redirect(`/dashboard/account?tab=billing&payment=success&plan=${tier}`);
  }

  const reference = `plan_${tier}_${userId}_${Date.now()}`;

  // Pre-create invoice record in pending state
  const supa = serviceSupabase();
  await supa.from('invoices').insert({
    user_id: userId,
    reference,
    amount: plan.amountNGN,
    currency: 'NGN',
    type: 'subscription',
    plan: tier,
    status: 'pending',
  });

  const response = await fetch('https://api.korapay.com/merchant/api/v1/charges/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: plan.amountNGN,
      currency: 'NGN',
      reference,
      notification_url: `${appUrl}/api/webhooks/korapay`,
      redirect_url: `${appUrl}/dashboard/account?tab=billing&payment=success&plan=${tier}`,
      merchant_bears_cost: true,
      customer: { email: userEmail, name: 'Amira User' },
      metadata: {
        plan: tier,
        user_id: userId,
        type: 'subscription',
      },
    }),
  });

  const result = await response.json();

  if (result.status && result.data?.checkout_url) {
    redirect(result.data.checkout_url);
  }

  throw new Error(result.message || 'Failed to initialize payment. Please try again.');
}

// ─── 2. Initiate call-credit top-up checkout ───────────────────────────────
//  Reference format: topup_{amount}_{userId}_{timestamp}
export async function createTopupCheckout(
  amountNGN: number,
  userEmail: string,
  userId: string
) {
  const secretKey = process.env.KORAPAY_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://heyamira.com';

  if (!secretKey) {
    redirect(`/dashboard/account?tab=billing&payment=topup_success&amount=${amountNGN}`);
  }

  const reference = `topup_${amountNGN}_${userId}_${Date.now()}`;

  const supa = serviceSupabase();
  await supa.from('invoices').insert({
    user_id: userId,
    reference,
    amount: amountNGN,
    currency: 'NGN',
    type: 'topup',
    status: 'pending',
  });

  const response = await fetch('https://api.korapay.com/merchant/api/v1/charges/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountNGN,
      currency: 'NGN',
      reference,
      notification_url: `${appUrl}/api/webhooks/korapay`,
      redirect_url: `${appUrl}/dashboard/account?tab=billing&payment=topup_success&amount=${amountNGN}`,
      merchant_bears_cost: true,
      customer: { email: userEmail },
      metadata: { user_id: userId, type: 'topup', amount: amountNGN },
    }),
  });

  const result = await response.json();

  if (result.status && result.data?.checkout_url) {
    redirect(result.data.checkout_url);
  }

  throw new Error(result.message || 'Failed to initialize top-up. Please try again.');
}

// ─── 3. Fetch live billing data for the current user ──────────────────────
export async function getBillingData() {
  try {
    const supa = createClient();
    const {
      data: { user },
    } = await supa.auth.getUser();
    if (!user) return null;

    // Fetch profile: plan, credits, sub status
    const { data: profile } = await supa
      .from('profiles')
      .select('plan, call_credits, subscription_status')
      .eq('id', user.id)
      .single();

    // Fetch invoice history (most recent 20)
    const { data: invoices } = await supa
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    return {
      userId: user.id,
      userEmail: user.email || '',
      plan: (profile?.plan as PlanTier | 'starter') || 'starter',
      callCredits: profile?.call_credits ?? 0,
      subscriptionStatus: profile?.subscription_status || 'inactive',
      invoices: invoices || [],
    };
  } catch {
    return null;
  }
}

// ─── 4. Legacy: keep old export name for compatibility ─────────────────────
// (used in manage billing button which we'll update)
export async function createKorapayCheckout(
  workspaceId: number,
  planAmount: number,
  customerEmail: string
) {
  const secretKey = process.env.KORAPAY_SECRET_KEY;
  if (!secretKey) {
    redirect('/dashboard/account?tab=billing&payment=success');
  }
  const response = await fetch('https://api.korapay.com/merchant/api/v1/charges/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: planAmount,
      currency: 'NGN',
      reference: `sub_${workspaceId}_${Date.now()}`,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://heyamira.com'}/api/webhooks/korapay`,
      customer: { email: customerEmail },
      merchant_bears_cost: true,
    }),
  });
  const result = await response.json();
  if (result.status && result.data?.checkout_url) {
    redirect(result.data.checkout_url);
  }
  throw new Error(result.message || 'Failed to initialize payment');
}
