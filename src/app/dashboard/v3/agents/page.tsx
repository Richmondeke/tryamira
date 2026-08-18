'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getComposioApps, 
  getComposioStatus, 
  initiateComposioConnection, 
  removeComposioIntegration 
} from '@/app/actions/integrations';
import { LiveVoiceTester } from '@/components/voice/LiveVoiceTester';

interface AgentConfig {
  name: string;
  role: string;
  phone: string;
  status: string;
  // Amira Voice Config
  voiceProvider: string;
  voiceModel: string;
  voiceId: string;
  stability: number;
  similarityBoost: number;
  styleExaggeration: number;
  speakerBoost: boolean;
  audioOutputFormat: string;
  // LLM Config
  llmModel: string;
  temperature: number;
  firstMessage: string;
  systemPrompt: string;
  endCallPhrases: string;
  // Phone & Call Flow
  maxDuration: number;
  silenceTimeout: number;
  interruptionSensitivity: string;
  backgroundSound: string;
  // Enabled Tool IDs for this agent
  enabledToolIds: string[];
  webhookUrl: string;
}

const DEFAULT_AGENTS: Record<string, AgentConfig> = {
  'Sales Closer': {
    name: 'Sales Closer',
    role: 'Outbound Sales & Qualification',
    phone: '🇺🇸 +1 (415) 555-0198',
    status: '🟢 Live',
    voiceProvider: 'Amira Voice Engine',
    voiceModel: 'amira_global_multilingual_v2',
    voiceId: 'Rachel (Warm & Executive)',
    stability: 0.50,
    similarityBoost: 0.75,
    styleExaggeration: 0.00,
    speakerBoost: true,
    audioOutputFormat: 'pcm_16000 (HD Audio)',
    llmModel: 'gpt-4o',
    temperature: 0.30,
    firstMessage: 'Hello! This is David from Amira Voice. Am I speaking with the sales executive?',
    systemPrompt: `You are Amira's Sales Closer AI voice agent. Your objective is to qualify inbound and outbound B2B sales leads. Verify contact email, evaluate deal size, check HubSpot contact status, and schedule a 15-minute demo on Google Calendar. Be articulate, polite, and concise.`,
    endCallPhrases: 'goodbye, talk to you soon, have a great day',
    maxDuration: 15,
    silenceTimeout: 400,
    interruptionSensitivity: 'High (400ms Interruption Handling)',
    backgroundSound: 'Office Ambiance (Soft)',
    enabledToolIds: ['hubspot', 'googlecalendar', 'gmail', 'salesforce', 'slack'],
    webhookUrl: 'https://api.tryamira.com/v1/webhooks/sales-closer'
  },
  'Support Genie': {
    name: 'Support Genie',
    role: 'Customer Support & Billing',
    phone: '🇮🇳 +91 80 1234 5678',
    status: '🟢 Live',
    voiceProvider: 'Amira Voice Engine',
    voiceModel: 'amira_turbo_fast_v2.5',
    voiceId: 'Adam (Authoritative Executive)',
    stability: 0.65,
    similarityBoost: 0.80,
    styleExaggeration: 0.05,
    speakerBoost: true,
    audioOutputFormat: 'pcm_16000 (HD Audio)',
    llmModel: 'gpt-4o',
    temperature: 0.20,
    firstMessage: 'Thank you for calling Customer Support. My name is Genie, how can I assist with your order today?',
    systemPrompt: `You are Support Genie, an autonomous customer support agent powered by Amira. Help users resolve order delays, issue refunds under $500, and log tickets directly in Zoho CRM.`,
    endCallPhrases: 'thank you for calling, goodbye, take care',
    maxDuration: 10,
    silenceTimeout: 500,
    interruptionSensitivity: 'Medium (500ms)',
    backgroundSound: 'None (Studio Clean)',
    enabledToolIds: ['zohocrm', 'gmail', 'stripe', 'zendesk'],
    webhookUrl: 'https://api.tryamira.com/v1/webhooks/support-genie'
  },
  'Appointment Pro': {
    name: 'Appointment Pro',
    role: 'Scheduling & Reminders',
    phone: '🇬🇧 +44 20 7946 0958',
    status: '🟢 Live',
    voiceProvider: 'Amira Voice Engine',
    voiceModel: 'amira_global_multilingual_v2',
    voiceId: 'Josh (Energetic Sales)',
    stability: 0.45,
    similarityBoost: 0.70,
    styleExaggeration: 0.00,
    speakerBoost: true,
    audioOutputFormat: 'pcm_16000 (HD Audio)',
    llmModel: 'claude-3-5-sonnet',
    temperature: 0.40,
    firstMessage: 'Hi there! I am calling from Appointment Pro to help you reserve your consultation slot.',
    systemPrompt: `You are Appointment Pro. Check Google Calendar slot availability, handle timezone conversions, and send calendar invite notifications via Gmail.`,
    endCallPhrases: 'see you soon, goodbye',
    maxDuration: 8,
    silenceTimeout: 350,
    interruptionSensitivity: 'High (350ms)',
    backgroundSound: 'None (Studio Clean)',
    enabledToolIds: ['googlecalendar', 'gmail', 'calendly'],
    webhookUrl: 'https://api.tryamira.com/v1/webhooks/appointment-pro'
  },
  'Onboarding Buddy': {
    name: 'Onboarding Buddy',
    role: 'User Onboarding & Setup',
    phone: '🇳🇬 +234 812 345 6789',
    status: '🟡 Thinking',
    voiceProvider: 'Amira Voice Engine',
    voiceModel: 'amira_turbo_fast_v2.5',
    voiceId: 'Elli (Friendly Support)',
    stability: 0.55,
    similarityBoost: 0.75,
    styleExaggeration: 0.00,
    speakerBoost: true,
    audioOutputFormat: 'pcm_16000 (HD Audio)',
    llmModel: 'gpt-4o',
    temperature: 0.30,
    firstMessage: 'Welcome to Amira OS! I am your Onboarding Buddy. Let us walk through setting up your first AI voice worker.',
    systemPrompt: `Walk new customers through key setup steps: connecting phone numbers, configuring tool integrations, and initiating test calls.`,
    endCallPhrases: 'happy building, goodbye',
    maxDuration: 20,
    silenceTimeout: 450,
    interruptionSensitivity: 'Medium (450ms)',
    backgroundSound: 'Office Ambiance (Soft)',
    enabledToolIds: ['notion', 'slack', 'gmail', 'hubspot'],
    webhookUrl: 'https://api.tryamira.com/v1/webhooks/onboarding-buddy'
  }
};

