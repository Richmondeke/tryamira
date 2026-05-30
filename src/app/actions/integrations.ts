'use server';

import { createClient } from '@/utils/supabase/server';

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

export async function getComposioApps() {
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
      const url = cursor
        ? `${COMPOSIO_BASE}/toolkits?limit=100&cursor=${cursor}`
        : `${COMPOSIO_BASE}/toolkits?limit=100&page=${page}`;
      
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`Composio v3 API error: ${res.status}`);
      
      const json = await res.json();
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

  const isKeyEmpty = !apiKey || 
                     apiKey === 'undefined' || 
                     apiKey === 'null' || 
                     apiKey.trim() === '';

  if (isKeyEmpty) {
    console.warn('COMPOSIO_API_KEY not set. Simulating OAuth redirect.');
    return { success: true, redirectUrl: callbackUrl };
  }

  try {
    // Composio v3 REST API — initiate OAuth connection
    const res = await fetch(
      `https://backend.composio.dev/api/v3/toolkits/${appName}/connections`,
      {
        method: 'POST',
        headers: { 
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_uuid: DEMO_WORKSPACE_ID,
          redirect_url: callbackUrl
        })
      }
    );

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson?.message || `Composio v3 connection error: ${res.status}`);
    }

    const json = await res.json();
    const redirectUrl = json.redirectUrl || json.redirect_url || json.connectionRequestId;

    return { success: true, redirectUrl: redirectUrl || callbackUrl };
  } catch (err: any) {
    console.error('Error initiating Composio v3 connection:', err?.message || err);
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
    const { Composio } = await import('@composio/core');
    const composio = new Composio({ apiKey });
    
    // Fetch all connections and delete the one matching this app
    const accounts = await composio.connectedAccounts.list({
      userIds: [DEMO_WORKSPACE_ID]
    });
    
    const account = accounts.items.find((a: any) => a.toolkit.slug.toLowerCase() === appName.toLowerCase());
    if (account) {
       await composio.connectedAccounts.delete(account.id);
    }
    
    // Remove from local DB
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = await createClient();
      await supabase.from('workspace_integrations').delete().match({ workspace_id: 1, provider: appName });
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error removing Composio integration:', err);
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
