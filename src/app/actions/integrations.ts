'use server';

import { createClient } from '@/utils/supabase/server';
import { unstable_cache } from 'next/cache';

// ── Helper: get user's real workspace_id from DB ──────────────────────────
async function getUserWorkspaceId(supabase: any, userId: string): Promise<string> {
  const { data } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();
  return data?.workspace_id || userId; // fallback to userId as workspace
}


const MOCK_INTEGRATIONS = [
  // ── 1. CRMs & Pipeline Management ──
  { id: 'hubspot', name: 'HubSpot', desc: 'Sync CRM leads, contact pipelines, and customer lists.', icon: '🟠', type: 'oauth', category: 'crm' },
  { id: 'salesforce', name: 'Salesforce', desc: 'Bidirectional sync for Enterprise Salesforce CRM records.', icon: '☁️', type: 'oauth', category: 'crm' },
  { id: 'zohocrm', name: 'Zoho CRM', desc: 'Manage sales pipelines, accounts, and deal conversions.', icon: '💼', type: 'oauth', category: 'crm' },
  { id: 'pipedrive', name: 'Pipedrive', desc: 'Automate sales stages, activities, and won deals.', icon: '🟢', type: 'oauth', category: 'crm' },
  { id: 'activecampaign', name: 'ActiveCampaign', desc: 'CRM automation, lead tagging, and pipeline scoring.', icon: '⚡', type: 'oauth', category: 'crm' },

  // ── 2. Lead Qualification & Nurturing ──
  { id: 'apollo', name: 'Apollo.io', desc: 'Enrich lead contacts, company data, and buyer intent.', icon: '🚀', type: 'oauth', category: 'lead_gen' },
  { id: 'linkedin', name: 'LinkedIn', desc: 'Engage B2B decision makers and prospect accounts.', icon: '💼', type: 'oauth', category: 'lead_gen' },
  { id: 'lemlist', name: 'Lemlist', desc: 'Execute personalized multi-channel cold outreach.', icon: '🔥', type: 'oauth', category: 'nurturing' },
  { id: 'mailchimp', name: 'Mailchimp', desc: 'Sync qualified subscribers into automated email funnels.', icon: '✉️', type: 'oauth', category: 'nurturing' },
  { id: 'sendgrid', name: 'SendGrid', desc: 'Send automated email sequences and deal confirmations.', icon: '📬', type: 'oauth', category: 'nurturing' },
  { id: 'twilio', name: 'Twilio', desc: 'Dispatch instant SMS lead alerts and appointment reminders.', icon: '📱', type: 'oauth', category: 'nurturing' },
  { id: 'whatsapp', name: 'WhatsApp', desc: 'Inbound chat qualification and conversational sales triage.', icon: '💬', type: 'oauth', category: 'nurturing' },

  // ── 3. Lead Databases & Spreadsheets ──
  { id: 'googlesheets', name: 'Google Sheets', desc: 'Log real-time lead rows, call transcripts, and qualification scores.', icon: '📊', type: 'oauth', category: 'database' },
  { id: 'airtable', name: 'Airtable', desc: 'Relational database for customer CRM tables and deal tracking.', icon: '📈', type: 'oauth', category: 'database' },
  { id: 'notion', name: 'Notion', desc: 'Sync customer briefs, deal wikis, and sales knowledge bases.', icon: '📝', type: 'oauth', category: 'database' },
  { id: 'googlecontacts', name: 'Google Contacts', desc: 'Synchronize verified phone numbers and client contacts.', icon: '👤', type: 'oauth', category: 'database' },

  // ── 4. Scheduling & Sales Closers ──
  { id: 'calendly', name: 'Calendly', desc: 'Book executive demo meetings and discover open closer slots.', icon: '📅', type: 'oauth', category: 'scheduling' },
  { id: 'googlecalendar', name: 'Google Calendar', desc: 'Schedule appointments, check availability, and sync bookings.', icon: '🗓️', type: 'oauth', category: 'scheduling' },
  { id: 'gmail', name: 'Gmail', desc: 'Send sales proposals, follow-ups, and meeting invites.', icon: '📧', type: 'oauth', category: 'communication' },
  { id: 'outlook', name: 'Microsoft Outlook', desc: 'Sync enterprise sales emails, calendars, and contacts.', icon: '📨', type: 'oauth', category: 'communication' },
  { id: 'zoom', name: 'Zoom', desc: 'Auto-generate video conference links for booked demos.', icon: '📹', type: 'oauth', category: 'scheduling' },
  { id: 'slack', name: 'Slack', desc: 'Broadcast instant lead conversion alerts to sales channels.', icon: '💬', type: 'oauth', category: 'communication' },

  // ── 5. Customer Relationship & Ticketing ──
  { id: 'zendesk', name: 'Zendesk', desc: 'Customer support tickets, SLAs, and retention escalations.', icon: '🎧', type: 'oauth', category: 'support' },
  { id: 'intercom', name: 'Intercom', desc: 'Live chat lead qualification and dynamic customer triage.', icon: '💬', type: 'oauth', category: 'support' },
  { id: 'freshdesk', name: 'Freshdesk', desc: 'Helpdesk ticketing and VIP customer relationship queues.', icon: '🎫', type: 'oauth', category: 'support' },

  // ── 6. Invoicing & Deal Closing ──
  { id: 'stripe', name: 'Stripe', desc: 'Generate payment links and close paid subscriptions.', icon: '💳', type: 'oauth', category: 'payments' },
  { id: 'quickbooks', name: 'QuickBooks', desc: 'Create sales invoices, estimates, and customer billing ledgers.', icon: '💰', type: 'oauth', category: 'payments' },
  { id: 'docusign', name: 'DocuSign', desc: 'Send sales agreements and contracts for digital signatures.', icon: '✍️', type: 'oauth', category: 'payments' }
];

