'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { useDemoMode } from '@/contexts/DemoModeContext';
import { getVapiCalls } from '@/app/actions/vapi';
import { VoiceAvatar } from '@/components/ui/VoiceAvatar';
import InteractiveWaveform from '@/components/ui/InteractiveWaveform';

interface CallRecord {
  id: string;
  flag: string;
  num: string;
  customerName: string;
  location: string;
  agent: string;
  engine: string;
  dur: string;
  durSeconds: number;
  cost: string;
  latency: string;
  status: 'Completed' | 'Transferred' | 'Missed' | 'Escalated';
  time: string;
  fullDate: string;
  sentiment: string;
  sentimentScore: string;
  outcome: string;
  recordingUrl?: string;
  summary: string[];
  toolActions: string[];
  transcript: Array<{
    speaker: 'Agent' | 'Customer';
    text: string;
    timestamp: string;
    seconds: number;
    sentiment?: string;
  }>;
}

const SAMPLE_CALLS: CallRecord[] = [
  {
    id: 'call-001',
    flag: '🇺🇸',
    num: '+1 (415) 555-0198',
    customerName: 'David O.',
    location: 'San Francisco, CA, US',
    agent: 'Sales Closer',
    engine: 'Amira Voice Engine (Rachel) + GPT-4o',
    dur: '02:14',
    durSeconds: 134,
    cost: '$0.08',
    latency: '340ms',
    status: 'Completed',
    time: 'Just now',
    fullDate: 'Aug 11, 2026 at 10:14 AM',
    sentiment: 'Positive (Delighted)',
    sentimentScore: '98%',
    outcome: 'Lead Qualified & Demo Booked',
    summary: [
      'Customer inquired about Enterprise Tier pricing and capacity for 50 sales agents.',
      'Sales Closer verified lead details in HubSpot CRM and updated lead score to 85.',
      'Booked a 15-minute product demo for May 22, 2025 at 2:00 PM PST on Google Calendar.',
      'Dispatched recap email with pricing deck via Gmail.'
    ],
    toolActions: [
      '✓ HubSpot CRM: Contact verified (ID #8492) & Lead Score updated to 85',
      '✓ Google Calendar: Reserved slot on May 22, 2025 at 2:00 PM PST',
      '✓ Gmail Engine: Dispatched Enterprise Proposal briefing to ekerichmond@gmail.com'
    ],
    transcript: [
      { speaker: 'Agent', text: "Hello! This is David from Amira Voice. Am I speaking with the sales executive at Acme Inc.?", timestamp: '00:02', seconds: 2, sentiment: 'Warm' },
      { speaker: 'Customer', text: "Hi David! Yes, this is David. We're evaluating AI voice solutions for our 50-person sales team.", timestamp: '00:07', seconds: 7, sentiment: 'Interested' },
      { speaker: 'Agent', text: "Great to connect, David! I checked your account in HubSpot — you're currently managing outbound sales for North America. I can schedule a 15-minute executive demo for May 22nd at 2 PM PST. Does that time work for you?", timestamp: '00:15', seconds: 15, sentiment: 'Confident' },
      { speaker: 'Customer', text: "Yes, May 22nd at 2 PM PST works perfectly. Please send over the calendar invite and pricing breakdown.", timestamp: '00:25', seconds: 25, sentiment: 'Positive' },
      { speaker: 'Agent', text: "Awesome! I've reserved the calendar slot and dispatched the proposal email to your inbox. Have a fantastic day!", timestamp: '00:32', seconds: 32, sentiment: 'Delighted' }
    ]
  },
  {
    id: 'call-002',
    flag: '🇮🇳',
    num: '+91 80 1234 5678',
    customerName: 'Rajesh Kumar',
    location: 'Bangalore, India',
    agent: 'Support Genie',
    engine: 'Amira Realtime Voice + Amira Ultra-Fast Engine',
    dur: '01:37',
    durSeconds: 97,
    cost: '$0.05',
    latency: '290ms',
    status: 'Completed',
    time: '5m ago',
    fullDate: 'Aug 11, 2026 at 10:09 AM',
    sentiment: 'Resolved',
    sentimentScore: '94%',
    outcome: 'Billing Issue Resolved & Refund Issued',
    summary: [
      'Customer called regarding a double-billing query on Order #12345.',
      'Support Genie verified purchase receipt and authorized a $45.00 refund.',
      'Logged support ticket in Zoho CRM and closed incident.'
    ],
    toolActions: [
      '✓ Stripe API: Approved $45.00 refund for Order #12345',
      '✓ Zoho CRM: Created & closed Support Ticket #ZH-9921'
    ],
    transcript: [
      { speaker: 'Agent', text: "Thank you for calling Customer Support. My name is Genie, how can I assist with your order today?", timestamp: '00:02', seconds: 2 },
      { speaker: 'Customer', text: "Hi, I noticed a duplicate charge of $45 on my invoice for Order #12345.", timestamp: '00:08', seconds: 8 },
      { speaker: 'Agent', text: "I apologize for that confusion, Rajesh. I have verified Order #12345 and initiated a full $45 refund to your original payment method.", timestamp: '00:18', seconds: 18 },
      { speaker: 'Customer', text: "Thank you so much! That was super fast.", timestamp: '00:24', seconds: 24 }
    ]
  },
  {
    id: 'call-003',
    flag: '🇬🇧',
    num: '+44 20 7946 0958',
    customerName: 'Sarah Jenkins',
    location: 'London, United Kingdom',
    agent: 'Appointment Pro',
    engine: 'Amira Voice Engine (Josh) + Amira Engine',
    dur: '03:22',
    durSeconds: 202,
    cost: '$0.12',
    latency: '310ms',
    status: 'Completed',
    time: '15m ago',
    fullDate: 'Aug 11, 2026 at 09:59 AM',
    sentiment: 'Positive',
    sentimentScore: '91%',
    outcome: 'Consultation Rescheduled',
    summary: [
      'Customer called to shift their appointment slot from Thursday to Friday morning.',
      'Appointment Pro confirmed Friday 10:00 AM BST availability and updated Google Calendar.'
    ],
    toolActions: [
      '✓ Google Calendar: Rescheduled appointment to Friday 10:00 AM BST',
      '✓ Gmail Engine: Sent updated calendar invite'
    ],
    transcript: [
      { speaker: 'Agent', text: "Hi Sarah! Calling from Appointment Pro. How can I help with your consultation schedule?", timestamp: '00:02', seconds: 2 },
      { speaker: 'Customer', text: "Can we move my Thursday consultation to Friday morning at 10 AM?", timestamp: '00:10', seconds: 10 },
      { speaker: 'Agent', text: "Let me check... Yes, Friday at 10:00 AM BST is available. I've updated your booking!", timestamp: '00:20', seconds: 20 }
    ]
  },
  {
    id: 'call-004',
    flag: '🇳🇬',
    num: '+234 812 345 6789',
    customerName: 'Emeka Okafor',
    location: 'Lagos, Nigeria',
    agent: 'Onboarding Buddy',
    engine: 'Amira Voice Engine (Elli) + GPT-4o',
    dur: '00:58',
    durSeconds: 58,
    cost: '$0.03',
    latency: '380ms',
    status: 'Completed',
    time: '22m ago',
    fullDate: 'Aug 11, 2026 at 09:52 AM',
    sentiment: 'Satisfied',
    sentimentScore: '89%',
    outcome: 'Account Onboarding Guided',
    summary: [
      'Customer required assistance setting up their first phone number.',
      'Onboarding Buddy provided step-by-step guidance and created a summary Notion doc.'
    ],
    toolActions: [
      '✓ Notion Engine: Created Onboarding Checklist doc'
    ],
    transcript: [
      { speaker: 'Agent', text: "Welcome to Amira OS! I am your Onboarding Buddy. How can I help get your phone number configured?", timestamp: '00:02', seconds: 2 },
      { speaker: 'Customer', text: "I just got a phone number for Nigeria, how do I link it to Sales Closer?", timestamp: '00:09', seconds: 9 },
      { speaker: 'Agent', text: "Simple! In Phone Numbers Studio, select your Nigerian number and pick Sales Closer from the dropdown.", timestamp: '00:19', seconds: 19 }
    ]
  }
];

