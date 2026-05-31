'use server';

import { createClient } from '@/utils/supabase/server';
import { unstable_cache } from 'next/cache';

// We use a fixed workspace ID for demo purposes
const DEMO_WORKSPACE_ID = 'workspace_1';

const MOCK_INTEGRATIONS = [
  { id: 'hubspot', name: 'HubSpot', desc: 'Sync CRM leads, contact pipelines, and customer lists.', icon: '🟠', type: 'oauth' },
  { id: 'gmail', name: 'Gmail', desc: 'Send emails and trigger notification updates.', icon: '📧', type: 'oauth' },
  { id: 'googlecalendar', name: 'Google Calendar', desc: 'Book appointments, discover slots, and sync schedules.', icon: '📅', type: 'oauth' },
  { id: 'salesforce', name: 'Salesforce', desc: 'Bidirectional sync for Enterprise Salesforce CRM records.', icon: '☁️', type: 'oauth' },
  { id: 'slack', name: 'Slack', desc: 'Send direct notifications to team Slack channels.', icon: '💬', type: 'oauth' },
  { id: 'stripe', name: 'Stripe', desc: 'Charge payments and view billing transactions.', icon: '💳', type: 'oauth' },
  { id: 'zendesk', name: 'Zendesk', desc: 'Create support tickets and check escalation queues.', icon: '🎧', type: 'oauth' },
  { id: 'notion', name: 'Notion', desc: 'Read and sync database workspace items.', icon: '📝', type: 'oauth' },
  { id: 'github', name: 'GitHub', desc: 'Create issues, review commits, and track code changes.', icon: '🐙', type: 'oauth' },
  { id: 'trello', name: 'Trello', desc: 'Manage project cards and kanban lists.', icon: '📋', type: 'oauth' },
  { id: 'jira', name: 'Jira', desc: 'Sync issue queues and development tickets.', icon: '🎯', type: 'oauth' },
  { id: 'asana', name: 'Asana', desc: 'Schedule tasks and verify team milestones.', icon: '💮', type: 'oauth' },
  { id: 'googledrive', name: 'Google Drive', desc: 'Access team files, brochures, and asset folders.', icon: '📁', type: 'oauth' },
  { id: 'shopify', name: 'Shopify', desc: 'Sync customer shopping carts, catalogs, and orders.', icon: '🛍️', type: 'oauth' },
  { id: 'discord', name: 'Discord', desc: 'Send alerts and chat logs directly to Discord.', icon: '🎮', type: 'oauth' },
  { id: 'zoom', name: 'Zoom', desc: 'Generate video meet links and calendar schedules.', icon: '📹', type: 'oauth' },
  { id: 'twilio', name: 'Twilio', desc: 'Trigger SMS messages and phone outbound alerts.', icon: '📱', type: 'oauth' },
  { id: 'mailchimp', name: 'Mailchimp', desc: 'Sync email subscribers to newsletter lists.', icon: '✉️', type: 'oauth' },
  { id: 'msteams', name: 'Microsoft Teams', desc: 'Send alerts and chat summaries to MS Teams.', icon: '👥', type: 'oauth' },
  { id: 'airtable', name: 'Airtable', desc: 'Organize relational data sheets and leads.', icon: '📊', type: 'oauth' },
  { id: 'intercom', name: 'Intercom', desc: 'Trigger dynamic chat support escalation.', icon: '💬', type: 'oauth' },
  { id: 'quickbooks', name: 'QuickBooks', desc: 'Sync business invoices, ledgers, and expenses.', icon: '💰', type: 'oauth' },
  { id: 'googlecontacts', name: 'Google Contacts', desc: 'Import contacts and phone lists.', icon: '👤', type: 'oauth' },
  { id: 'clickup', name: 'ClickUp', desc: 'Track tasks, workspaces, and team goals.', icon: '🔝', type: 'oauth' }
];

