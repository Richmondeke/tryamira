'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';
import { createClient } from '../../../../utils/supabase/client';
import { updateInboundAgent, triggerOutboundCall } from '@/app/actions/vapi';

export default function PhoneAgentPage() {
  const [activeTab, setActiveTab] = useState<'inbound' | 'outbound'>('inbound');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [provisionedNumber, setProvisionedNumber] = useState<string | null>(null);

  const [leadStats, setLeadStats] = useState({ total: 0, hot: 0, warm: 0, cold: 0 });
  const supabase = createClient();

  useEffect(() => {
    async function loadLeadStats() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
      const { data } = await supabase.from('leads').select('status');
      if (data && data.length > 0) {
        setLeadStats({
          total: data.length,
          hot: data.filter((d: any) => d.status === 'hot').length,
          warm: data.filter((d: any) => d.status === 'warm').length,
          cold: data.filter((d: any) => d.status === 'cold').length,
        });
      }
    }
    loadLeadStats();
  }, [supabase]);

  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'Cold Calling List A', audience: 'Cold Leads', status: 'Completed', callsMade: 1008, conversions: '4%' }
  ]);

  const handleLaunchCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const audience = formData.get('audience') as string;
    const name = formData.get('name') as string;
    const goal = formData.get('goal') as string;
    const scheduledTime = formData.get('scheduledTime') as string;
    
    // In a real app, you would fetch the leads for this audience and loop through them.
    // We mock triggering one call as an example integration:
    const mockLeadPhone = "+15551234567"; // Replace with actual lead phone number
    
    // We pass placeholder IDs if env vars are missing, the server action will gracefully handle it
    await triggerOutboundCall('dummy-assistant-id', 'dummy-phone-id', mockLeadPhone, goal, scheduledTime || undefined);
    
    setCampaigns([
      {
        id: Date.now(),
        name,
        audience,
        status: 'In Progress',
        callsMade: 0,
        conversions: '0%'
      },
      ...campaigns
    ]);
    
    setShowCampaignModal(false);
    setIsLoading(false);
    setToast('Voice Campaign successfully launched! The AI is now dialing.');
  };

  const handleSaveInbound = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const voice = formData.get('voice') as string;
    const prompt = formData.get('prompt') as string;
    const firstMessage = formData.get('firstMessage') as string;
    const language = formData.get('language') as string;
    
    // We pass a placeholder assistant ID, the action uses env vars if configured
    await updateInboundAgent('dummy-assistant-id', voice, prompt, firstMessage, language);

    setIsLoading(false);
    setToast('Inbound AI Voice Settings updated. The agent is now active on your numbers.');
  };

  const handleProvisionNumber = () => {
    setIsLoading(true);
    // Mock provisioning delay
    setTimeout(() => {
      setProvisionedNumber("+1 (555) 987-6543");
      setIsLoading(false);
      setToast('Phone number successfully provisioned!');
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>AI Voice Agent</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>Configure inbound call answering or launch outbound voice campaigns.</p>
        </div>
        <div style={{ display: 'flex', backgroundColor: '#f6f9fc', borderRadius: '6px', padding: '0.25rem', border: '1px solid var(--stripe-border)' }}>
          <button 
            onClick={() => setActiveTab('inbound')}
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '13px', 
              fontWeight: 500, 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              backgroundColor: activeTab === 'inbound' ? '#fff' : 'transparent',
              color: activeTab === 'inbound' ? 'var(--stripe-navy)' : 'var(--stripe-label)',
              boxShadow: activeTab === 'inbound' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            Inbound Setup
          </button>
          <button 
            onClick={() => setActiveTab('outbound')}
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '13px', 
              fontWeight: 500, 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              backgroundColor: activeTab === 'outbound' ? '#fff' : 'transparent',
              color: activeTab === 'outbound' ? 'var(--stripe-navy)' : 'var(--stripe-label)',
              boxShadow: activeTab === 'outbound' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            Outbound Campaigns
          </button>
        </div>
      </div>

      {activeTab === 'inbound' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--stripe-navy)', margin: '0 0 1rem 0' }}>Inbound Voice Configuration</h2>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', marginBottom: '1.5rem' }}>Train the AI on how to answer incoming calls, qualify leads over the phone, and route them or book meetings.</p>
          
          <form onSubmit={handleSaveInbound} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Amira Phone Number</label>
              {provisionedNumber ? (
                <>
                  <input type="text" readOnly value={provisionedNumber} style={{ width: '100%', maxWidth: '300px', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', backgroundColor: '#f6f9fc', color: 'var(--stripe-navy)' }} />
                  <p style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '4px' }}>Forward your existing numbers to this to activate the AI.</p>
                </>
              ) : (
                <button type="button" onClick={handleProvisionNumber} disabled={isLoading} style={{ padding: '0.5rem 1rem', backgroundColor: '#f6f9fc', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 500, fontSize: '13px' }}>
                  {isLoading ? 'Provisioning...' : 'Provision Phone Number'}
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Agent Voice Personality</label>
                <select name="voice" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
                  <option value="professional">Professional & Direct</option>
                  <option value="friendly">Friendly & Conversational</option>
                  <option value="enthusiastic">Enthusiastic Sales Rep</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Primary Language</label>
                <select name="language" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
                  <option value="en">English (US)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>First Message (Greeting)</label>
              <textarea name="firstMessage" rows={2} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', resize: 'vertical' }} defaultValue="Hi, thanks for calling Amira Real Estate! How can I help you today?"></textarea>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Custom System Prompt (What should the agent say?)</label>
              <textarea name="prompt" rows={6} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', resize: 'vertical' }} defaultValue="You are Amira, an AI voice receptionist for our real estate firm. Your goal is to gather the caller's name, email, and whether they are looking to buy or sell. If they want to buy, try to book a meeting."></textarea>
            </div>

            <div>
              <button type="submit" disabled={isLoading} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 500, opacity: isLoading ? 0.7 : 1, transition: 'background 0.2s' }} onMouseOver={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#4f46e5' }} onMouseOut={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#4caf50' }}>
                {isLoading ? 'Saving...' : 'Save & Activate Inbound'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'outbound' && (
        <>
          <Modal isOpen={showCampaignModal} onClose={() => setShowCampaignModal(false)} title="New Outbound Campaign">
            <form onSubmit={handleLaunchCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Campaign Name</label>
                <input required name="name" type="text" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} placeholder="e.g. Q3 Cold Call Blast" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Target Audience</label>
                <select name="audience" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
                  <option value="All Leads">All Leads ({leadStats.total})</option>
                  <option value="Hot Leads">Hot Leads ({leadStats.hot})</option>
                  <option value="Warm Leads">Warm Leads ({leadStats.warm})</option>
                  <option value="Cold Leads">Cold Leads ({leadStats.cold})</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Agent Goal</label>
                <textarea name="goal" required rows={4} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', resize: 'vertical' }} placeholder="You are calling leads to offer a free home valuation. Try to get them to say yes to a 10-minute follow-up call."></textarea>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Schedule For (Optional)</label>
                <input name="scheduledTime" type="datetime-local" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
                <p style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '4px' }}>Leave blank to dial immediately.</p>
              </div>
              <button type="submit" disabled={isLoading} style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 500, opacity: isLoading ? 0.7 : 1, transition: 'background 0.2s' }} onMouseOver={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#4f46e5' }} onMouseOut={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#4caf50' }}>
                {isLoading ? 'Launching...' : 'Launch Campaign'}
              </button>
            </form>
          </Modal>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={() => setShowCampaignModal(true)} style={{ backgroundColor: '#4caf50', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '13px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4caf50'}>New Campaign</button>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFeatureSettings: '"tnum", "ss01"' }}>
              <thead>
                <tr style={{ backgroundColor: '#f6f9fc', borderBottom: '1px solid var(--stripe-border)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>CAMPAIGN NAME</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>AUDIENCE</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>STATUS</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>CALLS MADE</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>CONVERSIONS</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--stripe-label)', fontSize: '13px' }}>
                      No campaigns running. Launch one to get started.
                    </td>
                  </tr>
                ) : (
                  campaigns.map(campaign => (
                    <tr key={campaign.id} style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{campaign.name}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-body)' }}>{campaign.audience}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ 
                          backgroundColor: campaign.status === 'In Progress' ? 'rgba(247,144,9,0.1)' : 'rgba(18,183,106,0.1)',
                          color: campaign.status === 'In Progress' ? '#b54708' : '#027a48',
                          padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500 
                        }}>
                          {campaign.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-navy)' }}>{campaign.callsMade}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-success-text)' }}>{campaign.conversions}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
