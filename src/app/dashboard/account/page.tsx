'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import SuccessConfirmation from '@/components/ui/SuccessConfirmation';
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
  
  // Billing plan state (Prepaid Flat Tiers)
  const [billingTier, setBillingTier] = useState<'starter' | 'pro' | 'team' | 'enterprise'>('starter');
  const [targetUpgradeTier, setTargetUpgradeTier] = useState<'pro' | 'team' | 'enterprise'>('pro');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('amira_billing_tier') as 'starter' | 'pro' | 'team' | 'enterprise';
      if (cached) setBillingTier(cached);
    }
  }, []);
  
  // Modals & loading states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgradeSuccess, setIsUpgradeSuccess] = useState(false);
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
  const [refLink, setRefLink] = useState("https://heyamira.com/ref/ashley99");
  const [refClicks, setRefClicks] = useState(12);
  const [refSignups, setRefSignups] = useState(3);
  const [refEarned, setRefEarned] = useState(150);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(refLink);
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

    const fetchReferralData = async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('referral_code, referral_clicks, referral_signups, referral_earnings')
          .eq('id', user.id)
          .single();
        if (profile) {
          const code = profile.referral_code || `user${user.id.substring(0, 4)}`;
          setRefLink(`https://heyamira.com/ref/${code}`);
          setRefClicks(profile.referral_clicks ?? 12);
          setRefSignups(profile.referral_signups ?? 3);
          setRefEarned(profile.referral_earnings ?? 150);
        }
      }
    };
    fetchReferralData();
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
      setBillingTier(targetUpgradeTier);
      if (typeof window !== 'undefined') {
        localStorage.setItem('amira_billing_tier', targetUpgradeTier);
      }
      setIsUpgradeSuccess(true);
      setToast(`🎉 Successfully upgraded to the ${targetUpgradeTier === 'pro' ? 'Pro Tier' : targetUpgradeTier === 'team' ? 'Team Plan' : 'Enterprise Plan'}!`);
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                    {billingTier === 'starter' && (
                      <div style={{
                        position: 'absolute',
                        inset: -10,
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '8px',
                        padding: '2rem',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '32px', marginBottom: '10px' }}>🔒</span>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--stripe-navy)', margin: '0 0 6px 0' }}>Local SIP Telephony (BYOT) is a Pro feature</h4>
                        <p style={{ fontSize: '12px', color: 'var(--stripe-muted)', margin: '0 0 16px 0', maxWidth: '340px', lineHeight: 1.5 }}>
                          Upgrade your plan to the Pro Tier to connect Safaricom Kenya, MTN Nigeria, or general SBC SIP trunks.
                        </p>
                        <button 
                          type="button"
                          onClick={() => handleTabChange('upgrade')}
                          style={{ backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 16px', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}
                        >
                          Upgrade to Pro Tier ✨
                        </button>
                      </div>
                    )}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
              
              {/* Plan Card */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 500, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Plan</div>
                    <div style={{ fontSize: '20px', color: 'var(--stripe-navy)', fontWeight: 300, letterSpacing: '-0.48px', marginBottom: '0.5rem' }}>
                      {billingTier === 'pro' ? 'Pro Tier' : billingTier === 'team' ? 'Team Plan' : billingTier === 'enterprise' ? 'Enterprise Plan' : 'Starter Plan'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--stripe-body)' }}>
                      {billingTier === 'pro' ? '₦45,000 / month' : billingTier === 'team' ? '₦135,000 / month' : billingTier === 'enterprise' ? '₦450,000 / month' : '₦0 / month'}
                    </div>
                  </div>
                  <span style={{ 
                    backgroundColor: billingTier !== 'starter' ? 'rgba(21,190,83,0.1)' : 'rgba(99,102,241,0.1)', 
                    color: billingTier !== 'starter' ? 'var(--stripe-success-text)' : '#6366f1', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '11px', 
                    fontWeight: 600 
                  }}>
                    {billingTier !== 'starter' ? 'Active' : 'Sandbox'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button 
                    onClick={() => {
                      if (billingTier === 'starter') {
                        setToast("Please upgrade to a Premium Plan to enable subscription billing configurations.");
                      } else {
                        handleCheckoutKorapay();
                      }
                    }} 
                    disabled={isCheckoutLoading} 
                    style={{ width: '100%', backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.6rem', fontSize: '12px', fontWeight: 500, cursor: isCheckoutLoading ? 'wait' : 'pointer' }}
                  >
                    {isCheckoutLoading ? 'Connecting...' : 'Manage Billing (Korapay)'}
                  </button>
                  {billingTier === 'starter' ? (
                    <button 
                      onClick={() => handleTabChange('upgrade')}
                      style={{ width: '100%', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.6rem', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Upgrade Plan Options ✨
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleTabChange('upgrade')}
                      style={{ width: '100%', backgroundColor: '#ffffff', color: 'var(--stripe-purple)', border: '1px solid var(--stripe-purple)', borderRadius: '4px', padding: '0.6rem', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Change Subscription Tier ✓
                    </button>
                  )}
                </div>
              </div>

              {/* Pay-as-you-go Call Credit Wallet */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 500, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Call Credits Wallet</div>
                    <div style={{ fontSize: '20px', color: 'var(--stripe-navy)', fontWeight: 300, letterSpacing: '-0.48px', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                      $150.00
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--stripe-body)' }}>Pay-as-you-go call credit wallet</div>
                  </div>
                  <span style={{ backgroundColor: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Active Wallet</span>
                </div>
                
                <button 
                  onClick={() => {
                    setToast("Opening Korapay to secure your outbound wallet top-up...");
                    setTimeout(() => {
                      handleCheckoutKorapay();
                    }, 1200);
                  }}
                  style={{ width: '100%', backgroundColor: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.6rem', fontSize: '12px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.15)' }}
                >
                  + Add Call Credits (Topup)
                </button>
              </div>

              {/* Usage Card */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 600 }}>Monthly Usage</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '0.4rem', fontFeatureSettings: '"tnum"' }}>
                    <span style={{ color: 'var(--stripe-navy)', fontWeight: 500 }}>AI Conversations</span>
                    <span style={{ color: 'var(--stripe-body)' }}>
                      {billingTier === 'starter' ? '85 / 100' : billingTier === 'pro' ? '450 / Unlimited' : billingTier === 'team' ? '1,200 / Unlimited' : '8,400 / Unlimited'}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e3e8ee', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: billingTier === 'starter' ? '85%' : billingTier === 'pro' ? '15%' : billingTier === 'team' ? '8%' : '2%', height: '100%', backgroundColor: 'var(--stripe-purple)', transition: 'width 0.5s ease-out' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '0.4rem', fontFeatureSettings: '"tnum"' }}>
                    <span style={{ color: 'var(--stripe-navy)', fontWeight: 500 }}>Team Members</span>
                    <span style={{ color: 'var(--stripe-body)' }}>
                      {billingTier === 'starter' ? '1 / 1' : billingTier === 'pro' ? '2 / 5' : billingTier === 'team' ? '4 / 5' : '18 / Unlimited'}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e3e8ee', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: billingTier === 'starter' ? '100%' : billingTier === 'pro' ? '40%' : billingTier === 'team' ? '80%' : '5%', height: '100%', backgroundColor: 'var(--stripe-purple)', transition: 'width 0.5s ease-out' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices List */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
              <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 600 }}>Invoice History</h3>
              <p style={{ fontSize: '12px', color: 'var(--stripe-body)', marginBottom: '1rem' }}>
                You are currently on the <strong>{billingTier === 'starter' ? 'Starter Plan' : billingTier === 'pro' ? 'Pro Plan' : billingTier === 'team' ? 'Team Plan' : 'Enterprise Plan'}</strong> subscription.
              </p>
              
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--stripe-navy)', marginBottom: '4px' }}>Next invoice</div>
                <div style={{ fontSize: '12px', color: 'var(--stripe-body)' }}>
                  {billingTier === 'starter' ? '₦0.00' : billingTier === 'pro' ? '₦45,000.00 due on June 1st, 2026' : billingTier === 'team' ? '₦135,000.00 due on June 1st, 2026' : '₦450,000.00 due on June 1st, 2026'}
                </div>
              </div>
              <button 
                onClick={async () => {
                  setIsProcessingBilling(true);
                  try {
                    const priceInCents = billingTier === 'pro' ? 4900 : billingTier === 'team' ? 14900 : billingTier === 'enterprise' ? 49900 : 0;
                    if (priceInCents === 0) {
                      setToast("Sandbox environment active. Upgrade subscription tier first.");
                      setIsProcessingBilling(false);
                      return;
                    }
                    await createKorapayCheckout(1, priceInCents, "user@example.com");
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
                <input type="text" readOnly value={refLink} style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)', backgroundColor: '#f6f9fc', outline: 'none' }} />
                <button onClick={handleCopyReferral} style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0 1.25rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer', boxShadow: 'var(--stripe-shadow-action)' }}>Copy Link</button>
              </div>

              <div style={{ borderTop: '1px solid var(--stripe-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)' }}>{refClicks}</div>
                  <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>Clicks</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)' }}>{refSignups}</div>
                  <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '0.25rem' }}>Signups</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-success-text)' }}>${refEarned}</div>
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
            <Modal isOpen={showUpgradeModal} onClose={() => !isProcessingUpgrade && setShowUpgradeModal(false)} title={isUpgradeSuccess ? "Workspace Upgraded" : `Upgrade to ${targetUpgradeTier === 'pro' ? 'Pro Tier' : targetUpgradeTier === 'team' ? 'Team Plan' : 'Enterprise Plan'}`}>
              {isUpgradeSuccess ? (
                <SuccessConfirmation
                  title={`Workspace Upgraded to ${targetUpgradeTier === 'pro' ? 'Pro Tier' : targetUpgradeTier === 'team' ? 'Team Plan' : 'Enterprise Plan'}!`}
                  subtitle={`Your plan features have been successfully updated. All features matching the ${targetUpgradeTier.toUpperCase()} tier are now fully unlocked.`}
                  icon="👑"
                  features={
                    targetUpgradeTier === 'pro' ? [
                      "Unlimited automated inbound chats & form triggers",
                      "Up to 5 active custom Voice AI Employees",
                      "Localized BYOT SIP trunks (MTN/Safaricom interconnect)",
                      "Composio secure API integrations"
                    ] : targetUpgradeTier === 'team' ? [
                      "Up to 15 active custom Voice AI Employees",
                      "ElevenLabs Neural Voice Clones (up to 3 distinct clones)",
                      "Advanced Outbound Campaign Dialers & CSV list uploads",
                      "HubSpot & Salesforce secure OAuth synchronization",
                      "Multi-seat workspace (up to 5 team members)"
                    ] : [
                      "Unlimited active custom Voice AI Employees",
                      "Unlimited Neural Voice Clones & fine-tuned LLMs",
                      "Dedicated custom SBC telecom trunks & massive outbound scale",
                      "SSO, custom databases integrations, SOC-2 security protocols",
                      "Unlimited seat licenses & dedicated SLA support manager"
                    ]
                  }
                  ctaText="Link Local SIP Telephone Number"
                  onCtaClick={() => {
                    setShowUpgradeModal(false);
                    setActiveTab('settings');
                    setActiveSettingsTab('telephony');
                  }}
                  secondaryCtaText="Explore Dashboard Overview"
                  onSecondaryClick={() => {
                    setShowUpgradeModal(false);
                    router.push('/dashboard');
                  }}
                />
              ) : isProcessingUpgrade ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                  <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid var(--stripe-purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                  <div style={{ color: 'var(--stripe-purple)', fontSize: '13px', fontWeight: 600 }}>Processing Subscription...</div>
                  <p style={{ color: 'var(--stripe-muted)', fontSize: '12px', marginTop: '0.5rem' }}>Securely processing payment details.</p>
                </div>
              ) : (
                <div>
                  <p style={{ color: 'var(--stripe-body)', fontSize: '12.5px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    You are about to upgrade your workspace to the <strong>{targetUpgradeTier === 'pro' ? 'Pro Tier' : targetUpgradeTier === 'team' ? 'Team Plan' : 'Enterprise Plan'}</strong> for <strong>{targetUpgradeTier === 'pro' ? '$49/month' : targetUpgradeTier === 'team' ? '$149/month' : '$499/month'}</strong> (₦{targetUpgradeTier === 'pro' ? '45,000' : targetUpgradeTier === 'team' ? '135,000' : '450,000'}/mo). Your primary payment details ending in **4242 will be billed.
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
              <h2 style={{ fontSize: '22px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' }}>Choose the Plan that fits you</h2>
              <p style={{ color: 'var(--stripe-body)', fontSize: '12.5px' }}>Unlock unlimited inbound AI conversations and professional telecommunication integrations.</p>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'stretch' }}>
              
              {/* Starter Plan */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', width: '250px', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Starter Plan</h3>
                  <p style={{ fontSize: '11px', color: 'var(--stripe-muted)', margin: '0 0 1rem 0', lineHeight: 1.4 }}>Sandbox environment for builders testing features.</p>
                  <div style={{ fontSize: '24px', color: 'var(--stripe-navy)', fontWeight: 300, marginBottom: '1.25rem' }}>$0<span style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>/mo</span></div>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: '#10b981' }}>✓</span> 100 Inbound Chats</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: '#10b981' }}>✓</span> 1 Voice AI Employee</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: '#10b981' }}>✓</span> Stock Voices Only</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-muted)', display: 'flex', gap: '0.4rem' }}><span style={{ color: '#ef4444' }}>✗</span> Outbound Campaigns</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-muted)', display: 'flex', gap: '0.4rem' }}><span style={{ color: '#ef4444' }}>✗</span> CRM pipelines sync</li>
                  </ul>
                </div>
                
                {billingTier === 'starter' ? (
                  <button disabled style={{ width: '100%', padding: '0.55rem', backgroundColor: '#f6f9fc', color: 'var(--stripe-muted)', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontWeight: 600, fontSize: '11.5px', cursor: 'not-allowed' }}>Current Plan</button>
                ) : (
                  <button onClick={() => { setBillingTier('starter'); localStorage.setItem('amira_billing_tier', 'starter'); setToast('Downgraded to Sandbox Starter Tier'); }} style={{ width: '100%', padding: '0.55rem', backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontWeight: 600, fontSize: '11.5px', cursor: 'pointer' }}>Downgrade</button>
                )}
              </div>

              {/* Pro Plan */}
              <div style={{ backgroundColor: '#ffffff', border: billingTier === 'pro' ? '2px solid var(--stripe-success-text)' : '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', width: '250px', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                {billingTier === 'pro' && <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#10b981', color: '#ffffff', fontSize: '9px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', letterSpacing: '0.5px' }}>CURRENT PLAN</div>}
                <div>
                  <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Pro Tier</h3>
                  <p style={{ fontSize: '11px', color: 'var(--stripe-muted)', margin: '0 0 1rem 0', lineHeight: 1.4 }}>For professional solo-agents & small scale setups.</p>
                  <div style={{ fontSize: '24px', color: 'var(--stripe-navy)', fontWeight: 300, marginBottom: '1.25rem' }}>$49<span style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>/mo</span></div>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Unlimited Inbound Chats</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> **5 Custom Voice AI Agents**</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Stock ElevenLabs pre-loaded</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> **1 Voice Clone Upload**</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Local SIP Trunks (BYOT)</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Basic CRM (1 pipeline)</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-label)', display: 'flex', gap: '0.4rem', fontWeight: 500 }}><span style={{ color: 'var(--stripe-purple)' }}>💰</span> Wallet rate: **$0.16/min**</li>
                  </ul>
                </div>
                
                {billingTier === 'pro' ? (
                  <button disabled style={{ width: '100%', padding: '0.55rem', backgroundColor: '#f6f9fc', color: 'var(--stripe-muted)', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontWeight: 600, fontSize: '11.5px', cursor: 'not-allowed' }}>Current Plan</button>
                ) : (
                  <button onClick={() => { setTargetUpgradeTier('pro'); setIsUpgradeSuccess(false); setShowUpgradeModal(true); }} style={{ width: '100%', padding: '0.55rem', backgroundColor: '#6366f1', backgroundImage: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#ffffff', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '11.5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)' }}>Upgrade to Pro</button>
                )}
              </div>

              {/* Team Plan */}
              <div style={{ backgroundColor: '#ffffff', border: billingTier === 'team' ? '2px solid var(--stripe-success-text)' : '2px solid var(--stripe-purple)', borderRadius: '8px', padding: '1.5rem', width: '250px', boxShadow: '0 12px 24px rgba(83,58,253,0.12)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', fontSize: '9px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', letterSpacing: '0.5px' }}>{billingTier === 'team' ? 'CURRENT PLAN' : 'RECOMMENDED'}</div>
                <div>
                  <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Team Plan</h3>
                  <p style={{ fontSize: '11px', color: 'var(--stripe-muted)', margin: '0 0 1rem 0', lineHeight: 1.4 }}>For fast-growing operations running multi-agent campaigns.</p>
                  <div style={{ fontSize: '24px', color: 'var(--stripe-navy)', fontWeight: 300, marginBottom: '1.25rem' }}>$149<span style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>/mo</span></div>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> **15 Custom Voice AI Agents**</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Neural voices + **3 Clones**</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> **Outbound Campaign Dialers**</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Multi-member: **5 Seats included**</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> Full HubSpot/Salesforce Sync</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: 'var(--stripe-purple)' }}>✓</span> WhatsApp/SMS automation triggers</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-label)', display: 'flex', gap: '0.4rem', fontWeight: 500 }}><span style={{ color: 'var(--stripe-purple)' }}>💰</span> Wallet rate: **$0.14/min**</li>
                  </ul>
                </div>
                
                {billingTier === 'team' ? (
                  <button disabled style={{ width: '100%', padding: '0.55rem', backgroundColor: '#f6f9fc', color: 'var(--stripe-muted)', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontWeight: 600, fontSize: '11.5px', cursor: 'not-allowed' }}>Current Plan</button>
                ) : (
                  <button onClick={() => { setTargetUpgradeTier('team'); setIsUpgradeSuccess(false); setShowUpgradeModal(true); }} style={{ width: '100%', padding: '0.55rem', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '11.5px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(83, 58, 253, 0.3)' }}>Upgrade to Team</button>
                )}
              </div>

              {/* Enterprise Plan */}
              <div style={{ backgroundColor: '#ffffff', border: billingTier === 'enterprise' ? '2px solid var(--stripe-success-text)' : '1px solid #1e293b', borderRadius: '8px', padding: '1.5rem', width: '250px', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                {billingTier === 'enterprise' && <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '9px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', letterSpacing: '0.5px' }}>CURRENT PLAN</div>}
                <div>
                  <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Enterprise</h3>
                  <p style={{ fontSize: '11px', color: 'var(--stripe-muted)', margin: '0 0 1rem 0', lineHeight: 1.4 }}>For large scale call-centers requiring dedicated trunks.</p>
                  <div style={{ fontSize: '24px', color: 'var(--stripe-navy)', fontWeight: 300, marginBottom: '1.25rem' }}>$499<span style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>/mo</span></div>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: '#1e293b' }}>✓</span> **Unlimited active agents**</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: '#1e293b' }}>✓</span> **Unlimited voice cloning**</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: '#1e293b' }}>✓</span> Dedicated LLM fine-tuning</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: '#1e293b' }}>✓</span> Dedicated SBC Telecom Trunks</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: '#1e293b' }}>✓</span> SSO & Custom Database sync</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-body)', display: 'flex', gap: '0.4rem' }}><span style={{ color: '#1e293b' }}>✓</span> SOC-2 & 99.9% SLA Support</li>
                    <li style={{ fontSize: '11px', color: 'var(--stripe-label)', display: 'flex', gap: '0.4rem', fontWeight: 500 }}><span style={{ color: '#1e293b' }}>💰</span> Wallet rate: **$0.11/min** (at cost)</li>
                  </ul>
                </div>
                
                {billingTier === 'enterprise' ? (
                  <button disabled style={{ width: '100%', padding: '0.55rem', backgroundColor: '#f6f9fc', color: 'var(--stripe-muted)', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontWeight: 600, fontSize: '11.5px', cursor: 'not-allowed' }}>Current Plan</button>
                ) : (
                  <button onClick={() => { setTargetUpgradeTier('enterprise'); setIsUpgradeSuccess(false); setShowUpgradeModal(true); }} style={{ width: '100%', padding: '0.55rem', backgroundColor: '#1e293b', color: '#ffffff', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '11.5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(30, 41, 59, 0.2)' }}>Upgrade to Enterprise</button>
                )}
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
