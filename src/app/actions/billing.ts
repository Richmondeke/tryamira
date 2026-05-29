'use server';

import { redirect } from 'next/navigation';

export async function createKorapayCheckout(workspaceId: number, planAmount: number, customerEmail: string) {
  const secretKey = process.env.KORAPAY_SECRET_KEY;
  
  if (!secretKey) {
    console.warn('KORAPAY_SECRET_KEY is not configured. Simulating successful checkout creation.');
    // In demo mode, just redirect to a simulated success page or dashboard
    redirect('/dashboard/settings?checkout=success');
  }
  
  // Korapay Initialization Endpoint
  const response = await fetch('https://api.korapay.com/merchant/api/v1/charges/initialize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: planAmount,
      currency: "NGN", // or "USD" depending on your account
      reference: `sub_${workspaceId}_${Date.now()}`,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://heyamira.com'}/api/webhooks/korapay`,
      customer: {
        email: customerEmail,
      },
      merchant_bears_cost: true
    })
  });

  const result = await response.json();
  
  if (result.status && result.data?.checkout_url) {
    redirect(result.data.checkout_url);
  } else {
    throw new Error(result.message || 'Failed to initialize payment');
  }
}
