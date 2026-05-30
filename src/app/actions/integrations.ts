'use server';

import { createClient } from '@/utils/supabase/server';

// We use a fixed workspace ID for demo purposes
const DEMO_WORKSPACE_ID = 'workspace_1';

export async function getComposioApps() {
  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) {
    // Return gorgeous library of top Composio integrations
    return {
      success: true,
      data: [
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
      ]
    };
  }

  try {
    const res = await fetch('https://backend.composio.dev/api/v1/apps', {
      headers: {
        'x-api-key': apiKey
      }
    });
    
    if (!res.ok) throw new Error('Failed to fetch from Composio API');
    const json = await res.json();
    
    // Map Composio apps directly
    const apps = (json.apps || []).map((app: any) => ({
      id: app.key || app.name.toLowerCase(),
      name: app.name,
      desc: app.description || `Connect Amira with your ${app.name} account via Composio.`,
      icon: app.logo || '🧩',
      type: 'oauth'
    }));
    
    return { success: true, data: apps };
  } catch (err: any) {
    console.error('Error fetching Composio apps:', err);
    return { success: false, error: err.message };
  }
}

export async function getComposioStatus() {
  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) {
    console.warn('COMPOSIO_API_KEY not set. Simulating Composio status fetch.');
    // Check locally in Supabase if URL is defined
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
    const { Composio } = await import('@composio/core');
    const composio = new Composio({ apiKey });
    
    // Fetch active connected accounts for the user (using workspace ID)
    const accounts = await composio.connectedAccounts.list({
      userIds: [DEMO_WORKSPACE_ID]
    });
    
    // Map connections format
    const mapped = accounts.items.map((conn: any) => ({
      provider: conn.toolkit.slug,
      status: conn.status.toLowerCase() === 'active' ? 'active' : 'inactive'
    }));
    
    return { success: true, data: mapped };
  } catch (err: any) {
    console.error('Error fetching Composio status:', err);
    return { success: false, error: err.message || 'Failed to fetch status' };
  }
}

export async function initiateComposioConnection(appName: string) {
  const apiKey = process.env.COMPOSIO_API_KEY;
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const callbackUrl = `${origin}/dashboard/integrations/apps?status=success&app=${appName}`;

  if (!apiKey) {
    console.warn('COMPOSIO_API_KEY not set. Simulating OAuth redirect.');
    // Simulate a redirect back to our callback success URL
    return { 
      success: true, 
      redirectUrl: callbackUrl
    };
  }

  try {
    const { Composio } = await import('@composio/core');
    const composio = new Composio({ apiKey });
    
    // Create a connection link using the recommended SDK link flow
    const connectionRequest = await composio.connectedAccounts.link(
      DEMO_WORKSPACE_ID,
      appName,
      { callbackUrl }
    );
    
    return { success: true, redirectUrl: connectionRequest.redirectUrl };
  } catch (err: any) {
    console.error('Error initiating Composio connection:', err);
    return { success: false, error: err.message || 'Failed to initiate connection' };
  }
}

export async function removeComposioIntegration(appName: string) {
  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) {
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
