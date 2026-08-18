'use client';

import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';

interface LiveVoiceTesterProps {
  assistantId?: string;
  agentName?: string;
  systemPrompt?: string;
  firstMessage?: string;
  voiceProvider?: string;
  voiceId?: string;
  model?: string;
}

export function LiveVoiceTester({
  assistantId,
  agentName = 'Amira Voice Agent',
  systemPrompt,
  firstMessage,
  voiceProvider = '11labs',
  voiceId = 'rachel',
  model = 'gpt-4o'
}: LiveVoiceTesterProps) {
  const [vapiInstance, setVapiInstance] = useState<any>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'active' | 'speaking' | 'listening'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<Array<{ role: 'assistant' | 'user'; text: string; time: string }>>([]);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '65903b62-2469-41eb-ba8e-264a5114416b';
    try {
      const vapi = new Vapi(publicKey);

      vapi.on('call-start', () => {
        setCallStatus('active');
        setErrorMessage(null);
      });

      vapi.on('call-end', () => {
        setCallStatus('idle');
        setVolumeLevel(0);
      });

      vapi.on('speech-start', () => {
        setCallStatus('speaking');
      });

      vapi.on('speech-end', () => {
        setCallStatus('listening');
      });

      vapi.on('volume-level', (vol: number) => {
        setVolumeLevel(vol);
      });

      vapi.on('message', (message: any) => {
        if (message.type === 'transcript') {
          if (message.transcriptType === 'final') {
            setLiveTranscript(prev => [
              ...prev,
              {
                role: message.role === 'assistant' ? 'assistant' : 'user',
                text: message.transcript,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              }
            ]);
          }
        }
      });

      vapi.on('error', (err: any) => {
        console.error('Vapi Web SDK Error:', err);
        setErrorMessage(err?.error?.message || err?.message || 'Connection error. Please ensure microphone permissions are allowed.');
        setCallStatus('idle');
      });

      setVapiInstance(vapi);

      return () => {
        vapi.stop();
      };
    } catch (e: any) {
      console.warn('Failed to initialize Vapi Web SDK:', e);
    }
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveTranscript]);

  const handleStartCall = async () => {
    if (!vapiInstance) return;
    setErrorMessage(null);
    setCallStatus('connecting');

    try {
      const targetAssistantId = assistantId || process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || 'ae0f0250-c62c-4c65-916e-85af7d7288b7';

      if (targetAssistantId && targetAssistantId.length > 10) {
        await vapiInstance.start(targetAssistantId);
      } else {
        // Start transient assistant with live in-studio parameters
        await vapiInstance.start({
          model: {
            provider: 'openai',
            model: model || 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: systemPrompt || 'You are Amira, a helpful AI customer support and sales representative.'
              }
            ]
          },
          voice: {
            provider: voiceProvider,
            voiceId: voiceId
          },
          firstMessage: firstMessage || 'Hello! I am your Amira voice assistant. How can I help you today?'
        });
      }
    } catch (err: any) {
      console.error('Failed to start Vapi call:', err);
      setErrorMessage(err.message || 'Could not connect call. Check microphone access.');
      setCallStatus('idle');
    }
  };

  const handleEndCall = () => {
    if (vapiInstance) {
      vapiInstance.stop();
    }
    setCallStatus('idle');
  };

  const handleToggleMute = () => {
    if (!vapiInstance) return;
    const nextMute = !isMuted;
    vapiInstance.setMuted(nextMute);
    setIsMuted(nextMute);
  };

  const isCallInProgress = callStatus !== 'idle';

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '16px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#1b5a92',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img src="/amira-head.png" alt="Amira" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {agentName}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Vapi WebRTC SDK • Realtime Mic & Audio
            </div>
          </div>
        </div>

        {/* Live Status Badge */}
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          padding: '3px 9px',
          borderRadius: '99px',
          backgroundColor: isCallInProgress ? '#10b98115' : 'var(--bg-subtle)',
          color: isCallInProgress ? '#10b981' : 'var(--text-secondary)',
          border: isCallInProgress ? '1px solid #10b98140' : '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isCallInProgress ? '#10b981' : '#94a3b8',
            boxShadow: isCallInProgress ? '0 0 6px #10b981' : 'none'
          }} />
          <span>
            {callStatus === 'connecting' && 'Connecting...'}
            {callStatus === 'speaking' && 'Amira Speaking 🔊'}
            {callStatus === 'listening' && 'Listening to You 🎙️'}
            {callStatus === 'active' && 'Call Connected'}
            {callStatus === 'idle' && 'Offline / Ready'}
          </span>
        </div>
      </div>

      {/* Error display */}
      {errorMessage && (
        <div style={{
          padding: '0.65rem 0.9rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#b91c1c',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Pulsing Audio Waveform Visualizer */}
      <div style={{
        height: '64px',
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: '10px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        padding: '0 1rem',
        overflow: 'hidden'
      }}>
        {Array.from({ length: 24 }).map((_, i) => {
          const activeHeight = isCallInProgress
            ? Math.max(8, Math.min(48, (volumeLevel * 100 * Math.sin((i + 1) * 0.5)) + (callStatus === 'speaking' ? 24 : 12)))
            : 6;
          return (
            <div
              key={i}
              style={{
                width: '3.5px',
                height: `${activeHeight}px`,
                backgroundColor: isCallInProgress ? '#1b5a92' : '#cbd5e1',
                borderRadius: '99px',
                transition: 'height 0.08s ease'
              }}
            />
          );
        })}
      </div>

      {/* Live Turn-by-Turn Transcript Log */}
      {isCallInProgress && (
        <div style={{
          maxHeight: '140px',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          fontSize: '12px'
        }}>
          {liveTranscript.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '0.5rem 0' }}>
              Speak into your microphone to talk to {agentName}...
            </div>
          ) : (
            liveTranscript.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 700, color: t.role === 'assistant' ? '#1b5a92' : '#10b981', flexShrink: 0 }}>
                  {t.role === 'assistant' ? 'Amira:' : 'You:'}
                </span>
                <span style={{ color: 'var(--text-primary)' }}>{t.text}</span>
              </div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>
      )}

      {/* Control Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {!isCallInProgress ? (
          <button
            type="button"
            onClick={handleStartCall}
            style={{
              flex: 1,
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: '#1b5a92',
              color: '#ffffff',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(27,90,146,0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>🎙️</span>
            <span>Test Voice Agent Live (Mic Call)</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleToggleMute}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: isMuted ? '#fef2f2' : 'var(--bg-subtle)',
                color: isMuted ? '#ef4444' : 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isMuted ? '🔇 Unmute' : '🎙️ Mute'}
            </button>

            <button
              type="button"
              onClick={handleEndCall}
              style={{
                flex: 1,
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <span>📞</span>
              <span>End Test Call</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
