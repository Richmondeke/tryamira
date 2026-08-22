import { useState, useEffect, useCallback } from 'react';
import { VoiceOption } from '@/lib/voices';

export function useVoiceAudition(voices: VoiceOption[]) {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Clean up audio playback on unmount
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

  const runSpeechSynthesis = useCallback((text: string, gender: string, onEndCallback: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEndCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voicesListSystem = window.speechSynthesis.getVoices();
    let selectedSysVoice = null;

    const isFemale = gender.toLowerCase().includes('female') || 
                     gender.toLowerCase().includes('soft') || 
                     gender.toLowerCase().includes('friendly');

    if (isFemale) {
      selectedSysVoice = voicesListSystem.find(v => 
        v.name.toLowerCase().includes('google us english') || 
        v.name.toLowerCase().includes('samantha') || 
        v.name.toLowerCase().includes('female')
      ) || voicesListSystem.find(v => v.lang.startsWith('en'));
    } else {
      selectedSysVoice = voicesListSystem.find(v => 
        v.name.toLowerCase().includes('google uk english male') || 
        v.name.toLowerCase().includes('david') || 
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

    utterance.onerror = () => {
      onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const playVoicePreview = useCallback((voiceId: string, text: string, gender: string) => {
    const voiceObj = voices.find(v => v.id === voiceId);

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }

    const globalAudio = typeof document !== 'undefined' 
      ? document.getElementById('voice-preview-player') as HTMLAudioElement | null 
      : null;

    if (globalAudio) {
      globalAudio.pause();
      globalAudio.currentTime = 0;
    }

    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    setPlayingVoiceId(voiceId);

    if (voiceObj?.previewUrl) {
      const audio = new Audio(voiceObj.previewUrl);
      audio.onended = () => {
        setPlayingVoiceId(null);
        setCurrentAudio(null);
      };
      audio.onerror = () => {
        runSpeechSynthesis(text, gender, () => setPlayingVoiceId(null));
      };
      audio.play().catch(() => {
        runSpeechSynthesis(text, gender, () => setPlayingVoiceId(null));
      });
      setCurrentAudio(audio);
    } else {
      runSpeechSynthesis(text, gender, () => setPlayingVoiceId(null));
    }
  }, [voices, currentAudio, playingVoiceId, runSpeechSynthesis]);

  return {
    playingVoiceId,
    playVoicePreview,
    stopAudio: () => {
      if (currentAudio) currentAudio.pause();
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
      setPlayingVoiceId(null);
    }
  };
}
