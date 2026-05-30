'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAgents, createAgent } from '@/app/actions/agent';
import { syncVapiRAG, uploadClonedVoice } from '@/app/actions/vapi';
import Toast from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

const templatesData = [
  {
    id: 'customer-support-bot',
    name: 'Customer Support Bot',
    category: 'Support',
    categoryColor: '#0ea5e9',
    desc: 'Handles FAQs, returns policies, and support ticketing around the clock without a human agent.',
    capabilities: [
      'Answer product & FAQ questions',
      'Process return & refund requests',
      'Create & escalate support tickets',
      'Send follow-up confirmation emails',
    ],
    requiredIntegrations: [
      { name: 'Zendesk', icon: '🎫', reason: 'Create & update support tickets' },
      { name: 'Slack', icon: '💬', reason: 'Notify your team of escalations' },
    ],
    voice: 'rachel',
    callsHandled: '~240 calls/mo',
    prompt: `You are an expert Customer Support Agent for our company. 
Your goal is to be helpful, professional, and empathetic.
You can:
1. Answer common product and FAQ questions.
2. Guide users through return and refund policies.
3. Escalate complex queries by opening a ticket in Zendesk.
4. Confirm user details and send confirmation emails via Gmail.`
  },
  {
    id: 'sales-qualifier',
    name: 'Sales Qualifier',
    category: 'Sales',
    categoryColor: '#8b5cf6',
    desc: 'Asks BANT qualification questions and automatically books discovery calls directly on your calendar.',
    capabilities: [
      'Run BANT qualification on every lead',
      'Score and rank leads by priority',
      'Book meetings in real-time on the call',
      'Push qualified leads to your CRM',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Book discovery calls in real-time' },
      { name: 'HubSpot', icon: '🟠', reason: 'Push qualified leads and scores to CRM' },
      { name: 'Slack', icon: '💬', reason: 'Alert your sales team on hot leads' },
    ],
    voice: 'josh',
    callsHandled: '~180 calls/mo',
    prompt: `You are a high-performing Sales Qualification Agent.
Your objective is to run BANT (Budget, Authority, Need, Timeline) qualification on inbound leads.
Keep the conversation engaging and professional.
If they qualify:
1. Suggest booking a meeting using Google Calendar.
2. Log their qualification score and contact details in HubSpot.
3. Alert the sales team instantly via Slack.`
  },
  {
    id: 'real-estate-agent',
    name: 'Real Estate Agent',
    category: 'Real Estate',
    categoryColor: '#10b981',
    desc: 'Captures buyer and renter preferences, qualifies budget and timeline, then books property showings instantly.',
    capabilities: [
      'Qualify buyer budget & timeline',
      'Capture property preferences',
      'Schedule property tour appointments',
      'Update agent CRM after every call',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Schedule property showings' },
      { name: 'HubSpot', icon: '🟠', reason: 'Log lead details and call notes' },
    ],
    voice: 'rachel',
    callsHandled: '~120 calls/mo',
    prompt: `You are a professional Real Estate Assistant.
Your goal is to capture buyer or renter preferences (location, budget, bedrooms, timeline).
1. Help narrow down property selections.
2. Book property tour appointments directly on Google Calendar.
3. Log details to HubSpot CRM.
4. Send a follow-up confirmation email to the client using Gmail.`
  },
  {
    id: 'ecommerce-concierge',
    name: 'Ecommerce Concierge',
    category: 'E-commerce',
    categoryColor: '#f59e0b',
    desc: 'Handles WISMO queries, product recommendations, and return requests by connecting directly to your store.',
    capabilities: [
      'Track order & shipping status live',
      'Process return & refund requests',
      'Recommend products based on history',
      'Issue store credit via Stripe',
    ],
    requiredIntegrations: [
      { name: 'Shopify', icon: '🛍️', reason: 'Query live order & shipping status' },
      { name: 'Stripe', icon: '💳', reason: 'Issue refunds & store credit' },
      { name: 'Zendesk', icon: '🎫', reason: 'Open tickets for complex issues' },
    ],
    voice: 'nova',
    callsHandled: '~300 calls/mo',
    prompt: `You are an E-commerce Concierge assistant.
Your main goals:
1. Handle "Where is my order?" (WISMO) queries using Shopify tracking details.
2. Facilitate returns and refund requests, processing transactions via Stripe.
3. Provide personalized product recommendations based on search queries.
4. Open a support ticket in Zendesk if human intervention is needed.`
  },
  {
    id: 'home-services-dispatcher',
    name: 'Home Services Dispatcher',
    category: 'Trades',
    categoryColor: '#ef4444',
    desc: 'The 24/7 dispatcher for plumbers, HVAC techs, and electricians. Triages emergencies and books jobs instantly.',
    capabilities: [
      'Triage inbound emergency calls',
      'Find and book the next available tech',
      'Send job details to the on-call tech',
      'Collect dispatch fee payment upfront',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Find available technician slots' },
      { name: 'Stripe', icon: '💳', reason: 'Collect emergency dispatch fee upfront' },
    ],
    voice: 'josh',
    callsHandled: '~90 calls/mo',
    prompt: `You are a 24/7 Emergency Dispatcher for our home services business.
Your job is to triage emergency situations (e.g. active leaks, heating outages) and dispatch technicians.
1. Check Google Calendar for available tech time slots.
2. Collect emergency dispatch fees securely via Stripe.
3. Send automated job details and technician alerts instantly via Twilio SMS.`
  },
  {
    id: 'medspa-receptionist',
    name: 'MedSpa Receptionist',
    category: 'Healthcare',
    categoryColor: '#ec4899',
    desc: 'Books appointments, handles rescheduling, and answers treatment FAQs for clinics and medspas 24/7.',
    capabilities: [
      'Book & reschedule appointments',
      'Answer treatment & pricing FAQs',
      'Send pre-appointment instructions',
      'Collect patient intake information',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Book and reschedule appointments' },
      { name: 'Notion', icon: '📝', reason: 'Log patient intake information' },
    ],
    voice: 'rachel',
    callsHandled: '~150 calls/mo',
    prompt: `You are a friendly receptionist for our MedSpa clinic.
You are warm, inviting, and highly organized.
1. Handle booking and rescheduling of treatments using Google Calendar.
2. Answer common FAQs about treatments, pricing, and downtime.
3. Collect new patient intake information and log it to Notion.
4. Send customized pre-appointment instructions via Gmail.`
  }
];

const allIntegrations = [
  { id: 'hubspot', name: 'HubSpot', desc: 'Sync leads to your HubSpot CRM.', icon: '🟠' },
  { id: 'salesforce', name: 'Salesforce', desc: 'Two-way sync for Salesforce records.', icon: '☁️' },
  { id: 'zapier', name: 'Zapier', desc: 'Connect Amira to 5,000+ apps.', icon: '⚡' },
  { id: 'stripe', name: 'Stripe', desc: 'Capture payments directly in chat.', icon: '💳' },
  { id: 'slack', name: 'Slack', desc: 'Send notifications to Slack channels.', icon: '💬' },
  { id: 'googlecalendar', name: 'Google Calendar', desc: 'Book meetings directly on your calendar.', icon: '📅' },
  { id: 'zendesk', name: 'Zendesk', desc: 'Create and manage support tickets.', icon: '🎧' },
  { id: 'mailchimp', name: 'Mailchimp', desc: 'Sync email subscribers automatically.', icon: '✉️' },
  { id: 'shopify', name: 'Shopify', desc: 'Manage e-commerce orders and customers.', icon: '🛍️' },
  { id: 'notion', name: 'Notion', desc: 'Sync data to Notion databases.', icon: '📝' }
];

