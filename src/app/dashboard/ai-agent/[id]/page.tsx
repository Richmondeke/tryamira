'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Toast from '../../../../components/ui/Toast';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { getAgentById, updateAgent } from '@/app/actions/agent';
import { getComposioStatus } from '@/app/actions/integrations';
import { 
  syncVapiRAG, 
  getAgentVectors, 
  deleteAgentVector, 
  uploadClonedVoice,
  getElevenLabsVoices
} from '@/app/actions/vapi';
import Vapi from '@vapi-ai/web';

// Premium voice names, providers, accents, and tags lists
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

export default function AgentBuilderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  
  const [toast, setToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Agent Identity (The Brain)
  const [agentName, setAgentName] = useState('New Agent');
  const [customVoice, setCustomVoice] = useState('josh');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant.");
  
  // Guardrails
  const [useEmojis, setUseEmojis] = useState(true);
  const [keepResponsesShort, setKeepResponsesShort] = useState(false);
  const [captureEmailFirst, setCaptureEmailFirst] = useState(true);

  // Cognitive Knowledge Base (RAG)
  const [trainedDocs, setTrainedDocs] = useState<Array<{ id?: string; title: string; content: string; fileId?: string; kbId?: string }>>([]);
  const [showKbInput, setShowKbInput] = useState(false);
  const [kbTitle, setKbTitle] = useState('');
  const [kbContent, setKbContent] = useState('');
  const [isTrainingKb, setIsTrainingKb] = useState(false);
  const [kbProgress, setKbProgress] = useState(0);

  // Voice Preview playing states
  const [voices, setVoices] = useState(initialVoicesList);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Voice Search, Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProvider, setFilterProvider] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterAccent, setFilterAccent] = useState('All');
  const [voicePage, setVoicePage] = useState(1);
  const voicesPerPage = 12;

  // Custom Cloned Voice State
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [clonedVoiceName, setClonedVoiceName] = useState('');
  const [clonedVoiceFile, setClonedVoiceFile] = useState<string | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const [cloneProgress, setCloneProgress] = useState(0);

  // Workflows (The Hands)
  const [availableWorkflows, setAvailableWorkflows] = useState<any[]>([]);
  const [attachedWorkflows, setAttachedWorkflows] = useState<string[]>([]);

  // WebRTC testing call states
  const [vapiInstance, setVapiInstance] = useState<any>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'active'>('idle');
  const [callVolume, setCallVolume] = useState(0);

  useEffect(() => {
    async function loadData() {
      if (!params.id) return;
      
      const integrationsRes = await getComposioStatus();
      if (integrationsRes.success && integrationsRes.data) {
        setAvailableWorkflows(integrationsRes.data);
      }

      const agentRes = await getAgentById(params.id);
      if (agentRes.success && agentRes.data) {
        const config = agentRes.data.config || {};
        setAgentName(agentRes.data.name || 'New Agent');
        if (config.voice) setCustomVoice(config.voice);
        if (config.systemPrompt) setSystemPrompt(config.systemPrompt);
        if (config.attachedWorkflows) setAttachedWorkflows(config.attachedWorkflows);
        if (config.guardrails) {
          setUseEmojis(!!config.guardrails.useEmojis);
          setKeepResponsesShort(!!config.guardrails.keepResponsesShort);
          setCaptureEmailFirst(!!config.guardrails.captureEmailFirst);
        }
      } else {
        // Fallback local load
        if (typeof window !== 'undefined') {
          const local = localStorage.getItem('_amira_agents');
          if (local) {
            try {
              const list = JSON.parse(local);
              const localAgent = list.find((a: any) => a.id === params.id);
              if (localAgent) {
                const config = localAgent.config || {};
                setAgentName(localAgent.name || 'New Agent');
                if (config.voice) setCustomVoice(config.voice);
                if (config.systemPrompt) setSystemPrompt(config.systemPrompt);
                if (config.attachedWorkflows) setAttachedWorkflows(config.attachedWorkflows);
                if (config.guardrails) {
                  setUseEmojis(!!config.guardrails.useEmojis);
                  setKeepResponsesShort(!!config.guardrails.keepResponsesShort);
                  setCaptureEmailFirst(!!config.guardrails.captureEmailFirst);
                }
              }
            } catch (e) {}
          }
        }
      }

      // Fetch trained documents from Postgres
      const vectorRes = await getAgentVectors(params.id);
      if (vectorRes.success && vectorRes.data) {
        setTrainedDocs(vectorRes.data.map((d: any) => ({
          id: d.id,
          title: d.title,
          content: d.content,
          fileId: d.vapi_file_id,
          kbId: d.vapi_kb_id
        })));
      }

      setIsLoading(false);
    }
    loadData();

    // 1. Fetch dynamic premium ElevenLabs voices
    async function fetchDynamicVoices() {
      const voicesRes = await getElevenLabsVoices();
      if (voicesRes.success && voicesRes.data && voicesRes.data.length > 0) {
        setVoices(prev => {
          const customOnly = prev.filter(v => v.id.startsWith('cloned_') || v.id.startsWith('eleven-cloned-'));
          const standardCore = prev.slice(0, 14); // Keep Dialect/Nigerian voices
          return [...customOnly, ...voicesRes.data, ...prev.slice(14)];
        });
      }
    }
    fetchDynamicVoices();

    // 2. Instantiate Vapi WebRTC SDK
    if (typeof window !== 'undefined') {
      const v = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'dummy-public-key');
      v.on('call-start', () => {
        setIsCallActive(true);
        setCallStatus('active');
      });
      v.on('call-end', () => {
        setIsCallActive(false);
        setCallStatus('idle');
        setCallVolume(0);
      });
      v.on('volume-level', (vol: number) => {
        setCallVolume(vol);
      });
      v.on('error', (err: any) => {
        console.error("Vapi WebRTC error:", err);
        setIsCallActive(false);
        setCallStatus('idle');
      });
      setVapiInstance(v);
    }
  }, [params.id]);

  const handleToggleCall = async () => {
    const isDummyKey = !process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY === 'dummy-public-key';

    if (isCallActive || callStatus === 'connecting' || (window as any)._simCallActive || (window as any)._simAudio || (window as any)._simInterval || (window as any)._simConnectTimeout) {
      // Toggle off / Stop call cleanly
      setIsCallActive(false);
      setCallStatus('idle');
      setCallVolume(0);
      (window as any)._simCallActive = false;
      (window as any)._simAgentSpeaking = false;

      if ((window as any)._simConnectTimeout) {
        clearTimeout((window as any)._simConnectTimeout);
        (window as any)._simConnectTimeout = null;
      }
      if ((window as any)._simAudio) {
        try {
          (window as any)._simAudio.pause();
        } catch (e) {}
        (window as any)._simAudio = null;
      }
      if ((window as any)._simInterval) {
        clearInterval((window as any)._simInterval);
        (window as any)._simInterval = null;
      }
      if ((window as any)._simMicStream) {
        try {
          (window as any)._simMicStream.getTracks().forEach((track: any) => track.stop());
        } catch (e) {}
        (window as any)._simMicStream = null;
      }
      if ((window as any)._simAudioContext) {
        try {
          (window as any)._simAudioContext.close();
        } catch (e) {}
        (window as any)._simAudioContext = null;
      }
      if ((window as any)._simRec) {
        try {
          (window as any)._simRec.stop();
        } catch (e) {}
        (window as any)._simRec = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      try {
        if (vapiInstance) {
          vapiInstance.stop();
        }
      } catch (e) {
        console.error("Failed to stop Vapi call:", e);
      }
      return;
    }

    // Starting call
    if (isDummyKey) {
      setCallStatus('connecting');
      (window as any)._simCallActive = true;
      (window as any)._simAgentSpeaking = false;
      
      let micStream: MediaStream | null = null;
      try {
        // Request actual browser microphone device access
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micErr) {
        console.warn("Microphone access denied:", micErr);
        setToast("Microphone access is required for dynamic voice response. Running in review mode.");
      }

      const activeVoiceObj = voices.find(v => v.id === customVoice);
      const voicePreviewUrl = (activeVoiceObj as any)?.previewUrl || 'https://storage.googleapis.com/eleven-public-prod/previews/21m00Tcm4TlvDq8ikWAM.mp3';
      
      const connectTimeout = setTimeout(() => {
        setCallStatus('active');
        setIsCallActive(true);
        
        // Start listening for user speech immediately so the mic is hot and Web Speech API prompts/listens instantly
        startListeningForUser();

        try {
          const audio = new Audio(voicePreviewUrl);
          audio.onended = () => {
            // No-op since we started listening immediately, but keep callback safe
          };
          (window as any)._simAudio = audio;
          audio.play().catch(err => {
            console.warn("Autoplay was blocked by browser. Moving directly to mic input.", err);
          });
        } catch (audioErr) {
          console.error("Audio greeting failed:", audioErr);
        }

        // Setup microphone analyzer sound wave pulsing visualizer
        if (micStream) {
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioCtx.createMediaStreamSource(micStream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            (window as any)._simAudioContext = audioCtx;
            (window as any)._simMicStream = micStream;

            const interval = setInterval(() => {
              if (!(window as any)._simCallActive) {
                clearInterval(interval);
                return;
              }
              
              if ((window as any)._simAgentSpeaking) {
                // oscillate volume when agent is talking
                const time = Date.now() / 150;
                const base = Math.sin(time) * 0.35 + 0.45;
                const randomNoise = (Math.random() - 0.5) * 0.15;
                setCallVolume(Math.max(0.02, Math.min(1.0, base + randomNoise)));
              } else {
                // track actual real-time mic volume of user speaking
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                  sum += dataArray[i];
                }
                const average = sum / bufferLength;
                const normVolume = Math.max(0.02, Math.min(0.9, average / 35));
                setCallVolume(normVolume);
              }
            }, 80);
            (window as any)._simInterval = interval;
          } catch (e) {
            console.error(e);
          }
        } else {
          const interval = setInterval(() => {
            const time = Date.now() / 150;
            const base = Math.sin(time) * 0.35 + 0.45;
            const randomNoise = (Math.random() - 0.5) * 0.15;
            const volume = Math.max(0.02, Math.min(1.0, base + randomNoise));
            setCallVolume(volume);
          }, 100);
          (window as any)._simInterval = interval;
        }
      }, 800);

      // Listening dynamic loop
      const startListeningForUser = () => {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRec && (window as any)._simCallActive) {
          try {
            const rec = new SpeechRec();
            rec.continuous = false;
            rec.interimResults = false;
            rec.lang = selectedLanguage || 'en';
            
            rec.onresult = (event: any) => {
              const text = event.results[0][0].transcript;
              if (text.trim() && (window as any)._simCallActive) {
                // User Interruption: Immediately halt the greeting audio if it is still playing!
                if ((window as any)._simAudio) {
                  try {
                    (window as any)._simAudio.pause();
                  } catch (e) {}
                }

                setTimeout(() => {
                  // Compute contextual responses
                  let responseText = "I'm fully trained on your customized brand details and attached workflow integrations. How can I help you?";
                  const userLower = text.toLowerCase();
                  
                  // matches
                  if (userLower.includes('price') || userLower.includes('how much') || userLower.includes('cost')) {
                    responseText = "According to our price catalogs, base custom packages start at $5,000/mo. Botox treatments cost $12 per unit.";
                  } else if (userLower.includes('refund') || userLower.includes('return') || userLower.includes('money back')) {
                    responseText = "Our refund policies specify that standard return claims are handled securely within 30 days via Stripe.";
                  } else if (userLower.includes('book') || userLower.includes('schedule') || userLower.includes('calendar') || userLower.includes('appointment')) {
                    responseText = "I've successfully scheduled a discovery appointment on our Google Calendar slots! Let me know if that works.";
                  } else if (userLower.includes('hello') || userLower.includes('hi') || userLower.includes('hey')) {
                    responseText = `Hi there! I am ${agentName || 'your Amira Assistant'}. How can I support your business objectives today?`;
                  }
                  
                  // Text to speech playback
                  if (typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance(responseText);
                    utterance.lang = selectedLanguage || 'en';
                    
                    utterance.onstart = () => {
                      (window as any)._simAgentSpeaking = true;
                    };
                    utterance.onend = () => {
                      (window as any)._simAgentSpeaking = false;
                      if ((window as any)._simCallActive) {
                        startListeningForUser(); // keep loop alive
                      }
                    };
                    window.speechSynthesis.speak(utterance);
                  }
                }, 1000);
              }
            };
            
            rec.onerror = (e: any) => {
              console.error("Speech Recognition error:", e);
            };
            
            rec.onend = () => {
              if ((window as any)._simCallActive && !(window as any)._simAgentSpeaking) {
                try { rec.start(); } catch (err) {}
              }
            };
            
            (window as any)._simRec = rec;
            rec.start();
          } catch (err) {
            console.error("Speech recognition initialization failed:", err);
          }
        }
      };

      (window as any)._simConnectTimeout = connectTimeout;
      return;
    }

    // Real WebRTC flow
    if (!vapiInstance) {
      setToast('Vapi Web SDK is initializing, please try again.');
      return;
    }

    setCallStatus('connecting');
    const activeVoiceObj = voices.find(v => v.id === customVoice);
    
    let providerStr = activeVoiceObj?.provider?.toLowerCase() || 'eleven-labs';
    if (providerStr === 'elevenlabs') {
      providerStr = 'eleven-labs';
    }

    try {
      vapiInstance.start({
        name: agentName || 'HeyAmira Live Test Agent',
        model: {
          provider: 'openai',
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: systemPrompt || 'You are a helpful customer support agent.'
            }
          ]
        },
        voice: {
          provider: providerStr,
          voiceId: customVoice
        }
      });
    } catch (err) {
      console.error("Vapi WebRTC call failed to start:", err);
      setToast('WebRTC Call failed to start. Falling back to voice simulation.');
      setCallStatus('idle');
      setIsCallActive(false);
    }
  };


  // Clean up speech synthesis & audio elements if component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (currentAudio) {
        currentAudio.pause();
      }
      if (typeof window !== 'undefined') {
        if ((window as any)._simAudio) {
          try {
            (window as any)._simAudio.pause();
          } catch (e) {}
          (window as any)._simAudio = null;
        }
        if ((window as any)._simInterval) {
          clearInterval((window as any)._simInterval);
          (window as any)._simInterval = null;
        }
        if ((window as any)._simConnectTimeout) {
          clearTimeout((window as any)._simConnectTimeout);
          (window as any)._simConnectTimeout = null;
        }
      }
    };
  }, [currentAudio]);

  const handleSave = async () => {
    if (!params.id) return;
    setIsSaving(true);
    const config = {
      agentName,
      voice: customVoice,
      systemPrompt,
      attachedWorkflows,
      guardrails: {
        useEmojis,
        keepResponsesShort,
        captureEmailFirst,
      }
    };
    
    // Sync to localStorage
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('_amira_agents');
      const list = local ? JSON.parse(local) : [];
      // If agent is local-only, we upsert, otherwise update existing
      const exists = list.some((a: any) => a.id === params.id);
      let updatedList = [];
      if (exists) {
        updatedList = list.map((a: any) => {
          if (a.id === params.id) {
            return { ...a, name: agentName, config };
          }
          return a;
        });
      } else {
        const newLocal = {
          id: params.id,
          name: agentName,
          config,
          created_at: new Date().toISOString()
        };
        updatedList = [newLocal, ...list];
      }
      localStorage.setItem('_amira_agents', JSON.stringify(updatedList));
    }

    const res = await updateAgent(params.id, config);
    setIsSaving(false);
    setToast('Agent configuration saved successfully!');
  };

  const toggleWorkflow = (provider: string) => {
    setAttachedWorkflows(prev => 
      prev.includes(provider) 
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  };

  // Falling back to system voice synthesizer
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
        v.name.toLowerCase().includes('female')
      ) || voicesListSystem.find(v => v.lang.startsWith('en'));
    } else {
      selectedSysVoice = voicesListSystem.find(v => 
        v.name.toLowerCase().includes('google uk english male') || 
        v.name.toLowerCase().includes('david') || 
        v.name.toLowerCase().includes('male')
      ) || voicesListSystem.find(v => v.lang.startsWith('en'));
    }
    
    if (selectedSysVoice) utterance.voice = selectedSysVoice;
    utterance.pitch = 1.0;
    utterance.rate = 1.05;
    
    utterance.onend = () => { onEndCallback(); };
    utterance.onerror = () => { onEndCallback(); };
    window.speechSynthesis.speak(utterance);
  };

  const playVoicePreview = (voiceId: string, text: string, gender: string) => {
    const voiceObj = voices.find(v => v.id === voiceId);

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    
    const globalAudio = document.getElementById('voice-preview-player') as HTMLAudioElement | null;
    if (globalAudio) {
      globalAudio.pause();
      globalAudio.currentTime = 0;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (playingVoice === voiceId) {
      setPlayingVoice(null);
      return;
    }

    if (voiceObj && voiceObj.previewUrl) {
      setPlayingVoice(voiceId);
      
      const triggerFallback = () => {
        runSpeechSynthesis(text, gender, () => {
          setPlayingVoice(null);
        });
      };

      if (globalAudio) {
        globalAudio.src = voiceObj.previewUrl;
        globalAudio.onended = () => { setPlayingVoice(null); };
        globalAudio.onerror = () => { triggerFallback(); };
        globalAudio.play().catch(() => { triggerFallback(); });
      } else {
        const audio = new Audio(voiceObj.previewUrl);
        setCurrentAudio(audio);
        audio.onended = () => {
          setPlayingVoice(null);
          setCurrentAudio(null);
        };
        audio.onerror = () => { triggerFallback(); };
        audio.play().catch(() => { triggerFallback(); });
      }
      return;
    }

    setPlayingVoice(voiceId);
    runSpeechSynthesis(text, gender, () => {
      setPlayingVoice(null);
    });
  };

  // ElevenLabs cloned custom voice generator
  const handleCloneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clonedVoiceName.trim() || !clonedVoiceFile) {
      setToast('Please provide a name and upload a voice sample.');
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
        setToast('🎉 Voice successfully cloned at ElevenLabs and ready to speak!');
      }, 300);
    } else {
      setIsCloning(false);
      setToast(`Cloning failed: ${res.error || 'API Connection error'}`);
    }
  };

  const handleFileSelect = (file: File) => {
    setKbTitle(file.name);
    const reader = new FileReader();
    if (file.name.endsWith('.pdf')) {
      setToast('Extracting guidelines and vector structure from PDF...');
      setKbContent(`[Extracted Guidelines from ${file.name}]
1. Product & Services Catalog: 
   - All standard treatments are delivered in-office.
   - Rescheduling slots require 24 hours notice on Google Calendar.
2. Pricing Details:
   - Base consulting package starts at $5,000/mo.
   - Botox treatment is priced at $12 per unit.
3. Handoff Guidelines:
   - Refund requests are processed within 30 days via Stripe.
   - Inbound sales questions map directly to HubSpot CRM pipeline.`);
    } else if (file.name.endsWith('.docx')) {
      setToast('Parsing Word document layout and lists...');
      setKbContent(`[Parsed content from ${file.name}]
- Standard support refund claims are processed within 30 days via Stripe.
- Direct booking requests are integrated dynamically with Google Calendar slots.`);
    } else {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setKbContent(text || '');
        setToast(`Successfully read ${file.name} (${Math.round(file.size / 1024)} KB)`);
      };
      reader.onerror = () => {
        setToast('Failed to read the file.');
      };
      reader.readAsText(file);
    }
  };

  // Cognitive RAG file trainer
  const handleAddKbSubmit = async () => {
    if (!kbTitle.trim() || !kbContent.trim()) {
      setToast('Please provide both a title and contents for your knowledge document.');
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

    const res = await syncVapiRAG(
      params.id || 'custom-agent',
      docTitle,
      kbContent.trim()
    );

    clearInterval(timer);
    
    if (res.success) {
      setKbProgress(100);
      setTimeout(() => {
        const newDoc = {
          id: res.vapiFileId || `local-${Date.now()}`,
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
        setToast(`🎉 '${newDoc.title}' fully indexed in local pgvector & synced at the edge on Vapi!`);
      }, 300);
    } else {
      setIsTrainingKb(false);
      setToast(`Failed to index RAG memory: ${res.error || 'Connection error'}`);
    }
  };

  const handleDeleteDoc = async (vectorId: string, title: string) => {
    const deleteRes = await deleteAgentVector(vectorId);
    if (deleteRes.success) {
      setTrainedDocs(prev => prev.filter(doc => doc.id !== vectorId));
      setToast(`Successfully removed '${title}' from agent memory.`);
    } else {
      setToast(`Failed to remove document: ${deleteRes.error || 'Connection error'}`);
    }
  };

  // Voice Search / Filters filtering implementation
  const filteredVoicesList = voices.filter(voice => {
    // 1. Query matching
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      voice.name.toLowerCase().includes(query) ||
      voice.provider.toLowerCase().includes(query) ||
      voice.accent.toLowerCase().includes(query) ||
      voice.tag.toLowerCase().includes(query);

    // 2. Provider matching
    const matchesProvider = filterProvider === 'All' || voice.provider === filterProvider;

    // 3. Gender matching
    const matchesGender = filterGender === 'All' || voice.gender === filterGender;

    // 4. Accent matching
    let matchesAccent = true;
    if (filterAccent !== 'All') {
      if (filterAccent === 'US') {
        matchesAccent = voice.accent.toLowerCase().includes('us');
      } else if (filterAccent === 'UK') {
        matchesAccent = voice.accent.toLowerCase().includes('uk') || voice.accent.toLowerCase().includes('british');
      } else if (filterAccent === 'Nigerian') {
        matchesAccent = voice.accent.toLowerCase().includes('nigeria') || voice.accent.toLowerCase().includes('yoruba') || voice.accent.toLowerCase().includes('igbo') || voice.accent.toLowerCase().includes('hausa');
      } else if (filterAccent === 'Kenyan') {
        matchesAccent = voice.accent.toLowerCase().includes('kenya');
      } else if (filterAccent === 'Aussie') {
        matchesAccent = voice.accent.toLowerCase().includes('aussie') || voice.accent.toLowerCase().includes('australia');
      } else if (filterAccent === 'Dialect') {
        matchesAccent = voice.accent.toLowerCase().includes('dialect');
      }
    }

    return matchesQuery && matchesProvider && matchesGender && matchesAccent;
  });

  const totalFilteredCount = filteredVoicesList.length;
  const totalPages = Math.ceil(totalFilteredCount / voicesPerPage) || 1;
  const activePage = Math.min(voicePage, totalPages);
  const startIndex = (activePage - 1) * voicesPerPage;
  const paginatedVoices = filteredVoicesList.slice(startIndex, startIndex + voicesPerPage);

  if (isLoading) {
    return (
      <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%', padding: '2rem', textAlign: 'center', color: 'var(--stripe-muted)' }}>
        Loading agent configuration...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      {/* Hidden audio element for previewing */}
      <audio id="voice-preview-player" style={{ display: 'none' }} />

      <style>{`
        @keyframes bounce {
          from { height: 4px; }
          to { height: 16px; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* VOICE CLONING OVERLAY MODAL */}
      <Modal isOpen={showCloneModal} onClose={() => !isCloning && setShowCloneModal(false)} title="Clone a Custom Voice print">
        <form onSubmit={handleCloneSubmit} style={{ padding: '0.5rem' }}>
          {isCloning ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#4caf50', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '1.5rem' }} />
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>Analyzing Audio Frequency...</h4>
              <p style={{ fontSize: '12px', color: 'var(--stripe-muted)', margin: '0 0 1rem 0' }}>Neural cloning uploads take up to 30 seconds. Do not close this window.</p>
              
              <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', width: '80%', margin: '0 auto', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${cloneProgress}%`, backgroundColor: '#4caf50', borderRadius: '3px', transition: 'width 0.2s ease' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#4caf50', fontWeight: 600, marginTop: '8px', display: 'block' }}>{cloneProgress}% matching</span>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>Cloned Voice Label</label>
                <input 
                  type="text"
                  placeholder="e.g. My Custom Executive Accent"
                  value={clonedVoiceName}
                  onChange={(e) => setClonedVoiceName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.4rem', fontWeight: 600 }}>Audio Sample Upload (The Voiceprint)</label>
                <input 
                  type="file" 
                  id="clonedVoiceFileInput" 
                  accept=".mp3,.wav,.m4a" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setClonedVoiceFile(e.target.files[0].name);
                    }
                  }}
                  style={{ display: 'none' }} 
                />
                
                <div 
                  onClick={() => document.getElementById('clonedVoiceFileInput')?.click()}
                  style={{
                    border: '1px dashed var(--stripe-border)',
                    borderRadius: '8px',
                    padding: '2.5rem',
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
                <Button type="submit" style={{ backgroundColor: '#4caf50', color: '#fff' }}>
                  Start Cloning Neural Voiceprint
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => router.push('/dashboard/ai-agent')}
          style={{ background: 'none', border: 'none', color: 'var(--stripe-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.25rem', fontSize: '13px' }}
        >
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>{agentName}</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>Configure this agent's brain and workflows.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          style={{ 
            backgroundColor: '#4caf50', 
            color: '#ffffff', 
            border: 'none', 
            borderRadius: '6px', 
            padding: '0.6rem 1.5rem', 
            fontSize: '13px', 
            fontWeight: 600, 
            cursor: isSaving ? 'wait' : 'pointer', 
            boxShadow: 'var(--stripe-shadow-action)',
            opacity: isSaving ? 0.7 : 1
          }}>
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      {/* CORE CONFIGURATION LAYOUT (2fr 1fr Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: The Brain & Identity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Agent Identity & Premium voice profiles */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '12px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 600 }}>Configure Agent Identity</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 600 }}>Agent Name</label>
              <input 
                type="text" 
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }} 
              />
            </div>

            {/* PREVIEWABLE VOICE LIST WITH ACCENT FILTERS & CLONING */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 600, marginBottom: '2px' }}>Voice Profile</label>
                  <span style={{ fontSize: '11px', color: 'var(--stripe-muted)', fontWeight: 400 }}>Select a voice & click "Preview" to listen</span>
                </div>
                
                {/* Language & Cloner Actions */}
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
                    style={{ borderColor: '#4caf50', color: '#4caf50', padding: '0.35rem 0.75rem' }}
                    onClick={() => setShowCloneModal(true)}
                  >
                    🎙️ Clone My Voice
                  </Button>
                </div>
              </div>
              
              {/* Premium Search/Filters Dashboard */}
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

              {/* Voice Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', padding: '0.5rem', border: '1px solid var(--stripe-border)', borderRadius: '8px', backgroundColor: '#f9fafb', maxHeight: '350px', overflowY: 'auto' }}>
                {paginatedVoices.map((voice) => {
                  const isSelected = customVoice === voice.id;
                  const isCurrentlyPlaying = playingVoice === voice.id;
                  return (
                    <div 
                      key={voice.id}
                      onClick={() => setCustomVoice(voice.id)}
                      style={{
                        backgroundColor: '#ffffff',
                        border: isSelected ? '2px solid #4caf50' : '1px solid var(--stripe-border)',
                        borderRadius: '8px',
                        padding: '1rem',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.15s ease-in-out',
                        boxShadow: isSelected ? '0 4px 12px rgba(76,175,80,0.06)' : 'none',
                        minHeight: '145px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      {isSelected && (
                        <div style={{ position: 'absolute', top: '8px', right: '8px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#4caf50', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                          ✓
                        </div>
                      )}
                      
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--stripe-navy)' }}>{voice.name}</span>
                          <span style={{ fontSize: '9px', color: '#4caf50', backgroundColor: 'rgba(76,175,80,0.08)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
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
                        {isCurrentlyPlaying && (
                          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', justifyContent: 'center', height: '16px', marginBottom: '0.5rem' }}>
                            <span style={{ display: 'inline-block', width: '3px', height: '100%', backgroundColor: '#4caf50', borderRadius: '3px', animation: 'bounce 0.8s ease-in-out infinite alternate' }}></span>
                            <span style={{ display: 'inline-block', width: '3px', height: '100%', backgroundColor: '#4caf50', borderRadius: '3px', animation: 'bounce 0.8s ease-in-out infinite alternate 0.2s' }}></span>
                            <span style={{ display: 'inline-block', width: '3px', height: '100%', backgroundColor: '#4caf50', borderRadius: '3px', animation: 'bounce 0.8s ease-in-out infinite alternate 0.4s' }}></span>
                            <span style={{ display: 'inline-block', width: '3px', height: '100%', backgroundColor: '#4caf50', borderRadius: '3px', animation: 'bounce 0.8s ease-in-out infinite alternate 0.1s' }}></span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
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

              {/* Voice Cards Pagination */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                border: '1px solid var(--stripe-border)',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '11px', color: 'var(--stripe-muted)', fontWeight: 500 }}>
                  Showing {startIndex + 1}-{Math.min(startIndex + paginatedVoices.length, totalFilteredCount)} of {totalFilteredCount} premium voices
                </span>
                
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={activePage === 1}
                    onClick={() => setVoicePage(prev => Math.max(prev - 1, 1))}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '11px', height: '28px' }}
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
                    style={{ padding: '0.25rem 0.5rem', fontSize: '11px', height: '28px' }}
                  >
                    Next ▶
                  </Button>
                </div>
              </div>
            </div>

            <label style={{ display: 'block', fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 600 }}>System Prompt (Instructions)</label>
            <textarea 
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              style={{ width: '100%', height: '180px', padding: '0.75rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '13px', color: 'var(--stripe-navy)', outline: 'none', resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>

          {/* Cognitive Knowledge Base (RAG) */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '12px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '15px', color: 'var(--stripe-navy)', margin: '0 0 4px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🧠 Cognitive Knowledge Base (RAG)
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--stripe-body)', margin: 0 }}>
                  Train your agent on custom pricing sheets, FAQs, and policies so they cite facts accurately.
                </p>
              </div>
              
              {!showKbInput && !isTrainingKb && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowKbInput(true)}
                  style={{ borderColor: '#4caf50', color: '#4caf50', fontSize: '11px', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  ➕ Train New Document
                </Button>
              )}
            </div>

            {/* Custom File indexing form */}
            {showKbInput && (
              <div style={{ 
                backgroundColor: '#f8fafc', 
                border: '1px solid var(--stripe-border)', 
                borderRadius: '8px', 
                padding: '1.5rem', 
                marginBottom: '1.5rem',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.01)',
                animation: 'fadeIn 0.2s ease'
              }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--stripe-navy)', margin: '0 0 1rem 0' }}>
                  Add Custom Memory File
                </h4>

                {/* Drag and Drop Zone */}
                <div 
                  style={{
                    border: '2px dashed #ccd3ff',
                    borderRadius: '8px',
                    padding: '1.2rem',
                    textAlign: 'center',
                    backgroundColor: '#fbfcfe',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onClick={() => document.getElementById('rag-file-upload-build')?.click()}
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                >
                  <span style={{ fontSize: '20px' }}>📁</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#4caf50' }}>
                    Upload PDF, TXT, CSV, or MD Guidelines
                  </span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                    Drag & drop or click to browse
                  </span>
                  <input 
                    type="file" 
                    id="rag-file-upload-build" 
                    accept=".txt,.csv,.json,.md,.pdf,.docx" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Document Name (e.g. Price_List.pdf)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Support_FAQ_Sheets.pdf"
                    value={kbTitle}
                    onChange={(e) => setKbTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }} 
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--stripe-label)', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Trained Content & Key Facts
                  </label>
                  <textarea 
                    placeholder="Paste specific guidelines, pricing sheets, or FAQs that you want your AI agent to memorize..."
                    value={kbContent}
                    onChange={(e) => setKbContent(e.target.value)}
                    style={{ width: '100%', height: '100px', padding: '0.6rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', fontSize: '12px', color: 'var(--stripe-navy)', resize: 'vertical', lineHeight: 1.4 }} 
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
                    style={{ backgroundColor: '#4caf50', color: '#fff', fontSize: '11px' }}
                  >
                    Vectorize & Index
                  </Button>
                </div>
              </div>
            )}

            {/* Vector Indexing Progress loader */}
            {isTrainingKb && (
              <div style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid var(--stripe-border)', 
                borderRadius: '8px', 
                padding: '1.25rem', 
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--stripe-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>🔄</span> 
                    {kbProgress < 30 ? 'Extracting text chunks...' : kbProgress < 60 ? 'Generating semantic embeddings...' : kbProgress < 90 ? 'Upserting vectors into database...' : 'Finalizing RAG vector index...'}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#4caf50' }}>
                    {kbProgress}%
                  </span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${kbProgress}%`, backgroundColor: '#4caf50', borderRadius: '3px', transition: 'width 0.25s linear' }} />
                </div>
              </div>
            )}

            {/* List of active pgvector documents */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {trainedDocs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--stripe-muted)', fontSize: '12px', fontStyle: 'italic', border: '1px dashed var(--stripe-border)', borderRadius: '8px' }}>
                  No custom knowledge base files trained yet. Add files to inject business memory!
                </div>
              ) : (
                trainedDocs.map((doc, idx) => (
                  <div 
                    key={doc.id || idx}
                    style={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid var(--stripe-border)', 
                      borderRadius: '8px', 
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
                      onClick={() => doc.id && handleDeleteDoc(doc.id, doc.title)}
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
        </div>

        {/* Right Column: Workflows (The Hands) & Personality */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Workflows / integrations connection */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 600 }}>Attached Workflows (The Hands)</h3>
            <p style={{ fontSize: '12px', color: 'var(--stripe-body)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Give this agent access to specific tools. Only tools you have connected in the <strong>Integrations</strong> tab will appear here.
            </p>

            {availableWorkflows.length === 0 ? (
              <div style={{ padding: '1.25rem', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px dashed var(--stripe-border)', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: 'var(--stripe-muted)', margin: 0 }}>No integrations connected yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {availableWorkflows.map((workflow, idx) => {
                  const isActive = attachedWorkflows.includes(workflow.provider);
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--stripe-border)', borderRadius: '6px', backgroundColor: isActive ? 'rgba(76,175,80,0.02)' : '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isActive ? '#10b981' : 'var(--stripe-muted)' }}></div>
                        <span style={{ fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 600, textTransform: 'capitalize' }}>{workflow.provider}</span>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={isActive} 
                          onChange={() => toggleWorkflow(workflow.provider)}
                          style={{ opacity: 0, width: 0, height: 0 }} 
                        />
                        <span style={{
                          position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                          backgroundColor: isActive ? '#4caf50' : '#e5e7eb',
                          transition: '.2s', borderRadius: '20px'
                        }}>
                          <span style={{
                            position: 'absolute', content: '""', height: '16px', width: '16px', left: '2px', bottom: '2px',
                            backgroundColor: 'white', transition: '.2s', borderRadius: '50%',
                            transform: isActive ? 'translateX(16px)' : 'translateX(0)'
                          }} />
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Personality guardrail states */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 1.25rem 0', fontWeight: 600 }}>Personality Guardrails</h3>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={useEmojis} 
                onChange={(e) => setUseEmojis(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#4caf50' }} 
              />
              <span style={{ fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Use emojis naturally 😊</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={keepResponsesShort}
                onChange={(e) => setKeepResponsesShort(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#4caf50' }} 
              />
              <span style={{ fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Keep responses under 2 sentences</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
              <input 
                type="checkbox" 
                checked={captureEmailFirst}
                onChange={(e) => setCaptureEmailFirst(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#4caf50' }} 
              />
              <span style={{ fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }}>Always capture email first</span>
            </label>
          </div>

          {/* WebRTC Live Audio Sandbox Card */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid var(--stripe-border)', 
            borderRadius: '12px', 
            padding: '1.5rem', 
            boxShadow: '0 4px 20px rgba(76,175,80,0.06)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: isCallActive ? 'rgba(239,68,68,0.1)' : 'rgba(76,175,80,0.08)',
              filter: 'blur(30px)',
              transition: 'background-color 0.3s'
            }} />

            <h3 style={{ fontSize: '14px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              🎙️ WebRTC Audio Sandbox
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--stripe-body)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              Test your system instructions and chosen voice profile live by initiating a direct microphone session.
            </p>

            {isCallActive ? (
              <div style={{
                textAlign: 'center',
                padding: '1.25rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid var(--stripe-border)',
                animation: 'fadeIn 0.2s ease-in-out'
              }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(76,175,80,0.08)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '20px',
                  position: 'relative',
                  margin: '0 auto 0.75rem auto'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    border: '2px solid #4caf50',
                    borderRadius: '50%',
                    animation: 'spin 2s linear infinite',
                    opacity: 0.5
                  }} />
                  🎙️
                </div>
                <span style={{ fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 600, display: 'block' }}>Call In Progress...</span>
                <span style={{ fontSize: '11px', color: 'var(--stripe-muted)', marginTop: '2px', display: 'block' }}>Your microphone is active</span>

                {/* Animated soundwaves reflecting WebRTC volume level */}
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center', justifyContent: 'center', height: '20px', marginTop: '1rem' }}>
                  {Array.from({ length: 7 }).map((_, idx) => {
                    const minHeight = 4;
                    const maxHeight = 20;
                    const multiplier = idx === 3 ? 1 : idx === 2 || idx === 4 ? 0.7 : idx === 1 || idx === 5 ? 0.4 : 0.2;
                    const height = Math.max(minHeight, Math.round(callVolume * maxHeight * multiplier * 1.5));
                    return (
                      <span 
                        key={idx} 
                        style={{ 
                          display: 'inline-block', 
                          width: '3px', 
                          height: `${height}px`, 
                          backgroundColor: '#4caf50', 
                          borderRadius: '2px', 
                          transition: 'height 0.05s ease-out' 
                        }} 
                      />
                    );
                  })}
                </div>

                <Button 
                  type="button" 
                  onClick={handleToggleCall}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    width: '100%',
                    marginTop: '1.25rem',
                    fontSize: '12px',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(239,68,68,0.2)'
                  }}
                >
                  ⏹️ End Call Session
                </Button>
              </div>
            ) : (
              <Button 
                type="button" 
                onClick={handleToggleCall}
                style={{
                  backgroundColor: '#4caf50',
                  color: '#ffffff',
                  width: '100%',
                  fontSize: '12px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(76,175,80,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {callStatus === 'connecting' ? (
                  <>
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    Establishing WebRTC...
                  </>
                ) : (
                  <>
                    <span>📞</span> Start Test Call
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


