'use server';

import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function getAgents() {
  const supabase = createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: true, data: [] };
  }

  try {
    const { data, error } = await supabase
      .from('workspace_agents')
      .select('*')
      .eq('workspace_id', 1)
      .order('created_at', { ascending: false });

    if (error) {
        console.warn('Fetch failed. Ignoring for demo.', error);
        return { success: true, data: [] };
    }
    
    return { success: true, data };
  } catch (err: any) {
    console.error('Error fetching agents:', err);
    return { success: false, error: err.message };
  }
}

export async function createAgent(name: string) {
  const supabase = createClient();
  const id = uuidv4();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: true, data: { id, name } };
  }

  try {
    const { error } = await supabase
      .from('workspace_agents')
      .insert({ 
        id,
        workspace_id: 1, 
        name,
        config: { agentName: name, voice: '11labs-josh', systemPrompt: 'You are a helpful assistant.', attachedWorkflows: [] },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.warn('Insert failed. Ignoring for demo.', error);
      return { success: true, data: { id, name } }; 
    }
    
    return { success: true, data: { id, name } };
  } catch (err: any) {
    console.error('Error creating agent:', err);
    return { success: false, error: err.message };
  }
}

export async function getAgentById(id: string) {
  const supabase = createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: true, data: null };
  }

  try {
    const { data, error } = await supabase
      .from('workspace_agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
        console.warn('Fetch failed. Ignoring for demo.', error);
        return { success: true, data: null };
    }
    
    return { success: true, data };
  } catch (err: any) {
    console.error('Error fetching agent:', err);
    return { success: false, error: err.message };
  }
}

export async function updateAgent(id: string, config: any) {
  const supabase = createClient();
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('workspace_agents')
      .update({ 
        name: config.agentName,
        config,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.warn('Update failed, ignoring for demo.', error);
      return { success: true }; 
    }
    
    return { success: true };
  } catch (err: any) {
    console.error('Error updating agent:', err);
    return { success: false, error: err.message };
  }
}
