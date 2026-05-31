'use client';

import { useState, useEffect, useRef } from 'react';
import Modal from '../../../components/ui/Modal';
import Toast from '../../../components/ui/Toast';
import { createClient } from '../../../utils/supabase/client';
import { triggerCampaignDialer } from '@/app/actions/vapi';
import { getComposioStatus } from '@/app/actions/integrations';

// Mock CRM/Integration lists when Composio has no active credentials connected yet
const DEMO_CRM_LISTS: Record<string, Array<{ name: string; phone: string; email: string }>> = {
  hubspot: [
    { name: 'Adewale Okafor', phone: '+2348039991201', email: 'adewale@hubspot-leads.com' },
    { name: 'Linda Vance', phone: '+14159820011', email: 'linda.v@vancecorp.com' },
    { name: 'Kalu Nwosu', phone: '+2348123456789', email: 'kalu.nwosu@gmail.com' },
    { name: 'Sophia Alao', phone: '+2347065432109', email: 'sophia@alaodesigns.com' },
    { name: 'Marcus Sterling', phone: '+12128930192', email: 'm.sterling@sterling-holdings.com' }
  ],
  salesforce: [
    { name: 'Chief Olumide', phone: '+2348055554321', email: 'olumide@salesforce-deals.com' },
    { name: 'Sarah Jenkins', phone: '+2348030000002', email: 'sarah@gmail.com' },
    { name: 'Brian O\'Connor', phone: '+13109923849', email: 'brian@racingcore.com' },
    { name: 'Amadi Kalu', phone: '+2349021234567', email: 'amadi.kalu@kaluassociates.com' }
  ],
  mailchimp: [
    { name: 'Kemi Balogun', phone: '+2348030000001', email: 'kemi@gmail.com' },
    { name: 'Daniel Craig', phone: '+447700900077', email: 'd.craig@mi6.gov.uk' },
    { name: 'Fatima Musa', phone: '+2348187654321', email: 'fatima.musa@outlook.com' }
  ]
};

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Billing Plan status (Prepaid Flat Tiers)
  const [billingTier, setBillingTier] = useState<'starter' | 'pro' | 'team' | 'enterprise'>('starter');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('amira_billing_tier') as 'starter' | 'pro' | 'team' | 'enterprise';
      if (cached) setBillingTier(cached);
    }
  }, []);
  
  // Real Data State
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Navigation Tab State
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'campaigns'>('directory');
  
  // Form Picker & Config states
  const [leadSource, setLeadSource] = useState<'manual' | 'database' | 'crm'>('manual');
  const [campaignName, setCampaignName] = useState('');
  const [campaignAgent, setCampaignAgent] = useState('sales-qualifier');
  const [campaignPhone, setCampaignPhone] = useState('vapi-phone-default');
  const [campaignPrompt, setCampaignPrompt] = useState('');
  const [campaignSchedule, setCampaignSchedule] = useState('');
  
  // Contacts queue container
  const [parsedLeads, setParsedLeads] = useState<Array<{ name: string; phone: string; email?: string }>>([]);
  const [csvText, setCsvText] = useState('');
  const [isLaunchingCampaign, setIsLaunchingCampaign] = useState(false);

  // Database Lead Checklist State
  const [selectedDbLeads, setSelectedDbLeads] = useState<string[]>([]);
  const [dbLeadFilter, setDbLeadFilter] = useState<'all' | 'hot' | 'warm' | 'new'>('all');

  // Integrations / CRM state
  const [activeIntegrations, setActiveIntegrations] = useState<any[]>([]);
  const [selectedCrmApp, setSelectedCrmApp] = useState<string>('');
  const [crmListType, setCrmListType] = useState<string>('all');
  const [isCrmLoading, setIsCrmLoading] = useState(false);

  // Outbound Campaigns List Panel
  const [campaignsList, setCampaignsList] = useState<any[]>([
    { 
      id: "c-1", 
      name: "Q2 MedSpa Botox Qualifier", 
      status: "Finished", 
      queued: 12, 
      completed: 12, 
      cost: 1.84, 
      agent: "medspa-receptionist",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() 
    },
    { 
      id: "c-2", 
      name: "Outbound HVAC Plumbing Triage", 
      status: "Running", 
      queued: 8, 
      completed: 5, 
      cost: 0.96, 
      agent: "sales-qualifier",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() 
    }
  ]);

  // Drawer Details State
  const [selectedCampaignRun, setSelectedCampaignRun] = useState<any | null>(null);
  const [simulatedCalls, setSimulatedCalls] = useState<any[]>([]);
  const [selectedCallTranscript, setSelectedCallTranscript] = useState<any | null>(null);
  
  // Simulation interval ref
  const simIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchLeads();
    fetchIntegrations();
  }, []);

  // Update simulator when running campaign run drawer is opened
  useEffect(() => {
    if (selectedCampaignRun && selectedCampaignRun.status === 'Running') {
      initializeLiveSimulation();
    } else if (selectedCampaignRun && selectedCampaignRun.status === 'Finished') {
      loadFinishedCampaignMockLogs();
    } else {
      clearSimulation();
    }
    return () => clearSimulation();
  }, [selectedCampaignRun]);

  const fetchLeads = async () => {
    setIsLoading(true);
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
        setAllLeads([]);
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

  const fetchIntegrations = async () => {
    try {
      const res = await getComposioStatus();
      if (res.success && res.data) {
        setActiveIntegrations(res.data.filter((d: any) => d.status === 'active'));
      }
    } catch (err) {
      console.error('Failed to load integrations status:', err);
    }
  };

  // Sync state checkbox changes on database checklist
  useEffect(() => {
    if (leadSource === 'database') {
      const mapped = allLeads
        .filter(lead => selectedDbLeads.includes(lead.id))
        .map(lead => ({
          name: lead.name,
          phone: lead.phone || '',
          email: lead.email || ''
        }));
      setParsedLeads(mapped);
    }
  }, [selectedDbLeads, leadSource, allLeads]);

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
    const phone = formData.get('phone') as string;

    const { error } = await supabase.from('leads').insert({
      workspace_id: '11111111-1111-1111-1111-111111111111', 
      name,
      email,
      phone,
      status: 'New',
      source: 'Manual',
    });

    if (error) {
      setToast({ message: 'Error adding lead. Check Supabase keys.', type: 'error' });
      setShowAddModal(false);
    } else {
      setToast({ message: 'New lead added successfully to Supabase.', type: 'success' });
      setShowAddModal(false);
      fetchLeads();
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

  // Quick Action Buttons on Local Database Contacts Picker
  const handleSelectDbFiltered = (filterType: 'all' | 'hot' | 'warm' | 'new') => {
    let matches = allLeads;
    if (filterType !== 'all') {
      matches = allLeads.filter(l => l.status?.toLowerCase() === filterType);
    }
    const ids = matches.map(l => l.id);
    setSelectedDbLeads(prev => {
      const merged = new Set([...prev, ...ids]);
      return Array.from(merged);
    });
    setToast({ message: `Checked all ${filterType} database contacts!`, type: 'success' });
  };

  // Trigger Outbound Campaign Dialer
  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim() || parsedLeads.length === 0) {
      setToast({ message: 'Please specify a campaign name and select/paste contacts.', type: 'error' });
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
      
      const newCampaign = {
        id: res.campaignId || `c-${Date.now()}`,
        name: campaignName,
        status: campaignSchedule ? 'Scheduled' : 'Running',
        queued: parsedLeads.length,
        completed: 0,
        cost: 0.00,
        agent: campaignAgent,
        createdAt: new Date().toISOString()
      };

      setCampaignsList(prev => [newCampaign, ...prev]);
      
      // Reset form states
      setCampaignName('');
      setParsedLeads([]);
      setCsvText('');
      setCampaignPrompt('');
      setCampaignSchedule('');
      setSelectedDbLeads([]);
      setSelectedCrmApp('');
      
      // Refresh directory
      fetchLeads();
    } else {
      setToast({ message: `Failed to queue dialer: ${res.message || 'Connection error'}`, type: 'error' });
    }
  };

  // CRM Demo Import Mocking Trigger
  const handleImportMockCRM = (crmKey: string) => {
    setIsCrmLoading(true);
    setSelectedCrmApp(crmKey);
    setTimeout(() => {
      const contacts = DEMO_CRM_LISTS[crmKey] || [];
      setParsedLeads(contacts);
      setIsCrmLoading(false);
      setToast({ message: `🔌 Imported ${contacts.length} active leads from ${crmKey.toUpperCase()}!`, type: 'success' });
    }, 1000);
  };

  // Dialer Run Simulation Engines
  const clearSimulation = () => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
  };

  const loadFinishedCampaignMockLogs = () => {
    const list = [
      { name: "Kemi Balogun", phone: "+2348030000001", status: "Answered", duration: "1m 45s", cost: 0.21, transcriptId: "botox-kemi" },
      { name: "Sarah Jenkins", phone: "+2348030000002", status: "Answered", duration: "0m 52s", cost: 0.11, transcriptId: "botox-sarah" },
      { name: "Linda Vance", phone: "+14159820011", status: "Voicemail", duration: "0m 22s", cost: 0.05, transcriptId: "voicemail" },
      { name: "Chief Olumide", phone: "+2348055554321", status: "No Answer", duration: "0s", cost: 0.00, transcriptId: null },
      { name: "Brian O\'Connor", phone: "+13109923849", status: "Answered", duration: "1m 12s", cost: 0.15, transcriptId: "botox-brian" },
      { name: "Adewale Okafor", phone: "+2348039991201", status: "Answered", duration: "2m 04s", cost: 0.26, transcriptId: "botox-adewale" },
      { name: "Marcus Sterling", phone: "+12128930192", status: "Voicemail", duration: "0m 18s", cost: 0.04, transcriptId: "voicemail" },
      { name: "Fatima Musa", phone: "+2348187654321", status: "Answered", duration: "0m 48s", cost: 0.10, transcriptId: "botox-fatima" },
      { name: "Kalu Nwosu", phone: "+2348123456789", status: "No Answer", duration: "0s", cost: 0.00, transcriptId: null },
      { name: "Sophia Alao", phone: "+2347065432109", status: "Answered", duration: "1m 30s", cost: 0.19, transcriptId: "botox-sophia" },
      { name: "Daniel Craig", phone: "+447700900077", status: "Answered", duration: "3m 15s", cost: 0.42, transcriptId: "botox-daniel" },
      { name: "Amadi Kalu", phone: "+2349021234567", status: "Voicemail", duration: "0m 24s", cost: 0.05, transcriptId: "voicemail" }
    ];
    setSimulatedCalls(list);
  };

  const initializeLiveSimulation = () => {
    // Standard mock list for active running HVAC/Sales run
    const currentList = [
      { name: "Kemi Balogun", phone: "+2348030000001", status: "Answered", duration: "1m 55s", cost: 0.24, transcriptId: "hvac-kemi" },
      { name: "Sarah Jenkins", phone: "+2348030000002", status: "Answered", duration: "1m 10s", cost: 0.14, transcriptId: "hvac-sarah" },
      { name: "Adewale Okafor", phone: "+2348039991201", status: "No Answer", duration: "0s", cost: 0.00, transcriptId: null },
      { name: "Linda Vance", phone: "+14159820011", status: "Voicemail", duration: "0m 22s", cost: 0.05, transcriptId: "voicemail" },
      { name: "Chief Olumide", phone: "+2348055554321", status: "Answered", duration: "2m 15s", cost: 0.28, transcriptId: "hvac-olumide" },
      { name: "Marcus Sterling", phone: "+12128930192", status: "Queued", duration: "0s", cost: 0.00, transcriptId: null },
      { name: "Brian O\'Connor", phone: "+13109923849", status: "Queued", duration: "0s", cost: 0.00, transcriptId: null },
      { name: "Fatima Musa", phone: "+2348187654321", status: "Queued", duration: "0s", cost: 0.00, transcriptId: null }
    ];
    setSimulatedCalls(currentList);

    let currentCallIdx = 5; // Start simulating dial on lead 6 (index 5)
    
    simIntervalRef.current = setInterval(() => {
      setSimulatedCalls(prev => {
        const next = [...prev];
        if (currentCallIdx >= next.length) {
          clearSimulation();
          // Update campaign run completed in list
          setCampaignsList(cList => cList.map(c => c.id === selectedCampaignRun.id ? { ...c, status: 'Finished', completed: c.queued, cost: c.queued * 0.16 } : c));
          setSelectedCampaignRun((prevRun: any) => ({ ...prevRun, status: 'Finished', completed: prevRun.queued, cost: prevRun.queued * 0.16 }));
          setToast({ message: "🎉 Campaign run completed successfully!", type: "success" });
          return prev;
        }

        const call = next[currentCallIdx];
        if (call.status === "Queued") {
          call.status = "Ringing";
          setToast({ message: `Dialing: ${call.name}...`, type: "success" });
        } else if (call.status === "Ringing") {
          call.status = "Connected";
          call.duration = "0m 05s";
          call.cost = 0.02;
          call.transcriptId = selectedCampaignRun.agent === "medspa-receptionist" ? "botox-active" : "hvac-active";
          setToast({ message: `📞 Call connected live with ${call.name}!`, type: "success" });
        } else if (call.status === "Connected") {
          call.status = "Answered";
          call.duration = "1m 20s";
          call.cost = 0.18;
          
          // Increment main list values
          setCampaignsList(cList => cList.map(c => {
            if (c.id === selectedCampaignRun.id) {
              const updatedCost = parseFloat((c.cost + 0.18).toFixed(2));
              return { ...c, completed: c.completed + 1, cost: updatedCost };
            }
            return c;
          }));
          
          setSelectedCampaignRun((prevRun: any) => {
            const updatedCost = parseFloat((prevRun.cost + 0.18).toFixed(2));
            return { ...prevRun, completed: prevRun.completed + 1, cost: updatedCost };
          });

          currentCallIdx++;
        }
        return next;
      });
    }, 6000);
  };

  // Full Conversational Dialogue Templates for interactive popover details
  const getTranscriptDialog = (id: string): Array<{ role: 'ai' | 'lead'; text: string }> => {
    const dialogs: Record<string, Array<{ role: 'ai' | 'lead'; text: string }>> = {
      "botox-kemi": [
        { role: 'ai', text: "Hi! This is Ashley from Amira MedSpa. Am I speaking with Kemi?" },
        { role: 'lead', text: "Yes, this is Kemi. How are you?" },
        { role: 'ai', text: "I'm wonderful, thanks! I noticed you clicked on our promotional offer for the Botox spring package and wanted to see if you have any questions or wanted to book your slot?" },
        { role: 'lead', text: "Ah yes! What is the price of the spring package?" },
        { role: 'ai', text: "It's currently $189, which includes 20 units of Botox and a complimentary skin consult! Normally that's valued at over $300. Would you prefer a morning or afternoon appointment?" },
        { role: 'lead', text: "Morning would be great, maybe next Tuesday?" },
        { role: 'ai', text: "Awesome! I have next Tuesday at 9:30 AM or 11:00 AM available. Which of those works better?" },
        { role: 'lead', text: "Let's do 9:30 AM." },
        { role: 'ai', text: "Great! I've provisionally reserved Tuesday at 9:30 AM for you. You'll receive a confirmation text in a minute. Looking forward to seeing you, Kemi! Have a lovely day." },
        { role: 'lead', text: "Thank you, Ashley! Bye." }
      ],
      "botox-sarah": [
        { role: 'ai', text: "Hello! This is Ashley from Amira MedSpa. Can I speak with Sarah?" },
        { role: 'lead', text: "Hi Ashley, this is Sarah. I'm busy right now, is it quick?" },
        { role: 'ai', text: "Oh absolutely, Sarah! Just a 30-second heads up—our Spring Botox discount is closing today. I saw your saved booking draft, did you want me to lock in that slot for you?" },
        { role: 'lead', text: "Oh, yes. I actually wanted the Thursday afternoon slot at 3 PM if available?" },
        { role: 'ai', text: "Perfect, yes! Thursday at 3:00 PM is free. I've locked it in under your email sarah@gmail.com. We'll see you Thursday!" },
        { role: 'lead', text: "Awesome, thank you so much!" }
      ],
      "voicemail": [
        { role: 'ai', text: "[Beep] Hey there! This is Amira AI Outreach. We missed you but will send an SMS reminder with our latest bookings and calendar availability. Have a nice day!" }
      ],
      "botox-brian": [
        { role: 'ai', text: "Hi! This is Ashley from Amira MedSpa. Am I speaking with Brian?" },
        { role: 'lead', text: "Actually, this is his wife, Chloe. We share this number." },
        { role: 'ai', text: "Ah, no problem Chloe! I was calling to check if you guys wanted to lock in our spring aesthetic promotion pack for $189?" },
        { role: 'lead', text: "Oh, yes! I'd love that. Can you sign me up for next Wednesday at 2 PM?" },
        { role: 'ai', text: "You bet! Booked for next Wednesday, June 3rd at 2:00 PM. Have a great day!" }
      ],
      "botox-active": [
        { role: 'ai', text: "Hello! This is Ashley from Amira MedSpa. Am I speaking with Marcus?" },
        { role: 'lead', text: "Yes, Marcus here. Who is this?" },
        { role: 'ai', text: "[Live Connection Active] Hi Marcus! I'm calling back to schedule your facial consult. We have slots available next week..." }
      ],
      "hvac-kemi": [
        { role: 'ai', text: "Hey there, this is Josh from HVAC Service Pros. Am I speaking with Kemi?" },
        { role: 'lead', text: "Yes, you are. What's this about?" },
        { role: 'ai', text: "Hey Kemi, I'm just calling back about the plumbing assessment request you submitted online yesterday. I wanted to see if you're still experiencing the drainage backup, and ask a couple of quick questions to get our dispatcher scheduled?" },
        { role: 'lead', text: "Yes, the kitchen sink is still backed up and draining very slowly." },
        { role: 'ai', text: "Oh, got it. That can be super frustrating! Just to confirm, is it a single sink or double basin, and is there any leakage underneath?" },
        { role: 'lead', text: "It's a double basin, and yes, there's a slow drip under the pipes." },
        { role: 'ai', text: "Got it. We should definitely get a technician out to resolve that before it causes any cabinet damage. I can have a technician at your location next Monday afternoon, between 1 PM and 4 PM. Would that work?" },
        { role: 'lead', text: "Yes, Monday afternoon works." },
        { role: 'ai', text: "Fantastic! I have you queued in for Monday. I'll pass these notes to our plumber, Steve. He will text you 30 minutes before arrival. Thanks, Kemi!" },
        { role: 'lead', text: "Sounds good. Thank you!" }
      ],
      "hvac-sarah": [
        { role: 'ai', text: "Hey there! This is Josh from HVAC Service Pros. Is this Sarah?" },
        { role: 'lead', text: "Yes, speaking." },
        { role: 'ai', text: "Hey Sarah! Just following up on your AC repair booking. Is the condenser unit still making that loud rattling noise?" },
        { role: 'lead', text: "Yes, it is, and it's barely blowing any cold air." },
        { role: 'ai', text: "Oh no! We'll definitely want to get that sorted out. I can get an AC specialist to you tomorrow morning between 8 AM and 11 AM. Does that work?" },
        { role: 'lead', text: "Yes, tomorrow morning works perfectly. Thank you!" }
      ],
      "hvac-olumide": [
        { role: 'ai', text: "Hello! This is Josh from HVAC Service Pros. Am I speaking with Chief Olumide?" },
        { role: 'lead', text: "Yes, this is Olumide. Go ahead." },
        { role: 'ai', text: "Excellent! I was calling to schedule your annual heat pump service checkup. We have slots on Friday?" },
        { role: 'lead', text: "Yes, Friday at 10 AM is perfect." },
        { role: 'ai', text: "Perfect! All booked. See you Friday morning!" }
      ],
      "hvac-active": [
        { role: 'ai', text: "Hello! This is Josh from HVAC Service Pros. Am I speaking with Marcus?" },
        { role: 'lead', text: "Yes, Marcus here. Who is this?" },
        { role: 'ai', text: "[Live Connection Active] Hey Marcus! Calling to schedule your plumber dispatch..." }
      ]
    };
    
    return dialogs[id] || [
      { role: 'ai', text: "Hi! This is Amira AI Outbound Outreach." },
      { role: 'lead', text: "Hello! Yes, thanks for calling back." },
      { role: 'ai', text: "Perfect, let me know if you would like to book a callback." }
    ];
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
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '4px' }}>Phone Number</label>
            <input name="phone" type="text" placeholder="+234..." style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }} />
          </div>
          <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Save Lead</button>
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
            <button onClick={() => setShowAddModal(true)} style={{ backgroundColor: '#4caf50', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4caf50'}>
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
            borderBottom: activeSubTab === 'directory' ? '2.5px solid #4caf50' : '2.5px solid transparent',
            padding: '8px 0',
            fontSize: '13px',
            fontWeight: 700,
            color: activeSubTab === 'directory' ? '#4caf50' : 'var(--stripe-muted)',
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
            borderBottom: activeSubTab === 'campaigns' ? '2.5px solid #4caf50' : '2.5px solid transparent',
            padding: '8px 0',
            fontSize: '13px',
            fontWeight: 700,
            color: activeSubTab === 'campaigns' ? '#4caf50' : 'var(--stripe-muted)',
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
                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, letterSpacing: '0.5px' }}>SOURCE</th>
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
                      padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 500, textTransform: 'capitalize'
                    }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--stripe-navy)' }}>{lead.source || 'Manual'}</td>
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
          <div style={{ position: 'relative' }}>
            {(billingTier === 'starter' || billingTier === 'pro') && (
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(5px)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                border: '1px dashed var(--stripe-border)'
              }}>
                <span style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</span>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--stripe-navy)', margin: '0 0 6px 0' }}>Outbound Campaigns requires Team Plan</h4>
                <p style={{ fontSize: '12px', color: 'var(--stripe-muted)', margin: '0 0 20px 0', maxWidth: '340px', lineHeight: 1.5 }}>
                  Upgrade your workspace to the **Team Plan** to unlock automated outbound dialers, neural voice cloning, CRM ingestion pipelines, and SMS triggers.
                </p>
                <button
                  type="button"
                  onClick={() => window.location.href = '/dashboard/account?tab=upgrade'}
                  style={{
                    backgroundColor: 'var(--stripe-purple)',
                    backgroundImage: 'linear-gradient(135deg, #4caf50, #4caf50)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 24px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(76,175,80,0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Upgrade to Team Plan ✨
                </button>
              </div>
            )}
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
                Uses Amira's <code>schedulePlan.earliestAt</code> parameter to defer call dialer triggers. Leave blank for immediate calls.
              </span>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>Campaign System Prompts Override</label>
              <textarea 
                placeholder="Give specific instructions or promotion notes for this calling run..."
                value={campaignPrompt}
                onChange={e => setCampaignPrompt(e.target.value)}
                style={{ width: '100%', height: '60px', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)', resize: 'vertical' }} 
              />
            </div>

            {/* UPGRADED: Contacts Source Selector Tab Container */}
            <div style={{ marginBottom: '1.5rem', border: '1px solid var(--stripe-border)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', borderBottom: '1px solid var(--stripe-border)', backgroundColor: '#f8fafc' }}>
                <button
                  type="button"
                  onClick={() => { setLeadSource('manual'); setParsedLeads([]); }}
                  style={{
                    padding: '8px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: leadSource === 'manual' ? '#4caf50' : 'var(--stripe-muted)',
                    backgroundColor: leadSource === 'manual' ? '#ffffff' : 'transparent',
                    borderBottom: leadSource === 'manual' ? '2px solid #4caf50' : 'none'
                  }}
                >
                  📋 CSV Paste
                </button>
                <button
                  type="button"
                  onClick={() => { setLeadSource('database'); setParsedLeads([]); }}
                  style={{
                    padding: '8px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: leadSource === 'database' ? '#4caf50' : 'var(--stripe-muted)',
                    backgroundColor: leadSource === 'database' ? '#ffffff' : 'transparent',
                    borderBottom: leadSource === 'database' ? '2px solid #4caf50' : 'none'
                  }}
                >
                  🗂️ Leads DB Checklist
                </button>
                <button
                  type="button"
                  onClick={() => { setLeadSource('crm'); setParsedLeads([]); }}
                  style={{
                    padding: '8px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: leadSource === 'crm' ? '#4caf50' : 'var(--stripe-muted)',
                    backgroundColor: leadSource === 'crm' ? '#ffffff' : 'transparent',
                    borderBottom: leadSource === 'crm' ? '2px solid #4caf50' : 'none'
                  }}
                >
                  🔌 CRM Integrations
                </button>
              </div>

              {/* Subcontent Tab Panel A: CSV PASTE */}
              {leadSource === 'manual' && (
                <div style={{ padding: '1rem', backgroundColor: '#fff' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-navy)', marginBottom: '0.4rem', fontWeight: 700 }}>
                    Paste CSV List (Name, Phone, Email)
                  </label>
                  <textarea 
                    placeholder="Name,Phone,Email&#10;Kemi Balogun,+2348030000001,kemi@gmail.com&#10;Sarah Jenkins,+2348030000002,sarah@gmail.com"
                    value={csvText}
                    onChange={e => setCsvText(e.target.value)}
                    style={{ width: '100%', height: '80px', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '11.5px', color: 'var(--stripe-navy)', fontFamily: 'monospace', resize: 'none' }} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '10px', color: 'var(--stripe-muted)' }}>
                      Columns: <code>Name,Phone,Email</code>
                    </span>
                    <button
                      type="button"
                      onClick={handleParseCSV}
                      style={{ backgroundColor: '#ffffff', border: '1px solid #4caf50', borderRadius: '4px', padding: '3px 8px', fontSize: '10.5px', color: '#4caf50', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Parse CSV
                    </button>
                  </div>
                </div>
              )}

              {/* Subcontent Tab Panel B: LEADS DB CHECKLIST */}
              {leadSource === 'database' && (
                <div style={{ padding: '1rem', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--stripe-navy)' }}>Pick database contacts:</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button type="button" onClick={() => handleSelectDbFiltered('all')} style={{ padding: '2px 6px', fontSize: '9.5px', border: '1px solid var(--stripe-border)', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}>All</button>
                      <button type="button" onClick={() => handleSelectDbFiltered('hot')} style={{ padding: '2px 6px', fontSize: '9.5px', border: '1px solid var(--stripe-border)', background: '#fff', color: '#ef4444', borderRadius: '4px', cursor: 'pointer' }}>Hot</button>
                      <button type="button" onClick={() => handleSelectDbFiltered('new')} style={{ padding: '2px 6px', fontSize: '9.5px', border: '1px solid var(--stripe-border)', background: '#fff', color: '#4caf50', borderRadius: '4px', cursor: 'pointer' }}>New</button>
                      <button type="button" onClick={() => setSelectedDbLeads([])} style={{ padding: '2px 6px', fontSize: '9.5px', border: '1px solid #ef4444', background: '#fff', color: '#ef4444', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
                    </div>
                  </div>

                  <div style={{ maxHeight: '130px', overflowY: 'auto', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '4px' }}>
                    {allLeads.length === 0 ? (
                      <p style={{ fontSize: '11px', color: 'var(--stripe-muted)', margin: '8px', textAlign: 'center' }}>No leads found in Database. Switch to CSV Paste.</p>
                    ) : allLeads.map((lead) => (
                      <label 
                        key={lead.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          padding: '4px 6px', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          fontSize: '11.5px',
                          borderBottom: '1px solid #f8fafc',
                          backgroundColor: selectedDbLeads.includes(lead.id) ? 'rgba(76,175,80,0.05)' : 'transparent'
                        }}
                      >
                        <input 
                          type="checkbox"
                          checked={selectedDbLeads.includes(lead.id)}
                          onChange={() => {
                            setSelectedDbLeads(prev => 
                              prev.includes(lead.id) ? prev.filter(id => id !== lead.id) : [...prev, lead.id]
                            );
                          }}
                        />
                        <span style={{ fontWeight: 600, color: 'var(--stripe-navy)' }}>{lead.name}</span>
                        <span style={{ color: 'var(--stripe-muted)', fontSize: '10.5px' }}>({lead.phone || 'No phone'})</span>
                        <span style={{ 
                          fontSize: '9.5px', 
                          marginLeft: 'auto',
                          padding: '1px 6px', 
                          borderRadius: '8px',
                          backgroundColor: lead.status?.toLowerCase() === 'hot' ? 'rgba(217,45,32,0.1)' : '#f3f4f6',
                          color: lead.status?.toLowerCase() === 'hot' ? '#d92d20' : 'var(--stripe-muted)'
                        }}>
                          {lead.status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Subcontent Tab Panel C: CRM / INTEGRATIONS */}
              {leadSource === 'crm' && (
                <div style={{ padding: '1rem', backgroundColor: '#fff' }}>
                  {activeIntegrations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '12px 6px', border: '1px dashed var(--stripe-border)', borderRadius: '6px', backgroundColor: '#fafafa' }}>
                      <p style={{ fontSize: '11px', color: 'var(--stripe-muted)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                        🔌 No active CRM accounts connected. Go to Integrations tab to link accounts.
                      </p>
                      
                      {/* Standard Mock Imports for sandbox testing */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                        <button
                          type="button"
                          onClick={() => handleImportMockCRM('hubspot')}
                          disabled={isCrmLoading}
                          style={{
                            width: '100%',
                            padding: '6px',
                            backgroundColor: '#fff',
                            border: '1px solid #ff7a59',
                            color: '#ff7a59',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          🟠 Import HubSpot Demo Contacts
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImportMockCRM('salesforce')}
                          disabled={isCrmLoading}
                          style={{
                            width: '100%',
                            padding: '6px',
                            backgroundColor: '#fff',
                            border: '1px solid #1798c1',
                            color: '#1798c1',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          ☁️ Import Salesforce Demo Contacts
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>Active connected integrations</label>
                      <select 
                        value={selectedCrmApp}
                        onChange={e => handleImportMockCRM(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)', backgroundColor: '#fff', marginBottom: '8px' }}
                      >
                        <option value="">-- Choose Connected CRM --</option>
                        {activeIntegrations.map((app) => (
                          <option key={app.provider} value={app.provider.toLowerCase()}>
                            {app.provider.toUpperCase()} (Connected API Active)
                          </option>
                        ))}
                      </select>

                      {selectedCrmApp && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginTop: '6px' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>CRM list type:</span>
                          <select 
                            value={crmListType}
                            onChange={e => setCrmListType(e.target.value)}
                            style={{ padding: '2px 4px', border: '1px solid var(--stripe-border)', borderRadius: '3px', fontSize: '11px' }}
                          >
                            <option value="all">All Contacts List</option>
                            <option value="deals">Open Opportunity Deals</option>
                            <option value="hot">High Score Leads</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Parsed Contacts Grid preview */}
            {parsedLeads.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: 'var(--stripe-navy)', marginBottom: '0.4rem' }}>
                  <span>Dialer Target Contacts ({parsedLeads.length})</span>
                  <button type="button" onClick={() => { setParsedLeads([]); setSelectedDbLeads([]); setSelectedCrmApp(''); }} style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>Clear Queue</button>
                </div>
                <div style={{ maxHeight: '110px', overflowY: 'auto', border: '1px solid var(--stripe-border)', borderRadius: '6px', backgroundColor: '#f9fafb' }}>
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
              {isLaunchingCampaign ? 'Queuing & Connecting Trunks...' : parsedLeads.length === 0 ? 'Select target contacts to activate' : '🚀 Launch Outbound Campaign Dialer'}
            </button>
          </form>
          </div>

          {/* Active Outbound Campaigns List Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
              <h4 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 1.25rem 0', fontWeight: 600 }}>Active Dialer Runs</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {campaignsList.map((campaign) => (
                  <div 
                    key={campaign.id} 
                    onClick={() => setSelectedCampaignRun(campaign)}
                    style={{ 
                      border: '1px solid var(--stripe-border)', 
                      borderRadius: '8px', 
                      padding: '1rem', 
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                    }}
                  >
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
                        <span>Voice Call Costs:</span>
                        <strong style={{ display: 'block', color: '#10b981', fontSize: '12px', fontFamily: 'monospace' }}>${campaign.cost.toFixed(2)}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9.5px', color: 'var(--stripe-muted)', borderTop: '1px dashed #e2e8f0', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                      <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                      <span style={{ color: '#4caf50', fontWeight: 600 }}>Click to view details &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED ACTIVE RUNS SIDE-OVER (DRAWER PANEL) */}
      {selectedCampaignRun && (
        <>
          <div 
            onClick={() => setSelectedCampaignRun(null)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 999 }} 
          />
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              right: 0, 
              bottom: 0, 
              width: '460px', 
              backgroundColor: '#fff', 
              boxShadow: '-6px 0 32px rgba(0,0,0,0.15)', 
              zIndex: 1000, 
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--stripe-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#f8fafc' }}>
              <div>
                <span style={{ 
                  fontSize: '9.5px', 
                  backgroundColor: selectedCampaignRun.status === 'Finished' ? '#dcfce7' : '#fef3c7',
                  color: selectedCampaignRun.status === 'Finished' ? '#15803d' : '#b45309',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '6px'
                }}>
                  {selectedCampaignRun.status} Run Details
                </span>
                <h2 style={{ fontSize: '16px', margin: 0, color: 'var(--stripe-navy)', fontWeight: 700 }}>
                  {selectedCampaignRun.name}
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--stripe-muted)' }}>
                  Trunk Outbound Dialer | Created: {new Date(selectedCampaignRun.createdAt).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCampaignRun(null)} 
                style={{ background: '#ffffff', border: '1px solid var(--stripe-border)', width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--stripe-muted)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              >
                &times;
              </button>
            </div>

            {/* Drawer Body - KPI Stats Grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              
              {/* Progress Tracker bar */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid var(--stripe-border)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600, color: 'var(--stripe-navy)', marginBottom: '6px' }}>
                  <span>Dialing Run Progress</span>
                  <span>{selectedCampaignRun.completed} / {selectedCampaignRun.queued} Contacts</span>
                </div>
                
                {/* Progress bar line */}
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${(selectedCampaignRun.completed / selectedCampaignRun.queued) * 100}%`, 
                      height: '100%', 
                      backgroundImage: 'linear-gradient(90deg, #4caf50, #10b981)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease-out'
                    }} 
                  />
                </div>

                {selectedCampaignRun.status === 'Running' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: '#4caf50', marginTop: '8px', fontWeight: 600 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4caf50', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                    Outbound dialer is actively queuing SIP handshakes...
                  </div>
                )}
              </div>

              {/* Statistics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--stripe-muted)' }}>Average Call Duration</span>
                  <strong style={{ display: 'block', fontSize: '15px', color: 'var(--stripe-navy)', marginTop: '4px' }}>1m 14s</strong>
                </div>
                <div style={{ padding: '1rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--stripe-muted)' }}>Outbound Answer Rate</span>
                  <strong style={{ display: 'block', fontSize: '15px', color: '#10b981', marginTop: '4px' }}>
                    {selectedCampaignRun.status === 'Finished' ? '75%' : '80%'}
                  </strong>
                </div>
                <div style={{ padding: '1rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--stripe-muted)' }}>Voice Dialer Cost</span>
                  <strong style={{ display: 'block', fontSize: '15px', color: '#10b981', fontFamily: 'monospace', marginTop: '4px' }}>
                    ${selectedCampaignRun.cost.toFixed(2)}
                  </strong>
                </div>
                <div style={{ padding: '1rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--stripe-muted)' }}>Calling AI Assistant</span>
                  <strong style={{ display: 'block', fontSize: '12px', color: '#4caf50', marginTop: '4px', textTransform: 'capitalize' }}>
                    {selectedCampaignRun.agent?.replace('-', ' ')}
                  </strong>
                </div>
              </div>

              {/* Table / Queue Logs inside campaign run */}
              <h3 style={{ fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 700, margin: '0 0 0.5px 0' }}>Call Queue Logs</h3>
              <div style={{ border: '1px solid var(--stripe-border)', borderRadius: '6px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--stripe-border)' }}>
                      <th style={{ padding: '8px 12px' }}>LEAD NAME</th>
                      <th style={{ padding: '8px 12px' }}>STATUS</th>
                      <th style={{ padding: '8px 12px' }}>DUR</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>TRANSCRIPT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulatedCalls.map((call, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--stripe-border)' }}>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--stripe-navy)' }}>{call.name}</span>
                          <span style={{ display: 'block', fontSize: '9px', color: 'var(--stripe-muted)', fontFamily: 'monospace' }}>{call.phone}</span>
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{ 
                            fontSize: '9.5px', 
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '10px',
                            backgroundColor: call.status === 'Answered' ? '#dcfce7' : call.status === 'Connected' ? '#dbeafe' : call.status === 'Ringing' ? '#fef3c7' : '#f3f4f6',
                            color: call.status === 'Answered' ? '#15803d' : call.status === 'Connected' ? '#1e40af' : call.status === 'Ringing' ? '#b45309' : 'var(--stripe-muted)'
                          }}>
                            {call.status}
                          </span>
                        </td>
                        <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{call.duration || '-'}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                          {call.transcriptId ? (
                            <button
                              onClick={() => setSelectedCallTranscript({
                                leadName: call.name,
                                transcriptId: call.transcriptId,
                                status: call.status
                              })}
                              style={{ 
                                padding: '2px 8px', 
                                border: '1px solid #4caf50', 
                                borderRadius: '4px', 
                                background: '#fff', 
                                color: '#4caf50', 
                                fontSize: '10px', 
                                fontWeight: 700,
                                cursor: 'pointer' 
                              }}
                            >
                              View &rarr;
                            </button>
                          ) : (
                            <span style={{ fontSize: '10px', color: 'var(--stripe-muted)' }}>-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TRANSCRIPT POPUP OVERLAY */}
      {selectedCallTranscript && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedCallTranscript(null)} 
          title={`Call Transcript: ${selectedCallTranscript.leadName}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', padding: '0.5rem' }}>
            <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', borderBottom: '1px solid var(--stripe-border)', paddingBottom: '8px' }}>
              🤖 Agent Channel Outbound | Call Status: <strong>{selectedCallTranscript.status}</strong>
            </div>

            {getTranscriptDialog(selectedCallTranscript.transcriptId).map((msg, mIdx) => (
              <div 
                key={mIdx} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: msg.role === 'ai' ? 'flex-start' : 'flex-end'
                }}
              >
                <span style={{ fontSize: '9.5px', color: 'var(--stripe-muted)', marginBottom: '2px', textTransform: 'capitalize' }}>
                  {msg.role === 'ai' ? 'Calling AI assistant' : selectedCallTranscript.leadName}
                </span>
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '12px',
                  maxWidth: '80%',
                  fontSize: '11.5px',
                  lineHeight: 1.4,
                  backgroundColor: msg.role === 'ai' ? '#f1f5f9' : '#e0e7ff',
                  color: msg.role === 'ai' ? 'var(--stripe-navy)' : '#1e3a8a',
                  borderBottomLeftRadius: msg.role === 'ai' ? '2px' : '12px',
                  borderBottomRightRadius: msg.role === 'lead' ? '2px' : '12px'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setSelectedCallTranscript(null)}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
            >
              Close logs
            </button>
          </div>
        </Modal>
      )}

      {/* Styles for transition overlays and keyframes */}
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      `}</style>

      {/* Side Panel Overlay for directory lead details edit */}
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
                <select name="status" defaultValue={selectedLead.status} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px' }}>
                  <option value="New">New</option>
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', borderTop: '1px solid var(--stripe-border)', paddingTop: '1.5rem' }}>
                <button type="submit" disabled={isUpdating} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: isUpdating ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
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
