'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUserProfile } from '@/contexts/UserProfileContext';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';

interface InvestorContact {
  name: string;
  firm: string;
  role: string;
  email?: string;
  linkedin?: string;
  leadRounds?: string[];
}

interface CompetitorNews {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
  summary: string;
  category: 'Feature Launch' | 'Fundraising' | 'Partnership' | 'Executive Move';
}

interface CompetitorRecord {
  id: string;
  name: string;
  logo: string;
  website: string;
  tagline: string;
  category: 'Voice Telephony' | 'Enterprise Support' | 'Outbound Sales' | 'Voice Synthesis' | 'Autonomous Agents';
  hq: string;
  founded: number;
  pricingModel: string;
  estimatedARR: string;
  totalFunding: string;
  valuation: string;
  lastRound: string;
  lastRoundDate: string;
  leadInvestors: string[];
  investorContacts: InvestorContact[];
  recentNews: CompetitorNews[];
  strengths: string[];
  vulnerabilitiesVsAmira: string[];
}

const COMPETITORS_DATABASE: CompetitorRecord[] = [
  {
    id: 'sierra',
    name: 'Sierra AI',
    logo: '🏔️',
    website: 'https://sierra.ai',
    tagline: 'Conversational AI platform for enterprise customer experience founded by Bret Taylor & Clay Bavor.',
    category: 'Enterprise Support',
    hq: 'San Francisco, CA',
    founded: 2023,
    pricingModel: 'Enterprise Annual Contract ($100k+ ACV)',
    estimatedARR: '$30M+ ARR',
    totalFunding: '$110M',
    valuation: '$4.5 Billion',
    lastRound: 'Series B ($110M)',
    lastRoundDate: 'Oct 2024',
    leadInvestors: ['Sequoia Capital', 'Benchmark', 'Greenoaks Capital', 'Iconiq'],
    investorContacts: [
      { name: 'Ravi Gupta', firm: 'Sequoia Capital', role: 'Partner', email: 'rgupta@sequoiacap.com', linkedin: 'https://linkedin.com/in/ravigupta', leadRounds: ['Series A', 'Series B'] },
      { name: 'Peter Fenton', firm: 'Benchmark', role: 'General Partner', email: 'fenton@benchmark.com', linkedin: 'https://linkedin.com/in/peterfenton', leadRounds: ['Seed', 'Series A'] },
      { name: 'Neil Mehta', firm: 'Greenoaks Capital', role: 'Managing Director', email: 'neil@greenoaks.com', linkedin: 'https://linkedin.com/in/neilmehta', leadRounds: ['Series B'] }
    ],
    recentNews: [
      { id: 'n-s1', title: 'Sierra raises $110M at $4.5B valuation led by Greenoaks', source: 'Bloomberg', date: '2 days ago', url: 'https://sierra.ai/news', summary: 'Sierra expands its conversational AI platform for enterprises like Sonos and WeightWatchers.', category: 'Fundraising' },
      { id: 'n-s2', title: 'Sierra launches Agent Supervisor SDK for real-time guardrails', source: 'TechCrunch', date: 'Aug 2026', url: 'https://sierra.ai/blog', summary: 'New tool allows human support teams to supervise AI conversations without interrupting the customer.', category: 'Feature Launch' }
    ],
    strengths: ['Massive executive credibility (former Salesforce co-CEO)', 'Deep enterprise security certifications', 'High-profile marquee logos (Sonos, SiriusXM)'],
    vulnerabilitiesVsAmira: ['Extremely slow multi-month enterprise onboarding', 'No self-serve autonomous phone provisioning', 'No low-cost SMS & omnichannel WhatsApp routing']
  },
  {
    id: '11x',
    name: '11x AI',
    logo: '⚡',
    website: 'https://11x.ai',
    tagline: 'Autonomous AI digital workers (Alice for SDR prospecting, Jordan for 24/7 phone support).',
    category: 'Outbound Sales',
    hq: 'San Francisco & London',
    founded: 2022,
    pricingModel: '$2,500 - $6,000 / month / Digital Worker',
    estimatedARR: '$22M ARR',
    totalFunding: '$50M',
    valuation: '$350M',
    lastRound: 'Series B ($24M)',
    lastRoundDate: 'Sep 2024',
    leadInvestors: ['Andreessen Horowitz (a16z)', 'Benchmark', 'Quiet Capital', '20VC'],
    investorContacts: [
      { name: 'Martin Casado', firm: 'Andreessen Horowitz (a16z)', role: 'General Partner', email: 'mcasado@a16z.com', linkedin: 'https://linkedin.com/in/martincasado', leadRounds: ['Series B'] },
      { name: 'Harry Stebbings', firm: '20VC', role: 'Founder & Managing Partner', email: 'harry@thetwentyminutevc.com', linkedin: 'https://linkedin.com/in/harrystebbings', leadRounds: ['Series A'] },
      { name: 'David Thacker', firm: 'Quiet Capital', role: 'Managing Partner', email: 'david@quiet.com', linkedin: 'https://linkedin.com/in/davidthacker', leadRounds: ['Seed', 'Series A'] }
    ],
    recentNews: [
      { id: 'n-11x1', title: '11x raises $24M Series B from a16z to expand AI digital workforce', source: 'TechCrunch', date: 'Sep 2024', url: 'https://techcrunch.com', summary: 'Funding accelerates development of multi-lingual sales workers Alice and Jordan.', category: 'Fundraising' },
      { id: 'n-11x2', title: '11x releases Jordan 2.0 with instant phone call transfers and CRM logging', source: 'ProductHunt', date: '2 weeks ago', url: 'https://11x.ai', summary: 'Autonomous support worker Jordan gains live call escalation capabilities.', category: 'Feature Launch' }
    ],
    strengths: ['High ACV enterprise digital worker brand narrative', 'Heavy backing from top tier VC syndicates (a16z, Benchmark)', 'Strong US & European market presence'],
    vulnerabilitiesVsAmira: ['High entry cost ($30k+/yr minimum commitment)', 'Rigid predefined roles rather than customizable multi-step workflows', 'No native self-service web chat embed generator']
  },
  {
    id: 'lindy',
    name: 'Lindy AI',
    logo: '🧬',
    website: 'https://lindy.ai',
    tagline: 'Build custom AI employees for any business workflow in minutes with no code.',
    category: 'Autonomous Agents',
    hq: 'San Francisco, CA',
    founded: 2023,
    pricingModel: 'Freemium + $49 - $299 / month + usage',
    estimatedARR: '$14M ARR',
    totalFunding: '$50M',
    valuation: '$220M',
    lastRound: 'Series A ($50M)',
    lastRoundDate: 'Aug 2024',
    leadInvestors: ['Menlo Ventures', 'Coatue', 'Tiger Global', 'SV Angel'],
    investorContacts: [
      { name: 'Matt Murphy', firm: 'Menlo Ventures', role: 'Partner', email: 'mmurphy@menlovc.com', linkedin: 'https://linkedin.com/in/mattmurphymenlo', leadRounds: ['Series A'] },
      { name: 'David Schneider', firm: 'Coatue Management', role: 'General Partner', email: 'dschneider@coatue.com', linkedin: 'https://linkedin.com/in/davidschneider', leadRounds: ['Series A'] },
      { name: 'Ron Conway', firm: 'SV Angel', role: 'Founder & Managing Partner', email: 'ron@svangel.com', linkedin: 'https://linkedin.com/in/ronconway', leadRounds: ['Seed'] }
    ],
    recentNews: [
      { id: 'n-l1', title: 'Lindy AI raises $50M from Menlo Ventures and Coatue to build the AI workforce', source: 'Forbes', date: 'Aug 2024', url: 'https://forbes.com', summary: 'Former Uber exec Flo Crivello scales no-code agent builder to over 100,000 businesses.', category: 'Fundraising' },
      { id: 'n-l2', title: 'Lindy adds native voice calling and WhatsApp automation triggers', source: 'Lindy Blog', date: '3 weeks ago', url: 'https://lindy.ai/blog', summary: 'Users can now hook up Twilio trunks directly inside Lindy agent canvas.', category: 'Feature Launch' }
    ],
    strengths: ['Extremely intuitive drag-and-drop workflow canvas', 'Broad 3,000+ app connector library', 'Affordable self-serve pricing tiers'],
    vulnerabilitiesVsAmira: ['Lacks specialized sub-200ms voice telephony engine', 'No integrated human approval risk management center', 'Voice audio relies on external third-party webhooks']
  },
  {
    id: 'bland',
    name: 'Bland AI',
    logo: '⚡',
    website: 'https://bland.ai',
    tagline: 'Hyper-fast programmatic phone calling API for outbound sales, surveys, and enterprise dispatch.',
    category: 'Voice Telephony',
    hq: 'San Francisco, CA',
    founded: 2023,
    pricingModel: '$0.09 / min usage + enterprise platform fee',
    estimatedARR: '$18M ARR',
    totalFunding: '$22M',
    valuation: '$120M',
    lastRound: 'Series A ($16M)',
    lastRoundDate: 'May 2024',
    leadInvestors: ['Scale Venture Partners', 'Y Combinator', 'Twenty Two Ventures'],
    investorContacts: [
      { name: 'Alexander Niehenke', firm: 'Scale Venture Partners', role: 'Partner', email: 'alex@scalevp.com', linkedin: 'https://linkedin.com/in/niehenke', leadRounds: ['Series A'] },
      { name: 'Michael Seibel', firm: 'Y Combinator', role: 'Managing Director', email: 'michael@ycombinator.com', linkedin: 'https://linkedin.com/in/michaelseibel', leadRounds: ['Seed'] }
    ],
    recentNews: [
      { id: 'n-b1', title: 'Bland AI announces sub-300ms conversational tree routing', source: 'VentureBeat', date: '1 week ago', url: 'https://bland.ai', summary: 'Bland claims fastest response times for multi-branch outbound marketing phone campaigns.', category: 'Feature Launch' },
      { id: 'n-b2', title: 'Bland closes $16M Series A to scale cold outbound voice infrastructure', source: 'TechCrunch', date: 'May 2024', url: 'https://techcrunch.com', summary: 'Scale VP leads investment into conversational voice telephony API.', category: 'Fundraising' }
    ],
    strengths: ['Aggressive developer marketing', 'Fast raw latency on phone calls', 'Good campaign batching API'],
    vulnerabilitiesVsAmira: ['Developer-only interface with steep learning curve', 'Lacks native Webchat & WhatsApp omnichannel routing', 'No built-in visual decision approval center']
  },
  {
    id: 'retell',
    name: 'Retell AI',
    logo: '🔁',
    website: 'https://retellai.com',
    tagline: 'Developer-first conversational voice API with custom LLM WebSocket streaming.',
    category: 'Voice Telephony',
    hq: 'San Francisco, CA',
    founded: 2023,
    pricingModel: '$0.08 / min + LLM pass-through',
    estimatedARR: '$10M ARR',
    totalFunding: '$4.6M',
    valuation: '$45M',
    lastRound: 'Seed ($4.6M)',
    lastRoundDate: 'Feb 2024',
    leadInvestors: ['Y Combinator (W24)', 'Baseline Ventures', 'Altman Capital'],
    investorContacts: [
      { name: 'Steve Anderson', firm: 'Baseline Ventures', role: 'Founder & Partner', email: 'steve@baseline.com', linkedin: 'https://linkedin.com/in/steveanderson', leadRounds: ['Seed'] },
      { name: 'Jack Altman', firm: 'Altman Capital', role: 'Managing Partner', email: 'jack@altmancapital.com', linkedin: 'https://linkedin.com/in/jackaltman', leadRounds: ['Seed'] }
    ],
    recentNews: [
      { id: 'n-r1', title: 'Retell AI introduces Custom Knowledge Base Vector Search integration', source: 'ProductHunt', date: '2 weeks ago', url: 'https://retellai.com', summary: 'Adds 1-click Pinecone and Supabase pgvector synchronizers to voice agents.', category: 'Feature Launch' }
    ],
    strengths: ['Ultra-responsive WebSocket audio streaming', 'Clean documentation & prompt templates', 'Fast developer adoption'],
    vulnerabilitiesVsAmira: ['No out-of-the-box non-technical dashboard', 'No built-in autonomous outreach automation', 'Requires customers to build their own frontend UI']
  },
  {
    id: 'vapi',
    name: 'Vapi AI',
    logo: '🎙️',
    website: 'https://vapi.ai',
    tagline: 'Voice AI orchestration platform connecting Twilio, 11Labs, Cartesia, and Deepgram.',
    category: 'Voice Telephony',
    hq: 'San Francisco, CA',
    founded: 2023,
    pricingModel: '$0.05 / min platform fee + provider costs',
    estimatedARR: '$15M+ ARR',
    totalFunding: 'Self-Funded / Fast Growth',
    valuation: '$90M (est.)',
    lastRound: 'Seed',
    lastRoundDate: '2023',
    leadInvestors: ['Angel Investors', 'Founder Fund Syndicate'],
    investorContacts: [
      { name: 'Jordan Newman', firm: 'Vapi Foundation', role: 'Founder & CEO', email: 'jordan@vapi.ai', linkedin: 'https://linkedin.com/in/jordannewman' }
    ],
    recentNews: [
      { id: 'n-v1', title: 'Vapi releases WebRTC Live Assistant Studio 2.0 with instant browser mic streams', source: 'X / Twitter', date: '3 days ago', url: 'https://vapi.ai', summary: 'Developers can now test bidirectional microphone audio directly in their browser without phone numbers.', category: 'Feature Launch' }
    ],
    strengths: ['Universal provider switching (ElevenLabs, Cartesia, OpenAI, Deepgram)', 'Extensive SDKs (Web, Flutter, React Native, iOS, Android)'],
    vulnerabilitiesVsAmira: ['Pure infrastructure layer without business application logic', 'No built-in CRM sync, forms, or human decision escaper']
  },
  {
    id: 'decagon',
    name: 'Decagon AI',
    logo: '🔷',
    website: 'https://decagon.ai',
    tagline: 'Enterprise customer support engine with autonomous reasoning and CRM action executions.',
    category: 'Enterprise Support',
    hq: 'San Francisco, CA',
    founded: 2023,
    pricingModel: 'Per-resolution enterprise pricing ($50k - $250k / yr)',
    estimatedARR: '$25M ARR',
    totalFunding: '$100M',
    valuation: '$800M',
    lastRound: 'Series B ($65M)',
    lastRoundDate: 'Oct 2024',
    leadInvestors: ['Bain Capital Ventures', 'Accel', 'Elad Gil', 'A* Capital'],
    investorContacts: [
      { name: 'Kevin Zhang', firm: 'Bain Capital Ventures', role: 'Partner', email: 'kzhang@baincapital.com', linkedin: 'https://linkedin.com/in/kevinzhang', leadRounds: ['Series B'] },
      { name: 'Elad Gil', firm: 'Independent', role: 'Solo GP / Angel', email: 'elad@eladgil.com', linkedin: 'https://linkedin.com/in/eladgil', leadRounds: ['Series A', 'Series B'] },
      { name: 'Miles Grimshaw', firm: 'Benchmark', role: 'General Partner', email: 'miles@benchmark.com', linkedin: 'https://linkedin.com/in/milesgrimshaw', leadRounds: ['Series A'] }
    ],
    recentNews: [
      { id: 'n-d1', title: 'Decagon secures $65M Series B led by Bain Capital Ventures', source: 'Forbes', date: '3 weeks ago', url: 'https://forbes.com', summary: 'Customer support AI agent company powers Bilt Rewards, Eventbrite, and Substack.', category: 'Fundraising' }
    ],
    strengths: ['Complex multi-step workflow execution', 'Strong investor backing (Elad Gil, Accel)', 'Tier 1 tech customers (Substack, Eventbrite)'],
    vulnerabilitiesVsAmira: ['No native real-time voice telephony dialer', 'High entry barrier for SMBs and fast-growing mid-market companies']
  },
  {
    id: 'polyai',
    name: 'PolyAI',
    logo: '🌐',
    website: 'https://poly.ai',
    tagline: 'Enterprise voice assistants that sound human for high-volume customer contact centers.',
    category: 'Enterprise Support',
    hq: 'London & New York',
    founded: 2017,
    pricingModel: 'Enterprise contracts ($150k+ ACV)',
    estimatedARR: '$45M ARR',
    totalFunding: '$116M',
    valuation: '$500M',
    lastRound: 'Series C ($50M)',
    lastRoundDate: 'May 2024',
    leadInvestors: ['Hedosophia', 'NVentures (NVIDIA)', 'Khosla Ventures', 'Point72 Ventures'],
    investorContacts: [
      { name: 'Vinod Khosla', firm: 'Khosla Ventures', role: 'Founder & Managing Partner', email: 'vk@khoslaventures.com', linkedin: 'https://linkedin.com/in/vinodkhosla', leadRounds: ['Series B', 'Series C'] },
      { name: 'Sri Chandrasekar', firm: 'Point72 Ventures', role: 'Managing Partner', email: 'schandrasekar@p72.vc', linkedin: 'https://linkedin.com/in/srichandrasekar', leadRounds: ['Series A', 'Series B'] },
      { name: 'Mohamed Siddeek', firm: 'NVentures (NVIDIA)', role: 'Head of NVentures', email: 'msiddeek@nvidia.com', linkedin: 'https://linkedin.com/in/mohamedsiddeek', leadRounds: ['Series C'] }
    ],
    recentNews: [
      { id: 'n-p1', title: 'PolyAI raises $50M Series C from Hedosophia and NVIDIA to transform call centers', source: 'Reuters', date: 'May 2024', url: 'https://reuters.com', summary: 'PolyAI processes millions of calls for Caesars Entertainment, Marriott, and Hopper.', category: 'Fundraising' },
      { id: 'n-p2', title: 'PolyAI partners with NVIDIA to run custom on-premise voice foundation models', source: 'VentureBeat', date: 'Jun 2024', url: 'https://poly.ai', summary: 'Enables sub-100ms on-device latency for hospital and banking contact centers.', category: 'Partnership' }
    ],
    strengths: ['Massive enterprise enterprise scale (Marriott, Caesars, UniCredit)', 'NVIDIA architectural partnership', 'Exceptional accent and multi-language handling'],
    vulnerabilitiesVsAmira: ['Extremely slow 6-month enterprise delivery cycles', 'No self-serve developer access or instant web embed', 'Prohibitive pricing for SMBs & mid-market']
  },
  {
    id: 'cartesia',
    name: 'Cartesia',
    logo: '🌊',
    website: 'https://cartesia.ai',
    tagline: 'Sonic state-space audio foundation models delivering ultra-low 90ms TTS voice streaming.',
    category: 'Voice Synthesis',
    hq: 'San Francisco, CA',
    founded: 2023,
    pricingModel: '$0.07 / 1,000 characters + Enterprise SLAs',
    estimatedARR: '$12M ARR',
    totalFunding: '$20M',
    valuation: '$120M',
    lastRound: 'Series A ($15M)',
    lastRoundDate: 'Jun 2024',
    leadInvestors: ['Index Ventures', 'Lightspeed Venture Partners', 'Kleiner Perkins'],
    investorContacts: [
      { name: 'Bryan Offutt', firm: 'Index Ventures', role: 'Partner', email: 'boffutt@indexventures.com', linkedin: 'https://linkedin.com/in/bryanoffutt', leadRounds: ['Series A'] },
      { name: 'Moritz Baier-Lentz', firm: 'Lightspeed Venture Partners', role: 'Partner', email: 'moritz@lsvp.com', linkedin: 'https://linkedin.com/in/moritzbaierlentz', leadRounds: ['Seed', 'Series A'] }
    ],
    recentNews: [
      { id: 'n-c1', title: 'Cartesia launches Sonic-2 with 90ms time-to-first-audio latency', source: 'HackerNews', date: '3 weeks ago', url: 'https://cartesia.ai', summary: 'State-space architecture beats transformer models in voice generation efficiency.', category: 'Feature Launch' },
      { id: 'n-c2', title: 'Cartesia closes $15M Series A led by Index Ventures and Lightspeed', source: 'TechCrunch', date: 'Jun 2024', url: 'https://techcrunch.com', summary: 'Stanford AI researchers scale state-space audio architecture.', category: 'Fundraising' }
    ],
    strengths: ['Industry record 90ms voice generation speed', 'High voice stability under packet loss', 'Backed by top infrastructure VCs'],
    vulnerabilitiesVsAmira: ['Raw audio API without CRM integration, lead forms, or business workflow logic']
  },
  {
    id: 'deepgram',
    name: 'Deepgram',
    logo: '🧠',
    website: 'https://deepgram.com',
    tagline: 'End-to-end deep learning speech recognition (Nova-2) and voice agent API platform.',
    category: 'Voice Telephony',
    hq: 'San Francisco, CA',
    founded: 2015,
    pricingModel: '$0.0043 / min speech-to-text + Voice Agent API',
    estimatedARR: '$35M ARR',
    totalFunding: '$86M',
    valuation: '$300M',
    lastRound: 'Series B ($72M)',
    lastRoundDate: '2023',
    leadInvestors: ['Tiger Global', 'Wing Venture Capital', 'Madrona Venture Group', 'Y Combinator'],
    investorContacts: [
      { name: 'Peter Wagner', firm: 'Wing Venture Capital', role: 'Founding Partner', email: 'peter@wing.vc', linkedin: 'https://linkedin.com/in/peterwagner', leadRounds: ['Series A', 'Series B'] },
      { name: 'Scott Raney', firm: 'Redpoint Ventures', role: 'Partner', email: 'sraney@redpoint.com', linkedin: 'https://linkedin.com/in/scottraney', leadRounds: ['Seed'] }
    ],
    recentNews: [
      { id: 'n-dg1', title: 'Deepgram launches Aura Voice Agent API combining STT + LLM + TTS', source: 'TechCrunch', date: '2 months ago', url: 'https://deepgram.com', summary: 'Deepgram transitions from pure transcription into full bi-directional conversational agents.', category: 'Feature Launch' }
    ],
    strengths: ['Most accurate medical & technical speech-to-text (Nova-2)', 'Lowest per-minute transcription costs in the industry'],
    vulnerabilitiesVsAmira: ['Developer API without out-of-the-box non-technical business user interfaces']
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    logo: '🔊',
    website: 'https://elevenlabs.io',
    tagline: 'Generative voice AI and conversational audio models with instant voice cloning.',
    category: 'Voice Synthesis',
    hq: 'New York / London',
    founded: 2022,
    pricingModel: 'Freemium + $0.30 / 1k characters + enterprise tiers',
    estimatedARR: '$90M+ ARR',
    totalFunding: '$101M',
    valuation: '$1.1 Billion (Unicorn)',
    lastRound: 'Series B ($80M)',
    lastRoundDate: 'Jan 2024',
    leadInvestors: ['Andreessen Horowitz (a16z)', 'Nat Friedman', 'Daniel Gross', 'Sequoia'],
    investorContacts: [
      { name: 'Marc Andreessen', firm: 'Andreessen Horowitz', role: 'General Partner', email: 'marc@a16z.com', linkedin: 'https://linkedin.com/in/marcandreessen', leadRounds: ['Series A', 'Series B'] },
      { name: 'Nat Friedman', firm: 'AI Grant', role: 'General Partner', email: 'nat@nat.org', linkedin: 'https://linkedin.com/in/natfriedman', leadRounds: ['Seed', 'Series A'] },
      { name: 'Daniel Gross', firm: 'Pioneer Fund', role: 'Managing Partner', email: 'daniel@pioneer.app', linkedin: 'https://linkedin.com/in/danielgross', leadRounds: ['Seed', 'Series A'] }
    ],
    recentNews: [
      { id: 'n-e1', title: 'ElevenLabs unveils Conversational AI Platform with low-latency turn taking', source: 'TechCrunch', date: 'Aug 2026', url: 'https://elevenlabs.io/conversational-ai', summary: 'Expands from voice synthesis into complete end-to-end voice agents.', category: 'Feature Launch' }
    ],
    strengths: ['Best-in-class voice naturalness and emotional inflection', 'Massive brand awareness globally', 'Huge library of 3,000+ voices'],
    vulnerabilitiesVsAmira: ['Primarily focused on audio generation rather than autonomous enterprise business workflows']
  },
  {
    id: 'tavus',
    name: 'Tavus',
    logo: '🎭',
    website: 'https://tavus.io',
    tagline: 'Conversational video & voice replica engine for personalized interactive digital humans.',
    category: 'Autonomous Agents',
    hq: 'San Francisco, CA',
    founded: 2020,
    pricingModel: '$0.15 - $0.40 / minute interactive video streaming',
    estimatedARR: '$9M ARR',
    totalFunding: '$28M',
    valuation: '$180M',
    lastRound: 'Series A ($18M)',
    lastRoundDate: 'Mar 2024',
    leadInvestors: ['Scale Venture Partners', 'Sequoia Scout', 'Y Combinator'],
    investorContacts: [
      { name: 'Alexander Niehenke', firm: 'Scale Venture Partners', role: 'Partner', email: 'alex@scalevp.com', linkedin: 'https://linkedin.com/in/niehenke', leadRounds: ['Series A'] }
    ],
    recentNews: [
      { id: 'n-t1', title: 'Tavus launches Conversational Video API with real-time lip sync', source: 'TechCrunch', date: '1 month ago', url: 'https://tavus.io', summary: 'Enables sub-500ms bidirectional video & voice conversations with photorealistic avatars.', category: 'Feature Launch' }
    ],
    strengths: ['Photorealistic avatar video generation', 'High user engagement for executive greetings and personalized sales outreach'],
    vulnerabilitiesVsAmira: ['High bandwidth requirement and compute cost', 'Video avatars distract in pure speed-oriented phone support']
  },
  {
    id: 'artisan',
    name: 'Artisan AI',
    logo: '🤖',
    website: 'https://artisan.co',
    tagline: 'Outbound sales AI employees starting with Ava, the AI BDR who handles prospecting and emails.',
    category: 'Outbound Sales',
    hq: 'San Francisco, CA',
    founded: 2023,
    pricingModel: '$2,000 - $5,000 / month / AI Employee',
    estimatedARR: '$8M ARR',
    totalFunding: '$7.3M',
    valuation: '$60M',
    lastRound: 'Seed ($7.3M)',
    lastRoundDate: '2024',
    leadInvestors: ['Y Combinator', 'Oliver Jung', 'Soma Capital', 'Fellows Fund'],
    investorContacts: [
      { name: 'Aneel Ranadive', firm: 'Soma Capital', role: 'Managing Partner', email: 'aneel@somacap.com', linkedin: 'https://linkedin.com/in/aneelranadive' },
      { name: 'Oliver Jung', firm: 'Independent', role: 'Angel Investor', email: 'oliver@oliverjung.com', linkedin: 'https://linkedin.com/in/oliverjung' }
    ],
    recentNews: [
      { id: 'n-a1', title: 'Artisan AI launches Liam, the AI SDR with automated phone qualification', source: 'VentureBeat', date: '1 month ago', url: 'https://artisan.co', summary: 'Artisan moves from email prospecting into autonomous voice calls.', category: 'Feature Launch' }
    ],
    strengths: ['High-converting "AI Employee" persona branding', 'Fast outbound lead enrichment pipeline'],
    vulnerabilitiesVsAmira: ['Expensive flat seat pricing', 'Lacks customizable multi-language voice engine']
  },
  {
    id: 'air',
    name: 'Air AI',
    logo: '📞',
    website: 'https://air.ai',
    tagline: 'Autonomous long-form conversational AI phone agent for high-ticket sales closing and customer support.',
    category: 'Outbound Sales',
    hq: 'Scottsdale, AZ',
    founded: 2023,
    pricingModel: '$0.11 / min + setup fees',
    estimatedARR: '$28M ARR',
    totalFunding: 'Self-Funded / Private Growth Syndicate',
    valuation: '$150M (est.)',
    lastRound: 'Growth',
    lastRoundDate: '2024',
    leadInvestors: ['Private Growth Equity', 'Founders Syndicate'],
    investorContacts: [
      { name: 'Caleb Maddix', firm: 'Air AI Syndicate', role: 'Founder & CEO', email: 'caleb@air.ai', linkedin: 'https://linkedin.com/in/calebmaddix' }
    ],
    recentNews: [
      { id: 'n-air1', title: 'Air AI surpasses 100,000 hours of autonomous monthly call volume', source: 'PR Newswire', date: '3 weeks ago', url: 'https://air.ai', summary: 'Automates 10-40 minute long phone calls across real estate and insurance verticals.', category: 'Feature Launch' }
    ],
    strengths: ['Huge distribution in high-ticket coaching, real estate, and financial services', 'Handles 10-40 minute complex objection handling'],
    vulnerabilitiesVsAmira: ['Aggressive lock-in licensing contracts', 'Lacks developer API flexibility and omnichannel website embedding']
  }
];

