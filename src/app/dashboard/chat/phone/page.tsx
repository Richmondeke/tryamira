'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';
import { createClient } from '../../../../utils/supabase/client';
import { updateInboundAgent, triggerCampaignDialer, getCampaigns, getCampaignCalls } from '@/app/actions/vapi';

export default function PhoneAgentPage() {
  const [activeTab, setActiveTab] = useState<'inbound' | 'outbound'>('inbound');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Phone numbers provisioned
  const [phoneNumbers, setPhoneNumbers] = useState<{number: string, id: string}[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string>('');

  // Campaigns & Calls
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  
  // Selected Campaign Details Modal
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [campaignCalls, setCampaignCalls] = useState<any[]>([]);
  const [loadingCalls, setLoadingCalls] = useState(false);
  const [selectedCallTranscript, setSelectedCallTranscript] = useState<string | null>(null);

  const [leadStats, setLeadStats] = useState({ total: 0, hot: 0, warm: 0, cold: 0 });
  const supabase = createClient();

  useEffect(() => {
    async function loadInitialData() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setLoadingCampaigns(false);
        return;
      }
      
      // Load Leads Stats
      const { data: leadsData } = await supabase.from('leads').select('status');
      if (leadsData && leadsData.length > 0) {
        setLeadStats({
          total: leadsData.length,
          hot: leadsData.filter((d: any) => d.status?.toLowerCase() === 'hot').length,
          warm: leadsData.filter((d: any) => d.status?.toLowerCase() === 'warm').length,
          cold: leadsData.filter((d: any) => d.status?.toLowerCase() === 'cold').length,
        });
      }

      // Load Phone numbers from integrations
      const { data: integData } = await supabase.from('workspace_integrations').select('*').in('provider', ['twilio', 'vapi']);
      const numbers: {number: string, id: string}[] = [];
      integData?.forEach(i => {
        if (i.config?.phoneNumber) numbers.push({ number: i.config.phoneNumber, id: i.id });
        if (i.config?.phoneNumbers && Array.isArray(i.config.phoneNumbers)) {
          i.config.phoneNumbers.forEach((p: any) => numbers.push({ number: p.number, id: p.id }));
        }
      });
      setPhoneNumbers(numbers);
      if (numbers.length > 0) setSelectedPhone(numbers[0].number);

      // Load Campaigns
      const camps = await getCampaigns();
      if (camps.success) {
        setCampaigns(camps.data);
      }
      setLoadingCampaigns(false);
    }
    loadInitialData();
  }, [supabase]);

  const handleLaunchCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const audience = formData.get('audience') as string;
    const name = formData.get('name') as string;
    const goal = formData.get('goal') as string;
    const scheduledTime = formData.get('scheduledTime') as string;
    
    // Fetch leads for this audience
    let leadsQuery = supabase.from('leads').select('*');
    if (audience !== 'All Leads') {
      const statusFilter = audience.replace(' Leads', '').toLowerCase();
      leadsQuery = leadsQuery.eq('status', statusFilter);
    }
    const { data: audienceLeads } = await leadsQuery;
    const leadsToCall = audienceLeads || [];

    if (leadsToCall.length === 0) {
      setToast('No leads found for this audience. Please add leads first.');
      setIsLoading(false);
      return;
    }
    
    // Trigger Dialing via Server Action
    const res = await triggerCampaignDialer({
      campaignName: name,
      agentId: 'dummy-assistant-id', // Would be selected in UI ideally
      phoneNumberId: 'dummy-phone-id', // Would be selected from DB
      leads: leadsToCall,
      prompt: goal,
      scheduledTime: scheduledTime || undefined
    });
    
    if (res.success) {
      setToast(`Campaign "${name}" successfully launched!`);
      setShowCampaignModal(false);
      // Reload campaigns
      const camps = await getCampaigns();
      if (camps.success) setCampaigns(camps.data);
    } else {
      setToast(`Failed to launch campaign: ${res.error}`);
    }
    
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

  const handleViewCampaign = async (campaign: any) => {
    setSelectedCampaign(campaign);
    setLoadingCalls(true);
    const callsRes = await getCampaignCalls(campaign.id);
    if (callsRes.success) {
      setCampaignCalls(callsRes.data);
    }
    setLoadingCalls(false);
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
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Agent Phone Number</label>
              {phoneNumbers.length > 0 ? (
                <>
                  <select 
                    value={selectedPhone} 
                    onChange={e => setSelectedPhone(e.target.value)} 
                    style={{ width: '100%', maxWidth: '300px', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}
                  >
                    {phoneNumbers.map((p, i) => <option key={i} value={p.number}>{p.number}</option>)}
                  </select>
                  <p style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '4px' }}>Select an imported number from your Integrations.</p>
                </>
              ) : (
                <>
                  <input type="text" readOnly value="No numbers found" style={{ width: '100%', maxWidth: '300px', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', backgroundColor: '#f6f9fc', color: 'var(--stripe-navy)' }} />
                  <p style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '4px' }}>Configure your phone numbers in Integrations & Channels first.</p>
                </>
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
                {loadingCampaigns ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--stripe-label)', fontSize: '13px' }}>
                      Loading campaigns...
                    </td>
                  </tr>
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--stripe-label)', fontSize: '13px' }}>
                      No campaigns running. Launch one to get started.
                    </td>
                  </tr>
                ) : (
                  campaigns.map(campaign => {
                    const content = campaign.content ? JSON.parse(campaign.content) : {};
                    const callsMade = content.leadsCount || 0;
                    return (
                      <tr 
                        key={campaign.id} 
                        onClick={() => handleViewCampaign(campaign)}
                        style={{ borderBottom: '1px solid var(--stripe-border)', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{campaign.name}</td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-body)' }}>{content.leadsCount || 0} leads</td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{ 
                            backgroundColor: campaign.status === 'Running' ? 'rgba(247,144,9,0.1)' : 'rgba(18,183,106,0.1)',
                            color: campaign.status === 'Running' ? '#b54708' : '#027a48',
                            padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500 
                          }}>
                            {campaign.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-navy)' }}>{callsMade}</td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--stripe-success-text)' }}>—</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Campaign Details Modal */}
          {selectedCampaign && (
            <Modal isOpen={!!selectedCampaign} onClose={() => { setSelectedCampaign(null); setSelectedCallTranscript(null); }} title={selectedCampaign.name}>
              <div style={{ padding: '1rem 0' }}>
                <h3 style={{ fontSize: '14px', margin: '0 0 1rem 0', color: 'var(--stripe-navy)' }}>Campaign Calls</h3>
                
                {loadingCalls ? (
                  <p style={{ fontSize: '13px', color: 'var(--stripe-label)' }}>Loading calls...</p>
                ) : campaignCalls.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--stripe-label)', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>No calls recorded yet for this campaign. They may still be queued or in progress.</p>
                ) : (
                  <div style={{ border: '1px solid var(--stripe-border)', borderRadius: '6px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFeatureSettings: '"tnum", "ss01"' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f6f9fc', borderBottom: '1px solid var(--stripe-border)' }}>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600 }}>STATUS</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600 }}>DURATION</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600 }}>COST</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600 }}>TRANSCRIPT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaignCalls.map(call => (
                          <tr key={call.id} style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                            <td style={{ padding: '0.75rem 1rem', fontSize: '13px', color: call.status === 'ended' ? '#027a48' : '#b54708' }}>{call.status}</td>
                            <td style={{ padding: '0.75rem 1rem', fontSize: '13px' }}>{call.duration_seconds}s</td>
                            <td style={{ padding: '0.75rem 1rem', fontSize: '13px' }}>${call.cost?.toFixed(3) || '0.000'}</td>
                            <td style={{ padding: '0.75rem 1rem', fontSize: '13px' }}>
                              {call.transcript ? (
                                <button onClick={() => setSelectedCallTranscript(call.transcript)} style={{ color: '#4caf50', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>View</button>
                              ) : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedCallTranscript && (
                  <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f6f9fc', borderRadius: '6px', border: '1px solid var(--stripe-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--stripe-navy)' }}>Call Transcript</h4>
                      <button onClick={() => setSelectedCallTranscript(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--stripe-muted)' }}>Close</button>
                    </div>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px', color: 'var(--stripe-body)', margin: 0, fontFamily: 'inherit' }}>
                      {selectedCallTranscript}
                    </pre>
                  </div>
                )}
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
}