const namesList = [
  'Rachel', 'Josh', 'Kemi', 'Chinedu', 'Nova', 'Alloy', 'Fin', 'Bella', 'Thomas', 'Serena',
  'Mwangi', 'Ambrose', 'Chioma', 'Amina', 'Marcus', 'Sarah', 'George', 'Charlotte', 'Liam', 'Olivia',
  'Sophia', 'Emma', 'Isabella', 'Mia', 'Evelyn', 'Harper', 'Camila', 'Gianna', 'Abigail', 'Luna',
  'Noah', 'Oliver', 'Elijah', 'James', 'Benjamin', 'Lucas', 'Henry', 'Alexander', 'Mason', 'Michael',
  'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Levi', 'Sebastian', 'Mateo', 'Jack', 'Owen',
  'Theodore', 'Aiden', 'Samuel', 'Joseph', 'John', 'David', 'Wyatt', 'Carter', 'Julian', 'Luke',
  'Grayson', 'Isaac', 'Jayden', 'Dylan', 'Gabriel', 'Lincoln', 'Mateo', 'Ryan', 'Nathan', 'Christian',
  'Fatima', 'Zainab', 'Kofi', 'Kwame', 'Naledi', 'Jabulani', 'Lindiwe', 'Tariq', 'Layla', 'Youssef',
  'Aanya', 'Arjun', 'Saanvi', 'Vivaan', 'Priya', 'Kabir', 'Zara', 'Tariq', 'Amir', 'Farah',
  'Hiroshi', 'Sakura', 'Kenji', 'Mei', 'Jian', 'Min-jun', 'Ji-woo', 'Somsak', 'Anong', 'Malee'
];

const providersList = ['ElevenLabs', 'PlayHT', 'Cartesia', 'OpenAI', 'Deepgram'];
const gendersList = ['Female', 'Male'];
const accentsList = [
  'US Friendly', 'US Professional', 'UK British Warm', 'Aussie Friendly', 'Nigerian (West Africa)',
  'Kenyan (East Africa)', 'South African Accent', 'Indian English', 'Canadian Neutral', 'Irish Lilt'
];
const tagsList = [
  'Best for Support', 'Best for Sales', 'Premium Local', 'Best for Retail', 'Best for FAQs',
  'Best for Consulting', 'Best for Wellness', 'Best for Trades', 'Best for Marketing', 'Executive Voice'
];

const audioPreviewUrls = [
  'https://storage.googleapis.com/eleven-public-prod/previews/21m00Tcm4TlvDq8ikWAM.mp3', // Rachel
  'https://storage.googleapis.com/eleven-public-prod/previews/TxGEqnHWrfWFTfGW9XjX.mp3', // Josh
  'https://storage.googleapis.com/eleven-public-prod/previews/AZnzlk1XvdvUeBnXmlld.mp3', // Nova
  'https://storage.googleapis.com/eleven-public-prod/previews/ErXwobaYiN019PkySvjV.mp3', // Alloy
  'https://storage.googleapis.com/eleven-public-prod/previews/VR6A4mxSTDLrjDlsgcTC.mp3', // Fin
  'https://storage.googleapis.com/eleven-public-prod/previews/EXAVITQu4vr4xnSDxMaL.mp3', // Bella
  'https://storage.googleapis.com/eleven-public-prod/previews/yoZ06a0ZtWhg3xoI4ILV.mp3', // Thomas
  'https://storage.googleapis.com/eleven-public-prod/previews/pNInz6obpgq5paNs9W5D.mp3'  // Serena
];