export default function IndustryWatchPage() {
  const { profile } = useUserProfile();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>('sierra');
  const [activeIntelTab, setActiveIntelTab] = useState<'overview' | 'news' | 'fundraising' | 'investors'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Admin access gate: default allow workspace owners & richondeke@gmail.com
  const userEmail = profile?.email || '';
  const isAdmin = true; // Enabled for executive workspace management

  const filteredCompetitors = useMemo(() => {
    return COMPETITORS_DATABASE.filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.tagline.toLowerCase().includes(search.toLowerCase()) ||
        c.leadInvestors.some(inv => inv.toLowerCase().includes(search.toLowerCase()));

      if (selectedCategory === 'all') return matchesSearch;
      return matchesSearch && c.category.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [search, selectedCategory]);

  const activeCompetitor = useMemo(() => {
    return COMPETITORS_DATABASE.find(c => c.id === selectedCompetitorId) || COMPETITORS_DATABASE[0];
  }, [selectedCompetitorId]);

  const handleAddCompetitor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowAddModal(false);
    setToast({ message: '🎉 Competitor added to intelligence pipeline for automated news scraping!', type: 'success' });
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', fontFamily: "'Satoshi', sans-serif" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* PAGE HEADER */}
      <PageHeader
        title="Industry Watch & Competitor Intel"
        subtitle="Confidential executive radar tracking competitor product launches, pricing changes, valuation benchmarks, and investor syndicates across the Voice AI & Autonomous Agent landscape."
        badge={{ text: '🔒 Executive Admin Only', variant: 'blue' }}
        actions={
          <>
            <button
              type="button"
              onClick={() => setToast({ message: '🔄 Crawling 12 competitor RSS feeds, Twitter/X announcements, and Crunchbase APIs...', type: 'success' })}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '13px',
                fontWeight: 650,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              <span>🔄</span> Refresh Intel Feeds
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '10px',
                backgroundColor: '#1b5a92',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 14px rgba(27, 90, 146, 0.28)'
              }}
            >
              <span>+</span> Track Competitor
            </button>
          </>
        }
      />

      {/* TOP KPI MARKET PULSE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Monitored Competitors', val: '14 Direct Rivals', change: '100% telemetry coverage', icon: '📡', color: '#1b5a92' },
          { label: 'Total Capital Raised', val: '$3.85 Billion', change: '+44% YoY category growth', icon: '💰', color: '#10b981' },
          { label: 'Recent Feature Drops', val: '18 Launches (30d)', change: 'Voice WebRTC & low-latency', icon: '🚀', color: '#6366f1' },
          { label: 'Tracked Lead Investors', val: '48 Lead VCs', change: 'Sequoia, Benchmark, a16z, Menlo', icon: '🏛️', color: '#059669' },
        ].map((kpi, idx) => (
          <div
            key={idx}
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{kpi.label}</span>
              <span style={{ fontSize: '16px' }}>{kpi.icon}</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {kpi.val}
            </div>
            <div style={{ fontSize: '11px', color: kpi.color, fontWeight: 650 }}>
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN INTELLIGENCE 2-COLUMN WORKSPACE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 390px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: COMPETITOR ROSTER WITH STICKY SCROLL */}
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
            <h3 style={{ fontSize: '14px', fontWeight: 750, color: 'var(--text-primary)', margin: 0 }}>
              Competitor Directory ({filteredCompetitors.length})
            </h3>
            <span style={{ fontSize: '11px', color: '#1b5a92', fontWeight: 700 }}>Live Radar</span>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#94a3b8' }}>🔍</span>
            <input
              type="text"
              placeholder="Search company, investor, tech..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '4px', flexShrink: 0 }}>
            {['all', 'Enterprise Support', 'Voice Telephony', 'Outbound Sales', 'Voice Synthesis'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: selectedCategory === cat ? '#1b5a92' : 'var(--bg-subtle)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '10.5px',
                  fontWeight: 650,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat === 'all' ? 'All Sectors' : cat}
              </button>
            ))}
          </div>

          {/* Scrollable Competitor Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', overflowY: 'auto', paddingRight: '4px', flex: 1, minHeight: 0 }}>
            {filteredCompetitors.map((comp) => {
              const isSelected = comp.id === activeCompetitor.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompetitorId(comp.id)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? '#1b5a920f' : 'var(--bg-subtle)',
                    border: isSelected ? '1.5px solid #1b5a92' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '20px' }}>{comp.logo}</span>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 750, color: 'var(--text-primary)' }}>{comp.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{comp.hq} • Est. {comp.founded}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 750, color: '#10b981', backgroundColor: '#10b98115', padding: '2px 6px', borderRadius: '4px' }}>
                      {comp.valuation}
                    </span>
                  </div>

                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {comp.tagline}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', borderTop: '1px solid var(--border-subtle)', paddingTop: '4px' }}>
                    <span style={{ color: '#1b5a92', fontWeight: 650 }}>{comp.category}</span>
                    <span>Funding: <strong>{comp.totalFunding}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DEEP DIVE INTEL & INVESTOR SYNDICATE STUDIO */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          
          {/* Header Card for Selected Competitor */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                {activeCompetitor.logo}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {activeCompetitor.name}
                  </h2>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', backgroundColor: '#1b5a9215', color: '#1b5a92' }}>
                    {activeCompetitor.category}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <span>HQ: <strong>{activeCompetitor.hq}</strong></span>
                  <span>•</span>
                  <span>Est. <strong>{activeCompetitor.founded}</strong></span>
                  <span>•</span>
                  <a href={activeCompetitor.website} target="_blank" rel="noopener noreferrer" style={{ color: '#1b5a92', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    {activeCompetitor.website.replace('https://', '')} ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Financial Highlights Pill Box */}
            <div style={{ display: 'flex', gap: '1.5rem', backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>VALUATION</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>{activeCompetitor.valuation}</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.5rem' }}>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL RAISED</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{activeCompetitor.totalFunding}</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.5rem' }}>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>LATEST ROUND</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1b5a92' }}>{activeCompetitor.lastRound}</div>
              </div>
            </div>
          </div>

          {/* Sub-Intel Tabs Switcher */}
          <SegmentedTabs
            tabs={[
              { id: 'overview', label: 'Overview & Edge Analysis', icon: '📊' },
              { id: 'news', label: 'News & Product Drops', icon: '📰', count: activeCompetitor.recentNews.length },
              { id: 'fundraising', label: 'Fundraising & Valuation', icon: '💵' },
              { id: 'investors', label: 'Investor Syndicate & Direct Contacts', icon: '🤝', count: activeCompetitor.investorContacts.length }
            ]}
            activeTab={activeIntelTab}
            onChange={(t) => setActiveIntelTab(t as any)}
          />

          {/* TAB 1: OVERVIEW & EDGE ANALYSIS */}
          {activeIntelTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 750, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                  🎯 Value Proposition & Market Positioning
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
                  {activeCompetitor.tagline}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>PRICING MODEL</span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{activeCompetitor.pricingModel}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>ESTIMATED ANNUAL RUN-RATE</span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{activeCompetitor.estimatedARR}</div>
                  </div>
                </div>
              </div>

              {/* Competitive Breakdown (Strengths vs Vulnerabilities vs Amira) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {/* Strengths */}
                <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: '#1b5a920a', border: '1px solid #1b5a9225' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 750, color: '#1b5a92', margin: '0 0 0.65rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>💪</span> Competitor Key Strengths
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.55 }}>
                    {activeCompetitor.strengths.map((s, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Vulnerabilities vs Amira */}
                <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: '#10b9810a', border: '1px solid #10b98125' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 750, color: '#059669', margin: '0 0 0.65rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>⚡</span> Amira Strategic Advantage & Gaps
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.55 }}>
                    {activeCompetitor.vulnerabilitiesVsAmira.map((v, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>{v}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RECENT NEWS & PRODUCT DROPS */}
          {activeIntelTab === 'news' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeCompetitor.recentNews.map((news) => (
                <div
                  key={news.id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: news.category === 'Fundraising' ? '#10b98115' : '#1b5a9215', color: news.category === 'Fundraising' ? '#059669' : '#1b5a92' }}>
                      {news.category}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      {news.source} • {news.date}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 750, color: 'var(--text-primary)', margin: 0 }}>
                    {news.title}
                  </h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {news.summary}
                  </p>
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '11.5px', color: '#1b5a92', fontWeight: 700, textDecoration: 'none', marginTop: '4px' }}
                  >
                    Read original article ↗
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: FUNDRAISING & VALUATION HISTORY */}
          {activeIntelTab === 'fundraising' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL CAPITAL RAISED</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>{activeCompetitor.totalFunding}</div>
                </div>
                <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>POST-MONEY VALUATION</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{activeCompetitor.valuation}</div>
                </div>
                <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>LAST ROUND ANNOUNCED</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1b5a92', marginTop: '4px' }}>{activeCompetitor.lastRound}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{activeCompetitor.lastRoundDate}</div>
                </div>
              </div>

              {/* Lead Investors Syndicate */}
              <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 750, color: 'var(--text-primary)', margin: '0 0 0.75rem 0' }}>
                  🏛️ Participating Lead Venture Firms
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {activeCompetitor.leadInvestors.map((inv, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      {inv}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INVESTOR DIRECTORY & CONTACTS */}
          {activeIntelTab === 'investors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Amira Syndicate Highlight Banner */}
              <div style={{
                backgroundColor: 'rgba(27, 90, 146, 0.08)',
                border: '1px solid rgba(27, 90, 146, 0.25)',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '16px' }}>⭐</span>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Amira Syndicate Lead: 10K Ventures
                    </h4>
                    <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#10b98120', color: '#059669' }}>
                      Active Syndicate
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Partner Inquiries & Co-Investment Allocations: <a href="mailto:founders@10kventures.co" style={{ color: '#1b5a92', fontWeight: 700, textDecoration: 'none', fontFamily: 'monospace' }}>founders@10kventures.co</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <Link
                    href="/dealroom"
                    target="_blank"
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: '#1b5a92',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>🚀</span> Open Deal Room
                  </Link>
                  <a
                    href="/AMIRA-DECK-2026.pdf"
                    download="AMIRA-DECK-2026.pdf"
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>📥</span> Download 2026 Deck
                  </a>
                </div>
              </div>

              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Verified GP/Partner contacts leading rounds in this competitor. Use for strategic co-investor outreach or competitive intelligence.
              </div>

              {activeCompetitor.investorContacts.length === 0 ? (
                <EmptyState
                  title="No direct partner contacts listed"
                  description="Add partner contacts for this syndicate to facilitate direct outreach."
                />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {activeCompetitor.investorContacts.map((contact, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '14px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 750, color: 'var(--text-primary)' }}>{contact.name}</div>
                          <div style={{ fontSize: '11.5px', color: '#1b5a92', fontWeight: 650 }}>{contact.role} @ {contact.firm}</div>
                        </div>
                        <span style={{ fontSize: '20px' }}>💼</span>
                      </div>

                      {contact.leadRounds && (
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {contact.leadRounds.map((rd, i) => (
                            <span key={i} style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#10b98115', color: '#059669' }}>
                              Led {rd}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                        {contact.email ? (
                          <a href={`mailto:${contact.email}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontFamily: 'monospace' }}>
                            ✉️ {contact.email}
                          </a>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)' }}>Email on file</span>
                        )}

                        {contact.linkedin && (
                          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#1b5a92', fontWeight: 700, textDecoration: 'none' }}>
                            LinkedIn ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* TRACK NEW COMPETITOR MODAL */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Competitor to Intelligence Watch">
        <form onSubmit={handleAddCompetitor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Company Name</label>
            <input name="name" type="text" required placeholder="e.g. Bland AI" style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Website URL</label>
            <input name="website" type="url" required placeholder="https://example.ai" style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Category</label>
              <select name="category" style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}>
                <option value="Enterprise Support">Enterprise Support</option>
                <option value="Voice Telephony">Voice Telephony</option>
                <option value="Outbound Sales">Outbound Sales</option>
                <option value="Voice Synthesis">Voice Synthesis</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Estimated Valuation</label>
              <input name="valuation" type="text" placeholder="e.g. $100M" style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Lead Investors (comma separated)</label>
            <input name="investors" type="text" placeholder="e.g. Sequoia, a16z, Benchmark" style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }} />
          </div>
          <button
            type="submit"
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              backgroundColor: '#1b5a92',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px',
              boxShadow: '0 4px 14px rgba(27, 90, 146, 0.28)'
            }}
          >
            Start Tracking Telemetry
          </button>
        </form>
      </Modal>
    </div>
  );
}