// Curated keywords & slugs for Sales, CRM, Lead Gen, Database & Customer Relationship teams
const SALES_CRM_KEYWORDS = [
  'crm', 'lead', 'sales', 'contact', 'customer', 'pipeline', 'deal', 'prospect', 'enrich',
  'email', 'mail', 'calendar', 'schedule', 'booking', 'appointment', 'meeting',
  'sheet', 'database', 'table', 'form', 'survey',
  'ticket', 'support', 'helpdesk', 'chat', 'message', 'sms', 'phone', 'telephony',
  'invoice', 'billing', 'payment', 'signature', 'contract', 'proposal'
];

const SALES_CRM_SLUGS = new Set([
  'hubspot', 'salesforce', 'zohocrm', 'pipedrive', 'close', 'copper', 'activecampaign',
  'apollo', 'linkedin', 'salesloft', 'outreach', 'lemlist', 'instantly', 'hunter', 'clearbit', 'lusha', 'zoominfo',
  'googlesheets', 'airtable', 'notion', 'googlecontacts', 'supabase', 'baserow', 'coda',
  'calendly', 'googlecalendar', 'calcom', 'gmail', 'outlook', 'zoom', 'slack', 'msteams', 'whatsapp', 'twilio', 'resend', 'sendgrid', 'mailchimp', 'brevo', 'customerio',
  'zendesk', 'intercom', 'freshdesk', 'front', 'helpscout', 'gorgias', 'crisp',
  'stripe', 'quickbooks', 'docusign', 'pandadoc', 'xero', 'shopify'
]);

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
    const MAX_PAGES = 11;

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

      if (!cursor || page > MAX_PAGES) break;
    } while (true);

    // Filter strictly for Sales, CRM, Lead Qualification, Nurturing & Database tools
    const apps = allApps
      .map((app: any) => ({
        id: app.slug || app.name?.toLowerCase().replace(/\s+/g, '-'),
        name: app.name || app.displayName,
        desc: app.meta?.description || `Connect Amira with your ${app.name} account to automate sales & customer workflows.`,
        icon: app.meta?.logo || app.logo || '🧩',
        toolsCount: app.meta?.tools_count || 0,
        type: 'oauth'
      }))
      .filter((a: any) => {
        if (!a.id || !a.name) return false;
        const cleanId = a.id.toLowerCase();
        const cleanName = a.name.toLowerCase();
        const cleanDesc = (a.desc || '').toLowerCase();

        // Exclude generic developer/cloud infrastructure noise
        if (['github', 'gitlab', 'docker', 'kubernetes', 'terraform', 'aws', 'bash', 'codeinterpreter', 'npm', 'pypi', 'composer', 'jenkins'].some(dev => cleanId.includes(dev))) {
          return false;
        }

        // Match against Sales/CRM slug whitelist or keywords
        const matchesSlug = SALES_CRM_SLUGS.has(cleanId) || Array.from(SALES_CRM_SLUGS).some(s => cleanId.includes(s));
        const matchesKeyword = SALES_CRM_KEYWORDS.some(kw => cleanName.includes(kw) || cleanDesc.includes(kw) || cleanId.includes(kw));

        return matchesSlug || matchesKeyword;
      });

    console.log(`✅ Composio v3 (Sales & CRM Focused): loaded ${apps.length} curated integrations`);
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

  let user: any = null;
  let entityId = 'anonymous';
  let workspaceId = 'anonymous';
  let supabaseClient: any = null;

  try {
    supabaseClient = await createClient();
    const { data } = await supabaseClient.auth.getUser();
    user = data?.user;
    if (user) {
      entityId = user.id;
      workspaceId = await getUserWorkspaceId(supabaseClient, user.id);
    }
  } catch {
    /* non-request scope fallback */
  }

  if (isKeyEmpty) {
    console.warn('COMPOSIO_API_KEY not set. Simulating Composio status fetch.');
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && supabaseClient) {
      const { data } = await supabaseClient
        .from('workspace_integrations')
        .select('*')
        .eq('workspace_id', workspaceId);
      return { success: true, data: data || [] };
    }
    return { success: true, data: [] };
  }

  try {
    // ── Ensure unique entity session is provisioned for this user ────────────
    if (entityId !== 'anonymous') {
      fetch(`https://backend.composio.dev/api/v3/entities`, {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: entityId })
      }).catch(() => {});
    }

    // Composio v3 REST API — fetch connected accounts STYLICALLY SCOPED to this user's unique entityId
    let res = await fetch(
      `https://backend.composio.dev/api/v3/connected_accounts?user_uuid=${entityId}&limit=100`,
      { headers: { 'x-api-key': apiKey } }
    );

    if (!res.ok) throw new Error(`Status error: ${res.status}`);
    let json = await res.json();
    let items = json.items || [];

    const mapped = items.map((conn: any) => ({
      provider: conn.toolkit?.slug || conn.appName?.toLowerCase(),
      status: conn.status?.toLowerCase() === 'active' ? 'active' : 'inactive'
    }));

    return { success: true, data: mapped };
  } catch (err: any) {
    console.error('Error fetching integration status:', err?.message || err);
    return { success: false, error: err.message || 'Failed to fetch status' };
  }
}

