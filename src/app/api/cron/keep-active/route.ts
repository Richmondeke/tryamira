import { NextRequest, NextResponse } from 'next/server';

/**
 * Vercel Cron Job — Supabase Keep-Alive
 * Pings the Supabase PostgREST root endpoint daily to prevent
 * the free-tier database from being paused due to inactivity.
 *
 * Schedule: Once daily at noon UTC (configured in vercel.json)
 */
export async function GET(request: NextRequest) {
  // Verify the request is from Vercel's cron scheduler
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing Supabase configuration' },
      { status: 500 }
    );
  }

  try {
    // Ping the PostgREST root — wakes the database engine
    // without requiring table-level RLS permissions
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    const status = response.status;
    const timestamp = new Date().toISOString();

    console.log(`[keep-active] Supabase ping: ${status} at ${timestamp}`);

    return NextResponse.json({
      success: true,
      supabaseStatus: status,
      timestamp,
    });
  } catch (error: any) {
    console.error('[keep-active] Failed:', error.message);
    return NextResponse.json(
      { error: 'Failed to ping Supabase', details: error.message },
      { status: 500 }
    );
  }
}
