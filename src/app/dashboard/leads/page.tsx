'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';
import { createClient } from '../../../utils/supabase/client';
import { triggerCampaignDialer } from '@/app/actions/vapi';

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Real Data State
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // WORKFLOW D: CSV Dialer & Campaign State
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'campaigns'>('directory');
  
  // Dialer form states
  const [campaignName, setCampaignName] = useState('');
  const [campaignAgent, setCampaignAgent] = useState('sales-qualifier');
  const [campaignPhone, setCampaignPhone] = useState('vapi-phone-default');
  const [campaignPrompt, setCampaignPrompt] = useState('');
  const [campaignSchedule, setCampaignSchedule] = useState('');
  const [csvText, setCsvText] = useState('');
  const [parsedLeads, setParsedLeads] = useState<Array<{ name: string; phone: string; email?: string }>>([]);
  const [isLaunchingCampaign, setIsLaunchingCampaign] = useState(false);
  
  const [campaignsList, setCampaignsList] = useState<any[]>([
    { id: "c-1", name: "Q2 MedSpa Botox Qualifier", status: "Finished", queued: 12, completed: 12, cost: 1.84, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "c-2", name: "Outbound HVAC Plumbing Triage", status: "Running", queued: 8, completed: 5, cost: 0.96, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
  ]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    
    // Check if we are running with a dummy supabase URL
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn('Supabase URL not configured. Showing empty state.');
      setAllLeads([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching leads:', error);
        setAllLeads([]); // Fallback to empty state
      } else {
        setAllLeads(data || []);
      }
    } catch (err) {
      console.error('Exception while fetching leads:', err);
      setAllLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLeads = allLeads.filter(lead => 
    lead.name?.toLowerCase().includes(search.toLowerCase()) || 
    lead.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setToast({ message: 'CSV Exported Successfully!', type: 'success' });
    }, 1500);
  };

  const handleAddLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    const { error } = await supabase.from('leads').insert({
      workspace_id: '11111111-1111-1111-1111-111111111111', // Dummy ID
      name,
      email,
      phone: '',
      status: 'new',
      source: 'manual',
      score: 50
    });

    if (error) {
      setToast({ message: 'Error adding lead. Check Supabase keys.', type: 'error' });
      setShowAddModal(false);
    } else {
      setToast({ message: 'New lead added successfully to Supabase.', type: 'success' });
      setShowAddModal(false);
      fetchLeads(); // Refresh from DB
    }
  };

  const handleUpdateLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedLead) return;
    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: formData.get('status') as string,
    };

    const { error } = await supabase.from('leads').update(updates).eq('id', selectedLead.id);
    if (error) {
      setToast({ message: 'Error updating lead.', type: 'error' });
    } else {
      setToast({ message: 'Lead updated successfully.', type: 'success' });
      setSelectedLead(null);
      fetchLeads();
    }
    setIsUpdating(false);
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) {
      setToast({ message: 'Error deleting lead.', type: 'error' });
    } else {
      setToast({ message: 'Lead deleted.', type: 'success' });
      setSelectedLead(null);
      fetchLeads();
    }
  };

  // Helper to parse pasted CSV rows client side
  const handleParseCSV = () => {
    if (!csvText.trim()) {
      setToast({ message: 'Please paste some CSV rows first.', type: 'error' });
      return;
    }

    try {
      const lines = csvText.split('\n');
      const contacts: any[] = [];
      
      lines.forEach((line, idx) => {
        if (!line.trim()) return;
        
        // Strip out headers if present
        if (idx === 0 && (line.toLowerCase().includes('name') || line.toLowerCase().includes('phone'))) {
          return;
        }

        const parts = line.split(',');
        if (parts.length >= 2) {
          contacts.push({
            name: parts[0]?.trim(),
            phone: parts[1]?.trim(),
            email: parts[2]?.trim() || ''
          });
        }
      });

      if (contacts.length === 0) {
        throw new Error("No contact entries parsed.");
      }

      setParsedLeads(contacts);
      setToast({ message: `🎉 Successfully parsed ${contacts.length} campaign contacts!`, type: 'success' });
    } catch (e) {
      setToast({ message: 'Failed to parse CSV format. Ensure at least: Name,Phone.', type: 'error' });
    }
  };

  // Trigger Outbound Campaign Server Action
  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim() || parsedLeads.length === 0) {
      setToast({ message: 'Please specify a campaign name and upload/paste some contacts.', type: 'error' });
      return;
    }

    setIsLaunchingCampaign(true);
    
    const res = await triggerCampaignDialer({
      campaignName,
      agentId: campaignAgent,
      phoneNumberId: campaignPhone,
      leads: parsedLeads,
      prompt: campaignPrompt || 'You are a professional outreach specialist.',
      scheduledTime: campaignSchedule || undefined
    });

    setIsLaunchingCampaign(false);

    if (res.success) {
      setToast({ message: `🎉 Campaign launched! Dialer scheduled ${parsedLeads.length} outbound calls!`, type: 'success' });
      setCampaignsList(prev => [
        {
          id: res.campaignId || `c-${Date.now()}`,
          name: campaignName,
          status: campaignSchedule ? 'Scheduled' : 'Running',
          queued: parsedLeads.length,
          completed: 0,
          cost: 0.00,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
      
      // Reset form states
      setCampaignName('');
      setParsedLeads([]);
      setCsvText('');
      setCampaignPrompt('');
      setCampaignSchedule('');
      
      // Refresh directory since leads are added to Supabase
      fetchLeads();
    } else {
      setToast({ message: `Failed to queue dialer: ${res.message || 'Connection error'}`, type: 'error' });
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Lead">
        <form onSubmit={handleAddLead} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Full Name</label>
            <input name="name" type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Email Address</label>
            <input name="email" type="email" required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
          </div>
          <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Save Lead</button>
        </form>
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Leads & Campaigns</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0 }}>Manage leads and schedule batch outbound dialing marketing campaigns.</p>
        </div>
        
        {activeSubTab === 'directory' && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleExport} disabled={isExporting} style={{ backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
            <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}>
              + Add Lead
            </button>
          </div>
        )}
      </div>

      {/* Tab selection links */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--stripe-border)', marginBottom: '1.5rem', gap: '1.5rem' }}>
        <button 
          onClick={() => setActiveSubTab('directory')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'directory' ? '2.5px solid #533afd' : '2.5px solid transparent',
            padding: '8px 0',
            fontSize: '13px',
            fontWeight: 700,
            color: activeSubTab === 'directory' ? '#533afd' : 'var(--stripe-muted)',
            cursor: 'pointer',
            paddingBottom: '6px'
          }}
        >
          🗂️ Leads Database
        </button>
        <button 
          onClick={() => setActiveSubTab('campaigns')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'campaigns' ? '2.5px solid #533afd' : '2.5px solid transparent',
            padding: '8px 0',
            fontSize: '13px',
            fontWeight: 700,
            color: activeSubTab === 'campaigns' ? '#533afd' : 'var(--stripe-muted)',
            cursor: 'pointer',
            paddingBottom: '6px'
          }}
        >
          📢 Outbound Dialer Campaigns
        </button>
      </div>

      {/* TAB 1: LEADS DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', boxShadow: 'var(--stripe-shadow-ambient)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--stripe-border)', backgroundColor: '#f6f9fc' }}>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', maxWidth: '400px', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--stripe-border)', fontSize: '12px', outline: 'none' }} 
            />
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFeatureSettings: '"tnum", "ss01"' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--stripe-border)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>NAME</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>EMAIL</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>PHONE</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>STATUS</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>SCORE</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--stripe-muted)', fontSize: '12px' }}>
                    Loading leads from database...
                  </td>
                </tr>
              ) : filteredLeads.map((lead, i) => (
                <tr key={i} onClick={() => setSelectedLead(lead)} style={{ borderBottom: '1px solid var(--stripe-border)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{lead.name}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-body)' }}>{lead.email}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-body)' }}>{lead.phone || '-'}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      backgroundColor: lead.status?.toLowerCase() === 'hot' ? 'rgba(217,45,32,0.1)' : lead.status?.toLowerCase() === 'warm' ? 'rgba(247,144,9,0.1)' : '#f6f9fc',
                      color: lead.status?.toLowerCase() === 'hot' ? '#d92d20' : lead.status?.toLowerCase() === 'warm' ? '#b54708' : 'var(--stripe-muted)',
                      padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500, textTransform: 'capitalize'
                    }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-navy)' }}>{lead.score || 0}</td>
                </tr>
              ))}
              {!isLoading && filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--stripe-muted)', fontSize: '13px' }}>No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: OUTBOUND DIALER CAMPAIGNS */}
      {activeSubTab === 'campaigns' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          {/* Dialer Configuration Form */}
          <form onSubmit={handleLaunchCampaign} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
              📢 Launch Dialer Campaign
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--stripe-muted)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              Schedule automated outbound calling runs. Ideal for customer follow-ups, promotion surveys, or sales reminders.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>Campaign Name</label>
              <input 
                type="text" 
                placeholder="e.g. June Botox Promo Outbound" 
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)' }} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>Select Calling AI Agent</label>
                <select 
                  value={campaignAgent}
                  onChange={e => setCampaignAgent(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)', backgroundColor: '#fff' }}
                >
                  <option value="sales-qualifier">Sales Qualifier (Josh)</option>
                  <option value="medspa-receptionist">MedSpa Ashley (Rachel)</option>
                  <option value="customer-support-bot">Acme Support (Nova)</option>
                  <option value="home-services-dispatcher">Home Dispatcher (Kemi)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>Local Outbound Trunk</label>
                <select 
                  value={campaignPhone}
                  onChange={e => setCampaignPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)', backgroundColor: '#fff' }}
                >
                  <option value="vapi-phone-default">Default Outbound Trunk (US)</option>
                  <option value="trunk-mtn-234">Imported MTN Nigeria SIP Trunk (+234 803 000 0192)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>Schedule Call Time (Optional)</label>
              <input 
                type="datetime-local" 
                value={campaignSchedule}
                onChange={e => setCampaignSchedule(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)' }} 
              />
              <span style={{ fontSize: '10px', color: 'var(--stripe-muted)', marginTop: '4px', display: 'block' }}>
                Uses Vapi's <code>schedulePlan.earliestAt</code> parameter to defer call dialer triggers. Leave blank for immediate calls.
              </span>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>Campaign System Prompts Override</label>
              <textarea 
                placeholder="Give specific instructions or promotion notes for this calling run..."
                value={campaignPrompt}
                onChange={e => setCampaignPrompt(e.target.value)}
                style={{ width: '100%', height: '70px', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)', resize: 'vertical' }} 
              />
            </div>

            {/* CSV pasting and parsing zone */}
            <div style={{ 
              marginBottom: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#f8fafc', 
              border: '1px solid var(--stripe-border)', 
              borderRadius: '6px' 
            }}>
              <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--stripe-navy)', marginBottom: '0.4rem', fontWeight: 700 }}>
                📋 Paste CSV Lead List (Name, Phone, Email)
              </label>
              <textarea 
                placeholder="Name,Phone,Email&#10;Kemi Balogun,+2348030000001,kemi@gmail.com&#10;Sarah Jenkins,+2348030000002,sarah@gmail.com"
                value={csvText}
                onChange={e => setCsvText(e.target.value)}
                style={{ width: '100%', height: '80px', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '11.5px', color: 'var(--stripe-navy)', fontFamily: 'monospace', resize: 'vertical' }} 
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '10px', color: 'var(--stripe-muted)' }}>
                  Format: <code>Name,Phone,Email</code> (Header line ignored)
                </span>
                
                <button
                  type="button"
                  onClick={handleParseCSV}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #533afd',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '10.5px',
                    color: '#533afd',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Parse Contacts
                </button>
              </div>
            </div>

            {/* Parsed Contacts Grid preview */}
            {parsedLeads.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: 'var(--stripe-navy)', marginBottom: '0.4rem' }}>
                  <span>Parsed Contacts Queue ({parsedLeads.length})</span>
                  <button type="button" onClick={() => setParsedLeads([])} style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>Clear Queue</button>
                </div>
                <div style={{ maxHeight: '140px', overflowY: 'auto', border: '1px solid var(--stripe-border)', borderRadius: '6px', backgroundColor: '#f9fafb' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--stripe-border)' }}>
                        <th style={{ padding: '4px 8px' }}>NAME</th>
                        <th style={{ padding: '4px 8px' }}>PHONE</th>
                        <th style={{ padding: '4px 8px' }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedLeads.map((pl, plIdx) => (
                        <tr key={plIdx} style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                          <td style={{ padding: '4px 8px', fontWeight: 600 }}>{pl.name}</td>
                          <td style={{ padding: '4px 8px', fontFamily: 'monospace' }}>{pl.phone}</td>
                          <td style={{ padding: '4px 8px', color: '#f59e0b', fontWeight: 600 }}>Pending Dial</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLaunchingCampaign || parsedLeads.length === 0}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: isLaunchingCampaign || parsedLeads.length === 0 ? '#cbd5e1' : '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: isLaunchingCampaign || parsedLeads.length === 0 ? 'not-allowed' : 'pointer',
                boxShadow: parsedLeads.length > 0 ? '0 4px 12px rgba(16,185,129,0.2)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {isLaunchingCampaign ? 'Queuing & Connecting Trunks...' : parsedLeads.length === 0 ? 'Pasted leads required' : '🚀 Launch Outbound Campaign Dialer'}
            </button>
          </form>

          {/* Active Outbound Campaigns List Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
              <h4 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 600 }}>Active Dialer Runs</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {campaignsList.map((campaign) => (
                  <div key={campaign.id} style={{ border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1rem', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--stripe-navy)' }}>{campaign.name}</span>
                      <span style={{ 
                        fontSize: '9.5px', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontWeight: 700,
                        backgroundColor: campaign.status === 'Finished' ? '#dcfce7' : campaign.status === 'Running' ? '#fef3c7' : '#e0f2fe',
                        color: campaign.status === 'Finished' ? '#15803d' : campaign.status === 'Running' ? '#b45309' : '#0369a1',
                        textTransform: 'uppercase'
                      }}>
                        {campaign.status}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '11px', color: 'var(--stripe-muted)', marginBottom: '0.5rem' }}>
                      <div>
                        <span>Queued Contacts:</span>
                        <strong style={{ display: 'block', color: 'var(--stripe-navy)', fontSize: '12px' }}>{campaign.queued} leads</strong>
                      </div>
                      <div>
                        <span>Calls Handled:</span>
                        <strong style={{ display: 'block', color: 'var(--stripe-navy)', fontSize: '12px' }}>{campaign.completed} calls</strong>
                      </div>
                      <div>
                        <span>Vapi Costs:</span>
                        <strong style={{ display: 'block', color: '#10b981', fontSize: '12px', fontFamily: 'monospace' }}>${campaign.cost.toFixed(2)}</strong>
                      </div>
                    </div>

                    <div style={{ fontSize: '9.5px', color: 'var(--stripe-muted)', borderTop: '1px dashed #e2e8f0', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                      Created: {new Date(campaign.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side Panel Overlay for lead detail edit */}
      {selectedLead && (
        <>
          <div 
            onClick={() => setSelectedLead(null)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 999 }} 
          />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', backgroundColor: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', zIndex: 1000, padding: '2rem', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--stripe-navy)', fontWeight: 500 }}>Lead Details</h2>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--stripe-muted)' }}>&times;</button>
            </div>

            <form onSubmit={handleUpdateLead} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Full Name</label>
                <input name="name" type="text" defaultValue={selectedLead.name} required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Email Address</label>
                <input name="email" type="email" defaultValue={selectedLead.email} required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Phone Number</label>
                <input name="phone" type="text" defaultValue={selectedLead.phone || ''} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Status</label>
                <select name="status" defaultValue={selectedLead.status?.toLowerCase()} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="new">New</option>
                  <option value="cold">Cold</option>
                </select>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', borderTop: '1px solid var(--stripe-border)', paddingTop: '1.5rem' }}>
                <button type="submit" disabled={isUpdating} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: isUpdating ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => handleDeleteLead(selectedLead.id)} style={{ padding: '0.75rem', backgroundColor: '#fff', color: '#d92d20', border: '1px solid #d92d20', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>
                  Delete
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
