'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import { createClient } from '@/utils/supabase/client';
import { inviteTeamMember, getTeamMembers } from '@/app/actions/team';
import { createKorapayCheckout } from '@/app/actions/billing';
import { createVapiSipTrunk } from '@/app/actions/vapi';

function AccountSettingsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') || 'settings';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [toast, setToast] = useState<string | null>(null);
  
  // Modals & loading states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingBilling, setIsProcessingBilling] = useState(false);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Settings & Team States
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');
  const [workspaceName, setWorkspaceName] = useState('Acme Real Estate');
  const [timezone, setTimezone] = useState('Pacific Time (PT)');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Admin');

  // SIP Trunk / Telephony States
  const [sipNumber, setSipNumber] = useState('');
  const [sipUri, setSipUri] = useState('');
  const [sipUser, setSipUser] = useState('');
  const [sipPass, setSipPass] = useState('');
  const [sipGateways, setSipGateways] = useState('');
  const [isRegisteringSip, setIsRegisteringSip] = useState(false);
  const [registeredTrunks, setRegisteredTrunks] = useState<any[]>([
    { id: "trunk-mtn-234", number: "+234 803 000 0192", sipUri: "sip:sip.mtn.com.ng:5060", status: "Active (MTN West Africa)" }
  ]);

  // Referral State
  const referralLink = "https://heyamira.com/ref/ashley99";

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setToast('Referral link copied to clipboard!');
  };

  // Sync tab with URL search parameter cleanly
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Replace URL parameter without full page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    router.replace(url.pathname + url.search);
  };

  useEffect(() => {
    getTeamMembers(1).then(setTeamMembers);
    const fetchWorkspace = async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
      const supabase = createClient();
      const { data } = await supabase.from('workspaces').select('*').eq('id', 1).single();
      if (data) {
        setWorkspaceName(data.name || 'Acme Real Estate');
        setTimezone(data.timezone || 'Pacific Time (PT)');
      }
    };
    fetchWorkspace();
  }, []);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn('Supabase URL not configured. Simulating save.');
      setTimeout(() => {
        setIsSaving(false);
        setToast('Preferences saved locally! (Supabase not configured)');
      }, 500);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('workspaces')
        .upsert({ id: 1, name: workspaceName, timezone: timezone });

      if (error) throw error;
      setToast('Preferences saved to database!');
    } catch (err: any) {
      console.error('Error saving to Supabase:', err);
      setToast('Preferences saved locally!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await inviteTeamMember(inviteEmail, inviteRole, 1);
    if (res.success) {
      setShowInviteModal(false);
      setToast(res.message);
      setInviteEmail('');
      // Reload team list
      getTeamMembers(1).then(setTeamMembers);
    }
  };

  const handleRegisterSip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sipNumber.trim() || !sipUri.trim()) {
      setToast('Please provide both the localized phone number and Outbound SIP URI.');
      return;
    }

    setIsRegisteringSip(true);
    const gatewaysArr = sipGateways ? sipGateways.split(',').map(ip => ip.trim()) : [];
    
    const res = await createVapiSipTrunk({
      number: sipNumber,
      sipUri: sipUri,
      username: sipUser,
      password: sipPass,
      gateways: gatewaysArr
    });

    setIsRegisteringSip(false);
    if (res.success) {
      setToast('🎉 Local SIP Trunk registered successfully!');
      setRegisteredTrunks(prev => [
        {
          id: res.data?.id || `trunk-${Date.now()}`,
          number: sipNumber,
          sipUri: sipUri,
          status: 'Active (Imported)'
        },
        ...prev
      ]);
      setSipNumber('');
      setSipUri('');
      setSipUser('');
      setSipPass('');
      setSipGateways('');
    } else {
      setToast(`Error: ${res.error || 'Failed to import SIP Trunk gateway.'}`);
    }
  };

  const handleToggleNotification = (setting: string) => {
    setToast(`${setting} preference updated.`);
  };

  const handleCheckoutKorapay = () => {
    setIsCheckoutLoading(true);
    setTimeout(() => {
      setIsCheckoutLoading(false);
      setToast('Simulated Korapay checkout opened successfully.');
    }, 1200);
  };

  const processUpgrade = () => {
    setIsProcessingUpgrade(true);
    setTimeout(() => {
      setIsProcessingUpgrade(false);
      setShowUpgradeModal(false);
      setToast('🎉 Successfully upgraded to the Pro Plan!');
    }, 2000);
  };

  // Nav styles matching Stripe theme
  const getTabStyle = (tab: string) => ({
    padding: '0.6rem 1.25rem',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
    color: activeTab === tab ? 'var(--stripe-navy)' : 'var(--stripe-label)',
    boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' : 'none',
    transition: 'all 0.15s ease',
    border: 'none',
    outline: 'none'
  });

  const getSubSettingsTabStyle = (tab: string) => ({
    padding: '0.75rem 1rem',
    backgroundColor: activeSettingsTab === tab ? '#f6f9fc' : 'transparent',
    borderRadius: '6px',
    color: 'var(--stripe-navy)',
    fontWeight: activeSettingsTab === tab ? 600 : 400,
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s'
  });

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Main Account Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>Account Settings</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>
          Manage your profile preferences, team workspaces, billing plans, and referral bonuses in one place.
        </p>
      </div>

      {/* Unified Tab Sub-Navigation */}
      <div style={{ 
        display: 'inline-flex', 
        backgroundColor: '#f6f9fc', 
        borderRadius: '6px', 
        padding: '0.25rem', 
        border: '1px solid var(--stripe-border)', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '4px'
      }}>
        <button onClick={() => handleTabChange('settings')} style={getTabStyle('settings')}>Workspace & Telephony</button>
        <button onClick={() => handleTabChange('notifications')} style={getTabStyle('notifications')}>Notifications</button>
        <button onClick={() => handleTabChange('plan')} style={getTabStyle('plan')}>Plan & Billing</button>
        <button onClick={() => handleTabChange('refer')} style={getTabStyle('refer')}>Refer & Earn</button>
        <button onClick={() => handleTabChange('partner')} style={getTabStyle('partner')}>Agency Dashboard</button>
        <button onClick={() => handleTabChange('upgrade')} style={getTabStyle('upgrade')}>Upgrade Plan ✨</button>
      </div>

      {/* RENDER ACTIVE TAB CONTENT */}
      <div style={{ marginTop: '0.5rem' }}>
        
        {/* TAB 1: WORKSPACE & TELEPHONY SETTINGS */}
        {activeTab === 'settings' && (
          <div>
            <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Team Member">
              <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Email Address</label>
                  <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} placeholder="colleague@company.com" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Role</label>
                  <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
                    <option value="Admin">Admin</option>
                    <option value="Agent">Agent</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Send Invite</button>
              </form>
            </Modal>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div onClick={() => setActiveSettingsTab('general')} style={getSubSettingsTabStyle('general')}>General Information</div>
                <div onClick={() => setActiveSettingsTab('team')} style={getSubSettingsTabStyle('team')}>Team Members</div>
                <div onClick={() => setActiveSettingsTab('telephony')} style={getSubSettingsTabStyle('telephony')}>Local SIP Telephony (BYOT)</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {activeSettingsTab === 'general' && (
                  <form onSubmit={handleSavePreferences} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
                    <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 600 }}>General Information</h3>
                    
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Workspace Name</label>
                      <input type="text" value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)' }} />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>Timezone</label>
                      <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)', backgroundColor: '#fff' }}>
                        <option value="Pacific Time (PT)">Pacific Time (PT)</option>
                        <option value="Eastern Time (ET)">Eastern Time (ET)</option>
                        <option value="Greenwich Mean Time (GMT)">Greenwich Mean Time (GMT)</option>
                      </select>
                    </div>
                    
                    <button type="submit" disabled={isSaving} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1.25rem', fontSize: '12px', fontWeight: 500, cursor: isSaving ? 'wait' : 'pointer', opacity: isSaving ? 0.7 : 1 }}>
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </form>
                )}

                {activeSettingsTab === 'team' && (
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: 0, fontWeight: 600 }}>Team Members</h3>
                        <p style={{ fontSize: '12px', color: 'var(--stripe-body)', margin: '4px 0 0 0' }}>Manage who has access to this workspace.</p>
                      </div>
                      <button onClick={() => setShowInviteModal(true)} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>+ Invite Member</button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
                      {teamMembers.map(member => (
                        <div key={member.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--stripe-border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500 }}>{member.initials}</div>
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--stripe-navy)' }}>{member.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--stripe-body)' }}>{member.email}</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '11px', backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '12px', color: '#475569' }}>{member.role}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'telephony' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <form onSubmit={handleRegisterSip} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
                      <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Local SIP Trunk Telephony (BYOT)</h3>
                      <p style={{ fontSize: '12px', color: 'var(--stripe-body)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                        Connect your business E1 phone lines and local carrier gateways (e.g. MTN/Airtel Nigeria, Safaricom Kenya) directly to Vapi. This enables outbound campaigns using local West/East African numbers.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>Phone Number (E.164 standard)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. +2348030000192" 
                            value={sipNumber} 
                            onChange={e => setSipNumber(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)' }} 
                          />
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>Outbound SIP URI</label>
                          <input 
                            type="text" 
                            placeholder="e.g. sip:sip.mtn.com.ng:5060" 
                            value={sipUri} 
                            onChange={e => setSipUri(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)' }} 
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>SIP Auth Username (Optional)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. mtn_trunk_user" 
                            value={sipUser} 
                            onChange={e => setSipUser(e.target.value)} 
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)' }} 
                          />
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>SIP Auth Password (Optional)</label>
                          <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={sipPass} 
                            onChange={e => setSipPass(e.target.value)} 
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)' }} 
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>Gateway IP Addresses (Optional, comma-separated)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 196.24.45.10, 196.24.45.11" 
                          value={sipGateways} 
                          onChange={e => setSipGateways(e.target.value)} 
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)' }} 
                        />
                        <span style={{ fontSize: '10px', color: 'var(--stripe-muted)', marginTop: '4px', display: 'block' }}>
                          Specify Session Border Controller SBC IPs to restrict handshake authorization.
                        </span>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isRegisteringSip} 
                        style={{ backgroundColor: '#533afd', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.6rem 1.25rem', fontSize: '12px', fontWeight: 600, cursor: isRegisteringSip ? 'wait' : 'pointer', opacity: isRegisteringSip ? 0.7 : 1, boxShadow: 'var(--stripe-shadow-action)' }}
                      >
                        {isRegisteringSip ? 'Connecting SIP Handshake...' : '🔒 Register Local SIP Trunk'}
                      </button>
                    </form>

                    {/* List of active SIP gateways */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
                      <h4 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 600 }}>Active Telephony Endpoints</h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {registeredTrunks.map((trunk) => (
                          <div key={trunk.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '20px' }}>📞</span>
                              <div>
                                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--stripe-navy)' }}>{trunk.number}</div>
                                <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', fontFamily: 'monospace', marginTop: '2px' }}>URI: {trunk.sipUri}</div>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '10px', backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                                {trunk.status}
                              </span>
                              <button
                                onClick={() => {
                                  setRegisteredTrunks(prev => prev.filter(t => t.id !== trunk.id));
                                  setToast('SIP Trunk deregistered.');
                                }}
                                style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '11px', fontWeight: 500, cursor: 'pointer' }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NOTIFICATION PREFERENCES */}
        {activeTab === 'notifications' && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Email Alerts</h3>
            <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: '0 0 1.5rem 0' }}>Control when and how you are alerted.</p>
            
            {[
              { title: 'New Lead Captured', desc: 'Get an email immediately when a new lead is captured by the AI.', active: true },
              { title: 'Human Takeover Requested', desc: 'Alert when a user explicitly asks to speak to a human.', active: true },
              { title: 'Daily Performance Summary', desc: "A morning digest of yesterday's metrics.", active: false },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: i === 2 ? 'none' : '1px solid var(--stripe-border)' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.25rem' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--stripe-body)' }}>{item.desc}</div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked={item.active} onChange={() => handleToggleNotification(item.title)} style={{ width: '18px', height: '18px', accentColor: 'var(--stripe-purple)' }} />
                </label>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PLAN & BILLING */}
        {activeTab === 'plan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              
              {/* Plan Card */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Plan</div>
                    <div style={{ fontSize: '20px', color: 'var(--stripe-navy)', fontWeight: 300, letterSpacing: '-0.48px', marginBottom: '0.5rem' }}>Pro Tier</div>
                    <div style={{ fontSize: '12px', color: 'var(--stripe-body)' }}>₦45,000 / month</div>
                  </div>
                  <span style={{ backgroundColor: 'rgba(21,190,83,0.1)', color: 'var(--stripe-success-text)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Active</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button onClick={handleCheckoutKorapay} disabled={isCheckoutLoading} style={{ width: '100%', backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.6rem', fontSize: '12px', fontWeight: 500, cursor: isCheckoutLoading ? 'wait' : 'pointer' }}>
                    {isCheckoutLoading ? 'Connecting...' : 'Manage Billing (Korapay)'}
                  </button>
                  <button 
                    onClick={() => handleTabChange('upgrade')}
                    style={{ width: '100%', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.6rem', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Upgrade Plan Options ✨
                  </button>
                </div>
              </div>

              {/* Usage Card */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
                <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 600 }}>Monthly Usage</h3>
                
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '0.5rem', fontFeatureSettings: '"tnum"' }}>
                    <span style={{ color: 'var(--stripe-navy)', fontWeight: 500 }}>AI Conversations</span>
                    <span style={{ color: 'var(--stripe-body)' }}>450 / 1,000</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e3e8ee', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '45%', height: '100%', backgroundColor: 'var(--stripe-purple)' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '0.5rem', fontFeatureSettings: '"tnum"' }}>
                    <span style={{ color: 'var(--stripe-navy)', fontWeight: 500 }}>Team Members</span>
                    <span style={{ color: 'var(--stripe-body)' }}>2 / 5</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e3e8ee', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '40%', height: '100%', backgroundColor: 'var(--stripe-purple)' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices List */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
              <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 600 }}>Invoice History</h3>
              <p style={{ fontSize: '12px', color: 'var(--stripe-body)', marginBottom: '1rem' }}>You are currently on the <strong>Pro Plan</strong> subscription.</p>
              
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--stripe-navy)', marginBottom: '4px' }}>Next invoice</div>
                <div style={{ fontSize: '12px', color: 'var(--stripe-body)' }}>$49.00 due on June 1st, 2026</div>
              </div>
              <button 
                onClick={async () => {
                  setIsProcessingBilling(true);
                  try {
                    await createKorapayCheckout(1, 4900, "user@example.com");
                  } catch (e: any) {
                    setToast(e.message);
                    setIsProcessingBilling(false);
                  }
                }}
                disabled={isProcessingBilling}
                style={{ backgroundColor: '#fff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '12px', fontWeight: 500, cursor: isProcessingBilling ? 'wait' : 'pointer' }}
              >
                {isProcessingBilling ? 'Processing...' : 'Manage Subscriptions via Korapay'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: REFER & EARN */}
        {activeTab === 'refer' && (
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.75rem 0' }}>Give $50, Get $50</h2>
              <p style={{ color: 'var(--stripe-body)', fontSize: '12.5px', lineHeight: 1.5 }}>
                Invite your friends to Amira. They get $50 in free credits when they sign up, and you get $50 applied directly to your next billing cycle.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '2.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
              <h3 style={{ fontSize: '12px', color: 'var(--stripe-navy)', margin: '0 0 1.25rem 0', fontWeight: 600 }}>Your unique referral link</h3>
              
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                <input type="text" readOnly value={referralLink} style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)', backgroundColor: '#f6f9fc', outline: 'none' }} />
                <button onClick={handleCopyReferral} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0 1.25rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>Copy Link</button>
              </div>

              <div style={{ borderTop: '1px solid var(--stripe-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)' }}>12</div>
                  <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>Clicks</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)' }}>3</div>
                  <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>Signups</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-success-text)' }}>$150</div>
                  <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>Earned</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AGENCY PARTNERS */}
        {activeTab === 'partner' && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: 0, fontWeight: 600 }}>Agency Sub-Accounts</h3>
                <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: '4px 0 0 0' }}>Manage client profiles and white-labeled dashboards.</p>
              </div>
              <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>+ Add Client</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontFeatureSettings: '"tnum"' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--stripe-border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600 }}>CLIENT NAME</th>
                  <th style={{ padding: '0.75rem 0', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600 }}>PLAN</th>
                  <th style={{ padding: '0.75rem 0', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600 }}>MRR</th>
                  <th style={{ padding: '0.75rem 0', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600 }}>STATUS</th>
                  <th style={{ padding: '0.75rem 0', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                  <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Burger Joint LLC</td>
                  <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-body)' }}>Pro ($99/mo)</td>
                  <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-body)' }}>$99.00</td>
                  <td style={{ padding: '1rem 0' }}><span style={{ backgroundColor: 'rgba(21,190,83,0.1)', color: 'var(--stripe-success-text)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Active</span></td>
                  <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-purple)', cursor: 'pointer' }}>Login as Client</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Downtown Realtors</td>
                  <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-body)' }}>Enterprise ($299/mo)</td>
                  <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-body)' }}>$299.00</td>
                  <td style={{ padding: '1rem 0' }}><span style={{ backgroundColor: 'rgba(21,190,83,0.1)', color: 'var(--stripe-success-text)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Active</span></td>
                  <td style={{ padding: '1rem 0', fontSize: '12px', color: 'var(--stripe-purple)', cursor: 'pointer' }}>Login as Client</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: UPGRADE COMPARISON */}
        {activeTab === 'upgrade' && (
          <div>
            <Modal isOpen={showUpgradeModal} onClose={() => !isProcessingUpgrade && setShowUpgradeModal(false)} title="Upgrade to Pro Plan">
              {isProcessingUpgrade ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                  <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid var(--stripe-purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                  <div style={{ color: 'var(--stripe-purple)', fontSize: '13px', fontWeight: 600 }}>Processing Subscription...</div>
                  <p style={{ color: 'var(--stripe-muted)', fontSize: '12px', marginTop: '0.5rem' }}>Securely processing payment details.</p>
                </div>
              ) : (
                <div>
                  <p style={{ color: 'var(--stripe-body)', fontSize: '12.5px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    You are about to upgrade your workspace to the <strong>Pro Plan</strong> for <strong>$49/month</strong>. Your primary payment details ending in **4242 will be billed.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => setShowUpgradeModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--stripe-border)', backgroundColor: '#fff', color: 'var(--stripe-navy)', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>Cancel</button>
                    <button onClick={processUpgrade} style={{ padding: '0.5rem 1.25rem', borderRadius: '4px', border: 'none', backgroundColor: 'var(--stripe-purple)', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600, boxShadow: 'var(--stripe-shadow-action)' }}>Confirm Payment</button>
                  </div>
                </div>
              )}
            </Modal>

            <style jsx global>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>

            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>Choose the Plan that fits you</h2>
              <p style={{ color: 'var(--stripe-body)', fontSize: '12.5px' }}>Unlock unlimited inbound AI conversations and local telephony gateways.</p>
            </div>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              
              {/* Starter Plan */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '2rem', width: '320px', boxShadow: 'var(--stripe-shadow-ambient)' }}>
                <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Starter Plan</h3>
                <div style={{ fontSize: '24px', color: 'var(--stripe-navy)', fontWeight: 300, marginBottom: '1.25rem' }}>$0<span style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>/mo</span></div>
                <button disabled style={{ width: '100%', padding: '0.6rem', backgroundColor: '#f6f9fc', color: 'var(--stripe-muted)', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontWeight: 500, marginBottom: '1.5rem', cursor: 'not-allowed' }}>Current Plan</button>
                
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> 100 Chats / month</li>
                  <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> 1 Voice AI Agent</li>
                  <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Standard Email Support</li>
                </ul>
              </div>

              {/* Pro Plan */}
              <div style={{ backgroundColor: '#ffffff', border: '2px solid var(--stripe-purple)', borderRadius: '8px', padding: '2rem', width: '320px', boxShadow: '0 12px 24px rgba(83,58,253,0.12)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', fontSize: '10px', fontWeight: 600, padding: '3px 10px', borderRadius: '10px', letterSpacing: '0.5px' }}>MOST POPULAR</div>
                <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Pro Tier</h3>
                <div style={{ fontSize: '24px', color: 'var(--stripe-navy)', fontWeight: 300, marginBottom: '1.25rem' }}>$49<span style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>/mo</span></div>
                <button onClick={() => setShowUpgradeModal(true)} style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', fontWeight: 600, marginBottom: '1.5rem', cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>Upgrade to Pro</button>
                
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Unlimited Chats & Forms</li>
                  <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> 5 Voice AI Agents</li>
                  <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Custom Voice & Accents</li>
                  <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Local SIP Carrier Trunks (BYOT)</li>
                  <li style={{ fontSize: '12px', color: 'var(--stripe-body)', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Dynamic Composio Integrations</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--stripe-navy)', fontSize: '13px' }}>
        Loading account settings...
      </div>
    }>
      <AccountSettingsInner />
    </Suspense>
  );
}
