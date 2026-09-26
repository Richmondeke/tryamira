'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface EndpointDoc {
  id: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  title: string;
  description: string;
  curl: string;
  javascript: string;
  python: string;
  response: string;
}

const ENDPOINTS: EndpointDoc[] = [
  {
    id: 'list-assistants',
    method: 'GET',
    path: '/api/v1/assistants',
    title: 'List AI Voice Agents',
    description: 'Retrieve all provisioned and custom AI Voice Agents configured in your workspace.',
    curl: `curl -X GET "https://heyamira.com/api/v1/assistants" \\
  -H "Authorization: Bearer amira_live_sec_your_secret_key" \\
  -H "Content-Type: application/json"`,
    javascript: `const response = await fetch("https://heyamira.com/api/v1/assistants", {
  method: "GET",
  headers: {
    "Authorization": "Bearer amira_live_sec_your_secret_key",
    "Content-Type": "application/json"
  }
});
const data = await response.json();
console.log(data);`,
    python: `import requests

url = "https://heyamira.com/api/v1/assistants"
headers = {
    "Authorization": "Bearer amira_live_sec_your_secret_key",
    "Content-Type": "application/json"
}
response = requests.get(url, headers=headers)
print(response.json())`,
    response: `{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "asst_991823a01f",
      "name": "Sarah - Inbound Closer",
      "firstMessage": "Hi, thanks for calling! How can I help you today?",
      "voice": { "provider": "11labs", "voiceId": "21m00Tcm4TlvDq8ikWAM" },
      "createdAt": "2026-09-01T10:00:00Z"
    }
  ]
}`
  },
  {
    id: 'create-assistant',
    method: 'POST',
    path: '/api/v1/assistants',
    title: 'Create AI Voice Agent',
    description: 'Instantly provision a new autonomous AI voice agent with custom system prompts, ElevenLabs voice cloning, and multilingual models.',
    curl: `curl -X POST "https://heyamira.com/api/v1/assistants" \\
  -H "Authorization: Bearer amira_live_sec_your_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Apex Support Agent",
    "firstMessage": "Hello! I am Amira AI. How may I direct your call?",
    "systemPrompt": "You are a professional customer support specialist for Apex Medspas. Qualify inbound leads and book consultation calls.",
    "voiceId": "21m00Tcm4TlvDq8ikWAM",
    "voiceProvider": "11labs",
    "language": "en"
  }'`,
    javascript: `const response = await fetch("https://heyamira.com/api/v1/assistants", {
  method: "POST",
  headers: {
    "Authorization": "Bearer amira_live_sec_your_secret_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Apex Support Agent",
    firstMessage: "Hello! I am Amira AI. How may I direct your call?",
    systemPrompt: "You are a customer support agent. Qualify inbound leads.",
    voiceId: "21m00Tcm4TlvDq8ikWAM",
    voiceProvider: "11labs",
    language: "en"
  })
});
const data = await response.json();
console.log(data);`,
    python: `import requests

url = "https://heyamira.com/api/v1/assistants"
headers = {
    "Authorization": "Bearer amira_live_sec_your_secret_key",
    "Content-Type": "application/json"
}
payload = {
    "name": "Apex Support Agent",
    "firstMessage": "Hello! I am Amira AI. How may I direct your call?",
    "systemPrompt": "You are a customer support agent. Qualify inbound leads.",
    "voiceId": "21m00Tcm4TlvDq8ikWAM",
    "voiceProvider": "11labs",
    "language": "en"
}
response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    response: `{
  "success": true,
  "data": {
    "id": "asst_a98f12c9",
    "name": "Apex Support Agent",
    "status": "ready",
    "phoneNumbers": []
  }
}`
  },
  {
    id: 'dispatch-call',
    method: 'POST',
    path: '/api/v1/calls',
    title: 'Dispatch Outbound Voice Call',
    description: 'Trigger an immediate autonomous outbound AI phone call to a customer phone number with sub-500ms voice synthesis and conversational AI.',
    curl: `curl -X POST "https://heyamira.com/api/v1/calls" \\
  -H "Authorization: Bearer amira_live_sec_your_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "assistantId": "asst_991823a01f",
    "phoneNumber": "+1234567890",
    "customer": { "name": "Alex Mercer" },
    "metadata": { "leadSource": "Website Contact Form", "dealValue": 5000 }
  }'`,
    javascript: `const response = await fetch("https://heyamira.com/api/v1/calls", {
  method: "POST",
  headers: {
    "Authorization": "Bearer amira_live_sec_your_secret_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    assistantId: "asst_991823a01f",
    phoneNumber: "+1234567890",
    customer: { name: "Alex Mercer" },
    metadata: { leadSource: "Website Contact Form" }
  })
});
const data = await response.json();
console.log(data);`,
    python: `import requests

url = "https://heyamira.com/api/v1/calls"
headers = {
    "Authorization": "Bearer amira_live_sec_your_secret_key",
    "Content-Type": "application/json"
}
payload = {
    "assistantId": "asst_991823a01f",
    "phoneNumber": "+1234567890",
    "customer": {"name": "Alex Mercer"},
    "metadata": {"leadSource": "Website Contact Form"}
}
response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    response: `{
  "success": true,
  "data": {
    "callId": "call_77610fa2e",
    "status": "queued",
    "assistantId": "asst_991823a01f",
    "phoneNumber": "+1234567890",
    "queuedAt": "2026-09-20T22:30:00Z"
  }
}`
  },
  {
    id: 'list-calls',
    method: 'GET',
    path: '/api/v1/calls',
    title: 'Fetch Call Records & Transcripts',
    description: 'Retrieve real-time call history, recording audio URLs, sentiment analysis scores, and full word-by-word transcripts.',
    curl: `curl -X GET "https://heyamira.com/api/v1/calls" \\
  -H "Authorization: Bearer amira_live_sec_your_secret_key" \\
  -H "Content-Type: application/json"`,
    javascript: `const response = await fetch("https://heyamira.com/api/v1/calls", {
  method: "GET",
  headers: {
    "Authorization": "Bearer amira_live_sec_your_secret_key",
    "Content-Type": "application/json"
  }
});
const data = await response.json();
console.log(data);`,
    python: `import requests

url = "https://heyamira.com/api/v1/calls"
headers = {
    "Authorization": "Bearer amira_live_sec_your_secret_key",
    "Content-Type": "application/json"
}
response = requests.get(url, headers=headers)
print(response.json())`,
    response: `{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "call_77610fa2e",
      "status": "ended",
      "durationSeconds": 142,
      "summary": "Customer scheduled consultation for Thursday 2 PM. High buying intent.",
      "sentiment": "positive",
      "recordingUrl": "https://api.vapi.ai/recordings/call_77610fa2e.mp3",
      "startedAt": "2026-09-20T22:30:05Z",
      "endedAt": "2026-09-20T22:32:27Z"
    }
  ]
}`
  }
];

export default function ApiDocumentationPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'javascript' | 'python'>('curl');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif", padding: '1.5rem 1rem' }}>
      
      {/* Breadcrumb & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '13px', color: '#64748b' }}>
        <Link href="/dashboard/v3/settings" style={{ color: '#1b5a92', textDecoration: 'none', fontWeight: 650 }}>
          ← Back to Settings & API Keys
        </Link>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 700 }}>API Documentation</span>
      </div>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #061b31 0%, #0b2447 100%)',
        borderRadius: '18px',
        padding: '2rem 2.25rem',
        color: '#ffffff',
        marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(6, 27, 49, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 800, marginBottom: '0.75rem' }}>
          ⚡ REST API GATEWAY V1 • PRODUCTION SPECIFICATION
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 850, margin: '0 0 0.5rem 0' }}>
          Amira Telephony & AI Agent REST API
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', margin: 0, maxWidth: '750px', lineHeight: 1.6 }}>
          Automate outbound calling campaigns, query real-time voice transcripts, provision specialized AI agents, and sync multi-channel CRM records using your secret API key.
        </p>
      </div>

      {/* Authentication Guide Card */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
          🔐 Authentication
        </h3>
        <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
          Authenticate all API requests by providing your secret key in the <code>Authorization</code> header:
        </p>
        <div style={{ backgroundColor: '#0f172a', padding: '0.85rem 1.25rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <code style={{ color: '#38bdf8', fontSize: '13.5px', fontFamily: 'monospace' }}>
            Authorization: Bearer amira_live_sec_your_secret_key
          </code>
          <button
            onClick={() => handleCopy("Authorization: Bearer amira_live_sec_your_secret_key", "auth-header")}
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
          >
            {copiedId === "auth-header" ? "✓ Copied" : "Copy Header"}
          </button>
        </div>
      </div>

      {/* Language Switcher Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Available Endpoints
        </h2>
        <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          {(['curl', 'javascript', 'python'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: selectedLanguage === lang ? '#ffffff' : 'transparent',
                color: selectedLanguage === lang ? '#0f172a' : '#64748b',
                fontWeight: 750,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: selectedLanguage === lang ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {lang === 'curl' ? 'cURL' : lang === 'javascript' ? 'Node.js / TS' : 'Python'}
            </button>
          ))}
        </div>
      </div>

      {/* Endpoints List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {ENDPOINTS.map(ep => {
          const codeSnippet = ep[selectedLanguage];
          const methodColor = ep.method === 'GET' ? '#047857' : ep.method === 'POST' ? '#1d4ed8' : '#b45309';
          const methodBg = ep.method === 'GET' ? '#dcfce7' : ep.method === 'POST' ? '#dbeafe' : '#fef3c7';

          return (
            <div key={ep.id} style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              
              {/* Endpoint Header */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: methodBg, color: methodColor, fontSize: '11px', fontWeight: 850, padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.05em' }}>
                    {ep.method}
                  </span>
                  <code style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{ep.path}</code>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>•</span>
                  <span style={{ fontSize: '14px', fontWeight: 750, color: '#334155' }}>{ep.title}</span>
                </div>
              </div>

              {/* Description */}
              <div style={{ padding: '1rem 1.5rem 0.5rem 1.5rem' }}>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  {ep.description}
                </p>
              </div>

              {/* Code Snippet Box */}
              <div style={{ padding: '1rem 1.5rem 1.5rem 1.5rem' }}>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                      Request Example ({selectedLanguage.toUpperCase()})
                    </span>
                    <button
                      onClick={() => handleCopy(codeSnippet, ep.id + '-code')}
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '0.3rem 0.65rem', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {copiedId === ep.id + '-code' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre style={{ margin: 0, padding: '1rem', overflowX: 'auto', fontSize: '12.5px', color: '#f8fafc', lineHeight: 1.6, fontFamily: 'monospace' }}>
                    <code>{codeSnippet}</code>
                  </pre>
                </div>

                {/* Response Example Box */}
                <div style={{ marginTop: '1rem', backgroundColor: '#0b1329', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b' }}>
                  <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981' }}>
                      Response Example (200 OK)
                    </span>
                  </div>
                  <pre style={{ margin: 0, padding: '0.85rem 1rem', overflowX: 'auto', fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, fontFamily: 'monospace' }}>
                    <code>{ep.response}</code>
                  </pre>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