export async function initiateComposioConnection(appName: string, returnPath?: string) {
  const apiKey = process.env.COMPOSIO_API_KEY;
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://heyamira.com';
  const callbackUrl = returnPath 
    ? `${origin}${returnPath}?status=success&app=${appName}`
    : `${origin}/dashboard/integrations/apps?status=success&app=${appName}`;
  const BASE = 'https://backend.composio.dev/api/v3';
  const headers = { 'x-api-key': apiKey!, 'Content-Type': 'application/json' };

  // Get the real user ID — this becomes the Composio entity_id for isolation
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const entityId = user?.id || 'anonymous';

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
        name: `${appName}_composio_managed_${entityId}`, // unique per user
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

    // ── Step 2: Generate an OAuth link token — scoped to this user's entity_id ──
    const linkRes = await fetch(`${BASE}/connected_accounts/link`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        auth_config_id: authConfigId,
        user_id: entityId, // ← real user ID, not a shared demo ID
        redirect_url: callbackUrl,
        redirect_uri: callbackUrl,
        redirectUri: callbackUrl
      })
    });

    if (!linkRes.ok) {
      const e = await linkRes.json().catch(() => ({}));
      throw new Error(e?.error?.message || `Link error: ${linkRes.status}`);
    }

    const linkJson = await linkRes.json();
    const redirectUrl = linkJson?.redirect_url;
    if (!redirectUrl) throw new Error('No redirect_url returned from Composio link');

    console.log(`✅ Composio OAuth link for ${appName} (entity: ${entityId}):`, redirectUrl);
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

  // Always resolve real workspace for DB scoping
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const entityId = user?.id || 'anonymous';
  const workspaceId = user ? await getUserWorkspaceId(supabase, user.id) : entityId;

  if (isKeyEmpty) {
    console.warn('COMPOSIO_API_KEY not set. Simulating disconnect.');
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from('workspace_integrations').delete().match({ workspace_id: workspaceId, provider: appName });
    }
    return { success: true };
  }

  try {
    const BASE = 'https://backend.composio.dev/api/v3';
    const hdrs = { 'x-api-key': apiKey! };

    // Find the connected account for THIS user's entity_id only
    const listRes = await fetch(
      `${BASE}/connected_accounts?user_uuid=${entityId}&toolkit_slug=${appName}&limit=10`,
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

    // Remove from local DB scoped to this user's workspace
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from('workspace_integrations').delete().match({ workspace_id: workspaceId, provider: appName });
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error removing Composio v3 integration:', err?.message || err);
    return { success: false, error: err.message || 'Failed to remove integration' };
  }
}

export async function saveIntegrationConfig(provider: string, config: any) {
  const supabase = await createClient();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: true };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    const workspaceId = user ? await getUserWorkspaceId(supabase, user.id) : 'anonymous';

    const { error } = await supabase
      .from('workspace_integrations')
      .upsert({
        workspace_id: workspaceId,
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

export async function executeComposioAction(actionSlug: string, args: any = {}) {
  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey === 'null' || apiKey.trim() === '') {
    return { success: false, error: 'COMPOSIO_API_KEY is not configured.' };
  }

  let entityId = '79ce9d25-e98c-4a87-8119-6941ebb39daa';
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) entityId = user.id;
  } catch (_err) {
    // Called outside HTTP request scope (e.g. CLI script or webhook)
  }

  try {
    const { Composio } = await import('@composio/core');
    const composio = new Composio({
      apiKey,
      toolkitVersions: { gmail: '20260721_00', googlecalendar: '20260721_00' }
    });

    const res = await composio.tools.execute(actionSlug as any, {
      userId: entityId,
      arguments: args
    });

    if (res && res.successful) {
      return { success: true, data: res.data, logId: res.logId };
    } else {
      return { success: false, error: res?.error || 'Composio execution returned unsuccessful' };
    }
  } catch (err: any) {
    console.error('Error executing Composio action via SDK:', err);
    return { success: false, error: err.message || 'Failed to execute Composio action' };
  }
}
