'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';

interface InteractiveWaveformProps {
  durationSeconds: number;
  currentSeconds: number;
  isPlaying: boolean;
  onSeek: (seconds: number) => void;
  sentiment?: string;
  transcript?: Array<{
    speaker: 'Agent' | 'Customer';
    text: string;
    timestamp: string;
    seconds: number;
  }>;
  height?: number;
}

export default function InteractiveWaveform({
  durationSeconds,
  currentSeconds,
  isPlaying,
  onSeek,
  sentiment = 'Positive',
  transcript = [],
  height = 54
}: InteractiveWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Generate realistic amplitude peaks based on duration and transcript turns
  const totalBars = 90;
  const bars = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < totalBars; i++) {
      const progress = i / totalBars;
      const targetSec = progress * (durationSeconds || 100);
      
      // Check if this timestamp is within an active speaking window
      const activeTurn = transcript.find((t, idx) => {
        const nextSec = transcript[idx + 1]?.seconds ?? (durationSeconds || 100);
        return targetSec >= t.seconds && targetSec < nextSec;
      });

      // Natural speech rhythm curve
      const baseAmp = activeTurn ? 0.45 : 0.15;
      const variation = Math.sin(i * 0.35) * 0.25 + Math.cos(i * 0.7) * 0.2;
      const microNoise = ((i * 17) % 23) / 100;
      const finalAmp = Math.max(0.12, Math.min(0.95, baseAmp + variation + microNoise));
      arr.push(finalAmp);
    }
    return arr;
  }, [totalBars, durationSeconds, transcript]);

  const effectiveDuration = Math.max(durationSeconds || 60, 1);
  const progressRatio = Math.min(1, Math.max(0, currentSeconds / effectiveDuration));
  const activeBarIndex = Math.floor(progressRatio * totalBars);

  const calculateSeekFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const seekSec = Math.floor(ratio * effectiveDuration);
    onSeek(seekSec);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    setHoverPosition(ratio);

    if (isDragging) {
      const seekSec = Math.floor(ratio * effectiveDuration);
      onSeek(seekSec);
    }
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    setIsDragging(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const hoverSeconds = hoverPosition !== null ? Math.floor(hoverPosition * effectiveDuration) : 0;
  const hoverSpeaker = useMemo(() => {
    if (hoverPosition === null || transcript.length === 0) return null;
    const sec = hoverPosition * effectiveDuration;
    const turn = transcript.slice().reverse().find(t => sec >= t.seconds);
    return turn ? turn.speaker : 'Amira Voice';
  }, [hoverPosition, effectiveDuration, transcript]);

  return (
    <div style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      {/* Waveform Bars Container */}
      <div
        ref={containerRef}
        onClick={calculateSeekFromEvent}
        onMouseDown={(e) => { setIsDragging(true); calculateSeekFromEvent(e); }}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          gap: '2.5px',
          cursor: 'pointer',
          padding: '4px 0',
          position: 'relative',
        }}
      >
        {bars.map((amplitude, idx) => {
          const isPlayed = idx <= activeBarIndex;
          const isHovered = hoverPosition !== null && idx <= Math.floor(hoverPosition * totalBars);

          // Speaker color-coding
          const barSec = (idx / totalBars) * effectiveDuration;
          const turn = transcript.slice().reverse().find(t => barSec >= t.seconds);
          const isAgent = turn ? turn.speaker === 'Agent' : idx % 2 === 0;

          let barColor = isPlayed
            ? (isAgent ? '#1b5a92' : '#10b981')
            : (isHovered ? '#94a3b8' : 'var(--border-subtle, #cbd5e1)');

          if (isPlayed && isPlaying) {
            barColor = isAgent ? '#2563eb' : '#059669';
          }

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                height: `${Math.max(10, amplitude * (height - 8))}px`,
                backgroundColor: barColor,
                borderRadius: '99px',
                transition: 'height 0.15s ease, background-color 0.1s ease',
                transformOrigin: 'center'
              }}
            />
          );
        })}

        {/* Current Playhead Indicator Line */}
        <div
          style={{
            position: 'absolute',
            left: `${progressRatio * 100}%`,
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: '#1b5a92',
            boxShadow: '0 0 8px rgba(27, 90, 146, 0.6)',
            borderRadius: '2px',
            pointerEvents: 'none',
            zIndex: 2,
            transition: isPlaying ? 'left 0.25s linear' : 'none'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '-3px',
            left: '-4px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#1b5a92',
            border: '2px solid #ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} />
        </div>

        {/* Hover Scrub Line */}
        {hoverPosition !== null && (
          <div
            style={{
              position: 'absolute',
              left: `${hoverPosition * 100}%`,
              top: 0,
              bottom: 0,
              width: '1.5px',
              backgroundColor: '#64748b',
              borderStyle: 'dashed',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        )}
      </div>

      {/* Floating Hover Tooltip */}
      {hoverPosition !== null && (
        <div
          style={{
            position: 'absolute',
            left: `${hoverPosition * 100}%`,
            bottom: `${height + 8}px`,
            transform: 'translateX(-50%)',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            pointerEvents: 'none',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span>{formatTime(hoverSeconds)}</span>
          {hoverSpeaker && (
            <span style={{
              fontSize: '9.5px',
              fontWeight: 600,
              padding: '1px 4px',
              borderRadius: '3px',
              backgroundColor: hoverSpeaker === 'Agent' ? '#1b5a92' : '#10b981',
              color: '#ffffff'
            }}>
              {hoverSpeaker === 'Agent' ? 'AI Agent' : 'Caller'}
            </span>
          )}
        </div>
      )}

      {/* Footer Markers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: 'var(--text-secondary, #94a3b8)', fontWeight: 600 }}>
        <span>{formatTime(currentSeconds)}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1b5a92' }} /> AI Agent
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Customer
          </span>
        </span>
        <span>{formatTime(effectiveDuration)}</span>
      </div>
    </div>
  );
}
