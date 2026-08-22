export interface VoiceOption {
  id: string;
  name: string;
  provider: string;
  gender: string;
  accent: string;
  tag: string;
  text: string;
  lang: string;
  previewUrl: string;
}

export type VoiceModel = VoiceOption;

export const namesList = [
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

export const providersList = ['ElevenLabs', 'PlayHT', 'Cartesia', 'OpenAI', 'Deepgram'];
export const gendersList = ['Female', 'Male'];
export const accentsList = [
  'US Friendly', 'US Professional', 'UK British Warm', 'Aussie Friendly', 'Nigerian (West Africa)',
  'Kenyan (East Africa)', 'South African Accent', 'Indian English', 'Canadian Neutral', 'Irish Lilt'
];
export const tagsList = [
  'Best for Support', 'Best for Sales', 'Premium Local', 'Best for Retail', 'Best for FAQs',
  'Best for Consulting', 'Best for Wellness', 'Best for Trades', 'Best for Marketing', 'Executive Voice'
];

export const audioPreviewUrls = [
  '/audio/voices/rachel.mp3',
  '/audio/voices/josh.mp3',
  '/audio/voices/adam.mp3',
  '/audio/voices/bella.mp3',
  '/audio/voices/sarah.mp3',
  '/audio/voices/liam.mp3',
  '/audio/voices/george.mp3',
  '/audio/voices/charlotte.mp3',
  '/audio/voices/tunde.mp3',
  '/audio/voices/zuri.mp3',
  '/audio/voices/kofi.mp3',
  '/audio/voices/chidimma.mp3'
];

export const generate100Voices = (): VoiceOption[] => {
  const list: VoiceOption[] = [];

  // Baseline premium core & local voices
  const base: VoiceOption[] = [
    { id: 'rachel', name: 'Rachel', provider: 'ElevenLabs', gender: 'Female', accent: 'US Friendly', tag: 'Best for Support', text: "Hi! I'm Rachel. I speak with a warm, empathetic, and professional tone. Perfect for customer support.", lang: 'en', previewUrl: '/audio/voices/rachel.mp3' },
    { id: 'josh', name: 'Josh', provider: 'ElevenLabs', gender: 'Male', accent: 'US Professional', tag: 'Best for Sales', text: "Hello! I'm Josh. My voice is deep, confident, and persuasive. Excellent for outbound sales.", lang: 'en', previewUrl: '/audio/voices/josh.mp3' },
    { id: 'kemi', name: 'Kemi', provider: 'ElevenLabs', gender: 'Female', accent: 'Nigerian (West Africa)', tag: 'Premium Local', text: "Kedu! I am Kemi. I speak with a clear and professional Nigerian English accent. Excellent for West African customer service.", lang: 'en', previewUrl: '/audio/voices/tunde.mp3' },
    { id: 'chinedu', name: 'Chinedu', provider: 'ElevenLabs', gender: 'Male', accent: 'Nigerian (West Africa)', tag: 'Premium Local', text: "Hello! I am Chinedu. My voice is warm and trustworthy, with a classic Nigerian accent.", lang: 'en', previewUrl: '/audio/voices/tunde.mp3' },
    { id: 'nova', name: 'Nova', provider: 'OpenAI', gender: 'Female', accent: 'US Energetic', tag: 'Best for Retail', text: "Hi there! I'm Nova. I have a bright, energetic, and highly engaging voice.", lang: 'en', previewUrl: '/audio/voices/nova.mp3' },
    { id: 'alloy', name: 'Alloy', provider: 'OpenAI', gender: 'Male', accent: 'US Neutral', tag: 'Best for FAQs', text: "Hello, I'm Alloy. I offer a clear, calm, and neutral voice.", lang: 'en', previewUrl: '/audio/voices/alloy.mp3' },
    { id: 'fin', name: 'Fin', provider: 'ElevenLabs', gender: 'Male', accent: 'British Warm', tag: 'Best for Consulting', text: "Cheers! I'm Fin. My British accent brings a warm, refined, and trustworthy tone.", lang: 'en', previewUrl: '/audio/voices/george.mp3' },
    { id: 'bella', name: 'Bella', provider: 'ElevenLabs', gender: 'Female', accent: 'US Soft', tag: 'Best for Wellness', text: "Hi, I'm Bella. I have a gentle, soothing, and attentive voice.", lang: 'en', previewUrl: '/audio/voices/bella.mp3' },
    { id: 'thomas', name: 'Thomas', provider: 'PlayHT', gender: 'Male', accent: 'Aussie Friendly', tag: 'Best for Trades', text: "G'day! I'm Thomas. My Australian voice is friendly, down-to-earth, and relatable.", lang: 'en', previewUrl: '/audio/voices/charlie.mp3' },
    { id: 'serena', name: 'Serena', provider: 'ElevenLabs', gender: 'Female', accent: 'US Conversational', tag: 'Best for Marketing', text: "Hey! I'm Serena. I have an upbeat, natural, and highly conversational voice.", lang: 'en', previewUrl: '/audio/voices/sarah.mp3' },
    { id: 'mwangi', name: 'Mwangi', provider: 'PlayHT', gender: 'Male', accent: 'Kenyan (East Africa)', tag: 'Warm Support', text: "Jambo! I am Mwangi. I offer a warm, articulate Kenyan English voice profile.", lang: 'en', previewUrl: '/audio/voices/zuri.mp3' },
    { id: 'ambrose', name: 'Ambrose', provider: 'ElevenLabs', gender: 'Male', accent: 'Yoruba Dialect', tag: 'Native Voice', text: "E nle o! I am Ambrose. I speak fluent Yoruba and English, bridging communications.", lang: 'yo', previewUrl: '/audio/voices/tunde.mp3' },
    { id: 'chioma', name: 'Chioma', provider: 'ElevenLabs', gender: 'Female', accent: 'Igbo Dialect', tag: 'Native Voice', text: "Nnoo! I am Chioma. I speak fluent Igbo and English, providing native guidance.", lang: 'ig', previewUrl: '/audio/voices/chidimma.mp3' },
    { id: 'amina', name: 'Amina', provider: 'ElevenLabs', gender: 'Female', accent: 'Hausa Dialect', tag: 'Native Voice', text: "Sannu! I am Amina. I speak fluent Hausa and English, providing professional communication.", lang: 'ha', previewUrl: '/audio/voices/amina.mp3' }
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
