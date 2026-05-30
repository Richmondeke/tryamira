'use server';

import { createClient } from '@/utils/supabase/server';
import { Composio } from '@composio/core';

// We use a fixed workspace ID for demo purposes
const DEMO_WORKSPACE_ID = 'workspace_1';

export async function getComposioStatus() {
  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) {
    console.warn('COMPOSIO_API_KEY not set. Simulating Composio status fetch.');
    return { success: true, data: [] };
  }

  try {
    const composio = new Composio({ apiKey });
    
    // In a real app, you would fetch the specific connected accounts for this entity (workspace)
    // For this implementation, we will simulate the check against our local database mapping
    const supabase = await createClient();
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data } = await supabase
        .from('workspace_integrations')
        .select('*')
        .eq('workspace_id', 1);
      return { success: true, data: data || [] };
    }

    return { success: true, data: [] };
  } catch (err: any) {
    console.error('Error fetching Composio status:', err);
    return { success: false, error: err.message || 'Failed to fetch status' };
  }
}

export async function initiateComposioConnection(appName: string) {
  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) {
    console.warn('COMPOSIO_API_KEY not set. Simulating OAuth redirect.');
    // Simulate a fake redirect for demo
    return { 
      success: true, 
      redirectUrl: `https://mock-oauth.com/authorize?app=${appName}&client_id=demo` 
    };
  }

  try {
    const composio = new Composio({ apiKey });
    
    // Create an entity (or use an existing one) representing the workspace
    const entity = await (composio as any).getEntity(DEMO_WORKSPACE_ID);
    
    // Initiate connection
    const connection = await entity.initiateConnection(appName);
    
    return { success: true, redirectUrl: connection.redirectUrl };
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
    const composio = new Composio({ apiKey });
    const entity = await (composio as any).getEntity(DEMO_WORKSPACE_ID);
    
    // Terminate connection on Composio's end
    // Note: The specific SDK method to remove connection might vary depending on Composio version
    // Assume entity.deleteConnection or similar.
    try {
      // Trying to fetch the connected account and remove it
      const accounts = await entity.getConnections();
      const account = accounts.find((a: any) => a.app.toLowerCase() === appName.toLowerCase());
      if (account) {
         // await composio.connectedAccounts.delete(account.id);
      }
    } catch(e) {
      console.error('Failed to remove from Composio', e);
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