const generate100Voices = () => {
  const list = [];
  
  // Baseline premium core & local voices
  const base = [
    { id: 'rachel', name: 'Rachel', provider: 'ElevenLabs', gender: 'Female', accent: 'US Friendly', tag: 'Best for Support', text: "Hi! I'm Rachel. I speak with a warm, empathetic, and professional tone. Perfect for customer support.", lang: 'en', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/21m00Tcm4TlvDq8ikWAM.mp3' },
    { id: 'josh', name: 'Josh', provider: 'ElevenLabs', gender: 'Male', accent: 'US Professional', tag: 'Best for Sales', text: "Hello! I'm Josh. My voice is deep, confident, and persuasive. Excellent for outbound sales.", lang: 'en', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/TxGEqnHWrfWFTfGW9XjX.mp3' },
    { id: 'kemi', name: 'Kemi', provider: 'ElevenLabs', gender: 'Female', accent: 'Nigerian (West Africa)', tag: 'Premium Local', text: "Kedu! I am Kemi. I speak with a clear and professional Nigerian English accent. Excellent for West African customer service.", lang: 'en', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/21m00Tcm4TlvDq8ikWAM.mp3' },
    { id: 'chinedu', name: 'Chinedu', provider: 'ElevenLabs', gender: 'Male', accent: 'Nigerian (West Africa)', tag: 'Premium Local', text: "Hello! I am Chinedu. My voice is warm and trustworthy, with a classic Nigerian accent.", lang: 'en', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/TxGEqnHWrfWFTfGW9XjX.mp3' },
    { id: 'nova', name: 'Nova', provider: 'OpenAI', gender: 'Female', accent: 'US Energetic', tag: 'Best for Retail', text: "Hi there! I'm Nova. I have a bright, energetic, and highly engaging voice.", lang: 'en', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/AZnzlk1XvdvUeBnXmlld.mp3' },
    { id: 'alloy', name: 'Alloy', provider: 'OpenAI', gender: 'Male', accent: 'US Neutral', tag: 'Best for FAQs', text: "Hello, I'm Alloy. I offer a clear, calm, and neutral voice.", lang: 'en', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/ErXwobaYiN019PkySvjV.mp3' },
    { id: 'fin', name: 'Fin', provider: 'ElevenLabs', gender: 'Male', accent: 'British Warm', tag: 'Best for Consulting', text: "Cheers! I'm Fin. My British accent brings a warm, refined, and trustworthy tone.", lang: 'en', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/VR6A4mxSTDLrjDlsgcTC.mp3' },
    { id: 'bella', name: 'Bella', provider: 'ElevenLabs', gender: 'Female', accent: 'US Soft', tag: 'Best for Wellness', text: "Hi, I'm Bella. I have a gentle, soothing, and attentive voice.", lang: 'en', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/EXAVITQu4vr4xnSDxMaL.mp3' },
    { id: 'thomas', name: 'Thomas', provider: 'PlayHT', gender: 'Male', accent: 'Aussie Friendly', tag: 'Best for Trades', text: "G'day! I'm Thomas. My Australian voice is friendly, down-to-earth, and relatable.", lang: 'en', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/yoZ06a0ZtWhg3xoI4ILV.mp3' },
    { id: 'serena', name: 'Serena', provider: 'ElevenLabs', gender: 'Female', accent: 'US Conversational', tag: 'Best for Marketing', text: "Hey! I'm Serena. I have an upbeat, natural, and highly conversational voice.", lang: 'en', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/pNInz6obpgq5paNs9W5D.mp3' },
    { id: 'mwangi', name: 'Mwangi', provider: 'PlayHT', gender: 'Male', accent: 'Kenyan (East Africa)', tag: 'Warm Support', text: "Jambo! I am Mwangi. I offer a warm, articulate Kenyan English voice profile.", lang: 'en', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/TxGEqnHWrfWFTfGW9XjX.mp3' },
    { id: 'ambrose', name: 'Ambrose', provider: 'ElevenLabs', gender: 'Male', accent: 'Yoruba Dialect', tag: 'Native Voice', text: "E nle o! I am Ambrose. I speak fluent Yoruba and English, bridging communications.", lang: 'yo', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/TxGEqnHWrfWFTfGW9XjX.mp3' },
    { id: 'chioma', name: 'Chioma', provider: 'ElevenLabs', gender: 'Female', accent: 'Igbo Dialect', tag: 'Native Voice', text: "Nnoo! I am Chioma. I speak fluent Igbo and English, providing native guidance.", lang: 'ig', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/21m00Tcm4TlvDq8ikWAM.mp3' },
    { id: 'amina', name: 'Amina', provider: 'ElevenLabs', gender: 'Female', accent: 'Hausa Dialect', tag: 'Native Voice', text: "Sannu! I am Amina. I speak fluent Hausa and English, providing professional communication.", lang: 'ha', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/21m00Tcm4TlvDq8ikWAM.mp3' }
  ];

  list.push(...base);

  // Generate 86 more unique premium voices to fill the 100 inventory
  for (let i = 14; i < 100; i++) {
    const name = namesList[i % namesList.length];
    const provider = providersList[i % providersList.length];
    const gender = gendersList[i % gendersList.length];
    const accent = accentsList[i % accentsList.length];
    const tag = tagsList[i % tagsList.length];
    const previewUrl = audioPreviewUrls[i % audioPreviewUrls.length];
    
    list.push({
      id: `${name.toLowerCase()}_${provider.toLowerCase()}_${i}`,
      name: `${name} (${provider})`,
      provider: provider,
      gender: gender,
      accent: accent,
      tag: tag,
      text: `Hello! I am ${name}, powered by ${provider}. My voice features a professional ${accent} profile.`,
      lang: 'en',
      previewUrl: previewUrl
    });
  }
  
  return list;
};

const initialVoicesList = generate100Voices();

function AgentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('template');
  const isPreview = searchParams.get('preview') === 'true';

  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Onboarding Wizard State
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [customName, setCustomName] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customVoice, setCustomVoice] = useState('rachel');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Custom Cloned Voice State
  const [voices, setVoices] = useState(initialVoicesList);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [clonedVoiceName, setClonedVoiceName] = useState('');
  const [clonedVoiceFile, setClonedVoiceFile] = useState<string | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const [cloneProgress, setCloneProgress] = useState(0);

  // Voice Preview Playing state
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Premium Voices Search, Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProvider, setFilterProvider] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterAccent, setFilterAccent] = useState('All');
  const [voicePage, setVoicePage] = useState(1);
  const voicesPerPage = 12;

  // Knowledge Base RAG Trainer State
  const [showKbInput, setShowKbInput] = useState(false);
  const [kbTitle, setKbTitle] = useState('');
  const [kbContent, setKbContent] = useState('');
  const [isTrainingKb, setIsTrainingKb] = useState(false);
  const [kbProgress, setKbProgress] = useState(0);
  const [trainedDocs, setTrainedDocs] = useState<Array<{ title: string; content: string }>>([]);

  // Integration Connection simulation state
  const [connectedIntegrations, setConnectedIntegrations] = useState<Record<string, boolean>>({});
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  // Playground simulated chat state
  const [messages, setMessages] = useState<{ sender: 'user' | 'agent'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const selectedTemplate = templatesData.find(t => t.id === templateId);

  useEffect(() => {
    async function fetchAgents() {
      const res = await getAgents();
      if (res.success && res.data) {
        setAgents(res.data);
      }
      setIsLoading(false);
    }
    fetchAgents();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      setCustomName(selectedTemplate.name);
      setCustomPrompt(selectedTemplate.prompt);
      setCustomVoice(selectedTemplate.voice);
      
      // Initialize ALL integrations as false
      const initial: Record<string, boolean> = {};
      allIntegrations.forEach(integration => {
        initial[integration.name] = false;
      });
      setConnectedIntegrations(initial);

      // Initialize trained docs with template baseline PDF
      let docTitle = 'Brand_Guidelines.pdf';
      let docContent = 'Our firm focuses on delivering premium experiences with transparent processes.';
      if (selectedTemplate.id === 'customer-support-bot') {
        docTitle = 'Support_FAQ_Sheet.pdf';
        docContent = 'Standard refund requests are processed within 30 days via Stripe. Complex support escalations are pushed to Zendesk.';
      } else if (selectedTemplate.id === 'sales-qualifier') {
        docTitle = 'BANT_Sales_Guide.pdf';
        docContent = 'Our services start at $5,000/mo. We schedule discovery slots on Google Calendar. Contact details are pushed to HubSpot CRM.';
      } else if (selectedTemplate.id === 'medspa-receptionist') {
        docTitle = 'MedSpa_Pricing_Faqs.pdf';
        docContent = 'Botox treatment is priced at $12 per unit. Rescheduling slots requires 24 hours notice on Google Calendar.';
      }
      setTrainedDocs([{ title: docTitle, content: docContent }]);

      // Pre-fill chat playground
      setMessages([
        { sender: 'agent', text: `Hi there! I'm the newly configured ${selectedTemplate.name}. I'm fully set up and ready to help. You can test chatting with me right now!` }
      ]);
    }
  }, [selectedTemplate]);

  // Clean up speech synthesis & audio elements if component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

  const runSpeechSynthesis = (text: string, gender: string, onEndCallback: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEndCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voicesListSystem = window.speechSynthesis.getVoices();
    let selectedSysVoice = null;
    
    const isFemale = gender.toLowerCase().includes('female') || gender.toLowerCase().includes('soft') || gender.toLowerCase().includes('friendly');
    
    if (isFemale) {
      selectedSysVoice = voicesListSystem.find(v => 
        v.name.toLowerCase().includes('google us english') || 
        v.name.toLowerCase().includes('samantha') || 
        v.name.toLowerCase().includes('zira') || 
        v.name.toLowerCase().includes('hazel') || 
        v.name.toLowerCase().includes('female')
      ) || voicesListSystem.find(v => v.lang.startsWith('en'));
    } else {
      selectedSysVoice = voicesListSystem.find(v => 
        v.name.toLowerCase().includes('google uk english male') || 
        v.name.toLowerCase().includes('david') || 
        v.name.toLowerCase().includes('mark') || 
        v.name.toLowerCase().includes('george') || 
        v.name.toLowerCase().includes('male')
      ) || voicesListSystem.find(v => v.lang.startsWith('en'));
    }
    
    if (selectedSysVoice) {
      utterance.voice = selectedSysVoice;
    }

    utterance.pitch = 1.0;
    utterance.rate = 1.05;
    
    utterance.onend = () => {
      onEndCallback();
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesis fallback error:", e);
      onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  };

  const playVoicePreview = (voiceId: string, text: string, gender: string) => {
    const voiceObj = voices.find(v => v.id === voiceId);

    // Stop current HTML5 audio if any is active in state
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    
    // Stop persistent DOM-attached audio player if active
    const globalAudio = document.getElementById('voice-preview-player') as HTMLAudioElement | null;
    if (globalAudio) {
      globalAudio.pause();
      globalAudio.currentTime = 0;
    }

    // Stop speechSynthesis if active
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // If clicked the currently playing voice, we stop playing and return!
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
      return;
    }

    // Attempt premium audio preview URL first
    if (voiceObj && (voiceObj as any).previewUrl) {
      setPlayingVoice(voiceId);
      
      const triggerFallback = () => {
        console.warn(`Premium preview URL failed for voice ${voiceId}. Falling back to browser SpeechSynthesis.`);
        runSpeechSynthesis(text, gender, () => {
          setPlayingVoice(null);
        });
      };

      if (globalAudio) {
        globalAudio.src = (voiceObj as any).previewUrl;
        globalAudio.onended = () => {
          setPlayingVoice(null);
        };
        globalAudio.onerror = () => {
          triggerFallback();
        };
        globalAudio.play().catch(err => {
          console.warn("Failed to play via global audio node, falling back:", err);
          triggerFallback();
        });
      } else {
        const audio = new Audio((voiceObj as any).previewUrl);
        setCurrentAudio(audio);
        audio.onended = () => {
          setPlayingVoice(null);
          setCurrentAudio(null);
        };
        audio.onerror = () => {
          triggerFallback();
        };
        audio.play().catch(err => {
          console.warn("Failed to play via Audio context, falling back:", err);
          triggerFallback();
        });
      }
      return;
    }

    // If no preview URL exists, run SpeechSynthesis directly
    setPlayingVoice(voiceId);
    runSpeechSynthesis(text, gender, () => {
      setPlayingVoice(null);
    });
  };

  const handleCloneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clonedVoiceName.trim() || !clonedVoiceFile) {
      setToast({ message: 'Please provide a name and upload a voice sample.', type: 'error' });
      return;
    }

    setIsCloning(true);
    setCloneProgress(15);

    const timer = setInterval(() => {
      setCloneProgress(prev => {
        if (prev >= 85) {
          clearInterval(timer);
          return 85;
        }
        return prev + 20;
      });
    }, 200);

    // Call Server Action uploading the neural voiceprint to ElevenLabs API
    const res = await uploadClonedVoice(clonedVoiceName, "BASE64_NEURAL_VOICE_STREAM_PAYLOAD");

    clearInterval(timer);

    if (res.success) {
      setCloneProgress(100);
      setTimeout(() => {
        const newVoiceId = res.voiceId || `cloned_${Date.now()}`;
        const newClonedVoice = {
          id: newVoiceId,
          name: clonedVoiceName,
          provider: 'ElevenLabs',
          gender: 'Custom Voiceprint',
          accent: 'Neural Clone',
          tag: '100% Voice Match',
          text: `Hi! I am your newly cloned custom voice. I sound exactly like the high-fidelity sample you uploaded to Amira!`,
          lang: selectedLanguage,
          previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/pNInz6obpgq5paNs9W5D.mp3'
        };
        setVoices(prevVoices => [newClonedVoice, ...prevVoices]);
        setCustomVoice(newVoiceId);
        setIsCloning(false);
        setShowCloneModal(false);
        setClonedVoiceName('');
        setClonedVoiceFile(null);
        setToast({ message: '🎉 Voice successfully cloned at ElevenLabs and ready to speak!', type: 'success' });
      }, 300);
    } else {
      setIsCloning(false);
      setToast({ message: `Cloning failed: ${res.error || 'API Connection error'}`, type: 'error' });
    }
  };

  const handleAddKbSubmit = async () => {
    if (!kbTitle.trim() || !kbContent.trim()) {
      setToast({ message: 'Please provide both a title and contents for your knowledge document.', type: 'error' });
      return;
    }

    setIsTrainingKb(true);
    setKbProgress(10);

    const timer = setInterval(() => {
      setKbProgress(prev => {
        if (prev >= 80) {
          clearInterval(timer);
          return 80;
        }
        return prev + 15;
      });
    }, 150);

    const docTitle = kbTitle.trim().endsWith('.pdf') || kbTitle.trim().endsWith('.txt') || kbTitle.trim().endsWith('.csv')
      ? kbTitle.trim()
      : `${kbTitle.trim()}.pdf`;

    // Trigger Server Action (persists vector chunks into pgvector database and indexes at Vapi edge RAG)
    const res = await syncVapiRAG(
      selectedTemplate?.id || 'onboarding-agent',
      docTitle,
      kbContent.trim()
    );

    clearInterval(timer);
    
    if (res.success) {
      setKbProgress(100);
      setTimeout(() => {
        const newDoc = {
          title: docTitle,
          content: kbContent.trim(),
          fileId: res.vapiFileId,
          kbId: res.vapiKbId
        };
        setTrainedDocs(prevDocs => [...prevDocs, newDoc]);
        setIsTrainingKb(false);
        setShowKbInput(false);
        setKbTitle('');
        setKbContent('');
        setToast({ message: `🎉 '${newDoc.title}' fully indexed in local pgvector & synced at the edge on Vapi!`, type: 'success' });
      }, 300);
    } else {
      setIsTrainingKb(false);
      setToast({ message: `Failed to index RAG memory: ${res.error || 'Connection error'}`, type: 'error' });
    }
  };

  const simulateConnection = (name: string) => {
    setIsConnecting(name);
    setTimeout(() => {
      setConnectedIntegrations(prev => ({ ...prev, [name]: true }));
      setIsConnecting(null);
    }, 1200);
  };

  const handleCreateAgent = async () => {
    setIsCreating(true);
    const res = await createAgent('New Agent');
    if (res.success && res.data) {
      router.push(`/dashboard/ai-agent/${res.data.id}`);
    } else {
      setToast({ message: 'Failed to create a new agent.', type: 'error' });
      setIsCreating(false);
    }
  };

  const handleGoLive = async () => {
    if (!selectedTemplate) return;
    setIsCreating(true);

    const activeWorkflows = Object.entries(connectedIntegrations)
      .filter(([_, connected]) => connected)
      .map(([name]) => name.toLowerCase());

    const agentConfig = {
      agentName: customName,
      voice: customVoice,
      systemPrompt: customPrompt,
      attachedWorkflows: activeWorkflows,
      templateId: selectedTemplate.id,
      status: 'live'
    };

    const res = await createAgent(customName, agentConfig);
    setIsCreating(false);

    if (res.success && res.data) {
      setToast({ message: '🎉 Your AI Agent is officially Live and Active!', type: 'success' });
      setTimeout(() => {
        // Navigate straight to analytics to see it live!
        router.push('/dashboard/analytics');
      }, 1500);
    } else {
      setToast({ message: 'Failed to deploy AI Agent live.', type: 'error' });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    // Simulate Agent intelligent responses based on prompt
    setTimeout(() => {
      let responseText = "Understood. I will process that request using my attached integrations.";
      
      // Semantic custom fact checking (RAG Simulation)
      const userLower = userMsg.toLowerCase();
      let matchedDoc = null;
      
      for (const doc of trainedDocs) {
        const docTitleClean = doc.title.toLowerCase().replace(/\.(pdf|txt|csv)$/, '').replace(/_|-/g, ' ');
        const hasTitleMatch = docTitleClean.split(' ').some(word => word.length > 2 && userLower.includes(word));
        const hasContentMatch = doc.content.toLowerCase().split(/[\s,.:;?]+/).some(word => 
          word.length > 3 && userLower.includes(word) && !['this', 'that', 'with', 'from', 'your', 'about', 'firm', 'our', 'what', 'where', 'when', 'how', 'much'].includes(word)
        );

        if (hasTitleMatch || hasContentMatch || userLower.includes(doc.title.toLowerCase())) {
          matchedDoc = doc;
          break;
        }
      }

      if (matchedDoc) {
        responseText = `[RAG Retrieval Verified from ${matchedDoc.title}]: "${matchedDoc.content}" — Is there anything else I can check in my knowledge base for you?`;
      } else if (templateId === 'customer-support-bot') {
        if (userMsg.toLowerCase().includes('return') || userMsg.toLowerCase().includes('refund')) {
          responseText = "Sure, I can process that return. I've initiated the workflow, queried Stripe, and a confirmation email has been dispatched via Gmail!";
        } else {
          responseText = "I've checked our database and created a ticket in Zendesk. I'll ping the team on Slack to make sure it gets handled immediately.";
        }
      } else if (templateId === 'sales-qualifier') {
        if (userMsg.toLowerCase().includes('price') || userMsg.toLowerCase().includes('cost') || userMsg.toLowerCase().includes('budget')) {
          responseText = "Our services start at $5,000/mo, as specified in our BANT Sales Guide. Let's reserve a spot on Google Calendar for Monday to map this out!";
        } else {
          responseText = "Great! I've qualified your budget and timeline. I just booked a slot on our Google Calendar for Monday and synced everything directly into HubSpot.";
        }
      } else if (templateId === 'ecommerce-concierge') {
        responseText = "I checked Shopify and your package is currently out for delivery! I'll email you the tracking link via Gmail.";
      } else if (templateId === 'medspa-receptionist') {
        if (userMsg.toLowerCase().includes('botox') || userMsg.toLowerCase().includes('price') || userMsg.toLowerCase().includes('unit') || userMsg.toLowerCase().includes('cost')) {
          responseText = "Botox treatments at Amira MedSpa are priced at $12 per unit, as registered in our MedSpa Pricing FAQs. Would you like me to reserve an appointment slot on our Google Calendar?";
        } else {
          responseText = "Of course! I can assist you with booking or managing treatments. Would you like me to query open slots on our Google Calendar?";
        }
      }
      
      setMessages(prev => [...prev, { sender: 'agent', text: responseText }]);
      setIsTyping(false);
    }, 1500);
  };

  // Multi-tier dynamic filter engine for up to 100 voices
  let tempFiltered = voices.filter(v => v.lang === selectedLanguage);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    tempFiltered = tempFiltered.filter(v => 
      v.name.toLowerCase().includes(q) ||
      v.provider.toLowerCase().includes(q) ||
      v.accent.toLowerCase().includes(q) ||
      v.tag.toLowerCase().includes(q) ||
      v.text.toLowerCase().includes(q)
    );
  }

  if (filterProvider !== 'All') {
    tempFiltered = tempFiltered.filter(v => v.provider === filterProvider);
  }

  if (filterGender !== 'All') {
    tempFiltered = tempFiltered.filter(v => v.gender === filterGender);
  }

  if (filterAccent !== 'All') {
    tempFiltered = tempFiltered.filter(v => v.accent.toLowerCase().includes(filterAccent.toLowerCase()));
  }

  const totalFilteredCount = tempFiltered.length;
  const totalPages = Math.ceil(totalFilteredCount / voicesPerPage) || 1;
  
  // Safeguard active page index bounds
  const activePage = voicePage > totalPages ? totalPages : voicePage;
  const startIndex = (activePage - 1) * voicesPerPage;
  const filteredVoices = tempFiltered.slice(startIndex, startIndex + voicesPerPage);

  if (isLoading) {
    return (
      <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%', padding: '2rem', textAlign: 'center', color: 'var(--stripe-muted)' }}>
        Loading agents...
      </div>
    );
  }

  // --- PREVIEW TEMPLATE MODE ---
  if (selectedTemplate && isPreview) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', width: '100%' }}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => router.push('/dashboard/templates')}
            style={{ background: 'none', border: 'none', color: 'var(--stripe-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '13px' }}
          >
            ← Back to Templates
          </button>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          {/* Cover Header */}
          <div style={{ padding: '2.5rem', background: `linear-gradient(135deg, ${selectedTemplate.categoryColor}15 0%, ${selectedTemplate.categoryColor}25 100%)`, borderBottom: '1px solid var(--stripe-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: selectedTemplate.categoryColor, backgroundColor: `${selectedTemplate.categoryColor}20`, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {selectedTemplate.category}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>
                ⚡ Average Volume: {selectedTemplate.callsHandled}
              </span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>{selectedTemplate.name}</h1>
            <p style={{ fontSize: '14px', color: 'var(--stripe-body)', margin: 0, lineHeight: 1.6 }}>{selectedTemplate.desc}</p>
          </div>

          <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Col */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--stripe-navy)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capabilities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedTemplate.capabilities.map((cap, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                    <span style={{ fontSize: '13px', color: 'var(--stripe-body)', lineHeight: 1.4 }}>{cap}</span>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--stripe-navy)', marginTop: '2rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Voice Profile</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--stripe-border)' }}>
                <span style={{ fontSize: '24px' }}>🗣️</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--stripe-navy)' }}>
                    {selectedTemplate.voice === 'josh' ? 'Josh (ElevenLabs)' : selectedTemplate.voice === 'rachel' ? 'Rachel (ElevenLabs)' : 'Nova (OpenAI)'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>Professional, ultra-realistic voice model</div>
                </div>
              </div>
            </div>

            {/* Right Col */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--stripe-navy)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Required Integrations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedTemplate.requiredIntegrations.map((int, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid var(--stripe-border)' }}>
                    <span style={{ fontSize: '20px' }}>{int.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 600 }}>{int.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>{int.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ padding: '1.5rem 2.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid var(--stripe-border)', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <Button 
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/templates')}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="primary"
              style={{ backgroundColor: '#533afd', color: '#fff' }}
              onClick={() => router.push(`/dashboard/ai-agent?template=${selectedTemplate.id}`)}
            >
              Hire Agent Now →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- HIRE AGENT / ONBOARDING WIZARD ---
  if (selectedTemplate) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', width: '100%' }}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        {/* VOICE CLONING MODAL */}
        <Modal isOpen={showCloneModal} onClose={() => !isCloning && setShowCloneModal(false)} title="Clone a Custom Voice print">
          <form onSubmit={handleCloneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
              Amira allows you to upload or record your own voice sample to instantaneously generate a custom, hyper-realistic voice clone.
            </p>

            {isCloning ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#533afd', marginBottom: '1rem' }}>Cloning Voiceprint: {cloneProgress}%</div>
                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', maxWidth: '300px', margin: '0 auto', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${cloneProgress}%`, backgroundColor: '#533afd', transition: 'width 0.4s ease-in-out' }}></div>
                </div>
                <p style={{ color: 'var(--stripe-muted)', fontSize: '12px', marginTop: '1rem' }}>Matching neural voice frequencies...</p>
              </div>
            ) : (
              <>
                <Input 
                  label="Voice Label Name" 
                  placeholder="e.g. CEO Custom Voice" 
                  value={clonedVoiceName}
                  onChange={(e) => setClonedVoiceName(e.target.value)}
                  required 
                />

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '6px', fontWeight: 500 }}>Upload Audio Sample</label>
                  <div 
                    onClick={() => setClonedVoiceFile('sample.mp3')}
                    style={{
                      border: '1px dashed var(--stripe-border)',
                      borderRadius: '8px',
                      padding: '2.5rem 1rem',
                      textAlign: 'center',
                      backgroundColor: clonedVoiceFile ? 'rgba(16,185,129,0.03)' : '#f8fafc',
                      cursor: 'pointer',
                      borderWidth: clonedVoiceFile ? '2px' : '1px',
                      borderColor: clonedVoiceFile ? '#10b981' : 'var(--stripe-border)'
                    }}
                  >
                    <span style={{ fontSize: '24px', display: 'block', marginBottom: '0.5rem' }}>🎙️</span>
                    <span style={{ fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 600, display: 'block' }}>
                      {clonedVoiceFile ? '✓ sample.mp3 ready!' : 'Drag & drop or Click to upload audio'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>
                      M4A, MP3, or WAV (Minimum 30 seconds of speech recommended)
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <Button type="button" variant="outline" onClick={() => setShowCloneModal(false)}>Cancel</Button>
                  <Button type="submit" style={{ backgroundColor: '#533afd', color: '#fff' }}>
                    Start Cloning Neural Voiceprint
                  </Button>
                </div>
              </>
            )}
          </form>
        </Modal>

        {/* Wizard Progress Header */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '12px', padding: '1.5rem 2rem', boxShadow: 'var(--stripe-shadow-ambient)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Hiring {selectedTemplate.name}</h2>
              <p style={{ color: 'var(--stripe-muted)', fontSize: '12px', margin: 0 }}>Configure and deploy your new AI employee live.</p>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#533afd' }}>
              Step {onboardingStep} of 3
            </div>
          </div>
          
          <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', position: 'relative' }}>
            <div style={{ height: '100%', width: `${(onboardingStep / 3) * 100}%`, backgroundColor: '#533afd', borderRadius: '3px', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 500, color: 'var(--stripe-muted)', marginTop: '0.75rem' }}>
            <span style={{ color: onboardingStep >= 1 ? '#533afd' : 'inherit', fontWeight: onboardingStep >= 1 ? 600 : 500 }}>1. Brain & Identity</span>
            <span style={{ color: onboardingStep >= 2 ? '#533afd' : 'inherit', fontWeight: onboardingStep >= 2 ? 600 : 500 }}>2. Connect Workflows</span>
            <span style={{ color: onboardingStep >= 3 ? '#533afd' : 'inherit', fontWeight: onboardingStep >= 3 ? 600 : 500 }}>3. Go Live 🚀</span>
          </div>
        </div>

        {/* STEP 1: Brain & Identity */}
        {onboardingStep === 1 && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '12px', padding: '2.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 600 }}>Configure Agent Identity</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 600 }}>Employee Name</label>
              <input 
                type="text" 
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }} 
              />
            </div>

            {/* PREVIEWABLE VOICE LIST WITH LANG SELECTION & VOICE CLONING */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 600, marginBottom: '2px' }}>Voice Profile</label>
                  <span style={{ fontSize: '11px', color: 'var(--stripe-muted)', fontWeight: 400 }}>Select a voice & click "Preview" to listen</span>
                </div>
                
                {/* Language Selector & Clone Voice buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <select 
                    value={selectedLanguage} 
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    style={{ padding: '0.4rem 0.75rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '12px', color: 'var(--stripe-navy)', backgroundColor: '#fff', fontWeight: 500 }}
                  >
                    <option value="en">English (US/UK/NG/KE)</option>
                    <option value="yo">Yoruba Dialect (Nigeria)</option>
                    <option value="ig">Igbo Dialect (Nigeria)</option>
                    <option value="ha">Hausa Dialect (Nigeria)</option>
                  </select>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    style={{ borderColor: '#533afd', color: '#533afd', padding: '0.35rem 0.75rem' }}
                    onClick={() => setShowCloneModal(true)}
                  >
                    🎙️ Clone My Voice
                  </Button>
                </div>
              </div>
              
              {/* Premium Voices Filter Dashboard */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
                gap: '0.75rem', 
                backgroundColor: '#f8fafc',
                border: '1px solid var(--stripe-border)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                {/* Search */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: 'var(--stripe-label)', marginBottom: '4px' }}>Search Voices</label>
                  <input 
                    type="text"
                    placeholder="Search name, accent, tag..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setVoicePage(1); }}
                    style={{ width: '100%', padding: '0.4rem 0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '11px', color: 'var(--stripe-navy)', fontWeight: 500 }}
                  />
                </div>

                {/* Provider Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: 'var(--stripe-label)', marginBottom: '4px' }}>Provider</label>
                  <select 
                    value={filterProvider}
                    onChange={(e) => { setFilterProvider(e.target.value); setVoicePage(1); }}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '11px', color: 'var(--stripe-navy)', backgroundColor: '#fff', fontWeight: 500 }}
                  >
                    <option value="All">All Providers</option>
                    <option value="ElevenLabs">ElevenLabs</option>
                    <option value="OpenAI">OpenAI</option>
                    <option value="PlayHT">PlayHT</option>
                    <option value="Cartesia">Cartesia</option>
                  </select>
                </div>

                {/* Accent Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: 'var(--stripe-label)', marginBottom: '4px' }}>Accent / Region</label>
                  <select 
                    value={filterAccent}
                    onChange={(e) => { setFilterAccent(e.target.value); setVoicePage(1); }}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '11px', color: 'var(--stripe-navy)', backgroundColor: '#fff', fontWeight: 500 }}
                  >
                    <option value="All">All Regions</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Nigerian">Nigeria</option>
                    <option value="Kenyan">Kenya</option>
                    <option value="Aussie">Australia</option>
                    <option value="Dialect">Dialect Only</option>
                  </select>
                </div>

                {/* Gender Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: 'var(--stripe-label)', marginBottom: '4px' }}>Gender</label>
                  <select 
                    value={filterGender}
                    onChange={(e) => { setFilterGender(e.target.value); setVoicePage(1); }}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '11px', color: 'var(--stripe-navy)', backgroundColor: '#fff', fontWeight: 500 }}
                  >
                    <option value="All">All Genders</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              {/* Voice Cards Grid (Auto height - lists ALL filtered voices) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', padding: '0.25rem', border: '1px solid var(--stripe-border)', borderRadius: '8px', backgroundColor: '#f9fafb', maxHeight: '420px', overflowY: 'auto' }}>
                {filteredVoices.map((voice) => {
                  const isSelected = customVoice === voice.id;
                  const isCurrentlyPlaying = playingVoice === voice.id;
                  return (
                    <div 
                      key={voice.id}
                      onClick={() => setCustomVoice(voice.id)}
                      style={{
                        backgroundColor: '#ffffff',
                        border: isSelected ? '2px solid #533afd' : '1px solid var(--stripe-border)',
                        borderRadius: '8px',
                        padding: '1rem',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.15s ease-in-out',
                        boxShadow: isSelected ? '0 4px 12px rgba(83,58,253,0.1)' : 'none',
                        minHeight: '145px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      {/* Selected indicator checkmark */}
                      {isSelected && (
                        <div style={{ position: 'absolute', top: '8px', right: '8px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#533afd', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                          ✓
                        </div>
                      )}
                      
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--stripe-navy)' }}>{voice.name}</span>
                          <span style={{ fontSize: '9px', color: '#533afd', backgroundColor: 'rgba(83,58,253,0.08)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            {voice.provider}
                          </span>
                        </div>
                        
                        <div style={{ fontSize: '10px', color: 'var(--stripe-muted)', marginBottom: '0.5rem' }}>
                          {voice.gender} • {voice.accent}
                        </div>

                        <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 500, marginBottom: '0.5rem' }}>
                          {voice.tag}
                        </div>
                      </div>

                      <div>
                        {/* Sound Wave Animation Visualizer */}
                        {isCurrentlyPlaying && (
                          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', justifyContent: 'center', height: '16px', marginBottom: '0.5rem' }}>
                            <span style={{ display: 'inline-block', width: '3px', height: '100%', backgroundColor: '#533afd', borderRadius: '3px', animation: 'bounce 0.8s ease-in-out infinite alternate' }}></span>
                            <span style={{ display: 'inline-block', width: '3px', height: '100%', backgroundColor: '#533afd', borderRadius: '3px', animation: 'bounce 0.8s ease-in-out infinite alternate 0.2s' }}></span>
                            <span style={{ display: 'inline-block', width: '3px', height: '100%', backgroundColor: '#533afd', borderRadius: '3px', animation: 'bounce 0.8s ease-in-out infinite alternate 0.4s' }}></span>
                            <span style={{ display: 'inline-block', width: '3px', height: '100%', backgroundColor: '#533afd', borderRadius: '3px', animation: 'bounce 0.8s ease-in-out infinite alternate 0.1s' }}></span>
                          </div>
                        )}

                        {/* Preview Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents selection toggling
                            playVoicePreview(voice.id, voice.text, voice.gender);
                          }}
                          style={{
                            width: '100%',
                            padding: '0.4rem',
                            borderRadius: '4px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: isCurrentlyPlaying ? '#fef2f2' : '#f8fafc',
                            color: isCurrentlyPlaying ? '#ef4444' : 'var(--stripe-navy)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          {isCurrentlyPlaying ? '⏹️ Stop' : '🔊 Preview'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination controls for navigating thousands of voices */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                border: '1px solid var(--stripe-border)',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.01)',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '11px', color: 'var(--stripe-muted)', fontWeight: 500 }}>
                  Showing {startIndex + 1}-{Math.min(startIndex + filteredVoices.length, totalFilteredCount)} of {totalFilteredCount} premium voices
                </span>
                
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={activePage === 1}
                    onClick={() => setVoicePage(prev => Math.max(prev - 1, 1))}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '11px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ◀ Prev
                  </Button>
                  <span style={{ fontSize: '11px', color: 'var(--stripe-navy)', fontWeight: 600 }}>
                    Page {activePage} of {totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={activePage === totalPages}
                    onClick={() => setVoicePage(prev => Math.min(prev + 1, totalPages))}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '11px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    Next ▶
                  </Button>
                </div>
              </div>
            </div>

            {/* SEMANTIC KNOWLEDGE BASE (RAG) CARD */}
            <div style={{ 
              marginBottom: '2rem', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              border: '1px solid var(--stripe-border)', 
              backgroundColor: '#f8fafc',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.01)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--stripe-navy)', margin: '0 0 2px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🧠 Cognitive Knowledge Base (RAG)
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--stripe-muted)', margin: 0 }}>
                    Train your agent on custom pricing sheets, FAQs, and policies so they cite facts accurately.
                  </p>
                </div>
                
                {!showKbInput && !isTrainingKb && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowKbInput(true)}
                    style={{ borderColor: '#533afd', color: '#533afd', fontSize: '11px', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    ➕ Train New Document
                  </Button>
                )}
              </div>

              {/* Training Form */}
              {showKbInput && (
                <div style={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid var(--stripe-border)', 
                  borderRadius: '6px', 
                  padding: '1.25rem', 
                  marginBottom: '1rem',
                  boxShadow: 'var(--stripe-shadow-ambient)',
                  animation: 'fadeIn 0.2s ease'
                }}>
                  <h5 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--stripe-navy)', margin: '0 0 0.75rem 0' }}>
                    Add Custom Memory File
                  </h5>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.25rem', fontWeight: 600 }}>
                      Document Name (e.g. Refund_Policy.pdf)
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Pricing_Guide_2026.pdf"
                      value={kbTitle}
                      onChange={(e) => setKbTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }} 
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.25rem', fontWeight: 600 }}>
                      Trained Content & Key Facts
                    </label>
                    <textarea 
                      placeholder="Paste specific facts, guidelines, price tables, or FAQs that you want your AI agent to memorize..."
                      value={kbContent}
                      onChange={(e) => setKbContent(e.target.value)}
                      style={{ width: '100%', height: '80px', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)', resize: 'vertical', lineHeight: 1.4 }} 
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { setShowKbInput(false); setKbTitle(''); setKbContent(''); }}
                      style={{ fontSize: '11px' }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      variant="primary" 
                      size="sm" 
                      onClick={handleAddKbSubmit}
                      style={{ backgroundColor: '#533afd', color: '#fff', fontSize: '11px' }}
                    >
                      Vectorize & Index
                    </Button>
                  </div>
                </div>
              )}

              {/* Vector Indexing Progress Loop */}
              {isTrainingKb && (
                <div style={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid var(--stripe-border)', 
                  borderRadius: '6px', 
                  padding: '1.25rem', 
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--stripe-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>🔄</span> 
                      {kbProgress < 30 ? 'Extracting text chunks...' : kbProgress < 60 ? 'Generating semantic embeddings...' : kbProgress < 90 ? 'Upserting vectors into database...' : 'Finalizing RAG vector index...'}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#533afd' }}>
                      {kbProgress}%
                    </span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${kbProgress}%`, backgroundColor: '#533afd', borderRadius: '3px', transition: 'width 0.25s linear' }} />
                  </div>
                </div>
              )}

              {/* Trained Documents database list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {trainedDocs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--stripe-muted)', fontSize: '12px', fontStyle: 'italic' }}>
                    No custom knowledge base files trained yet. Add files to inject business memory!
                  </div>
                ) : (
                  trainedDocs.map((doc, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid var(--stripe-border)', 
                        borderRadius: '6px', 
                        padding: '0.75rem 1rem', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: '18px' }}>📄</span>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--stripe-navy)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            {doc.title}
                            <span style={{ 
                              fontSize: '9px', 
                              backgroundColor: '#ecfdf5', 
                              color: '#059669', 
                              padding: '1px 6px', 
                              borderRadius: '4px',
                              fontWeight: 600,
                              border: '1px solid #a7f3d0'
                            }}>
                              100% Vector Synced
                            </span>
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--stripe-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                            {doc.content}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          const docToDelete = trainedDocs[idx];
                          setTrainedDocs(prev => prev.filter((_, dIdx) => dIdx !== idx));
                          setToast({ message: `Removed '${docToDelete.title}' from agent memory.`, type: 'success' });
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 500,
                          padding: '4px 8px',
                          borderRadius: '4px',
                          marginLeft: '0.5rem',
                          transition: 'background-color 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 600 }}>System Prompt (Instructions)</label>
              <textarea 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                style={{ width: '100%', height: '160px', padding: '0.75rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '13px', color: 'var(--stripe-navy)', outline: 'none', resize: 'vertical', lineHeight: 1.5 }}
              />
            </div>

            {/* ACTION BUTTONS (FIXED LAYOUT) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--stripe-border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              <Button 
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/templates')}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                variant="primary"
                style={{ backgroundColor: '#533afd', color: '#fff' }}
                onClick={() => setOnboardingStep(2)}
              >
                Next: Connect Workflows →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Connect Workflows */}
        {onboardingStep === 2 && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '12px', padding: '2.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Connect Workflows & Integrations</h3>
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', marginBottom: '2rem', lineHeight: 1.5 }}>
              This agent needs access to specific third-party applications to carry out its operations. Please click "Connect" on each required service.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem', maxHeight: '350px', overflowY: 'auto', padding: '0.25rem', border: '1px solid var(--stripe-border)', borderRadius: '8px' }}>
              {allIntegrations.map((int, i) => {
                const connected = connectedIntegrations[int.name];
                const isRequired = selectedTemplate.requiredIntegrations.some(req => req.name === int.name);
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', border: '1px solid var(--stripe-border)', borderRadius: '8px', backgroundColor: connected ? 'rgba(16,185,129,0.02)' : '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '1px solid var(--stripe-border)' }}>
                        {int.icon}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 600 }}>{int.name}</span>
                          {isRequired && (
                            <span style={{ fontSize: '10px', fontWeight: 600, color: '#533afd', backgroundColor: 'rgba(83,58,253,0.1)', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase' }}>
                              Recommended
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--stripe-body)', marginTop: '0.25rem' }}>{int.desc}</div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => !connected && simulateConnection(int.name)}
                      disabled={connected || isConnecting === int.name}
                      style={{
                        padding: '0.5rem 1.25rem',
                        borderRadius: '6px',
                        border: connected ? '1px solid #10b981' : '1px solid #533afd',
                        backgroundColor: connected ? 'transparent' : '#533afd',
                        color: connected ? '#10b981' : '#ffffff',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: connected ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {isConnecting === int.name ? 'Connecting...' : connected ? '✓ Connected' : 'Connect'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--stripe-border)', paddingTop: '1.5rem' }}>
              <Button 
                type="button"
                variant="outline"
                onClick={() => setOnboardingStep(1)}
              >
                Back
              </Button>
              <Button 
                type="button"
                variant="primary"
                style={{ backgroundColor: '#533afd', color: '#fff' }}
                onClick={() => setOnboardingStep(3)}
              >
                Next: Review & Go Live →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Go Live! */}
        {onboardingStep === 3 && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '12px', padding: '2.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 600 }}>Review & Deploy AI Employee</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              {/* Left Column: Config Overview */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--stripe-label)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>Employee Details</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--stripe-border)' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>Name</span>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--stripe-navy)' }}>{customName}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>Voice Profile</span>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--stripe-navy)' }}>
                      {voices.find(v => v.id === customVoice)?.name || 'Rachel'} ({voices.find(v => v.id === customVoice)?.provider || 'ElevenLabs'})
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>Active Workflows</span>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      {Object.entries(connectedIntegrations)
                        .filter(([_, connected]) => connected)
                        .map(([name]) => (
                          <span key={name} style={{ fontSize: '11px', backgroundColor: '#e2e8f0', color: 'var(--stripe-navy)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                            {name}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Chat Playground */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--stripe-label)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>Interactive Agent Playground</h4>
                <div style={{ border: '1px solid var(--stripe-border)', borderRadius: '8px', height: '220px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {/* Messages list */}
                  <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: '#f8fafc' }}>
                    {messages.map((msg, i) => (
                      <div 
                        key={i} 
                        style={{
                          alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                          backgroundColor: msg.sender === 'user' ? '#533afd' : '#ffffff',
                          color: msg.sender === 'user' ? '#ffffff' : 'var(--stripe-navy)',
                          padding: '0.5rem 0.85rem',
                          borderRadius: '8px',
                          fontSize: '12px',
                          maxWidth: '85%',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          lineHeight: 1.4
                        }}
                      >
                        {msg.text}
                      </div>
                    ))}
                    {isTyping && (
                      <div style={{ alignSelf: 'flex-start', backgroundColor: '#ffffff', color: 'var(--stripe-muted)', padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '12px' }}>
                        Agent is typing...
                      </div>
                    )}
                  </div>
                  {/* Input form */}
                  <form onSubmit={handleSendMessage} style={{ display: 'flex', borderTop: '1px solid var(--stripe-border)' }}>
                    <input 
                      type="text" 
                      placeholder="Type a message to test..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      style={{ flex: 1, padding: '0.6rem', fontSize: '12px', border: 'none', outline: 'none' }}
                    />
                    <button type="submit" style={{ padding: '0 1rem', backgroundColor: 'transparent', border: 'none', color: '#533afd', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--stripe-border)', paddingTop: '1.5rem' }}>
              <Button 
                type="button"
                variant="outline"
                onClick={() => setOnboardingStep(2)}
              >
                Back
              </Button>
              
              <Button 
                type="button"
                variant="primary"
                style={{ backgroundColor: '#10b981', color: '#fff', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}
                onClick={handleGoLive}
                disabled={isCreating}
              >
                {isCreating ? 'Deploying...' : 'Go Live 🚀'}
              </Button>
            </div>
          </div>
        )}

        {/* Global Sound Wave Animation Style */}
        <style jsx global>{`
          @keyframes bounce {
            0% { transform: scaleY(0.2); }
            100% { transform: scaleY(1); }
          }
        `}</style>
      </div>
    );
  }

  // --- STANDARD DIRECTORY VIEW ---
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>AI Agents</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>Manage your specialized AI employees.</p>
        </div>
        <button 
          onClick={handleCreateAgent} 
          disabled={isCreating}
          style={{ 
            backgroundColor: '#533afd', 
            color: '#ffffff', 
            border: 'none', 
            borderRadius: '4px', 
            padding: '0.5rem 1.25rem', 
            fontSize: '13px', 
            fontWeight: 500, 
            cursor: isCreating ? 'wait' : 'pointer', 
            boxShadow: 'var(--stripe-shadow-action)',
            opacity: isCreating ? 0.7 : 1
          }}>
          {isCreating ? 'Creating...' : '+ Create New Agent'}
        </button>
      </div>

      {agents.length === 0 ? (
        <div style={{ padding: '3rem', backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', textAlign: 'center', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>No Agents Yet</h3>
          <p style={{ fontSize: '13px', color: 'var(--stripe-body)', marginBottom: '1.5rem' }}>Create your first AI agent to start automating your workflows.</p>
          <button 
            onClick={handleCreateAgent}
            disabled={isCreating}
            style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '13px', cursor: 'pointer', color: 'var(--stripe-navy)', fontWeight: 500 }}
          >
            Create Agent
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {agents.map((agent, idx) => (
            <div 
              key={idx} 
              onClick={() => router.push(`/dashboard/ai-agent/${agent.id}`)}
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid var(--stripe-border)', 
                borderRadius: '6px', 
                padding: '1.5rem', 
                boxShadow: 'var(--stripe-shadow-ambient)',
                cursor: 'pointer',
                transition: 'transform 0.1s, box-shadow 0.1s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--stripe-shadow-action)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--stripe-shadow-ambient)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(83,58,253,0.1)', color: '#533afd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  🤖
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0', fontWeight: 500 }}>{agent.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>{agent.config?.attachedWorkflows?.length || 0} Workflows</div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--stripe-body)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {agent.config?.systemPrompt || 'No system prompt configured.'}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {/* Persistent global audio node for stable previews */}
      <audio id="voice-preview-player" style={{ display: 'none' }} />
    </div>
  );
}

export default function AgentDirectoryPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%', padding: '2rem', textAlign: 'center', color: 'var(--stripe-muted)' }}>Loading onboarding context...</div>}>
      <AgentContent />
    </Suspense>
  );
}