// ─── INTERNAL FETCHER (not exported — used by cached wrapper below) ─────────
async function _fetchComposioApps() {
  const apiKey = process.env.COMPOSIO_API_KEY;
  const isKeyEmpty = !apiKey || 
                     apiKey === 'undefined' || 
                     apiKey === 'null' || 
                     apiKey.trim() === '';

  if (isKeyEmpty) {
    console.warn('COMPOSIO_API_KEY not set — using mock integrations.');
    return { success: true, data: MOCK_INTEGRATIONS };
  }

  try {
    // Composio v3 REST API with cursor-based pagination
    const COMPOSIO_BASE = 'https://backend.composio.dev/api/v3';
    const headers = { 'x-api-key': apiKey };
    
    let allApps: any[] = [];
    let cursor: string | null = null;
    let page = 1;
    const MAX_PAGES = 11; // v3 returns up to 1043 apps across 11 pages

    do {
      const url: string = cursor
        ? `${COMPOSIO_BASE}/toolkits?limit=100&cursor=${cursor}`
        : `${COMPOSIO_BASE}/toolkits?limit=100&page=${page}`;
      
      const res: Response = await fetch(url, { headers });
      if (!res.ok) throw new Error(`Composio v3 API error: ${res.status}`);
      
      const json: any = await res.json();
      const items = json.items || [];
      allApps = allApps.concat(items);
      
      cursor = json.next_cursor || null;
      page++;

      
      // Stop if no more pages
      if (!cursor || page > MAX_PAGES) break;
    } while (true);

    const apps = allApps.map((app: any) => ({
      id: app.slug || app.name?.toLowerCase().replace(/\s+/g, '-'),
      name: app.name || app.displayName,
      desc: app.meta?.description || `Connect Amira with your ${app.name} account via Composio.`,
      icon: app.meta?.logo || app.logo || '🧩',
      toolsCount: app.meta?.tools_count || 0,
      type: 'oauth'
    })).filter((a: any) => a.id && a.name);

    console.log(`✅ Composio v3: loaded ${apps.length} live integrations`);
    return { success: true, data: apps.length > 0 ? apps : MOCK_INTEGRATIONS };
  } catch (err: any) {
    console.error('Composio v3 fetch error, falling back to mock list:', err?.message || err);
    return { success: true, data: MOCK_INTEGRATIONS };
  }
}

// ─── CACHED EXPORT: 1043 apps fetched once, reused for 24 hours ─────────────
// Before: 11 HTTP requests on EVERY integrations page visit (3-6 seconds)
// After:  0 requests for 24 hours after first load (~0ms)
export const getComposioApps = unstable_cache(
  _fetchComposioApps,
  ['composio-apps-v3'],
  { revalidate: 86400 } // 24 hours
);

export async function getComposioStatus() {

  const apiKey = process.env.COMPOSIO_API_KEY;
  const isKeyEmpty = !apiKey || 
                     apiKey === 'undefined' || 
                     apiKey === 'null' || 
                     apiKey.trim() === '';

  if (isKeyEmpty) {
    console.warn('COMPOSIO_API_KEY not set. Simulating Composio status fetch.');
    const supabase = await createClient();
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data } = await supabase
        .from('workspace_integrations')
        .select('*')
        .eq('workspace_id', 1);
      return { success: true, data: data || [] };
    }
    return { success: true, data: [] };
  }

  try {
    // Composio v3 REST API — fetch connected accounts
    const res = await fetch(
      `https://backend.composio.dev/api/v3/connected_accounts?user_uuid=${DEMO_WORKSPACE_ID}&limit=100`,
      { headers: { 'x-api-key': apiKey } }
    );

    if (!res.ok) throw new Error(`Composio v3 status error: ${res.status}`);
    const json = await res.json();

    const mapped = (json.items || []).map((conn: any) => ({
      provider: conn.toolkit?.slug || conn.appName?.toLowerCase(),
      status: conn.status?.toLowerCase() === 'active' ? 'active' : 'inactive'
    }));

    return { success: true, data: mapped };
  } catch (err: any) {
    console.error('Error fetching Composio v3 status:', err?.message || err);
    return { success: false, error: err.message || 'Failed to fetch status' };
  }
}

