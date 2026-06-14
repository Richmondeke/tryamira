'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import Toast from '../../../../components/ui/Toast';
import { getAgents } from '@/app/actions/agent';
import { searchPhoneNumbers, buyPhoneNumber } from '@/app/actions/vapi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

interface PhoneNumber {
  id: string;
  number: string;
  carrier: 'Owned' | 'Twilio' | 'Vonage' | 'SignalWire';
  assignedAgentId: string | null;
  assignedAgentName: string | null;
  billingStatus: string;
  createdAt: string;
}

export default function PhoneNumbersPage() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    {
      id: 'num_1',
      number: '+1 (415) 801-3920',
      carrier: 'Owned',
      assignedAgentId: null,
      assignedAgentName: null,
      billingStatus: '$2.00 / mo',
      createdAt: new Date().toLocaleDateString()
    }
  ]);

  // Modals state
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<PhoneNumber | null>(null);

  // Import form state
  const [importCarrier, setImportCarrier] = useState<'Twilio' | 'Vonage' | 'SignalWire'>('Twilio');
  const [importNumber, setImportNumber] = useState('');
  const [accountSid, setAccountSid] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Buy form state
  const [areaCode, setAreaCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState<{phoneNumber: string, areaCode: string}[]>([]);
  const [isBuying, setIsBuying] = useState<string | null>(null);

  // Link Agent form state
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Load active workspace agents so we can link them to phone numbers
    getAgents().then(res => {
      if (res.success && res.data) {
        setAgents(res.data);
      }
    });
  }, []);

  // Handle Import Number Action
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importNumber.trim() || !accountSid.trim() || !authToken.trim()) {
      setToast({ message: 'Please fill out all credential fields.', type: 'error' });
      return;
    }

    setIsImporting(true);
    setTimeout(() => {
      const newNum: PhoneNumber = {
        id: `num_${Date.now()}`,
        number: importNumber,
        carrier: importCarrier,
        assignedAgentId: null,
        assignedAgentName: null,
        billingStatus: 'External Carrier',
        createdAt: new Date().toLocaleDateString()
      };
      setPhoneNumbers(prev => [...prev, newNum]);
      setIsImporting(false);
      setShowImportModal(false);
      setToast({ message: `Successfully imported ${importNumber} from ${importCarrier}!`, type: 'success' });
      // Reset state
      setImportNumber('');
      setAccountSid('');
      setAuthToken('');
    }, 1500);
  };

  // Search Mock Numbers by Area Code
  const handleSearchNumbers = async () => {
    if (!areaCode.trim() || areaCode.length !== 3) {
      setToast({ message: 'Please enter a valid 3-digit Area Code.', type: 'error' });
      return;
    }
    setIsSearching(true);
    setAvailableNumbers([]);
    
    const res = await searchPhoneNumbers(areaCode);
    if (res.success && res.data) {
      setAvailableNumbers(res.data);
    } else {
      setToast({ message: res.error || 'Failed to search phone numbers', type: 'error' });
    }
    
    setIsSearching(false);
  };

  // Purchase Number
  const handleBuyNumber = async (num: string) => {
    setIsBuying(num);
    const res = await buyPhoneNumber(num);
    
    if (res.success) {
      const newNum: PhoneNumber = {
        id: res.data?.id || `num_${Date.now()}`,
        number: num,
        carrier: 'Owned',
        assignedAgentId: null,
        assignedAgentName: null,
        billingStatus: '$2.00 / mo',
        createdAt: new Date().toLocaleDateString()
      };
      setPhoneNumbers(prev => [...prev, newNum]);
      setIsBuying(null);
      setShowBuyModal(false);
      setToast({ message: `Successfully purchased ${num}! It is now active in your workspace.`, type: 'success' });
      setAreaCode('');
      setAvailableNumbers([]);
    } else {
      setToast({ message: res.error || 'Failed to purchase number', type: 'error' });
      setIsBuying(null);
    }
  };

  // Open Link Agent Modal
  const openLinkModal = (num: PhoneNumber) => {
    setSelectedNumber(num);
    setSelectedAgentId(num.assignedAgentId || '');
    setShowLinkModal(true);
  };

  // Link Agent to Number Submit
  const handleLinkAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNumber) return;

    const matchedAgent = agents.find(a => a.id === selectedAgentId);
    
    setPhoneNumbers(prev => prev.map(num => 
      num.id === selectedNumber.id 
        ? { 
            ...num, 
            assignedAgentId: selectedAgentId || null, 
            assignedAgentName: matchedAgent ? matchedAgent.name : null 
          }
        : num
    ));

    setShowLinkModal(false);
    setToast({ 
      message: matchedAgent 
        ? `Successfully linked ${selectedNumber.number} to AI employee "${matchedAgent.name}"` 
        : `Successfully disconnected agent from ${selectedNumber.number}`, 
      type: 'success' 
    });
  };

  // Release (delete) Phone Number
  const handleReleaseNumber = (id: string, num: string) => {
    if (confirm(`Are you sure you want to release the phone number ${num}? This action cannot be undone.`)) {
      setPhoneNumbers(prev => prev.filter(n => n.id !== id));
      setToast({ message: `Released number ${num} from your account.`, type: 'success' });
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* --- IMPORT MODAL --- */}
      <Modal isOpen={showImportModal} onClose={() => !isImporting && setShowImportModal(false)} title="Import Existing Phone Number">
        <form onSubmit={handleImportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
            Link your existing Twilio, Vonage, or SignalWire phone number to Amira by providing your API credentials.
          </p>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '6px', fontWeight: 500 }}>Select Carrier</label>
            <select 
              value={importCarrier} 
              onChange={(e) => setImportCarrier(e.target.value as any)}
              style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '13px', backgroundColor: '#fff', color: 'var(--stripe-navy)' }}
            >
              <option value="Twilio">Twilio</option>
              <option value="Vonage">Vonage</option>
              <option value="SignalWire">SignalWire</option>
            </select>
          </div>

          <Input 
            label="Phone Number" 
            placeholder="+1 (555) 123-4567" 
            value={importNumber} 
            onChange={(e) => setImportNumber(e.target.value)} 
            required 
          />

          <Input 
            label={importCarrier === 'Twilio' ? 'Account SID' : 'API Key'} 
            placeholder={importCarrier === 'Twilio' ? 'ACxxxxxxxxxxxxxxxxxxxxxx' : 'key_xxxxxx'} 
            value={accountSid} 
            onChange={(e) => setAccountSid(e.target.value)} 
            required 
          />

          <Input 
            label={importCarrier === 'Twilio' ? 'Auth Token' : 'API Secret'} 
            type="password" 
            placeholder="•••••••••••••••••••••••••••••" 
            value={authToken} 
            onChange={(e) => setAuthToken(e.target.value)} 
            required 
          />

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button type="button" variant="outline" onClick={() => setShowImportModal(false)} disabled={isImporting}>Cancel</Button>
            <Button type="submit" style={{ backgroundColor: '#4caf50', color: '#fff' }} disabled={isImporting}>
              {isImporting ? 'Importing...' : 'Import Number'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- BUY MODAL --- */}
      <Modal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} title="Rent a New Phone Number">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
            Instantly provision a new clean phone number from Amira's number pool. Enter an area code to search for available numbers.
          </p>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Input 
                label="Search by Area Code (3 digits)" 
                placeholder="212" 
                maxLength={3} 
                value={areaCode} 
                onChange={(e) => setAreaCode(e.target.value)} 
              />
            </div>
            <Button 
              type="button" 
              style={{ backgroundColor: '#4caf50', color: '#fff', height: '42px' }}
              onClick={handleSearchNumbers}
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {availableNumbers.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <label style={{ fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 600 }}>Available Numbers:</label>
              {availableNumbers.map((num, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem', border: '1px solid var(--stripe-border)', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--stripe-navy)' }}>{num.phoneNumber}</span>
                  <Button 
                    type="button" 
                    size="sm"
                    style={{ backgroundColor: '#10b981', color: '#fff' }}
                    onClick={() => handleBuyNumber(num.phoneNumber)}
                    disabled={isBuying === num.phoneNumber}
                  >
                    {isBuying === num.phoneNumber ? 'Provisioning...' : 'Buy ($2.00/mo)'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* --- LINK AGENT MODAL --- */}
      <Modal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} title={`Configure Route for ${selectedNumber?.number}`}>
        <form onSubmit={handleLinkAgentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
            Direct all incoming calls reaching <strong>{selectedNumber?.number}</strong> to a specific active AI Employee.
          </p>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '6px', fontWeight: 500 }}>Select AI Employee Agent</label>
            <select 
              value={selectedAgentId} 
              onChange={(e) => setSelectedAgentId(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '13px', backgroundColor: '#fff', color: 'var(--stripe-navy)' }}
            >
              <option value="">-- Disconnected / Standby --</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button type="button" variant="outline" onClick={() => setShowLinkModal(false)}>Cancel</Button>
            <Button type="submit" style={{ backgroundColor: '#4caf50', color: '#fff' }}>
              Save Route Configuration
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- HEADER --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 400, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>Provisioned Phone Numbers</h2>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>Provision phone numbers to bind with your voice agents for inbound calling.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowImportModal(true)}
          >
            🔌 Import Number
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            style={{ backgroundColor: '#4caf50', color: '#fff' }}
            onClick={() => setShowBuyModal(true)}
          >
            📞 Buy New Number
          </Button>
        </div>
      </div>

      {/* --- ACTIVE LISTING --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {phoneNumbers.map((num) => (
          <div 
            key={num.id}
            style={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid var(--stripe-border)', 
              borderRadius: '8px', 
              padding: '1.5rem', 
              boxShadow: 'var(--stripe-shadow-ambient)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => router.push(`/dashboard/integrations/phone/${num.id}`)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(76,175,80,0.06)', color: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                📞
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '16px', color: 'var(--stripe-navy)', fontWeight: 600 }}>{num.number}</span>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#64748b', backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '20px' }}>
                    {num.carrier}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '12px' }}>
                  <span style={{ color: num.assignedAgentName ? '#10b981' : '#64748b', fontWeight: num.assignedAgentName ? 600 : 400 }}>
                    {num.assignedAgentName ? `🟢 Routed to: ${num.assignedAgentName}` : '⚪ Standby / Unassigned'}
                  </span>
                  <span style={{ color: 'var(--stripe-muted)' }}>•</span>
                  <span style={{ color: 'var(--stripe-muted)' }}>Billing: {num.billingStatus}</span>
                  <span style={{ color: 'var(--stripe-muted)' }}>•</span>
                  <span style={{ color: 'var(--stripe-muted)' }}>Created: {num.createdAt}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }} onClick={(e) => e.stopPropagation()}>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => openLinkModal(num)}
              >
                ⚙️ Link Agent
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                style={{ color: '#d92d20', borderColor: '#fecdca' }}
                onClick={() => handleReleaseNumber(num.id, num.number)}
              >
                Release
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
