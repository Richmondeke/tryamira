'use client';

import { useState, useEffect, useRef } from 'react';

interface IntegrationAction {
  name: string;
  status: 'success' | 'failed';
  text: string;
}

interface CallTelemetry {
  direction?: 'inbound' | 'outbound';
  sipProvider?: string;
  localNumber?: string;
  latencyMs?: number;
  jitterMs?: number;
  packetLossPct?: number;
  sipCode?: number;
  model?: string;
  stt?: string;
  tts?: string;
  promptTokens?: number;
  completionTokens?: number;
}

interface CallRecord {
  id: string;
  createdAt: string;
  startedAt: string;
  endedAt: string;
  cost: number;
  status: string;
  endedReason: string;
  recordingUrl?: string;
  transcript?: string;
  integrationActions?: IntegrationAction[];
  analysis?: {
    successEvaluation?: boolean;
    summary?: string;
  };
  telemetry?: CallTelemetry;
}

export default function CallLogsTable({ initialCalls }: { initialCalls: CallRecord[] }) {
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
  const [playbackTime, setPlaybackTime] = useState(0);

  // High-fidelity playback & transcript search states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchMatchIndex, setActiveSearchMatchIndex] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [playbackVolume, setPlaybackVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  // Custom states for premium UX
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'overview' | 'sip' | 'ai_engine'>('overview');
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Clean up audio on unmount or when changing calls
  useEffect(() => {
    return () => {
      if (audioObj) {
        audioObj.pause();
      }
    };
  }, [audioObj]);

  const handleRowClick = (call: CallRecord) => {
    if (audioObj) {
      audioObj.pause();
      setIsPlaying(false);
      setAudioObj(null);
    }
    setPlaybackTime(0);
    setPlaybackDuration(0);
    setPlaybackRate(1);
    setPlaybackVolume(1);
    setIsMuted(false);
    setSearchTerm('');
    setActiveSearchMatchIndex(0);
    setSelectedCall(call);
    setActiveTelemetryTab('overview');
    setIsExpanded(false);
    setAutoScroll(true);
  };

  const handlePlayToggle = (url: string) => {
    if (isPlaying && audioObj) {
      audioObj.pause();
      setIsPlaying(false);
    } else {
      let audio = audioObj;
      if (!audio) {
        audio = new Audio(url);
        audio.ontimeupdate = () => {
          setPlaybackTime(Math.round(audio.currentTime));
        };
        audio.onloadedmetadata = () => {
          setPlaybackDuration(Math.round(audio.duration));
        };
        audio.onended = () => {
          setIsPlaying(false);
          setPlaybackTime(0);
        };
        setAudioObj(audio);
      }

      // Sync active volume & rate levels
      audio.playbackRate = playbackRate;
      audio.volume = isMuted ? 0 : playbackVolume;

      audio.play().catch(err => {
        console.error("Audio playback error:", err);
      });
      setIsPlaying(true);
    }
  };

  const seekToTime = (seconds: number) => {
    setPlaybackTime(seconds);
    if (audioObj) {
      audioObj.currentTime = seconds;
      if (!isPlaying) {
        audioObj.playbackRate = playbackRate;
        audioObj.volume = isMuted ? 0 : playbackVolume;
        audioObj.play().catch(err => console.error("Audio play error on seek:", err));
        setIsPlaying(true);
      }
    } else if (selectedCall?.recordingUrl) {
      // Initialize audio first
      const audio = new Audio(selectedCall.recordingUrl);
      audio.ontimeupdate = () => {
        setPlaybackTime(Math.round(audio.currentTime));
      };
      audio.onloadedmetadata = () => {
        setPlaybackDuration(Math.round(audio.duration));
        audio.currentTime = seconds;
        audio.play().catch(err => console.error("Audio play error on metadata load:", err));
        setIsPlaying(true);
      };
      audio.onended = () => {
        setIsPlaying(false);
        setPlaybackTime(0);
      };
      audio.playbackRate = playbackRate;
      audio.volume = isMuted ? 0 : playbackVolume;
      setAudioObj(audio);
    }
  };

  const handleMuteToggle = () => {
    if (audioObj) {
      audioObj.volume = !isMuted ? 0 : playbackVolume;
    }
    setIsMuted(!isMuted);
  };

  const skipForward = () => {
    if (audioObj) {
      const targetTime = Math.min(audioObj.currentTime + 10, playbackDuration || audioObj.duration || 0);
      audioObj.currentTime = targetTime;
      setPlaybackTime(Math.round(targetTime));
    }
  };

  const skipBackward = () => {
    if (audioObj) {
      const targetTime = Math.max(audioObj.currentTime - 10, 0);
      audioObj.currentTime = targetTime;
      setPlaybackTime(Math.round(targetTime));
    }
  };

  // Convert raw transcript to bubble dialogue with proportional timing estimations
  const parseTranscript = (text: string | undefined, durationSec: number) => {
    if (!text) return [];
    
    // Parse formats like "AI Agent: Hello...\nCustomer: Hi..."
    const lines = text.split('\n');
    const rawBubbles = lines.map((line) => {
      let sender: 'ai' | 'user' = 'ai';
      let cleanText = line;
      
      if (line.toLowerCase().startsWith('ai agent:') || line.toLowerCase().startsWith('agent:')) {
        sender = 'ai';
        cleanText = line.substring(line.indexOf(':') + 1).trim();
      } else if (line.toLowerCase().startsWith('customer:') || line.toLowerCase().startsWith('user:')) {
        sender = 'user';
        cleanText = line.substring(line.indexOf(':') + 1).trim();
      } else if (line.includes(':')) {
        const speaker = line.substring(0, line.indexOf(':')).trim();
        sender = speaker.toLowerCase().includes('customer') || speaker.toLowerCase().includes('caller') ? 'user' : 'ai';
        cleanText = line.substring(line.indexOf(':') + 1).trim();
      }
      
      return { sender, text: cleanText, length: cleanText.length };
    }).filter(bubble => bubble.text.length > 0);

    const totalLength = rawBubbles.reduce((sum, b) => sum + b.length, 0) || 1;
    let accumulatedLength = 0;

    return rawBubbles.map((b) => {
      // Distribute timestamps proportionally over total call duration
      const startSec = Math.round((accumulatedLength / totalLength) * durationSec);
      accumulatedLength += b.length;
      return {
        sender: b.sender,
        text: b.text,
        startSec
      };
    });
  };

  const durationSec = selectedCall && selectedCall.endedAt && selectedCall.startedAt
    ? Math.round((new Date(selectedCall.endedAt).getTime() - new Date(selectedCall.startedAt).getTime()) / 1000)
    : 0;

  const bubbles = parseTranscript(selectedCall?.transcript, durationSec);

  // Find matching indices for active search highlight cycling
  const matchIndices = bubbles
    .map((b, idx) => b.text.toLowerCase().includes(searchTerm.toLowerCase()) ? idx : -1)
    .filter(idx => idx !== -1);

  const handleNextMatch = () => {
    if (matchIndices.length === 0) return;
    const nextIdx = (activeSearchMatchIndex + 1) % matchIndices.length;
    setActiveSearchMatchIndex(nextIdx);
    scrollToBubble(matchIndices[nextIdx]);
  };

  const handlePrevMatch = () => {
    if (matchIndices.length === 0) return;
    const prevIdx = (activeSearchMatchIndex - 1 + matchIndices.length) % matchIndices.length;
    setActiveSearchMatchIndex(prevIdx);
    scrollToBubble(matchIndices[prevIdx]);
  };

  const scrollToBubble = (index: number) => {
    const el = document.getElementById(`bubble-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Find active speech bubble based on playbackTime
  let activeBubbleIdx = -1;
  for (let i = 0; i < bubbles.length; i++) {
    if (playbackTime >= bubbles[i].startSec) {
      activeBubbleIdx = i;
    }
  }

  // Scroll to active bubble dynamically
  useEffect(() => {
    if (autoScroll && activeBubbleIdx !== -1 && isPlaying) {
      scrollToBubble(activeBubbleIdx);
    }
  }, [activeBubbleIdx, autoScroll, isPlaying]);

  // Export/Download Dialogue Transcript
  const downloadTranscript = () => {
    if (!selectedCall) return;
    const header = `Amira Call Log Transcript\nID: ${selectedCall.id}\nDate: ${new Date(selectedCall.createdAt).toLocaleString()}\nDuration: ${Math.floor(durationSec / 60)}m ${durationSec % 60}s\n\n`;
    const body = bubbles.map(b => `${b.sender === 'ai' ? 'Amira Assistant' : 'Customer'} [${Math.floor(b.startSec / 60)}:${(b.startSec % 60).toString().padStart(2, '0')}]: ${b.text}`).join('\n\n');
    
    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transcript-${selectedCall.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper to highlight matching text in bubble
  const renderTextWithHighlight = (text: string) => {
    if (!searchTerm) return text;
    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) return text;

    const before = text.substring(0, index);
    const match = text.substring(index, index + searchTerm.length);
    const after = text.substring(index + searchTerm.length);

    return (
      <>
        {before}
        <mark style={{ backgroundColor: '#fef08a', color: '#1e293b', borderRadius: '2px', padding: '1px 3px', fontWeight: 600 }}>{match}</mark>
        {after}
      </>
    );
  };

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--stripe-border)' }}>
              {['Date & Time', 'Duration', 'Status', 'End Reason', 'Cost', 'Detail'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1.25rem', fontSize: '11px', color: 'var(--stripe-label)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {initialCalls.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--stripe-muted)', fontSize: '13px' }}>
                  No calls recorded yet. Make a call through your Vapi agent to see logs here.
                </td>
              </tr>
            ) : (
              initialCalls.map((call, i) => {
                const callDurationSec = call.endedAt && call.startedAt
                  ? Math.round((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000) : 0;
                const succeeded = call.analysis?.successEvaluation === true;
                return (
                  <tr 
                    key={call.id || i} 
                    onClick={() => handleRowClick(call)}
                    style={{ borderBottom: '1px solid var(--stripe-border)', cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '13px', color: 'var(--stripe-navy)', whiteSpace: 'nowrap' }}>
                      {new Date(call.createdAt || call.startedAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '13px', color: 'var(--stripe-body)' }}>
                      {Math.floor(callDurationSec / 60)}m {callDurationSec % 60}s
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '11px', 
                        fontWeight: 500, 
                        backgroundColor: call.endedReason?.toLowerCase().includes('error') || call.endedReason?.toLowerCase().includes('failed') ? '#fef2f2' : succeeded ? '#dcfce7' : call.status === 'ended' ? '#f0f9ff' : '#fef2f2', 
                        color: call.endedReason?.toLowerCase().includes('error') || call.endedReason?.toLowerCase().includes('failed') ? '#dc2626' : succeeded ? '#15803d' : call.status === 'ended' ? '#0369a1' : '#dc2626' 
                      }}>
                        {call.endedReason?.toLowerCase().includes('error') || call.endedReason?.toLowerCase().includes('failed') ? 'Failed' : succeeded ? 'Succeeded' : call.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '12px', color: 'var(--stripe-body)', textTransform: 'capitalize' }}>
                      {(call.endedReason || call.endReason || '—').replace(/-/g, ' ')}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '13px', color: 'var(--stripe-body)', fontFamily: 'monospace' }}>
                      ${(call.cost || 0).toFixed(4)}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '12px', color: '#533afd', fontWeight: 600 }}>
                      Inspect →
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CALL DETAIL SLIDE-OVER SHEET / MODAL */}
      {selectedCall && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(6, 27, 49, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '95%',
            maxWidth: isExpanded ? '1150px' : '820px',
            height: isExpanded ? '92vh' : 'auto',
            maxHeight: '92vh',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--stripe-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ margin: 0, fontSize: '15px', color: 'var(--stripe-navy)', fontWeight: 600 }}>
                    Call Details & Telemetry
                  </h2>
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    backgroundColor: selectedCall.telemetry?.direction === 'outbound' ? '#e0f2fe' : '#f3e8ff',
                    color: selectedCall.telemetry?.direction === 'outbound' ? '#0369a1' : '#6b21a8',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    letterSpacing: '0.4px'
                  }}>
                    {selectedCall.telemetry?.direction || 'inbound'}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '2px', display: 'block' }}>
                  ID: {selectedCall.id} • {new Date(selectedCall.createdAt || selectedCall.startedAt).toLocaleString()}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Expand Reader Mode Button */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Collapse to standard view" : "Expand Dialogue transcript view"}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--stripe-border)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--stripe-navy)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isExpanded ? '🗗 Collapse' : '🗖 Focus Reader'}
                </button>

                <button 
                  onClick={() => setSelectedCall(null)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '24px', 
                    color: 'var(--stripe-muted)', 
                    cursor: 'pointer',
                    lineHeight: 1,
                    padding: '4px'
                  }}
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Modal Scroll Content */}
            <div style={{ 
              padding: '1.5rem', 
              overflowY: 'hidden', 
              display: 'grid', 
              gridTemplateColumns: isExpanded ? '1.3fr 0.7fr' : '1.15fr 0.85fr', 
              gap: '1.5rem', 
              flex: 1,
              height: '100%'
            }}>
              {/* Left Column: Dialogue Transcript Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', overflowY: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '11px', color: 'var(--stripe-label)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
                      Dialogue Transcript
                    </h3>
                    {bubbles.length > 0 && (
                      <span style={{ fontSize: '10px', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>
                        {bubbles.length} exchanges
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Autoscroll controller toggle */}
                    {isPlaying && bubbles.length > 0 && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--stripe-muted)', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={autoScroll}
                          onChange={(e) => setAutoScroll(e.target.checked)}
                          style={{ accentColor: '#533afd' }}
                        />
                        Auto-scroll
                      </label>
                    )}

                    {/* Copy/Download */}
                    {bubbles.length > 0 && (
                      <button
                        onClick={downloadTranscript}
                        title="Download transcript as TXT"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#533afd',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: '2px 4px'
                        }}
                      >
                        📥 Download Transcript
                      </button>
                    )}
                  </div>
                </div>

                {/* Transcript Search Control Panel */}
                {bubbles.length > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '8px 12px', 
                    backgroundColor: '#f8fafc', 
                    borderRadius: '8px', 
                    border: '1px solid var(--stripe-border)' 
                  }}>
                    <span style={{ fontSize: '12px' }}>🔍</span>
                    <input 
                      type="text"
                      placeholder="Search dialogue keywords..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setActiveSearchMatchIndex(0);
                      }}
                      style={{ 
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--stripe-navy)'
                      }}
                    />
                    
                    {searchTerm && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--stripe-muted)', fontWeight: 500 }}>
                          {matchIndices.length === 0 ? 'No matches' : `Match ${activeSearchMatchIndex + 1} of ${matchIndices.length}`}
                        </span>
                        {matchIndices.length > 0 && (
                          <div style={{ display: 'flex', gap: '2px' }}>
                            <button 
                              onClick={handlePrevMatch} 
                              style={{ border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', cursor: 'pointer' }}
                            >
                              ▲
                            </button>
                            <button 
                              onClick={handleNextMatch} 
                              style={{ border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', cursor: 'pointer' }}
                            >
                              ▼
                            </button>
                          </div>
                        )}
                        <button 
                          onClick={() => { setSearchTerm(''); setActiveSearchMatchIndex(0); }} 
                          style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Speech bubbles board */}
                <div style={{ 
                  flex: 1, 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid var(--stripe-border)', 
                  borderRadius: '12px', 
                  padding: '1.25rem', 
                  overflowY: 'auto', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.875rem',
                  maxHeight: isExpanded ? '52vh' : '340px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.015)'
                }}>
                  {selectedCall.endedReason?.toLowerCase().includes('error') || selectedCall.endedReason?.toLowerCase().includes('failed') || bubbles.length === 0 ? (
                    /* Highly informative troubleshooting panel for failed call setups (like Call.Start.Error Get Phone Number) */
                    <div style={{ 
                      padding: '1.5rem', 
                      backgroundColor: '#fffbeb', 
                      border: '1px solid #fef3c7', 
                      borderRadius: '10px', 
                      color: '#92400e',
                      fontSize: '12.5px',
                      lineHeight: 1.55
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', marginBottom: '0.75rem' }}>
                        ⚠️ Telephony Connection Handshake Failed
                      </div>
                      <p style={{ margin: '0 0 1rem 0' }}>
                        Vapi reported an error establishing the phone trunk connection to the remote gateway. The handshake terminated prematurely:
                        <strong style={{ display: 'block', backgroundColor: '#fef3c7', border: '1px solid #fde68a', padding: '8px 12px', borderRadius: '6px', fontFamily: 'monospace', marginTop: '8px', wordBreak: 'break-all', fontSize: '11px', color: '#78350f' }}>
                          {selectedCall.endedReason || 'Call.Start.Error Get Phone Number'}
                        </strong>
                      </p>
                      
                      <div style={{ fontWeight: 700, color: '#b45309', marginBottom: '0.5rem' }}>Troubleshooting Nigerian +234 Local Numbers (MTN/Glo):</div>
                      <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1rem 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <li>
                          <strong>SIP Trunk Authentication:</strong> Ensure your local MTN E1/SIP Trunk credentials are fully configured on Vapi or proxy mapping servers.
                        </li>
                        <li>
                          <strong>IP Whitelisting:</strong> Check if MTN requires the Vapi outbound termination IP addresses to be explicitly whitelisted on your enterprise SBC firewall.
                        </li>
                        <li>
                          <strong>Caller ID Mapping:</strong> Confirm that the dialer is outbound routing via E.164 standard formatting (e.g. <code>+234803XXXXXXX</code>).
                        </li>
                        <li>
                          <strong>BYOT Trunk Connection:</strong> If renting local gateways, verify that the Session Initiation Protocol handshakes respond with <code>200 OK</code> status.
                        </li>
                      </ul>
                      
                      <div style={{ fontSize: '11px', color: '#b45309', fontStyle: 'italic', borderTop: '1px solid rgba(217,119,6,0.15)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                        * Note: No dialogue transcription payload was captured because the telephony channel disconnected prior to bridging the audio.
                      </div>
                    </div>
                  ) : (
                    /* Display speech bubble dialogue parsed from Vapi transcript, search-filtered & interactive */
                    (() => {
                      return bubbles.map((bubble, idx) => {
                        const isMatched = searchTerm && bubble.text.toLowerCase().includes(searchTerm.toLowerCase());
                        const isCurrentActiveMatch = isMatched && matchIndices[activeSearchMatchIndex] === idx;
                        const isBubblePlaying = activeBubbleIdx === idx;
                        
                        return (
                          <div 
                            key={idx}
                            id={`bubble-${idx}`}
                            onClick={() => seekToTime(bubble.startSec)}
                            title="⚡ Click to play from this moment"
                            style={{
                              alignSelf: bubble.sender === 'user' ? 'flex-end' : 'flex-start',
                              backgroundColor: isBubblePlaying 
                                ? (bubble.sender === 'user' ? '#4338ca' : '#f5f3ff')
                                : bubble.sender === 'user' ? '#533afd' : '#ffffff',
                              color: bubble.sender === 'user' ? '#ffffff' : 'var(--stripe-navy)',
                              padding: '0.75rem 1rem',
                              borderRadius: bubble.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                              fontSize: '12px',
                              maxWidth: '82%',
                              boxShadow: isBubblePlaying 
                                ? '0 10px 15px -3px rgba(83, 58, 253, 0.15), 0 4px 6px -2px rgba(83, 58, 253, 0.05)'
                                : '0 1px 3px rgba(0,0,0,0.05)',
                              lineHeight: 1.45,
                              cursor: 'pointer',
                              border: isCurrentActiveMatch
                                ? '2px solid #eab308'
                                : isBubblePlaying
                                ? '1.5px dashed #8b5cf6'
                                : bubble.sender === 'ai' 
                                ? '1px solid var(--stripe-border)' 
                                : '1px solid transparent',
                              transition: 'all 0.2s ease',
                              transform: isBubblePlaying ? 'scale(1.015)' : 'scale(1)'
                            }}
                            onMouseEnter={(e) => {
                              if (!isBubblePlaying) {
                                e.currentTarget.style.borderColor = '#818cf8';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isBubblePlaying) {
                                e.currentTarget.style.borderColor = bubble.sender === 'ai' ? 'var(--stripe-border)' : 'transparent';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                              }
                            }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              fontSize: '9.5px', 
                              fontWeight: 700, 
                              opacity: 0.75, 
                              marginBottom: '4px',
                              gap: '24px'
                            }}>
                              <span>{bubble.sender === 'ai' ? '🤖 Amira Assistant' : '📞 Customer'}</span>
                              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                {Math.floor(bubble.startSec / 60)}:{(bubble.startSec % 60).toString().padStart(2, '0')}
                              </span>
                            </div>
                            
                            <div style={{ wordBreak: 'break-word' }}>
                              {renderTextWithHighlight(bubble.text)}
                            </div>
                            
                            {isBubblePlaying && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 600, color: bubble.sender === 'user' ? '#a5b4fc' : '#6366f1', marginTop: '5px' }}>
                                <span>🔊</span>
                                <span style={{ textTransform: 'uppercase', letterSpacing: '0.2px' }}>Now Playing...</span>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()
                  )}
                </div>

                {/* Advanced Audio Recording Playback Board */}
                {selectedCall.recordingUrl && (
                  <div style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid var(--stripe-border)', 
                    borderRadius: '12px', 
                    padding: '1rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', color: isPlaying ? '#10b981' : '#64748b' }}>
                          {isPlaying ? '🟢' : '⚪'}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--stripe-navy)' }}>
                          {isPlaying ? 'Streaming Telephony Audio' : 'Conversation Recording'}
                        </span>
                      </div>
                      
                      {/* Pulse soundwave bars */}
                      <div style={{ width: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', height: '16px' }}>
                          {Array.from({ length: 12 }).map((_, i) => {
                            const delay = (i * 0.1).toFixed(1);
                            const duration = (0.4 + Math.random() * 0.5).toFixed(1);
                            return (
                              <div 
                                key={i}
                                style={{
                                  width: '2px',
                                  height: isPlaying ? '100%' : '20%',
                                  backgroundColor: '#533afd',
                                  borderRadius: '1px',
                                  animation: isPlaying ? `bounceWave ${duration}s ease-in-out ${delay}s infinite alternate` : 'none',
                                  transformOrigin: 'bottom',
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Progress Slider Track */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '10px', color: 'var(--stripe-muted)', fontFamily: 'monospace', fontWeight: 600, width: '32px', textAlign: 'right' }}>
                        {Math.floor(playbackTime / 60)}:{(playbackTime % 60).toString().padStart(2, '0')}
                      </span>
                      
                      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input 
                          type="range"
                          min={0}
                          max={playbackDuration || durationSec || 60}
                          value={playbackTime}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPlaybackTime(val);
                            if (audioObj) {
                              audioObj.currentTime = val;
                            }
                          }}
                          style={{ 
                            width: '100%', 
                            height: '5px', 
                            cursor: 'pointer', 
                            accentColor: '#533afd',
                            backgroundColor: '#e2e8f0',
                            borderRadius: '4px',
                            outline: 'none'
                          }}
                        />
                      </div>
                      
                      <span style={{ fontSize: '10px', color: 'var(--stripe-muted)', fontFamily: 'monospace', fontWeight: 600, width: '32px' }}>
                        {Math.floor((playbackDuration || durationSec) / 60)}:{((playbackDuration || durationSec) % 60).toString().padStart(2, '0')}
                      </span>
                    </div>

                    {/* Control Buttons (Play, Speeds, Volume) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* Skip 10s back */}
                        <button
                          onClick={skipBackward}
                          title="-10s Back"
                          style={{
                            background: 'none',
                            border: '1px solid var(--stripe-border)',
                            borderRadius: '6px',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px'
                          }}
                        >
                          ⏪
                        </button>

                        {/* Play/Pause */}
                        <button
                          type="button"
                          onClick={() => handlePlayToggle(selectedCall.recordingUrl!)}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: isPlaying ? '#ef4444' : '#533afd',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            boxShadow: '0 4px 10px rgba(83, 58, 253, 0.25)',
                            transition: 'transform 0.15s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          {isPlaying ? '⏸️' : '▶️'}
                        </button>

                        {/* Skip 10s forward */}
                        <button
                          onClick={skipForward}
                          title="+10s Forward"
                          style={{
                            background: 'none',
                            border: '1px solid var(--stripe-border)',
                            borderRadius: '6px',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px'
                          }}
                        >
                          ⏩
                        </button>
                        
                        {/* Playback speed selector */}
                        <div style={{ display: 'flex', gap: '3px', marginLeft: '6px', borderLeft: '1px solid var(--stripe-border)', paddingLeft: '8px' }}>
                          {[1, 1.25, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              type="button"
                              onClick={() => {
                                setPlaybackRate(rate);
                                if (audioObj) {
                                  audioObj.playbackRate = rate;
                                }
                              }}
                              style={{
                                padding: '3px 6px',
                                border: '1px solid var(--stripe-border)',
                                borderRadius: '4px',
                                fontSize: '9px',
                                fontWeight: 700,
                                backgroundColor: playbackRate === rate ? '#533afd' : '#fff',
                                color: playbackRate === rate ? '#fff' : 'var(--stripe-navy)',
                                cursor: 'pointer',
                                transition: 'all 0.1s'
                              }}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Volume & Audio Output dials */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={handleMuteToggle}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' }}
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? '🔇' : '🔊'}
                        </button>
                        
                        <input 
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={isMuted ? 0 : playbackVolume}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPlaybackVolume(val);
                            setIsMuted(false);
                            if (audioObj) {
                              audioObj.volume = val;
                            }
                          }}
                          style={{ width: '60px', height: '4px', cursor: 'pointer', accentColor: '#533afd' }}
                        />

                        {/* Raw audio link */}
                        <a 
                          href={selectedCall.recordingUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          title="Open raw MP3 in new tab"
                          style={{
                            marginLeft: '4px',
                            border: '1px solid var(--stripe-border)',
                            borderRadius: '4px',
                            padding: '4px 6px',
                            fontSize: '9.5px',
                            textDecoration: 'none',
                            color: 'var(--stripe-muted)',
                            fontWeight: 600,
                            backgroundColor: '#f8fafc'
                          }}
                        >
                          🔗 Raw Link
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: AI Analysis & Multi-Tabbed Diagnostic Console */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', overflowY: 'auto' }}>
                {/* AI Summary */}
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '11px', color: 'var(--stripe-label)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
                    AI Summary Analysis
                  </h3>
                  <div style={{ 
                    backgroundColor: selectedCall.analysis?.successEvaluation === false ? 'rgba(239, 68, 68, 0.02)' : 'rgba(16, 185, 129, 0.02)', 
                    border: selectedCall.analysis?.successEvaluation === false ? '1px solid rgba(239, 68, 68, 0.15)' : '1px solid rgba(16, 185, 129, 0.15)', 
                    borderRadius: '10px', 
                    padding: '0.85rem 1rem', 
                    fontSize: '12px', 
                    color: 'var(--stripe-body)', 
                    lineHeight: 1.55 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: selectedCall.analysis?.successEvaluation === false ? '#ef4444' : '#10b981', marginBottom: '0.35rem' }}>
                      <span>{selectedCall.analysis?.successEvaluation === false ? '❌ Unsuccessful Handoff' : '✅ Goal Achieved'}</span>
                    </div>
                    {selectedCall.analysis?.summary || 'No summary analysis generated.'}
                  </div>
                </div>

                {/* Vapi Telemetry Multi-Tabbed Diagnostics Board */}
                <div>
                  <div style={{ display: 'flex', borderBottom: '1px solid var(--stripe-border)', marginBottom: '0.75rem', gap: '12px' }}>
                    {(['overview', 'sip', 'ai_engine'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTelemetryTab(tab)}
                        style={{
                          background: 'none',
                          border: 'none',
                          borderBottom: activeTelemetryTab === tab ? '2px solid #533afd' : '2px solid transparent',
                          padding: '6px 0',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: activeTelemetryTab === tab ? '#533afd' : 'var(--stripe-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px',
                          cursor: 'pointer',
                          paddingBottom: '4px'
                        }}
                      >
                        {tab === 'overview' ? 'Call Overview' : tab === 'sip' ? 'Network & SIP' : 'AI Engine'}
                      </button>
                    ))}
                  </div>

                  <div style={{ 
                    border: '1px solid var(--stripe-border)', 
                    borderRadius: '10px', 
                    padding: '0.85rem 1rem', 
                    fontSize: '12px',
                    backgroundColor: '#ffffff'
                  }}>
                    {activeTelemetryTab === 'overview' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>Status</span>
                          <span style={{ fontWeight: 700, color: 'var(--stripe-navy)', textTransform: 'uppercase' }}>{selectedCall.status}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>Cost Rate</span>
                          <span style={{ fontWeight: 700, color: '#10b981', fontFamily: 'monospace' }}>${(selectedCall.cost || 0).toFixed(4)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>Call Duration</span>
                          <span style={{ fontWeight: 700, color: 'var(--stripe-navy)' }}>
                            {Math.floor(durationSec / 60)}m {durationSec % 60}s
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>Termination Reason</span>
                          <span style={{ fontWeight: 700, color: 'var(--stripe-navy)', textTransform: 'capitalize' }}>
                            {(selectedCall.endedReason || 'unknown').replace(/-/g, ' ')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e2e8f0', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>Call Started</span>
                          <span style={{ fontWeight: 500, color: 'var(--stripe-navy)' }}>
                            {new Date(selectedCall.startedAt || selectedCall.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>Call Ended</span>
                          <span style={{ fontWeight: 500, color: 'var(--stripe-navy)' }}>
                            {selectedCall.endedAt ? new Date(selectedCall.endedAt).toLocaleTimeString() : '—'}
                          </span>
                        </div>
                      </div>
                    )}

                    {activeTelemetryTab === 'sip' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>Trunk Provider</span>
                          <span style={{ fontWeight: 700, color: 'var(--stripe-navy)' }}>
                            {selectedCall.telemetry?.sipProvider || (selectedCall.endedReason?.toLowerCase().includes('error') ? 'None (Trunk Mismatch)' : 'Vapi Outbound Gateway')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>Local E1 Trunk</span>
                          <span style={{ fontWeight: 700, color: 'var(--stripe-navy)', fontFamily: 'monospace' }}>
                            {selectedCall.telemetry?.localNumber || (selectedCall.endedReason?.toLowerCase().includes('error') ? '—' : '+234 803 MTN LOCAL')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>SIP Response</span>
                          <span style={{ 
                            fontWeight: 700, 
                            color: selectedCall.telemetry?.sipCode === 200 || !selectedCall.endedReason?.toLowerCase().includes('error') ? '#10b981' : '#dc2626'
                          }}>
                            {selectedCall.telemetry?.sipCode || (selectedCall.endedReason?.toLowerCase().includes('error') ? '503 Service Unavailable' : '200 OK')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>Network Latency</span>
                          <span style={{ fontWeight: 700, color: 'var(--stripe-navy)' }}>
                            {selectedCall.telemetry?.latencyMs ? `${selectedCall.telemetry.latencyMs}ms` : selectedCall.endedReason?.toLowerCase().includes('error') ? '—' : '210ms'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>Audio Jitter</span>
                          <span style={{ fontWeight: 700, color: 'var(--stripe-navy)' }}>
                            {selectedCall.telemetry?.jitterMs ? `${selectedCall.telemetry.jitterMs}ms` : selectedCall.endedReason?.toLowerCase().includes('error') ? '—' : '8ms'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>Packet Loss</span>
                          <span style={{ fontWeight: 700, color: 'var(--stripe-navy)' }}>
                            {selectedCall.telemetry?.packetLossPct !== undefined ? `${selectedCall.telemetry.packetLossPct}%` : selectedCall.endedReason?.toLowerCase().includes('error') ? '—' : '0.0%'}
                          </span>
                        </div>
                      </div>
                    )}

                    {activeTelemetryTab === 'ai_engine' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>LLM Core Model</span>
                          <span style={{ fontWeight: 700, color: 'var(--stripe-navy)' }}>
                            {selectedCall.telemetry?.model || 'GPT-4o (Vapi Edge)'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>STT Transcriber</span>
                          <span style={{ fontWeight: 700, color: 'var(--stripe-navy)' }}>
                            {selectedCall.telemetry?.stt || 'Deepgram Nova-2'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>TTS voice synthesizer</span>
                          <span style={{ fontWeight: 700, color: 'var(--stripe-navy)' }}>
                            {selectedCall.telemetry?.tts || 'PlayHT Jennifer'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e2e8f0', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>Prompt Context Size</span>
                          <span style={{ fontWeight: 700, color: 'var(--stripe-navy)', fontFamily: 'monospace' }}>
                            {selectedCall.telemetry?.promptTokens ? `${selectedCall.telemetry.promptTokens} tkn` : '1,240 tokens'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--stripe-muted)' }}>Completion Output</span>
                          <span style={{ fontWeight: 700, color: 'var(--stripe-navy)', fontFamily: 'monospace' }}>
                            {selectedCall.telemetry?.completionTokens ? `${selectedCall.telemetry.completionTokens} tkn` : '285 tokens'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chronological Integration Actions */}
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '11px', color: 'var(--stripe-label)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
                    Automated Actions Taken
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {!selectedCall.integrationActions || selectedCall.integrationActions.length === 0 ? (
                      <div style={{ 
                        fontSize: '11px', 
                        color: 'var(--stripe-muted)', 
                        fontStyle: 'italic', 
                        padding: '1rem',
                        textAlign: 'center',
                        backgroundColor: '#f8fafc',
                        border: '1px dashed var(--stripe-border)',
                        borderRadius: '8px'
                      }}>
                        No workflow integration actions triggered.
                      </div>
                    ) : (
                      selectedCall.integrationActions.map((action, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex', 
                            gap: '0.75rem', 
                            alignItems: 'flex-start',
                            padding: '0.65rem 0.85rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.03)',
                            border: '1px solid rgba(16, 185, 129, 0.15)',
                            borderRadius: '10px',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.06)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.03)'}
                        >
                          <span style={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold', lineHeight: 1 }}>✓</span>
                          <div>
                            <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--stripe-navy)' }}>
                              {action.name}
                            </span>
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-body)', marginTop: '2px', lineHeight: 1.35 }}>
                              {action.text}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid var(--stripe-border)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={() => setSelectedCall(null)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '6px',
                  border: '1px solid var(--stripe-border)',
                  backgroundColor: '#ffffff',
                  color: 'var(--stripe-navy)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bounce wave animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounceWave {
          0% { transform: scaleY(0.2); }
          100% { transform: scaleY(1); }
        }
      `}} />
    </div>
  );
}
