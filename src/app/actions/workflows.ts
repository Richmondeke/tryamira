'use server';

import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export interface WorkflowRecipe {
  id: string;
  title: string;
  triggerEvent: string; // 'whatsapp_dm' | 'email_received' | 'form_submission' | 'call_completed' | 'ticket_created'
  agentId: string;
  agentName: string;
  useKnowledgeBase: boolean;
  intentCondition: string; // 'all' | 'pricing' | 'refund' | 'leads' | 'support'
  actionType: string; // 'auto_reply' | 'vapi_call' | 'composio_tool' | 'drip_campaign'
  targetTool?: string; // 'hubspot' | 'linear' | 'slack' | 'stripe'
  dripDays?: number;
  status: 'active' | 'paused';
  createdAt: string;
}

// Memory fallback store for dynamic session storage
let memoryWorkflows: WorkflowRecipe[] = [
  {
    id: 'wf-default-1',
    title: 'WhatsApp Lead Auto-Call & CRM Sync',
    triggerEvent: 'whatsapp_dm',
    agentId: 'agent-sales-1',
    agentName: 'Sales Closer AI',
    useKnowledgeBase: true,
    intentCondition: 'pricing',
    actionType: 'vapi_call',
    targetTool: 'hubspot',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'wf-default-2',
    title: 'Support Email Intent Parser & Stripe Refund',
    triggerEvent: 'email_received',
    agentId: 'agent-support-1',
    agentName: 'Support Genie',
    useKnowledgeBase: true,
    intentCondition: 'refund',
    actionType: 'composio_tool',
    targetTool: 'stripe',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'wf-default-3',
    title: 'Lead Form Submission 3-Day WhatsApp Drip',
    triggerEvent: 'form_submission',
    agentId: 'agent-outreach-1',
    agentName: 'Outreach Specialist',
    useKnowledgeBase: true,
    intentCondition: 'leads',
    actionType: 'drip_campaign',
    dripDays: 3,
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

export async function getWorkspaceWorkflows(): Promise<{ success: boolean; data: WorkflowRecipe[] }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .eq('activity_type', 'workflow_recipe');

      if (!error && data && data.length > 0) {
        const parsed = data.map(row => row.details as WorkflowRecipe);
        return { success: true, data: parsed };
      }
    }

    return { success: true, data: memoryWorkflows };
  } catch (err) {
    console.error('Error fetching workflows:', err);
    return { success: true, data: memoryWorkflows };
  }
}

export async function saveWorkflowRecipe(recipeData: Omit<WorkflowRecipe, 'id' | 'createdAt'>): Promise<{ success: boolean; data?: WorkflowRecipe; error?: string }> {
  try {
    const newRecipe: WorkflowRecipe = {
      ...recipeData,
      id: `wf-${uuidv4()}`,
      createdAt: new Date().toISOString()
    };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from('activities').insert({
        user_id: user.id,
        activity_type: 'workflow_recipe',
        description: `Created workflow: ${newRecipe.title}`,
        details: newRecipe
      });
    }

    memoryWorkflows.unshift(newRecipe);
    return { success: true, data: newRecipe };
  } catch (err: any) {
    console.error('Error saving workflow recipe:', err);
    return { success: false, error: err?.message || 'Failed to save workflow' };
  }
}

export async function toggleWorkflowStatus(recipeId: string): Promise<{ success: boolean }> {
  const index = memoryWorkflows.findIndex(w => w.id === recipeId);
  if (index !== -1) {
    memoryWorkflows[index].status = memoryWorkflows[index].status === 'active' ? 'paused' : 'active';
  }
  return { success: true };
}

export async function deleteWorkflowRecipe(recipeId: string): Promise<{ success: boolean }> {
  memoryWorkflows = memoryWorkflows.filter(w => w.id !== recipeId);
  return { success: true };
}

// ── WORKFLOW DISPATCH ENGINE ───────────────────────────────────────────
// Triggers matching workflows automatically when channels or webhooks receive events
export async function executeWorkflowTrigger(
  triggerEvent: string,
  payload: {
    phone?: string;
    email?: string;
    customerName?: string;
    messageContent?: string;
    metadata?: Record<string, any>;
  }
): Promise<{ dispatchedCount: number; results: any[] }> {
  console.log(`⚡ [AMIRA WORKFLOW ENGINE] Evaluating trigger '${triggerEvent}' for customer ${payload.phone || payload.email || 'anonymous'}`);

  const matchingWorkflows = memoryWorkflows.filter(
    w => w.status === 'active' && w.triggerEvent === triggerEvent
  );

  const results: any[] = [];

  for (const wf of matchingWorkflows) {
    console.log(`🤖 [AMIRA WORKFLOW ENGINE] Executing active recipe: ${wf.title}`);

    if (wf.actionType === 'vapi_call' && payload.phone) {
      // Trigger automated outbound VAPI call
      try {
        const vapiKey = process.env.VAPI_PRIVATE_API_KEY;
        const phoneNumberId = process.env.NEXT_PUBLIC_VAPI_PHONE_NUMBER_ID || '';
        if (vapiKey && phoneNumberId) {
          const callResp = await fetch('https://api.vapi.ai/call', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${vapiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phoneNumberId,
              customer: { number: payload.phone, name: payload.customerName || 'Customer' },
              assistantId: wf.agentId,
              metadata: { source: 'workflow_auto_trigger', workflow_id: wf.id },
            }),
          });
          if (callResp.ok) {
            const data = await callResp.json();
            results.push({ workflowId: wf.id, type: 'vapi_call', status: 'dispatched', callId: data.id });
          }
        }
      } catch (err) {
        console.error('Call dispatch error in workflow:', err);
      }
    } else {
      results.push({ workflowId: wf.id, type: wf.actionType, status: 'processed' });
    }
  }

  return { dispatchedCount: matchingWorkflows.length, results };
}
