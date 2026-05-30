'use client';

import { useState, useEffect } from 'react';

interface IntegrationAction {
  name: string;
  status: 'success' | 'failed';
  text: string;
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
}

export default function CallLogsTable({ initialCalls }: { initialCalls: CallRecord[] }) {
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
  const [playbackTime, setPlaybackTime] = useState(0);

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
    setSelectedCall(call);
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
        audio.onended = () => {
          setIsPlaying(false);
          setPlaybackTime(0);
        };
        setAudioObj(audio);
      }
      audio.play().catch(err => {
        console.error("Audio playback error:", err);
      });
      setIsPlaying(true);
    }
  };

  // Convert raw transcript to bubble dialogue
  const parseTranscript = (text: string | undefined) => {
    if (!text) return [];
    
    // Parse formats like "AI Agent: Hello...\nCustomer: Hi..."
    const lines = text.split('\n');
    return lines.map((line, i) => {
      let sender: 'ai' | 'user' = 'ai';
      let cleanText = line;
      
      if (line.toLowerCase().startsWith('ai agent:') || line.toLowerCase().startsWith('agent:')) {
        sender = 'ai';
        cleanText = line.substring(line.indexOf(':') + 1).trim();
      } else if (line.toLowerCase().startsWith('customer:') || line.toLowerCase().startsWith('user:')) {
        sender = 'user';
        cleanText = line.substring(line.indexOf(':') + 1).trim();
      } else if (line.includes(':')) {
        // Fallback for custom speaker tags (e.g. "Ashley: Hello")
        const speaker = line.substring(0, line.indexOf(':')).trim();
        sender = speaker.toLowerCase().includes('customer') || speaker.toLowerCase().includes('caller') ? 'user' : 'ai';
        cleanText = line.substring(line.indexOf(':') + 1).trim();
      }
      
      return { sender, text: cleanText };
    }).filter(bubble => bubble.text.length > 0);
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
                const durationSec = call.endedAt && call.startedAt
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
                      {Math.floor(durationSec / 60)}m {durationSec % 60}s
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 500, backgroundColor: succeeded ? '#dcfce7' : call.status === 'ended' ? '#f0f9ff' : '#fef2f2', color: succeeded ? '#15803d' : call.status === 'ended' ? '#0369a1' : '#dc2626' }}>
                        {succeeded ? 'Succeeded' : call.status}
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
            borderRadius: '12px',
            width: '90%',
            maxWidth: '750px',
            maxHeight: '90vh',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
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
                <h2 style={{ margin: 0, fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 600 }}>
                  Call Details & Analytics
                </h2>
                <span style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '2px', display: 'block' }}>
                  ID: {selectedCall.id} • {new Date(selectedCall.createdAt || selectedCall.startedAt).toLocaleString()}
                </span>
              </div>
              <button 
                onClick={() => setSelectedCall(null)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '22px', 
                  color: 'var(--stripe-muted)', 
                  cursor: 'pointer',
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', flex: 1 }}>
              {/* Left Column: Dialogue Transcript */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '300px' }}>
                <h3 style={{ margin: 0, fontSize: '12px', color: 'var(--stripe-label)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
                  Dialogue Transcript
                </h3>
                
                <div style={{ 
                  flex: 1, 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid var(--stripe-border)', 
                  borderRadius: '8px', 
                  padding: '1rem', 
                  overflowY: 'auto', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.75rem',
                  maxHeight: '360px'
                }}>
                  {parseTranscript(selectedCall.transcript).length === 0 ? (
                    <div style={{ color: 'var(--stripe-muted)', fontSize: '12px', textAlign: 'center', padding: '2rem' }}>
                      No dialogue text captured for this call log.
                    </div>
                  ) : (
                    parseTranscript(selectedCall.transcript).map((bubble, idx) => (
                      <div 
                        key={idx}
                        style={{
                          alignSelf: bubble.sender === 'user' ? 'flex-end' : 'flex-start',
                          backgroundColor: bubble.sender === 'user' ? '#533afd' : '#ffffff',
                          color: bubble.sender === 'user' ? '#ffffff' : 'var(--stripe-navy)',
                          padding: '0.6rem 0.9rem',
                          borderRadius: '8px',
                          fontSize: '12px',
                          maxWidth: '85%',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          lineHeight: 1.4,
                          border: bubble.sender === 'ai' ? '1px solid var(--stripe-border)' : 'none'
                        }}
                      >
                        <div style={{ fontSize: '9px', fontWeight: 600, opacity: 0.8, marginBottom: '2px', textAlign: bubble.sender === 'user' ? 'right' : 'left' }}>
                          {bubble.sender === 'ai' ? '🤖 Amira Assistant' : '📞 Customer'}
                        </div>
                        {bubble.text}
                      </div>
                    ))
                  )}
                </div>

                {/* Audio Recording Player */}
                {selectedCall.recordingUrl && (
                  <div style={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid var(--stripe-border)', 
                    borderRadius: '8px', 
                    padding: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem' 
                  }}>
                    <button
                      onClick={() => handlePlayToggle(selectedCall.recordingUrl!)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: isPlaying ? '#ef4444' : '#533afd',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        boxShadow: '0 4px 10px rgba(83,58,253,0.2)'
                      }}
                    >
                      {isPlaying ? '⏹️' : '▶️'}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--stripe-navy)' }}>
                        {isPlaying ? 'Playing Audio Recording' : 'Listen to Call Recording'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Source: Vapi.ai Hosting</span>
                        {isPlaying && <span>Elapsed: {playbackTime}s</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: AI Analysis & Integration Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* AI Summary */}
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '12px', color: 'var(--stripe-label)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
                    AI Summary Analysis
                  </h3>
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '12px', color: 'var(--stripe-body)', lineHeight: 1.5 }}>
                    {selectedCall.analysis?.summary || 'No summary analysis generated.'}
                  </div>
                </div>

                {/* Call Analytics */}
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '12px', color: 'var(--stripe-label)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
                    Vapi Telemetry
                  </h3>
                  <div style={{ border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--stripe-muted)' }}>Status</span>
                      <span style={{ fontWeight: 600, color: 'var(--stripe-navy)', textTransform: 'uppercase' }}>{selectedCall.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--stripe-muted)' }}>Ending Reason</span>
                      <span style={{ fontWeight: 600, color: 'var(--stripe-navy)', textTransform: 'capitalize' }}>{(selectedCall.endedReason || '').replace(/-/g, ' ')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--stripe-muted)' }}>Cost Rate</span>
                      <span style={{ fontWeight: 600, color: '#10b981', fontFamily: 'monospace' }}>${(selectedCall.cost || 0).toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                {/* Chronological Integration Actions */}
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '12px', color: 'var(--stripe-label)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
                    Automated Actions Taken
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {!selectedCall.integrationActions || selectedCall.integrationActions.length === 0 ? (
                      <div style={{ fontSize: '11px', color: 'var(--stripe-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
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
                            padding: '0.6rem 0.8rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.03)',
                            border: '1px solid rgba(16, 185, 129, 0.15)',
                            borderRadius: '8px'
                          }}
                        >
                          <span style={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold', lineHeight: 1 }}>✓</span>
                          <div>
                            <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--stripe-navy)' }}>
                              {action.name}
                            </span>
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-body)', marginTop: '2px', lineHeight: 1.3 }}>
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
                  cursor: 'pointer'
                }}
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fade In Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
}
