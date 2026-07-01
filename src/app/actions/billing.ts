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
//  Creates a Flutterwave v4 checkout session (or falls back to Korapay).
export async function createPlanCheckout(tier: PlanTier, userEmail: string, userId: string) {
  const plan = PLANS[tier];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://heyamira.com';
  const cleanUserId = userId.replace(/-/g, '');
  const timestamp = Date.now();
  
  // Alphanumeric reference for Flutterwave
  const flwReference = `flwplan${tier}${cleanUserId}${timestamp}`;
  // Standard reference for Korapay
  const koraReference = `plan_${tier}_${userId}_${timestamp}`;

  // 1. Try Flutterwave v3
  const flwSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;

  if (flwSecretKey) {
    try {
      // Pre-create invoice record in pending state using Flutterwave reference
      const supa = serviceSupabase();
      await supa.from('invoices').insert({
        user_id: userId,
        reference: flwReference,
        amount: plan.amountNGN,
        currency: 'NGN',
        type: 'subscription',
        plan: tier,
        status: 'pending',
      });

      // Create Flutterwave v3 standard checkout payment
      const sessionResponse = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${flwSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_ref: flwReference,
          amount: plan.amountNGN,
          currency: 'NGN',
          redirect_url: `${appUrl}/dashboard/account?tab=billing&payment=success&plan=${tier}`,
          customer: {
            email: userEmail,
          },
          customizations: {
            title: 'Amira Premium Plan',
            description: `Subscription to Amira ${tier} plan`,
            logo: 'https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png',
          }
        }),
      });

      const sessionResult = await sessionResponse.json();

      if (sessionResponse.ok && sessionResult.status === 'success' && sessionResult.data?.link) {
        return { url: sessionResult.data.link };
      } else {
        throw new Error(sessionResult.message || 'Failed to initialize Flutterwave v3 session');
      }
    } catch (flwError: any) {
      console.error('Flutterwave flow failed, falling back to Korapay:', flwError);
    }
  }

  // 2. Fallback to Korapay Flow
  const secretKey = process.env.KORAPAY_SECRET_KEY;
  if (!secretKey) {
    // Demo/dev fallback — record a pending invoice and redirect to success
    const supa = serviceSupabase();
    await supa.from('invoices').insert({
      user_id: userId,
      reference: koraReference,
      amount: plan.amountNGN,
      currency: 'NGN',
      type: 'subscription',
      plan: tier,
      status: 'pending',
    });
    return { url: `/dashboard/account?tab=billing&payment=success&plan=${tier}` };
  }

  // Pre-create invoice record in pending state using Korapay reference
  const supa = serviceSupabase();
  await supa.from('invoices').insert({
    user_id: userId,
    reference: koraReference,
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
      reference: koraReference,
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
    return { url: result.data.checkout_url };
  }

  throw new Error(result.message || 'Failed to initialize payment. Please try again.');
}

// ─── 2. Initiate call-credit top-up checkout ───────────────────────────────
//  Creates a Flutterwave v4 checkout session (or falls back to Korapay).
export async function createTopupCheckout(
  amountNGN: number,
  userEmail: string,
  userId: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://heyamira.com';
  const cleanUserId = userId.replace(/-/g, '');
  const timestamp = Date.now();

  const flwReference = `flwtopup${amountNGN}usr${cleanUserId}ts${timestamp}`;
  const koraReference = `topup_${amountNGN}_${userId}_${timestamp}`;

  // 1. Try Flutterwave v3
  const flwSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;

  if (flwSecretKey) {
    try {
      // Pre-create invoice record in pending state using Flutterwave reference
      const supa = serviceSupabase();
      await supa.from('invoices').insert({
        user_id: userId,
        reference: flwReference,
        amount: amountNGN,
        currency: 'NGN',
        type: 'topup',
        status: 'pending',
      });

      // Create Flutterwave v3 standard checkout payment
      const sessionResponse = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${flwSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_ref: flwReference,
          amount: amountNGN,
          currency: 'NGN',
          redirect_url: `${appUrl}/dashboard/account?tab=billing&payment=topup_success&amount=${amountNGN}`,
          customer: {
            email: userEmail,
          },
          customizations: {
            title: 'Amira Credits Top-up',
            description: `Top-up of $${(amountNGN / 1500).toFixed(2)} credits`,
            logo: 'https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png',
          }
        }),
      });

      const sessionResult = await sessionResponse.json();

      if (sessionResponse.ok && sessionResult.status === 'success' && sessionResult.data?.link) {
        return { url: sessionResult.data.link };
      } else {
        throw new Error(sessionResult.message || 'Failed to initialize Flutterwave v3 session');
      }
    } catch (flwError: any) {
      console.error('Flutterwave flow failed, falling back to Korapay:', flwError);
    }
  }

  // 2. Fallback to Korapay Flow
  const secretKey = process.env.KORAPAY_SECRET_KEY;
  if (!secretKey) {
    const supa = serviceSupabase();
    await supa.from('invoices').insert({
      user_id: userId,
      reference: koraReference,
      amount: amountNGN,
      currency: 'NGN',
      type: 'topup',
      status: 'pending',
    });
    return { url: `/dashboard/account?tab=billing&payment=topup_success&amount=${amountNGN}` };
  }

  const supa = serviceSupabase();
  await supa.from('invoices').insert({
    user_id: userId,
    reference: koraReference,
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
      reference: koraReference,
      notification_url: `${appUrl}/api/webhooks/korapay`,
      redirect_url: `${appUrl}/dashboard/account?tab=billing&payment=topup_success&amount=${amountNGN}`,
      merchant_bears_cost: true,
      customer: { email: userEmail },
      metadata: { user_id: userId, type: 'topup', amount: amountNGN },
    }),
  });

  const result = await response.json();

  if (result.status && result.data?.checkout_url) {
    return { url: result.data.checkout_url };
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
export async function createKorapayCheckout(
  workspaceId: number,
  planAmount: number,
  customerEmail: string
) {
  // Try to determine the active plan tier based on planAmount
  let tier: PlanTier = 'pro';
  if (planAmount === PLANS.team.amountNGN) {
    tier = 'team';
  } else if (planAmount === PLANS.enterprise.amountNGN) {
    tier = 'enterprise';
  }

  // Get current user id
  let userId = `legacy_ws_${workspaceId}`;
  try {
    const supa = createClient();
    const { data: { user } } = await supa.auth.getUser();
    if (user) {
      userId = user.id;
    }
  } catch (err) {
    console.error('Failed to get user session for legacy checkout:', err);
  }

  // Delegate to createPlanCheckout which handles Flutterwave primarily and Korapay fallback
  return await createPlanCheckout(tier, customerEmail, userId);
}
