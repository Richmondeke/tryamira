'use client';

import { useState } from 'react';
import SiteNavbar from '@/components/layout/SiteNavbar';
import SiteFooter from '@/components/layout/SiteFooter';
import GlowIcon from '@/components/GlowIcon';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const navCategories = [
    {
      title: 'Getting Started',
      items: [
        { id: 'overview', label: 'Overview & Amira Auth', iconName: 'key-outline' },
        { id: 'agents-crud', label: 'Create & Manage Agents', iconName: 'user-outline' },
        { id: 'knowledge-base', label: 'Knowledge Base & RAG Upload', iconName: 'book-open-outline' },
        { id: 'voice-telephony', label: 'Outbound & Inbound Calls', iconName: 'phone-outline' },
        { id: 'webchat-sdk', label: 'Webchat Embed SDK', iconName: 'message-square-outline' },
      ]
    },
    {
      title: 'Core Engine & RAG',
      items: [
        { id: 'agent-execution', label: 'Agent Commands & Reasoning', iconName: 'zap-outline' },
        { id: 'tool-actions', label: 'Live Tool Calling & Composio', iconName: 'gear-outline' },
      ]
    },
    {
      title: 'Webhooks & Events',
      items: [
        { id: 'vapi-webhooks', label: 'Call Lifecycle Webhooks', iconName: 'link-outline' },
      ]
    }
  ];

  return (
    <div style={{ fontFamily: "'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif", backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteNavbar />

      {/* Docs Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1b5a92 0%, #0f375a 100%)', color: '#ffffff', paddingTop: '7rem', paddingBottom: '3.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ backgroundColor: '#10b981', color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '99px', letterSpacing: '0.05em' }}>AMIRA PUBLIC API GATEWAY</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600 }}>• REST API v1 Reference</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 850, margin: 0, letterSpacing: '-0.02em' }}>Amira Developer Hub & API Specification</h1>
          <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.85)', margin: '0.75rem 0 0 0', maxWidth: '820px', lineHeight: 1.6 }}>
            Build, deploy, and manage AI voice agents, knowledge bases, outbound calls, and tool integrations via the Amira API Gateway at <code>https://api.heyamira.com/v1</code>.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', padding: '2.5rem 1.5rem', boxSizing: 'border-box' }}>
        
        {/* Docs Sidebar Navigation */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'sticky', top: '6rem', alignSelf: 'start' }}>
          {navCategories.map(cat => (
            <div key={cat.title}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.65rem' }}>{cat.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {cat.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      textAlign: 'left', padding: '0.65rem 0.85rem', borderRadius: '10px', border: 'none',
                      backgroundColor: activeTab === item.id ? '#1b5a92' : 'transparent',
                      color: activeTab === item.id ? '#ffffff' : '#334155',
                      fontWeight: activeTab === item.id ? 750 : 600, fontSize: '13.5px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <GlowIcon name={item.iconName} size={16} color={activeTab === item.id ? '#ffffff' : '#1b5a92'} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginTop: '1rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1b5a92', marginBottom: '0.35rem' }}>Need Custom SIP Trunks?</div>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 0.85rem 0', lineHeight: 1.4 }}>Configure dedicated Twilio, Bandwidth, or Plivo BYOC Gateways with Amira.</p>
            <a href="/contact" style={{ display: 'block', textAlign: 'center', backgroundColor: '#10b981', color: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '12px', fontWeight: 750, textDecoration: 'none' }}>Talk to Telephony Team</a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ minWidth: 0, backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          
          {/* TAB 1: OVERVIEW & AMIRA AUTH */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 850, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Amira API Gateway & Authentication</h2>
                <p style={{ fontSize: '15px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                  The <strong>Amira Public API Gateway</strong> provides high-speed, secure REST endpoints for provisioning AI agents, dispatching voice calls, uploading RAG documents, and managing live customer conversations.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 750, color: '#64748b', textTransform: 'uppercase' }}>Amira Production Gateway</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#1b5a92', marginTop: '0.35rem', fontFamily: 'monospace' }}>https://api.heyamira.com/v1</div>
                </div>
                <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 750, color: '#64748b', textTransform: 'uppercase' }}>Authentication Header</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#10b981', marginTop: '0.35rem' }}>Bearer YOUR_AMIRA_API_KEY</div>
                </div>
                <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 750, color: '#64748b', textTransform: 'uppercase' }}>Supported AI Engines</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>GPT-4o / ElevenLabs / Nova-2</div>
                </div>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '2rem 0 0.75rem 0' }}>API Authentication Header</h3>
              <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <button 
                  onClick={() => copyToClipboard(`Authorization: Bearer YOUR_AMIRA_API_KEY\nContent-Type: application/json`, 'auth-hdr')}
                  style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                >
                  {copiedSnippet === 'auth-hdr' ? '✓ Copied' : 'Copy Header'}
                </button>
                <pre style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '1.25rem', borderRadius: '12px', fontSize: '13.5px', overflowX: 'auto', fontFamily: 'Fira Code, monospace', margin: 0 }}>
                  {`Authorization: Bearer YOUR_AMIRA_API_KEY\nContent-Type: application/json`}
                </pre>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '2rem 0 0.75rem 0' }}>Amira API Architecture Diagram</h3>
              <div style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '1.5rem', borderRadius: '12px', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.5 }}>
{`[ Client Request ] ────> Authorization: Bearer YOUR_AMIRA_API_KEY
                            │
                            ▼
           [ Amira Gateway: https://api.heyamira.com/v1/ ]
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
[ AI Assistants ]   [ Outbound Calls ]    [ Knowledge Base RAG ]
/v1/assistants      /v1/calls            /v1/files`}
              </div>
            </div>
          )}

          {/* TAB 2: CREATE & MANAGE AGENTS */}
          {activeTab === 'agents-crud' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 850, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Agent Management API (Create, Read, Update, Delete)</h2>
                <p style={{ fontSize: '15px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                  Manage AI voice & chat agents programmatically via the Amira API Gateway.
                </p>
              </div>

              {/* 1. Create Agent */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ backgroundColor: '#10b981', color: '#ffffff', fontWeight: 800, fontSize: '11px', padding: '3px 8px', borderRadius: '6px' }}>POST</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>https://api.heyamira.com/v1/assistants</span>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '1rem' }}>Provisions a new AI agent instance in your workspace.</p>

                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <button 
                    onClick={() => copyToClipboard(`curl -X POST "https://api.heyamira.com/v1/assistants" \\\n  -H "Authorization: Bearer $AMIRA_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "name": "Amira Support Operator",\n    "firstMessage": "Hello! Thank you for calling. How can I assist you today?",\n    "systemPrompt": "You are Amira, an intelligent customer support agent.",\n    "voiceProvider": "11labs",\n    "voiceId": "21m00Tcm4TlvDq8ikWAM",\n    "language": "en"\n  }'`, 'curl-create-agent')}
                    style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    {copiedSnippet === 'curl-create-agent' ? '✓ Copied' : 'Copy cURL'}
                  </button>
                  <pre style={{ backgroundColor: '#0f172a', color: '#a7f3d0', padding: '1.25rem', borderRadius: '12px', fontSize: '13px', overflowX: 'auto', fontFamily: 'Fira Code, monospace' }}>
{`curl -X POST "https://api.heyamira.com/v1/assistants" \\
  -H "Authorization: Bearer $AMIRA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Amira Support Operator",
    "firstMessage": "Hello! Thank you for calling. How can I assist you today?",
    "systemPrompt": "You are Amira, an intelligent customer support agent.",
    "voiceProvider": "11labs",
    "voiceId": "21m00Tcm4TlvDq8ikWAM",
    "language": "en"
  }'`}
                  </pre>
                </div>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '12px', fontWeight: 750, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Response 201 Created</div>
                  <pre style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '0.75rem', borderRadius: '6px', fontSize: '12px', margin: 0, fontFamily: 'monospace' }}>
{`{
  "success": true,
  "message": "Amira AI Assistant successfully provisioned.",
  "data": {
    "id": "asst_991823a01",
    "name": "Amira Support Operator",
    "created_at": "2026-08-16T10:40:00Z"
  }
}`}
                  </pre>
                </div>
              </div>

              {/* 2. List Agents */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ backgroundColor: '#1b5a92', color: '#ffffff', fontWeight: 800, fontSize: '11px', padding: '3px 8px', borderRadius: '6px' }}>GET</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>https://api.heyamira.com/v1/assistants</span>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '1rem' }}>Lists all configured agents in your workspace.</p>
                <pre style={{ backgroundColor: '#0f172a', color: '#e2e8f0', padding: '1.25rem', borderRadius: '12px', fontSize: '13px', overflowX: 'auto', fontFamily: 'Fira Code, monospace' }}>
{`GET https://api.heyamira.com/v1/assistants
Header: Authorization: Bearer $AMIRA_API_KEY

Response 200 OK:
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "asst_991823a01",
      "name": "Amira Support Operator",
      "firstMessage": "Hello! Thank you for calling."
    }
  ]
}`}
                </pre>
              </div>

              {/* 3. Update Agent */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ backgroundColor: '#e11d48', color: '#ffffff', fontWeight: 800, fontSize: '11px', padding: '3px 8px', borderRadius: '6px' }}>PATCH</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>https://api.heyamira.com/v1/assistants/:id</span>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '1rem' }}>Updates system prompt, greeting, ElevenLabs voice stability, or Deepgram transcription settings.</p>

                <pre style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '1.25rem', borderRadius: '12px', fontSize: '13px', overflowX: 'auto', fontFamily: 'Fira Code, monospace' }}>
{`curl -X PATCH "https://api.heyamira.com/v1/assistants/asst_991823a01" \\
  -H "Authorization: Bearer $AMIRA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "systemPrompt": "You are Amira. Qualify leads and answer inquiries.",
    "firstMessage": "Welcome to Amira AI!",
    "stability": 0.5,
    "similarityBoost": 0.75
  }'`}
                </pre>
              </div>

              {/* 4. Delete Agent */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ backgroundColor: '#dc2626', color: '#ffffff', fontWeight: 800, fontSize: '11px', padding: '3px 8px', borderRadius: '6px' }}>DELETE</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>https://api.heyamira.com/v1/assistants/:id</span>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '1rem' }}>Deletes an agent instance from your workspace.</p>
                <pre style={{ backgroundColor: '#0f172a', color: '#f87171', padding: '1.25rem', borderRadius: '12px', fontSize: '13px', overflowX: 'auto', fontFamily: 'Fira Code, monospace' }}>
{`curl -X DELETE "https://api.heyamira.com/v1/assistants/asst_991823a01" \\
  -H "Authorization: Bearer $AMIRA_API_KEY"`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: KNOWLEDGE BASE & RAG UPLOAD */}
          {activeTab === 'knowledge-base' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 850, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Knowledge Base & Edge RAG Upload API</h2>
                <p style={{ fontSize: '15px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                  Upload product documentation, PDF policies, and text knowledge base files via <code>https://api.heyamira.com/v1/files</code>.
                </p>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ backgroundColor: '#10b981', color: '#ffffff', fontWeight: 800, fontSize: '11px', padding: '3px 8px', borderRadius: '6px' }}>POST</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>https://api.heyamira.com/v1/files</span>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '1rem' }}>Uploads text content or document files, extracts vector embeddings, and attaches them to your agent's Knowledge Base.</p>

                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <button 
                    onClick={() => copyToClipboard(`curl -X POST "https://api.heyamira.com/v1/files" \\\n  -H "Authorization: Bearer $AMIRA_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "title": "Enterprise Refund Policy 2026.txt",\n    "content": "Customers are eligible for a 100% refund within 30 days of purchase...",\n    "assistantId": "asst_991823a01"\n  }'`, 'curl-rag-upload')}
                    style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    {copiedSnippet === 'curl-rag-upload' ? '✓ Copied' : 'Copy cURL'}
                  </button>
                  <pre style={{ backgroundColor: '#0f172a', color: '#a7f3d0', padding: '1.25rem', borderRadius: '12px', fontSize: '13px', overflowX: 'auto', fontFamily: 'Fira Code, monospace' }}>
{`curl -X POST "https://api.heyamira.com/v1/files" \\
  -H "Authorization: Bearer $AMIRA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Enterprise Refund Policy 2026.txt",
    "content": "Customers are eligible for a 100% refund within 30 days of purchase...",
    "assistantId": "asst_991823a01"
  }'`}
                  </pre>
                </div>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '12px', fontWeight: 750, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Response 201 Created</div>
                  <pre style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '0.75rem', borderRadius: '6px', fontSize: '12px', margin: 0, fontFamily: 'monospace' }}>
{`{
  "success": true,
  "message": "Knowledge base document uploaded & synchronized with Amira Edge RAG.",
  "data": {
    "fileId": "file_88192a01",
    "knowledgeBaseId": "kb_88192a01",
    "title": "Enterprise Refund Policy 2026.txt"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OUTBOUND & INBOUND CALLS */}
          {activeTab === 'voice-telephony' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 850, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Outbound & Inbound Voice Calls API</h2>
                <p style={{ fontSize: '15px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                  Dispatch automated outbound calls via <code>https://api.heyamira.com/v1/calls</code> or query call history logs.
                </p>
              </div>

              {/* Dispatch Call */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ backgroundColor: '#10b981', color: '#ffffff', fontWeight: 800, fontSize: '11px', padding: '3px 8px', borderRadius: '6px' }}>POST</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>https://api.heyamira.com/v1/calls</span>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '1rem' }}>Initiates an instant outbound AI voice call.</p>

                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <button 
                    onClick={() => copyToClipboard(`curl -X POST "https://api.heyamira.com/v1/calls" \\\n  -H "Authorization: Bearer $AMIRA_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "assistantId": "asst_991823a01",\n    "customerNumber": "+14152633600",\n    "customerName": "Sarah Connor",\n    "promptOverride": "You are calling Sarah regarding her account upgrade."\n  }'`, 'curl-call-dispatch')}
                    style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    {copiedSnippet === 'curl-call-dispatch' ? '✓ Copied' : 'Copy cURL'}
                  </button>
                  <pre style={{ backgroundColor: '#0f172a', color: '#a7f3d0', padding: '1.25rem', borderRadius: '12px', fontSize: '13px', overflowX: 'auto', fontFamily: 'Fira Code, monospace' }}>
{`curl -X POST "https://api.heyamira.com/v1/calls" \\
  -H "Authorization: Bearer $AMIRA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "assistantId": "asst_991823a01",
    "customerNumber": "+14152633600",
    "customerName": "Sarah Connor",
    "promptOverride": "You are calling Sarah regarding her account upgrade."
  }'`}
                  </pre>
                </div>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '12px', fontWeight: 750, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Response 201 Created</div>
                  <pre style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '0.75rem', borderRadius: '6px', fontSize: '12px', margin: 0, fontFamily: 'monospace' }}>
{`{
  "success": true,
  "message": "Outbound voice call dispatched successfully.",
  "data": {
    "id": "call_991823a01",
    "status": "queued",
    "customer": { "number": "+14152633600", "name": "Sarah Connor" },
    "createdAt": "2026-08-16T10:44:00Z"
  }
}`}
                  </pre>
                </div>
              </div>

              {/* List Calls */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ backgroundColor: '#1b5a92', color: '#ffffff', fontWeight: 800, fontSize: '11px', padding: '3px 8px', borderRadius: '6px' }}>GET</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>https://api.heyamira.com/v1/calls</span>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '1rem' }}>Fetches call history logs and audio recording URLs.</p>
                <pre style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '1.25rem', borderRadius: '12px', fontSize: '13px', overflowX: 'auto', fontFamily: 'Fira Code, monospace' }}>
{`GET https://api.heyamira.com/v1/calls?assistantId=asst_991823a01
Header: Authorization: Bearer $AMIRA_API_KEY`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: WEBCHAT EMBED SDK */}
          {activeTab === 'webchat-sdk' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 850, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Webchat Embed Script SDK</h2>
                <p style={{ fontSize: '15px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                  Embed the Amira AI widget on any website or SPA in seconds with 1 line of HTML script code.
                </p>
              </div>

              <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <pre style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '1.25rem', borderRadius: '12px', fontSize: '13.5px', overflowX: 'auto', fontFamily: 'Fira Code, monospace' }}>
{`<!-- Amira AI Webchat Widget Embed Script -->
<script 
  src="https://heyamira.com/widget.js" 
  data-agent-id="asst_991823a01"
  data-primary-color="#1b5a92"
  data-position="bottom-right"
  async>
</script>`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 6: AGENT COMMANDS & REASONING */}
          {activeTab === 'agent-execution' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 850, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Agent Commands & Reasoning Engine</h2>
                <p style={{ fontSize: '15px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                  Multi-turn conversational execution engine powered by Gemini 2.5 Flash.
                </p>
              </div>

              <pre style={{ backgroundColor: '#0f172a', color: '#a7f3d0', padding: '1.25rem', borderRadius: '12px', fontSize: '13px', overflowX: 'auto', fontFamily: 'Fira Code, monospace' }}>
{`import { executeAmiraCommand } from '@/app/actions/agent';

const result = await executeAmiraCommand("Draft a summary of today's customer calls");`}
              </pre>
            </div>
          )}

          {/* TAB 7: LIVE TOOL CALLING & COMPOSIO */}
          {activeTab === 'tool-actions' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 850, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Live Tool Calling & Composio Bridge</h2>
                <p style={{ fontSize: '15px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                  Connect over 1,000+ SaaS apps via Composio. Your AI voice and chat agents can autonomously trigger API actions directly during live conversations.
                </p>
              </div>

              <div style={{ backgroundColor: '#10b98110', border: '1px solid #10b98130', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ fontWeight: 800, color: '#047857', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <GlowIcon name="zap-outline" size={16} color="#047857" />
                  <span>Real-time Telephony Tool Bridge Endpoint</span>
                </div>
                <div style={{ fontSize: '13.5px', color: '#475569', marginTop: '0.4rem', fontFamily: 'monospace' }}>
                  POST /api/v1/tool
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: CALL LIFE CYCLE WEBHOOKS */}
          {activeTab === 'vapi-webhooks' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 850, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Call Lifecycle Webhook Reference</h2>
                <p style={{ fontSize: '15px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                  Configure your webhook listener at <code>https://heyamira.com/api/v1/webhooks/call</code> to receive real-time call notifications.
                </p>
              </div>

              <pre style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '1.25rem', borderRadius: '12px', fontSize: '13px', overflowX: 'auto', fontFamily: 'Fira Code, monospace' }}>
{`{
  "message": {
    "type": "end-of-call-report",
    "call": {
      "id": "call_991823a01",
      "assistantId": "asst_991823a01",
      "status": "ended",
      "startedAt": "2026-08-16T10:44:00Z",
      "endedAt": "2026-08-16T10:45:30Z",
      "cost": 0.08,
      "endedReason": "customer-ended-call",
      "transcript": "User: I need help with my account. \\nAmira: Sure, I can assist you with that!",
      "recordingUrl": "https://r2.cloudflarestorage.com/vapi-recordings/call_991823a01.wav"
    }
  }
}`}
              </pre>
            </div>
          )}

        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
