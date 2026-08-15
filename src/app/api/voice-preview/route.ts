import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const voiceId = searchParams.get('voiceId') || '21m00Tcm4TlvDq8ikWAM';
  const text = searchParams.get('text') || 'Hello! I am your Amira voice agent, ready to handle your calls.';

  const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  const vapiApiKey = process.env.VAPI_PRIVATE_API_KEY;

  const cleanVoiceId = voiceId.replace(/^eleven_/, '');

  // 1. Synthesize live audio via ElevenLabs TTS API if key is available
  if (elevenLabsApiKey && elevenLabsApiKey !== 'undefined' && elevenLabsApiKey.trim() !== '') {
    try {
      const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cleanVoiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': elevenLabsApiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      });

      if (ttsRes.ok) {
        const audioBuffer = await ttsRes.arrayBuffer();
        return new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
    } catch (err) {
      console.error('ElevenLabs live TTS API error:', err);
    }
  }

  // 2. Stream official ElevenLabs preview audio MP3 directly
  try {
    const vRes = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (vRes.ok) {
      const data = await vRes.json();
      const voices: any[] = data.voices || [];
      const searchTarget = cleanVoiceId.toLowerCase();
      
      const found = voices.find(v => 
        v.voice_id.toLowerCase() === searchTarget || 
        v.name.toLowerCase().includes(searchTarget) ||
        searchTarget.includes(v.name.toLowerCase().split(' ')[0])
      );

      if (found?.preview_url) {
        const audioRes = await fetch(found.preview_url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (audioRes.ok) {
          const audioBuffer = await audioRes.arrayBuffer();
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'public, max-age=3600'
            }
          });
        }
      }
    }
  } catch (err) {
    console.error('ElevenLabs preview proxy error:', err);
  }

  // 3. Fallback to local studio MP3
  return NextResponse.redirect(new URL(`/audio/voices/${cleanVoiceId.toLowerCase()}.mp3`, request.url));
}