function getToolLogoUrl(slugOrName: string): string {
  const clean = slugOrName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const map: Record<string, string> = {
    hubspot: 'hubspot', salesforce: 'salesforce', zohocrm: 'zohocrm', slack: 'slack',
    googlesheets: 'googlesheets', notion: 'notion', calendly: 'calendly', gmail: 'gmail',
    github: 'github', googlecalendar: 'googlecalendar', linear: 'linear', asana: 'asana',
    jira: 'jira', zendesk: 'zendesk', stripe: 'stripe', intercomm: 'intercom', intercom: 'intercom',
    airtable: 'airtable', zoom: 'zoom', whatsapp: 'whatsapp', mailchimp: 'mailchimp',
    trello: 'trello', clickup: 'clickup', quickbooks: 'quickbooks'
  };
  const slug = map[clean] || clean;
  return `https://logos.composio.dev/api/${slug}`;
}

import { useDemoMode } from '@/contexts/DemoModeContext';
import { getAgents, updateAgent } from '@/app/actions/agent';

export default function V3AgentsPage() {
  const { isDemoMode } = useDemoMode();
  const [dbAgents, setDbAgents] = useState<Record<string, AgentConfig>>({});
  const [selectedAgentKey, setSelectedAgentKey] = useState<string>('Sales Closer');
  const [agents, setAgents] = useState<Record<string, AgentConfig>>(DEFAULT_AGENTS);

  useEffect(() => {
    if (!isDemoMode) {
      getAgents().then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped: Record<string, AgentConfig> = {};
          data.forEach((ag: any) => {
            mapped[ag.name || ag.title] = {
              name: ag.name || ag.title || 'Custom Agent',
              role: ag.role || ag.description || 'Voice Assistant',
              phone: ag.phone || '🇺🇸 +1 (415) 555-0198',
              status: ag.status || '🟢 Live',
              voiceProvider: 'Amira Voice Engine',
              voiceModel: 'amira_global_multilingual_v2',
              voiceId: ag.voice_id || 'Rachel (Warm & Executive)',
              stability: 0.5,
              similarityBoost: 0.75,
              styleExaggeration: 0.0,
              speakerBoost: true,
              audioOutputFormat: 'pcm_16000 (HD Audio)',
              llmModel: ag.model || 'gpt-4o',
              temperature: 0.3,
              firstMessage: ag.greeting || ag.firstMessage || 'Hello! How can I assist you today?',
              systemPrompt: ag.prompt || ag.systemPrompt || 'You are an autonomous AI voice worker.',
              endCallPhrases: 'goodbye, talk to you soon',
              maxDuration: 15,
              silenceTimeout: 400,
              interruptionSensitivity: 'High (400ms)',
              backgroundSound: 'None',
              enabledToolIds: ag.tools || ['hubspot', 'gmail'],
              webhookUrl: ag.webhook_url || 'https://api.tryamira.com/v1/webhooks'
            };
          });
          setDbAgents(mapped);
          const firstKey = Object.keys(mapped)[0];
          if (firstKey) setSelectedAgentKey(firstKey);
        } else {
          setDbAgents({});
        }
      }).catch(() => setDbAgents({}));
    }
  }, [isDemoMode]);

  const activeAgents = isDemoMode ? agents : dbAgents;
  
  // Step order: 1. Create Agent (Persona LLM) -> 2. Choose Voice -> 3. Connect Number -> 4. Connect Tools -> 5. API Payload
  const [activeTab, setActiveTab] = useState<'llm' | 'voice' | 'telephony' | 'tools' | 'json'>('llm');
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Live workspace integrations for Step 4
  const [allTools, setAllTools] = useState<any[]>([]);
  const [connectedToolIds, setConnectedToolIds] = useState<string[]>(['hubspot', 'salesforce', 'zohocrm', 'slack', 'googlesheets', 'notion', 'calendly', 'gmail']);
  const [toolSearch, setToolSearch] = useState('');
  const [connectingToolId, setConnectingToolId] = useState<string | null>(null);
  const [isVoicePreviewPlaying, setIsVoicePreviewPlaying] = useState(false);
  const activeAudioRef = React.useRef<HTMLAudioElement | null>(null);

  const currentConfig = activeAgents[selectedAgentKey] || Object.values(activeAgents)[0] || DEFAULT_AGENTS['Sales Closer'];

  const VOICE_CATALOG = [
    // 🌍 African Regional Voices
    { id: 'eleven_tunde', name: 'Tunde — Nigerian Executive & Sales Male', category: '🌍 African Regional Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/tunde.mp3' },
    { id: 'eleven_chidimma', name: 'Chidimma — West African Corporate Female', category: '🌍 African Regional Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/chidimma.mp3' },
    { id: 'eleven_kofi', name: 'Kofi — Ghanaian Enterprise Consultant Male', category: '🌍 African Regional Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/kofi.mp3' },
    { id: 'eleven_zuri', name: 'Zuri — East African (Swahili & English) Female', category: '🌍 African Regional Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/zuri.mp3' },
    { id: 'eleven_sipho', name: 'Sipho — South African Commercial Male', category: '🌍 African Regional Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/sipho.mp3' },
    { id: 'eleven_lesedi', name: 'Lesedi — South African Professional Female', category: '🌍 African Regional Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/lesedi.mp3' },
    { id: 'eleven_eze', name: 'Eze — West African Conversational Male', category: '🌍 African Regional Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/eze.mp3' },
    { id: 'eleven_amina', name: 'Amina — West African Friendly Support Female', category: '🌍 African Regional Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/amina.mp3' },
    { id: 'eleven_jabari', name: 'Jabari — African Outbound Prospecting Male', category: '🌍 African Regional Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/jabari.mp3' },
    { id: 'eleven_nia', name: 'Nia — African Brand Storyteller Female', category: '🌍 African Regional Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/nia.mp3' },

    // 🇺🇸 North American Voices
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel — Warm & Executive Female', category: '🇺🇸 North American Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/rachel.mp3' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam — Authoritative Executive Male', category: '🇺🇸 North American Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/adam.mp3' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh — Energetic Outbound Sales Male', category: '🇺🇸 North American Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/josh.mp3' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli — Friendly Customer Support Female', category: '🇺🇸 North American Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/elli.mp3' },
    { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam — Energetic American Male', category: '🇺🇸 North American Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/liam.mp3' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah — Soft Professional Female', category: '🇺🇸 North American Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/sarah.mp3' },

    // 🇬🇧 European & International Voices
    { id: 'N2lD3BihCvhUxWvW037k', name: 'Callum — Enterprise Deal Closer Male', category: '🇬🇧 European & International Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/callum.mp3' },
    { id: 'XB0fDUnXU5powctDhCvo', name: 'Charlotte — International Executive Female', category: '🇬🇧 European & International Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/charlotte.mp3' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George — Sophisticated British Male', category: '🇬🇧 European & International Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/george.mp3' },
    { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie — Casual Australian Male', category: '🇬🇧 European & International Voices', provider: 'ElevenLabs', sampleUrl: '/audio/voices/charlie.mp3' },

    // 🌐 OpenAI Realtime, Cartesia & PlayHT Engines
    { id: 'openai_alloy', name: 'Alloy — Neutral Conversational (OpenAI Realtime)', category: '🌐 OpenAI Realtime & Cartesia Engines', provider: 'OpenAI', sampleUrl: '/audio/voices/river.mp3' },
    { id: 'openai_nova', name: 'Nova — Warm Expressive Female (OpenAI Realtime)', category: '🌐 OpenAI Realtime & Cartesia Engines', provider: 'OpenAI', sampleUrl: '/audio/voices/bella.mp3' },
    { id: 'cartesia_sonic', name: 'Sonic — Ultra Low Latency 120ms (Cartesia Engine)', category: '🌐 OpenAI Realtime & Cartesia Engines', provider: 'Cartesia', sampleUrl: '/audio/voices/eric.mp3' },
    { id: 'playht_jennifer', name: 'Jennifer — Corporate Receptionist (PlayHT Engine)', category: '🌐 OpenAI Realtime & Cartesia Engines', provider: 'PlayHT', sampleUrl: '/audio/voices/jessica.mp3' }
  ];

  const handlePlayVoicePreview = () => {
    if (isVoicePreviewPlaying) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      setIsVoicePreviewPlaying(false);
      return;
    }

    const currentVoiceId = (currentConfig.voiceId || '').toLowerCase();
    const matchedVoice = VOICE_CATALOG.find(v => 
      v.id.toLowerCase() === currentVoiceId || 
      currentVoiceId.includes(v.id.toLowerCase()) ||
      v.id.toLowerCase().includes(currentVoiceId) ||
      v.name.toLowerCase().includes(currentVoiceId) ||
      currentVoiceId.includes(v.name.split(' ')[0].toLowerCase())
    ) || VOICE_CATALOG[0];

    if (!matchedVoice?.sampleUrl) return;

    setIsVoicePreviewPlaying(true);

    const playAudioWithFallback = (urls: string[]) => {
      if (urls.length === 0) {
        setIsVoicePreviewPlaying(false);
        return;
      }
      const currentUrl = urls[0];
      const audio = new Audio(currentUrl);
      activeAudioRef.current = audio;

      audio.onended = () => setIsVoicePreviewPlaying(false);
      audio.onerror = () => {
        if (urls.length > 1) {
          playAudioWithFallback(urls.slice(1));
        } else {
          setIsVoicePreviewPlaying(false);
        }
      };

      audio.play().catch(() => {
        if (urls.length > 1) {
          playAudioWithFallback(urls.slice(1));
        } else {
          setIsVoicePreviewPlaying(false);
        }
      });
    };

    const liveApiUrl = `/api/voice-preview?voiceId=${encodeURIComponent(matchedVoice.id)}&text=${encodeURIComponent('Hello! I am your Amira voice agent, ready to handle inbound and outbound calls.')}`;
    const primaryUrl = matchedVoice.sampleUrl;
    const fallbackUrl = primaryUrl.endsWith('.mp3') ? primaryUrl.replace('.mp3', '.m4a') : primaryUrl.replace('.m4a', '.mp3');

    playAudioWithFallback([primaryUrl, fallbackUrl, liveApiUrl]);
  };

  // Load real workspace integrations
  useEffect(() => {
    async function loadIntegrations() {
      try {
        const [appsRes, statusRes] = await Promise.all([
          getComposioApps(),
          getComposioStatus()
        ]);
        if (appsRes?.data) setAllTools(appsRes.data);
        if ((statusRes as any)?.activeApps) setConnectedToolIds((statusRes as any).activeApps);
      } catch (err) {
        console.error('Failed to load Amira workspace integrations:', err);
      }
    }
    loadIntegrations();
  }, []);

  const updateField = (field: keyof AgentConfig, value: any) => {
    setAgents(prev => ({
      ...prev,
      [selectedAgentKey]: {
        ...(prev[selectedAgentKey] || DEFAULT_AGENTS['Sales Closer']),
        [field]: value
      }
    }));
    setDbAgents(prev => ({
      ...prev,
      [selectedAgentKey]: {
        ...(prev[selectedAgentKey] || DEFAULT_AGENTS['Sales Closer']),
        [field]: value
      }
    }));
  };

  const handleSaveAgentConfig = async () => {
    setSaveSuccess(true);
    try {
      await updateAgent(selectedAgentKey, currentConfig);
    } catch (err) {
      console.warn('Persist agent config fallback:', err);
    }
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleAgentTool = (toolId: string) => {
    const currentTools = currentConfig.enabledToolIds || [];
    const updated = currentTools.includes(toolId)
      ? currentTools.filter(id => id !== toolId)
      : [...currentTools, toolId];
    updateField('enabledToolIds', updated);
  };

  const handleConnectTool = async (toolId: string) => {
    setConnectingToolId(toolId);
    try {
      const redirectPath = typeof window !== 'undefined' ? window.location.pathname : '/dashboard/v3/agents';
      const res = await initiateComposioConnection(toolId, redirectPath);
      if (res?.redirectUrl) {
        window.location.href = res.redirectUrl;
      } else {
        // Fallback connection state
        setConnectedToolIds(prev => [...prev, toolId]);
        if (!currentConfig.enabledToolIds.includes(toolId)) {
          toggleAgentTool(toolId);
        }
      }
    } catch (err) {
      console.error('Error initiating tool connection:', err);
    } finally {
      setConnectingToolId(null);
    }
  };

  const handleDisconnectTool = async (toolId: string) => {
    setConnectingToolId(toolId);
    try {
      await removeComposioIntegration(toolId);
      setConnectedToolIds(prev => prev.filter(id => id !== toolId));
    } catch (err) {
      console.error('Error disconnecting tool:', err);
    } finally {
      setConnectingToolId(null);
    }
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredToolsList = allTools.filter(t => {
    const nameStr = String(t.name || t.id || '').toLowerCase();
    const descStr = String(t.desc || '').toLowerCase();
    return nameStr.includes(toolSearch.toLowerCase()) || descStr.includes(toolSearch.toLowerCase());
  });

  const jsonPayload = {
    name: currentConfig.name,
    model: {
      provider: currentConfig.llmModel.includes('gpt') ? 'openai' : 'anthropic',
      model: currentConfig.llmModel,
      temperature: currentConfig.temperature,
      messages: [
        { role: 'system', content: currentConfig.systemPrompt }
      ],
      firstMessage: currentConfig.firstMessage,
      endCallPhrases: currentConfig.endCallPhrases.split(',').map(s => s.trim())
    },
    voice: {
      provider: 'amira_voice',
      model: currentConfig.voiceModel,
      voiceId: currentConfig.voiceId.split(' ')[0],
      settings: {
        stability: currentConfig.stability,
        similarity_boost: currentConfig.similarityBoost,
        style: currentConfig.styleExaggeration,
        use_speaker_boost: currentConfig.speakerBoost,
        output_format: currentConfig.audioOutputFormat
      }
    },
    telephony: {
      provider: 'amira_telephony',
      phoneNumber: currentConfig.phone,
      maxDurationSeconds: currentConfig.maxDuration * 60,
      silenceTimeoutMs: currentConfig.silenceTimeout,
      interruptionSensitivity: currentConfig.interruptionSensitivity,
      backgroundSound: currentConfig.backgroundSound
    },
    tools: currentConfig.enabledToolIds.map(id => ({ id, name: id, type: 'amira_action' })),
    serverUrl: currentConfig.webhookUrl
  };

  return (
    <div className="v3-widget-animate delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>Voice Agents Studio</h1>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#1b5a9215', color: '#1b5a92' }}>Amira Voice Engine</span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Build agent persona, choose Amira Voice, assign phone number, and connect live tools.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {saveSuccess && (
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#10b981', animation: 'fadeIn 0.2s' }}>
              ✓ Agent Config Saved
            </span>
          )}

          <button
            onClick={() => setIsPreviewActive(true)}
            style={{
              padding: '0.6rem 1.25rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', color: '#1b5a92',
              fontSize: '13px', fontWeight: 600, border: '1px solid rgba(27,90,146,0.3)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            <span>🎙️</span> Test Agent Voice Flow
          </button>

          <button
            onClick={handleSaveAgentConfig}
            style={{
              padding: '0.6rem 1.25rem', borderRadius: '10px', backgroundColor: '#1b5a92', color: '#fff',
              fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer'
            }}
          >
            Save Agent Config
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Agent Roster Navigation */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Active Agents ({Object.keys(activeAgents).length})</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Amira Fleet</span>
          </div>

          {Object.values(activeAgents).map(ag => {
            const isSelected = selectedAgentKey === ag.name;
            return (
              <div
                key={ag.name}
                onClick={() => setSelectedAgentKey(ag.name)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#1b5a920f' : 'var(--bg-subtle)',
                  border: isSelected ? '1px solid #1b5a9250' : '1px solid var(--border-subtle)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{ag.name}</span>
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>{ag.status}</span>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{ag.role}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', fontSize: '10.5px', color: '#1b5a92', fontWeight: 600 }}>
                  <span>🎙️ {ag.voiceProvider} ({ag.voiceId.split(' ')[0]})</span>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => alert('Creating new Voice Agent instance...')}
            style={{
              marginTop: '0.5rem', padding: '0.6rem', borderRadius: '10px', border: '1px dashed #1b5a9260',
              backgroundColor: 'transparent', color: '#1b5a92', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            + Create New Agent
          </button>
        </div>

        {/* Right Configuration Form Studio */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
          
          {/* Agent Title & Phone Sub-bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>
                  {currentConfig.name} Setup Flow
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Assigned Phone Number: <strong>{currentConfig.phone}</strong>
                </span>
              </div>
            </div>

            {/* TAB STEPPER NAVIGATION BAR (EXPLICIT ORDER) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--bg-subtle)', padding: '5px', borderRadius: '12px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
              {[
                { id: 'llm', step: '1', label: 'Create Agent (Persona & LLM)' },
                { id: 'voice', step: '2', label: 'Choose Voice' },
                { id: 'telephony', step: '3', label: 'Connect Phone Number' },
                { id: 'tools', step: '4', label: 'Connect Tools' },
                { id: 'json', step: '5', label: 'API Payload' },
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      padding: '0.45rem 0.85rem', borderRadius: '8px', border: 'none',
                      backgroundColor: isActive ? '#1b5a92' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: '0.4rem'
                    }}
                  >
                    <span style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      backgroundColor: isActive ? '#ffffff' : 'var(--border-subtle)',
                      color: isActive ? '#1b5a92' : 'var(--text-secondary)',
                      fontSize: '10.5px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {tab.step}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 1: CREATE AGENT (PERSONA & LLM CONFIGURATION) */}
          {activeTab === 'llm' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.2s' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Agent Name & Role Identity
                  </label>
                  <input
                    type="text"
                    value={currentConfig.name}
                    onChange={e => updateField('name', e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    AI Model & Brain
                  </label>
                  <select
                    value={currentConfig.llmModel}
                    onChange={e => updateField('llmModel', e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                  >
                    <option value="gpt-4o">GPT-4o (Recommended - Smartest & Fastest)</option>
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Best Persona & Tone)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Multilingual & Long Knowledge)</option>
                    <option value="llama-3-70b">Groq Llama-3 70B (Ultra-Fast 120ms Response)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  First Message / Outbound Greeting
                </label>
                <input
                  type="text"
                  value={currentConfig.firstMessage}
                  onChange={e => updateField('firstMessage', e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  System Instructions & Persona Role
                </label>
                <textarea
                  value={currentConfig.systemPrompt}
                  onChange={e => updateField('systemPrompt', e.target.value)}
                  rows={5}
                  style={{
                    width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontFamily: "'Satoshi', sans-serif", fontSize: '13px', lineHeight: 1.5, outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Creativity Level ({currentConfig.temperature})
                  </label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={currentConfig.temperature}
                    onChange={e => updateField('temperature', parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#1b5a92', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    <span>0.0 (Strict & Exact)</span>
                    <span>1.0 (Creative & Flexible)</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    End Call Words (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={currentConfig.endCallPhrases}
                    onChange={e => updateField('endCallPhrases', e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: CHOOSE VOICE */}
          {activeTab === 'voice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.2s' }}>
              
              {/* Live WebRTC Voice Call Tester with Vapi SDK */}
              <LiveVoiceTester
                agentName={currentConfig.name}
                systemPrompt={currentConfig.systemPrompt}
                firstMessage={currentConfig.firstMessage}
                voiceProvider={currentConfig.voiceProvider}
                voiceId={currentConfig.voiceId}
                model={currentConfig.llmModel}
              />

              {/* Voice Sample Preview Player Banner */}
              <div style={{
                backgroundColor: '#1b5a920f', border: '1px solid #1b5a9240', borderRadius: '12px',
                padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#1b5a92', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    🔊
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Listen to Voice Sample ({currentConfig.voiceId.split(' ')[0]})
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Test how your agent sounds reading their initial greeting.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePlayVoicePreview}
                  style={{
                    padding: '0.65rem 1.35rem', borderRadius: '10px', backgroundColor: isVoicePreviewPlaying ? '#ef4444' : '#1b5a92',
                    color: '#ffffff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{isVoicePreviewPlaying ? '⏹ Stop Sample' : '▶️ Play Voice Sample'}</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Voice Engine
                  </label>
                  <select
                    value={currentConfig.voiceProvider}
                    onChange={e => updateField('voiceProvider', e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                  >
                    <option value="Amira Voice Engine">Amira Voice Engine (Natural Conversational Voice)</option>
                    <option value="Amira Engine">Amira Realtime Engine (Ultra-Low Latency)</option>
                    <option value="Amira Ultra-Fast Engine">Amira Express Engine</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Language & Accent Model
                  </label>
                  <select
                    value={currentConfig.voiceModel}
                    onChange={e => updateField('voiceModel', e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                  >
                    <option value="amira_global_multilingual_v2">Amira Global Multilingual (Recommended for all languages)</option>
                    <option value="amira_turbo_fast_v2.5">Amira Turbo Fast (Low Latency 340ms)</option>
                    <option value="amira_flash_v1">Amira Flash (Ultra-Fast Speech)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Select Voice Persona
                </label>
                <select
                  value={currentConfig.voiceId}
                  onChange={e => updateField('voiceId', e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                >
                  {Array.from(new Set(VOICE_CATALOG.map(v => v.category))).map(category => (
                    <optgroup key={category} label={category}>
                      {VOICE_CATALOG.filter(v => v.category === category).map(v => (
                        <option key={v.id} value={v.id}>
                          [{v.provider}] {v.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Sliders for Amira voice settings */}
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Voice Tone & Clarity Controls
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      <span>Stability (Voice Naturalness)</span>
                      <span>{currentConfig.stability.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={currentConfig.stability}
                      onChange={e => updateField('stability', parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: '#1b5a92', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      <span>More Expressive (0.0)</span>
                      <span>More Stable (1.0)</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      <span>Clarity / Accent Boost</span>
                      <span>{currentConfig.similarityBoost.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={currentConfig.similarityBoost}
                      onChange={e => updateField('similarityBoost', parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: '#1b5a92', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      <span>Standard Boost</span>
                      <span>High Clarity (1.0)</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                      Audio Quality
                    </label>
                    <select
                      value={currentConfig.audioOutputFormat}
                      onChange={e => updateField('audioOutputFormat', e.target.value)}
                      style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 500 }}
                    >
                      <option value="pcm_16000 (Low Latency Telephony)">HD Phone Audio (16kHz PCM)</option>
                      <option value="mp3_44100_128 (High Quality MP3)">Studio Quality MP3 (44.1kHz)</option>
                      <option value="ulaw_8000 (Standard Phone Line (8kHz u-Law))">Standard Phone Line (8kHz u-Law)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.2rem' }}>
                    <input
                      type="checkbox"
                      id="speakerBoost"
                      checked={currentConfig.speakerBoost}
                      onChange={e => updateField('speakerBoost', e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#1b5a92', cursor: 'pointer' }}
                    />
                    <label htmlFor="speakerBoost" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                      Enable Vocal Clarity Boost
                    </label>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* STEP 3: CONNECT NUMBER (PHONE NUMBER & CALL FLOW) */}
          {activeTab === 'telephony' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.2s' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Assigned Phone Number
                  </label>
                  <select
                    value={currentConfig.phone}
                    onChange={e => updateField('phone', e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                  >
                    <option value="🇺🇸 +1 (415) 555-0198">🇺🇸 +1 (415) 555-0198 (San Francisco, US)</option>
                    <option value="🇮🇳 +91 80 1234 5678">🇮🇳 +91 80 1234 5678 (Bangalore, India)</option>
                    <option value="🇬🇧 +44 20 7946 0958">🇬🇧 +44 20 7946 0958 (London, UK)</option>
                    <option value="🇳🇬 +234 812 345 6789">🇳🇬 +234 812 345 6789 (Lagos, Nigeria)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Maximum Call Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={currentConfig.maxDuration}
                    onChange={e => updateField('maxDuration', parseInt(e.target.value) || 15)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Pause Sensitivity (Customer Stop Speaking)
                  </label>
                  <select
                    value={currentConfig.silenceTimeout}
                    onChange={e => updateField('silenceTimeout', parseInt(e.target.value))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                  >
                    <option value={300}>Fast (300ms pause - Responsive)</option>
                    <option value={400}>Balanced (400ms pause - Standard)</option>
                    <option value={600}>Relaxed (600ms pause - Patient)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Background Atmosphere Sound
                  </label>
                  <select
                    value={currentConfig.backgroundSound}
                    onChange={e => updateField('backgroundSound', e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                  >
                    <option value="None (Studio Clean)">None (Clean Studio)</option>
                    <option value="Office Ambiance (Soft)">Soft Office Sound</option>
                    <option value="Call Center Soft">Soft Call Center Background</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: CONNECT TOOLS */}
          {activeTab === 'tools' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.2s' }}>
              
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Connected Apps & Automation
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                  Connect your software stack (HubSpot, Google Calendar, Gmail, Slack, Notion, etc.) and authorize automatic app actions for {currentConfig.name}.
                </p>
              </div>

              {/* Search bar inside Step 4 */}
              <div style={{ position: 'relative', width: '100%' }}>
                <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: 'var(--text-secondary)' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search available software integrations to connect..."
                  value={toolSearch}
                  onChange={e => setToolSearch(e.target.value)}
                  style={{
                    width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', borderRadius: '10px',
                    border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', outline: 'none'
                  }}
                />
              </div>

              {/* Live Tools Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {filteredToolsList.map(t => {
                  const toolId = (t.id || t.appName || t.name).toLowerCase();
                  const isWorkspaceConnected = connectedToolIds.includes(toolId) || connectedToolIds.includes(t.name?.toLowerCase());
                  const isAgentEnabled = (currentConfig.enabledToolIds || []).includes(toolId);
                  const isConnectingThis = connectingToolId === toolId;

                  return (
                    <div
                      key={t.id}
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: isAgentEnabled ? '1px solid #1b5a9260' : '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        padding: '1.1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '38px', height: '38px', borderRadius: '10px',
                            backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                          }}>
                            <img
                              src={getToolLogoUrl(t.id || t.name)}
                              alt={t.name}
                              style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                              onError={(e) => { (e.target as any).style.display = 'none'; }}
                            />
                          </div>
                          <div>
                            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {t.desc || 'Amira autonomous integration.'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Connect / Toggle Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                        {isWorkspaceConnected ? (
                          <>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                              <input
                                type="checkbox"
                                checked={isAgentEnabled}
                                onChange={() => toggleAgentTool(toolId)}
                                style={{ width: '16px', height: '16px', accentColor: '#1b5a92', cursor: 'pointer' }}
                              />
                              <span>Enable for Agent</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => handleDisconnectTool(toolId)}
                              disabled={isConnectingThis}
                              style={{
                                background: 'none', border: 'none', color: '#ef4444', fontSize: '11px',
                                fontWeight: 600, cursor: 'pointer', padding: 0
                              }}
                            >
                              Disconnect
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleConnectTool(toolId)}
                            disabled={isConnectingThis}
                            style={{
                              width: '100%', padding: '0.45rem 0.85rem', borderRadius: '8px', border: 'none',
                              backgroundColor: '#1b5a92', color: '#ffffff', fontSize: '12px', fontWeight: 600,
                              cursor: 'pointer', transition: 'all 0.15s'
                            }}
                          >
                            {isConnectingThis ? 'Connecting...' : `+ Connect ${t.name}`}
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 650, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Server End-of-Call Webhook URL (<code style={{ color: '#1b5a92' }}>serverUrl</code>)
                </label>
                <input
                  type="text"
                  value={currentConfig.webhookUrl}
                  onChange={e => updateField('webhookUrl', e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                />
              </div>

            </div>
          )}

          {/* STEP 5: LIVE API PAYLOAD PREVIEW */}
          {activeTab === 'json' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.2s', width: '100%', overflowX: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Live Voice & Connected Apps API Payload
                </h4>
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(jsonPayload, null, 2))}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: '#1b5a92', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                >
                  📋 Copy JSON
                </button>
              </div>

              <pre style={{
                backgroundColor: '#0a0c14', color: '#10b981', padding: '1.25rem', borderRadius: '12px',
                fontSize: '12.5px', fontFamily: 'monospace', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)', lineHeight: 1.55, margin: 0,
                maxWidth: '100%', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
              }}>
                {JSON.stringify(jsonPayload, null, 2)}
              </pre>
            </div>
          )}

        </div>
      </div>

      {/* Live Voice Flow Test Modal */}
      {isPreviewActive && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '2rem', maxWidth: '480px', width: '90%', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#1b5a9218', color: '#1b5a92', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '28px' }}>
              🎙️
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.3rem 0' }}>
                Testing {currentConfig.name} Voice Stream
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Streaming live audio via Amira Voice Engine. Speak into your microphone.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--text-primary)' }}>
              &quot;{currentConfig.firstMessage}&quot;
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => setIsPreviewActive(false)}
                style={{ padding: '0.65rem 1.5rem', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                End Test Stream
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