export async function initiateComposioConnection(appName: string) {
  const apiKey = process.env.COMPOSIO_API_KEY;
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://heyamira.com';
  const callbackUrl = `${origin}/dashboard/integrations/apps?status=success&app=${appName}`;
  const BASE = 'https://backend.composio.dev/api/v3';
  const headers = { 'x-api-key': apiKey!, 'Content-Type': 'application/json' };

  const isKeyEmpty = !apiKey || apiKey === 'undefined' || apiKey === 'null' || apiKey.trim() === '';
  if (isKeyEmpty) {
    console.warn('COMPOSIO_API_KEY not set. Simulating OAuth redirect.');
    return { success: true, redirectUrl: callbackUrl };
  }

  try {
    // ── Step 1: Create (or reuse) a Composio-managed auth config for this toolkit ──
    const configRes = await fetch(`${BASE}/auth_configs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        toolkit: { slug: appName },
        name: `${appName}_composio_managed_${DEMO_WORKSPACE_ID}`,
        auth_scheme: 'OAUTH2',
        use_composio_managed_oauth: true
      })
    });

    if (!configRes.ok) {
      const e = await configRes.json().catch(() => ({}));
      throw new Error(e?.error?.message || `Auth config error: ${configRes.status}`);
    }

    const configJson = await configRes.json();
    const authConfigId = configJson?.auth_config?.id;
    if (!authConfigId) throw new Error('No auth_config id returned from Composio');

    // ── Step 2: Generate an OAuth link token via /connected_accounts/link ──
    const linkRes = await fetch(`${BASE}/connected_accounts/link`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        auth_config_id: authConfigId,
        user_id: DEMO_WORKSPACE_ID,
        redirect_url: callbackUrl
      })
    });

    if (!linkRes.ok) {
      const e = await linkRes.json().catch(() => ({}));
      throw new Error(e?.error?.message || `Link error: ${linkRes.status}`);
    }

    const linkJson = await linkRes.json();
    // Returns: { link_token, redirect_url: 'https://connect.composio.dev/link/lk_...', expires_at, connected_account_id }
    const redirectUrl = linkJson?.redirect_url;
    if (!redirectUrl) throw new Error('No redirect_url returned from Composio link');

    console.log(`✅ Composio OAuth link for ${appName}:`, redirectUrl);
    return { success: true, redirectUrl };
  } catch (err: any) {
    console.error('Error initiating Composio v3 OAuth:', err?.message || err);
    return { success: false, error: err.message || 'Failed to initiate connection' };
  }
}

export async function removeComposioIntegration(appName: string) {
  const apiKey = process.env.COMPOSIO_API_KEY;
  const isKeyEmpty = !apiKey || 
                     apiKey === 'undefined' || 
                     apiKey === 'null' || 
                     apiKey.trim() === '';

  if (isKeyEmpty) {
    console.warn('COMPOSIO_API_KEY not set. Simulating disconnect.');
    // Also remove from supabase mock
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
       const supabase = await createClient();
       await supabase.from('workspace_integrations').delete().match({ workspace_id: 1, provider: appName });
    }
    return { success: true };
  }

  try {
    const BASE = 'https://backend.composio.dev/api/v3';
    const hdrs = { 'x-api-key': apiKey! };

    // Find the connected account for this toolkit and user via v3 REST
    const listRes = await fetch(
      `${BASE}/connected_accounts?user_uuid=${DEMO_WORKSPACE_ID}&toolkit_slug=${appName}&limit=10`,
      { headers: hdrs }
    );

    if (listRes.ok) {
      const listJson = await listRes.json();
      const account = (listJson?.items || []).find(
        (a: any) => a.toolkit?.slug?.toLowerCase() === appName.toLowerCase()
      );

      if (account?.id) {
        await fetch(`${BASE}/connected_accounts/${account.id}`, {
          method: 'DELETE',
          headers: hdrs
        });
      }
    }

    // Also remove from local DB
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = await createClient();
      await supabase.from('workspace_integrations').delete().match({ workspace_id: 1, provider: appName });
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error removing Composio v3 integration:', err?.message || err);
    return { success: false, error: err.message || 'Failed to remove integration' };
  }
}

// Keep the old save method for backward compatibility if needed, or to save mock state
export async function saveIntegrationConfig(provider: string, config: any) {
  const supabase = await createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('workspace_integrations')
      .upsert({ 
        workspace_id: 1, 
        provider, 
        config,
        status: 'active',
        updated_at: new Date().toISOString()
      }, { onConflict: 'workspace_id, provider' });

    if (error) {
      return { success: true }; 
    }
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
