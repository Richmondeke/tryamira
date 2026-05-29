import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// In production, the webhook receiver must verify the signature
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-korapay-signature');
    const secret = process.env.KORAPAY_SECRET_KEY;

    if (!secret) {
      console.warn('Webhook received but KORAPAY_SECRET_KEY is not set.');
    } else if (signature) {
      const hash = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
      if (hash !== signature) {
        return NextResponse.json({ status: false, message: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success' || event.event === 'transfer.success') {
      const { reference, amount, status } = event.data;
      console.log(`Payment successful: ${reference} - Amount: ${amount}`);
      
      // The reference was formatted as: sub_{workspaceId}_{timestamp}
      if (reference && reference.startsWith('sub_')) {
        const workspaceId = parseInt(reference.split('_')[1], 10);
        
        if (!isNaN(workspaceId) && process.env.NEXT_PUBLIC_SUPABASE_URL) {
          // Initialize service role Supabase client to bypass RLS
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY || ''
          );

          // Update workspace subscription
          await supabase.from('workspaces').update({
            subscription_status: 'active',
            subscription_plan: 'Pro Plan'
          }).eq('id', workspaceId);
        }
      }
    }

    return NextResponse.json({ status: true });
  } catch (err: any) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ status: false, message: 'Webhook handler failed' }, { status: 500 });
  }
}