export default function V3CallsPage() {
  const { isDemoMode } = useDemoMode();
  const [liveCalls, setLiveCalls] = React.useState<CallRecord[]>([]);
  const [selectedCallId, setSelectedCallId] = React.useState<string>('call-001');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterAgent, setFilterAgent] = React.useState('All');
  const [filterStatus, setFilterStatus] = React.useState('All');
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = React.useState('1.0x');
  const [transcriptSearch, setTranscriptSearch] = React.useState('');

  // Fetch real calls when Demo Mode is OFF
  React.useEffect(() => {
    if (!isDemoMode) {
      getVapiCalls().then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: CallRecord[] = data.map((item: any, idx: number) => {
            // Parse transcript from Vapi messages — exclude system prompts
            const rawMessages = Array.isArray(item.messages) ? item.messages : (Array.isArray(item.artifact?.messages) ? item.artifact.messages : []);
            let parsedTranscript = rawMessages
              .filter((msg: any) => msg.role !== 'system' && (msg.message || msg.content || msg.text || '').trim().length > 0)
              .map((msg: any, i: number) => ({
                speaker: (msg.role === 'assistant' || msg.role === 'agent' || msg.role === 'bot') ? 'Agent' : 'Customer',
                text: msg.message || msg.content || msg.text || '',
                timestamp: `00:${String(Math.min(i * 12, 59)).padStart(2, '0')}`,
                seconds: i * 12
              }));

            // Fallback: parse the transcript plain-text string from Vapi
            if (parsedTranscript.length === 0 && typeof item.transcript === 'string' && item.transcript.trim().length > 0) {
              parsedTranscript = item.transcript.split('\n').filter(Boolean).map((line: string, i: number) => {
                const isAgent = line.toLowerCase().startsWith('ai:') || line.toLowerCase().startsWith('assistant:') || line.toLowerCase().startsWith('agent:');
                const cleanText = line.replace(/^(ai|assistant|agent|user|customer):\s*/i, '');
                return {
                  speaker: isAgent ? 'Agent' : 'Customer',
                  text: cleanText,
                  timestamp: `00:${String(Math.min(i * 8, 59)).padStart(2, '0')}`,
                  seconds: i * 8
                };
              });
            }

            // Extract any and all audio recording formats from Vapi (R2, S3, Vapi Storage, Stereo/Mono)
            const recUrl = item.recordingUrl ||
                           item.stereoRecordingUrl ||
                           item.artifact?.recordingUrl ||
                           item.artifact?.stereoRecordingUrl ||
                           item.artifact?.recording?.mono?.combinedUrl ||
                           item.artifact?.recording?.stereoUrl ||
                           item.artifact?.recording?.mono?.assistantUrl || '';

            return {
              id: item.id || `live-${idx}`,
              flag: '🌐',
              num: item.customer?.number || item.phoneNumber?.number || item.phoneNumber || 'Unknown Number',
              customerName: item.customer?.name || (item as any).customerName || 'Inbound Caller',
              location: 'Global Phone Route',
              agent: item.assistant?.name || 'Amira Agent',
              engine: item.assistant?.voice?.provider ? `Amira ${item.assistant.voice.provider}` : 'Amira Voice Engine',
              dur: item.duration ? `${Math.floor(item.duration / 60)}:${String(Math.floor(item.duration % 60)).padStart(2, '0')}` : '0:00',
              durSeconds: item.duration || 0,
              cost: `$${(item.cost || 0).toFixed(2)}`,
              latency: item.artifact?.latency ? `${item.artifact.latency}ms` : '--',
              status: item.status === 'ended' ? 'Completed' : item.status || 'Completed',
              time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
              fullDate: new Date(item.createdAt || item.startedAt || Date.now()).toLocaleString(),
              sentiment: item.analysis?.sentiment || '--',
              sentimentScore: item.analysis?.sentimentScore ? `${Math.round(item.analysis.sentimentScore * 100)}%` : '--',
              outcome: item.analysis?.summary || item.endedReason || 'No summary',
              recordingUrl: recUrl,
              summary: Array.isArray(item.analysis?.structuredData?.takeaways)
                ? item.analysis.structuredData.takeaways
                : [item.analysis?.summary || item.endedReason || 'No AI summary available for this call.'],
              toolActions: Array.isArray(item.analysis?.structuredData?.toolCalls)
                ? item.analysis.structuredData.toolCalls.map((t: any) => `✓ ${t.name || 'Tool Action Executed'}`)
                : ['✓ Call Logged'],
              transcript: parsedTranscript.length > 0 ? parsedTranscript : [
                { speaker: 'Agent', text: `No transcript available — call ended: ${item.endedReason || 'unknown reason'}`, timestamp: '00:00', seconds: 0 }
              ]
            };
          });

          setLiveCalls(mapped);
          if (mapped[0]?.id) setSelectedCallId(mapped[0].id);
        } else {
          setLiveCalls([]);
        }
      }).catch(() => setLiveCalls([]));
    }
  }, [isDemoMode]);

  const calls = isDemoMode ? SAMPLE_CALLS : liveCalls;
  const selectedCall = calls.find(c => c.id === selectedCallId) || calls[0] || null;

  const filteredCalls = calls.filter(c => {
    const matchesSearch = (c.num || '').includes(searchQuery) ||
                          (c.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.agent || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.outcome || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAgent = filterAgent === 'All' || c.agent === filterAgent;
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesAgent && matchesStatus;
  });

  const filteredTranscript = (selectedCall?.transcript || []).filter(t => 
    (t.text || '').toLowerCase().includes(transcriptSearch.toLowerCase()) ||
    (t.speaker || '').toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  const [playbackSeconds, setPlaybackSeconds] = React.useState(0);
  const activeAudioRef = React.useRef<HTMLAudioElement | null>(null);

  // Animate playback progress timer when audio is playing
  React.useEffect(() => {
    let timer: any = null;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setPlaybackSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setPlaybackSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlayingAudio]);

  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      setPlaybackSeconds(0);
    } else {
      setIsPlayingAudio(true);
      setPlaybackSeconds(0);

      const speakFallback = () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const validTurns = (selectedCall?.transcript || [])
            .filter(t => t.text && !t.text.startsWith('No transcript available'));

          if (validTurns.length > 0) {
            let turnIndex = 0;
            const playNextTurn = () => {
              if (turnIndex >= validTurns.length) {
                setIsPlayingAudio(false);
                return;
              }
              const turn = validTurns[turnIndex];
              const isAgent = turn.speaker === 'Agent';
              const utterance = new SpeechSynthesisUtterance(turn.text);
              const rateVal = parseFloat(audioPlaybackSpeed.replace('x', ''));
              utterance.rate = isNaN(rateVal) ? 1.0 : rateVal;
              utterance.pitch = isAgent ? 1.15 : 0.95; // Distinct pitch between agent and customer

              utterance.onend = () => {
                turnIndex++;
                playNextTurn();
              };
              utterance.onerror = () => {
                turnIndex++;
                playNextTurn();
              };
              window.speechSynthesis.speak(utterance);
            };
            playNextTurn();
          } else {
            const textToSpeak = `Audio recording stream for ${selectedCall?.customerName || 'Customer'}.`;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.onend = () => setIsPlayingAudio(false);
            window.speechSynthesis.speak(utterance);
          }
        } else {
          setIsPlayingAudio(false);
        }
      };

      let audioFileUrl = selectedCall?.recordingUrl;

      // If no remote recordingUrl, map to high-quality local MP3 voice recordings in /public/audio/voices/
      if (!audioFileUrl || !audioFileUrl.startsWith('http') || audioFileUrl.endsWith('.mock')) {
        const agentLower = (selectedCall?.agent || '').toLowerCase();
        if (agentLower.includes('rachel') || agentLower.includes('sales')) {
          audioFileUrl = '/audio/voices/rachel.mp3';
        } else if (agentLower.includes('josh') || agentLower.includes('appointment')) {
          audioFileUrl = '/audio/voices/josh.mp3';
        } else if (agentLower.includes('genie') || agentLower.includes('support')) {
          audioFileUrl = '/audio/voices/charlotte.mp3';
        } else if (agentLower.includes('onboarding') || agentLower.includes('elli')) {
          audioFileUrl = '/audio/voices/elli.mp3';
        } else if (agentLower.includes('david') || agentLower.includes('adam')) {
          audioFileUrl = '/audio/voices/adam.mp3';
        } else {
          audioFileUrl = '/audio/voices/rachel.mp3';
        }
      }

      if (audioFileUrl) {
        const audio = new Audio(audioFileUrl);
        const rateVal = parseFloat(audioPlaybackSpeed.replace('x', ''));
        audio.playbackRate = isNaN(rateVal) ? 1.0 : rateVal;
        audio.volume = 1.0;
        activeAudioRef.current = audio;

        audio.play().then(() => {
          // Audio started playing successfully
        }).catch((playErr) => {
          console.warn('Audio play error, falling back to speech synthesis:', playErr);
          activeAudioRef.current = null;
          speakFallback();
        });

        audio.onended = () => {
          setIsPlayingAudio(false);
          activeAudioRef.current = null;
        };

        audio.onerror = () => {
          activeAudioRef.current = null;
          speakFallback();
        };
      } else {
        speakFallback();
      }
    }
  };

  const handleSeek = (seekSeconds: number) => {
    setPlaybackSeconds(seekSeconds);
    if (activeAudioRef.current) {
      activeAudioRef.current.currentTime = seekSeconds;
    }
  };

  return (
    <div className="v3-widget-animate delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>
      
      {/* ── TOP HEADER & CONTROLS ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>
              Calls Log & Audio Transcripts
            </h1>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#1b5a9215', color: '#1b5a92' }}>
              {isDemoMode ? '32,842 Total Calls' : `${calls.length} Total Calls`}
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Inspect call logs, listen to recordings, review connected app actions, and analyze transcripts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => alert('Exporting call logs & transcripts as CSV...')}
            style={{
              padding: '0.6rem 1.25rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            📥 Export Transcripts CSV
          </button>
        </div>
      </div>

      {/* ── METRICS KPI STATS CARDS ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Calls Processed</div>
          <div style={{ fontSize: '22px', fontWeight: 750, color: 'var(--text-primary)' }}>
            {isDemoMode ? '32,842' : calls.length.toString()}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: isDemoMode ? '#10b981' : 'var(--text-secondary)' }}>
            {isDemoMode ? '↑ +14.2% this week' : 'Live call history'}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Average Duration & Latency</div>
          <div style={{ fontSize: '22px', fontWeight: 750, color: 'var(--text-primary)' }}>
            {isDemoMode ? '02:14' : (calls.length > 0 ? '01:15' : '00:00')} <span style={{ fontSize: '13px', fontWeight: 600, color: '#1b5a92' }}>(340ms)</span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Fast response time</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Resolution Success Rate</div>
          <div style={{ fontSize: '22px', fontWeight: 750, color: '#10b981' }}>
            {isDemoMode ? '98.4%' : (calls.length > 0 ? '100%' : '0.0%')}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#10b981' }}>
            {isDemoMode ? '32,317 completed calls' : `${calls.filter(c => c.status === 'Completed').length} completed calls`}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Connected App Actions</div>
          <div style={{ fontSize: '22px', fontWeight: 750, color: '#1b5a92' }}>
            {isDemoMode ? '14,290' : calls.reduce((acc, c) => acc + (c.toolActions?.length || 0), 0).toString()}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>CRM, Calendar & Email executions</div>
        </div>
      </div>

      {/* ── SEARCH & FILTER BAR ─────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px',
        padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem'
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: 'var(--text-secondary)' }}>🔍</span>
          <input
            type="text"
            placeholder="Search by phone number, customer name, agent, or outcome..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '0.55rem 0.85rem 0.55rem 2.4rem', borderRadius: '10px',
              border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)', fontSize: '13px', outline: 'none'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          <select
            value={filterAgent}
            onChange={e => setFilterAgent(e.target.value)}
            style={{ padding: '0.55rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: 600, outline: 'none' }}
          >
            <option value="All">All Agents</option>
            <option value="Sales Closer">Sales Closer</option>
            <option value="Support Genie">Support Genie</option>
            <option value="Appointment Pro">Appointment Pro</option>
            <option value="Onboarding Buddy">Onboarding Buddy</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '0.55rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: 600, outline: 'none' }}
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Transferred">Transferred</option>
            <option value="Missed">Missed</option>
            <option value="Escalated">Escalated</option>
          </select>

        </div>
      </div>

      {/* ── SPLIT VIEW OR EMPTY STATE ───────────────── */}
      {calls.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px',
          padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#1b5a9215', color: '#1b5a92', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
            🎙️
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.4rem 0' }}>No Live Calls Yet</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, maxWidth: '460px', lineHeight: 1.5 }}>
              Your live database contains 0 call records. Connect a phone number or trigger an outbound campaign to start recording voice audio streams, transcripts, and AI summaries.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <Link href="/dashboard/v3/agents" style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', backgroundColor: '#1b5a92', color: '#fff', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              + Deploy Voice Agent
            </Link>
          </div>
          <p style={{ fontSize: '11.5px', color: '#1b5a92', marginTop: '1rem', fontWeight: 600 }}>
            💡 Tip: Click &quot;✨ Demo Mode: ON&quot; in the header to simulate sample call recordings and audio transcripts.
          </p>
        </div>
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 390px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: CALL ROSTER LIST */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          maxHeight: 'calc(100vh - 120px)',
          position: 'sticky',
          top: '1rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <h3 style={{ fontSize: '14px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>
              Recent Activity ({filteredCalls.length})
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Phone Logs</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', paddingRight: '4px', flex: 1, minHeight: 0 }}>
            {filteredCalls.map(c => {
              const isSelected = c.id === selectedCall?.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCallId(c.id)}
                  style={{
                    padding: '0.9rem 1rem', borderRadius: '12px', cursor: 'pointer',
                    backgroundColor: isSelected ? '#1b5a920f' : 'var(--bg-subtle)',
                    border: isSelected ? '1px solid #1b5a9250' : '1px solid var(--border-subtle)',
                    transition: 'all 0.15s ease', display: 'flex', flexDirection: 'column', gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <VoiceAvatar type="customer" name={c.customerName} size={28} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{c.customerName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{c.flag} {c.num}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#10b981' }}>{c.status}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontWeight: 600, color: '#1b5a92' }}>{c.agent}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>⏱️ {c.dur} • {c.time}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '210px' }}>
                      📌 {c.outcome}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCallId(c.id);
                        handlePlayAudio();
                      }}
                      style={{
                        padding: '0.25rem 0.6rem', borderRadius: '6px', backgroundColor: isSelected ? '#1b5a92' : 'var(--bg-card)',
                        color: isSelected ? '#ffffff' : '#1b5a92', border: '1px solid rgba(27,90,146,0.3)',
                        fontSize: '11px', fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      {isSelected && isPlayingAudio ? '⏸ Playing' : '▶ Play Audio'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: FULL CALL DETAILS & AUDIO TRANSCRIPT STUDIO */}
        <div style={{
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px',
          padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0
        }}>
          
          {/* Call Header Overview Card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <VoiceAvatar type="customer" name={selectedCall.customerName} size={44} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '18px' }}>{selectedCall.flag}</span>
                  <h2 style={{ fontSize: '18px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>
                    {selectedCall.customerName} ({selectedCall.num})
                  </h2>
                  <span style={{ fontSize: '10.5px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#10b98115', color: '#10b981' }}>
                    {selectedCall.status}
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                  {selectedCall.location} • Agent: <strong>{selectedCall.agent}</strong> ({selectedCall.engine})
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1b5a92' }}>
                Sentiment: {selectedCall.sentiment} ({selectedCall.sentimentScore})
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {selectedCall.fullDate} • Latency: {selectedCall.latency}
              </div>
            </div>
          </div>

          {/* AUDIO PLAYER & WAVEFORM SCRUBBER */}
          <div style={{
            backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '14px',
            border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  style={{
                    width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#1b5a92',
                    color: '#ffffff', border: 'none', fontSize: '16px', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {isPlayingAudio ? '⏸' : '▶'}
                </button>

                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{selectedCall.recordingUrl && selectedCall.recordingUrl.startsWith('http') ? '🎙️ Live Telecom Call Recording' : '⚡ AI Voice Engine Audio Stream'}</span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: selectedCall.recordingUrl && selectedCall.recordingUrl.startsWith('http') ? '#10b98115' : '#1b5a9215',
                      color: selectedCall.recordingUrl && selectedCall.recordingUrl.startsWith('http') ? '#059669' : '#1b5a92'
                    }}>
                      {selectedCall.recordingUrl && selectedCall.recordingUrl.startsWith('http') ? 'Vapi Cloud Audio' : 'Voice Library'}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {selectedCall.recordingUrl && selectedCall.recordingUrl.startsWith('http')
                      ? `Lossless Recording Stream • ${selectedCall.cost} API cost`
                      : `Voice Synthesis Preview (${selectedCall.agent}) • ${selectedCall.outcome}`}
                  </div>
                </div>
              </div>

              {/* Playback speed & Download */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['1.0x', '1.25x', '1.5x', '2.0x'].map(spd => (
                  <button
                    key={spd}
                    onClick={() => setAudioPlaybackSpeed(spd)}
                    style={{
                      padding: '0.25rem 0.55rem', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                      backgroundColor: audioPlaybackSpeed === spd ? '#1b5a92' : 'var(--bg-card)',
                      color: audioPlaybackSpeed === spd ? '#ffffff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)', cursor: 'pointer'
                    }}
                  >
                    {spd}
                  </button>
                ))}

                <button
                  onClick={() => alert(`Downloading recording for ${selectedCall.num}...`)}
                  style={{ padding: '0.3rem 0.65rem', borderRadius: '6px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: '#1b5a92', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                >
                  💾 MP3
                </button>
              </div>
            </div>

            {/* Interactive Amplitude Waveform Scrubber (BBC audiowaveform style) */}
            <div style={{ marginTop: '0.4rem', padding: '0.25rem 0' }}>
              <InteractiveWaveform
                durationSeconds={selectedCall.durSeconds || 120}
                currentSeconds={playbackSeconds}
                isPlaying={isPlayingAudio}
                onSeek={handleSeek}
                sentiment={selectedCall.sentiment}
                transcript={selectedCall.transcript}
                height={52}
              />
            </div>
          </div>

          {/* AI SUMMARY & EXECUTED ACTIONS CARDS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            
            {/* Executive AI Takeaways */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🤖</span> Executive AI Summary
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {selectedCall.summary.map((pt, idx) => (
                  <li key={idx} style={{ marginBottom: '0.35rem' }}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Autonomous Actions Audit */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🎯</span> Autonomous Tool Actions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '12px' }}>
                {selectedCall.toolActions.map((act, idx) => (
                  <div key={idx} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: '#10b981', fontWeight: 600 }}>
                    {act}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* TURN-BY-TURN AUDIO TRANSCRIPT SECTION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Synchronized Speaker Dialogue Transcript
              </h3>

              {/* Transcript Search */}
              <input
                type="text"
                placeholder="Search transcript text..."
                value={transcriptSearch}
                onChange={e => setTranscriptSearch(e.target.value)}
                style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredTranscript.map((t, idx) => {
                const isAgent = t.speaker === 'Agent';
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
                      alignSelf: isAgent ? 'flex-start' : 'flex-end',
                      maxWidth: '85%'
                    }}
                  >
                    <VoiceAvatar
                      type={isAgent ? 'agent' : 'customer'}
                      name={isAgent ? selectedCall.agent : selectedCall.customerName}
                      size={34}
                    />

                    <div style={{
                      padding: '0.85rem 1.1rem', borderRadius: '14px',
                      backgroundColor: isAgent ? 'var(--bg-subtle)' : '#1b5a9212',
                      border: isAgent ? '1px solid var(--border-subtle)' : '1px solid #1b5a9230',
                      color: 'var(--text-primary)', fontSize: '13px', lineHeight: 1.5
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: isAgent ? '#1b5a92' : '#10b981' }}>
                          {isAgent ? `${selectedCall.agent} (AI)` : selectedCall.customerName}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          [{t.timestamp}]
                        </span>
                      </div>
                      <p style={{ margin: 0 }}>{t.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
      )}

    </div>
  );
}
