'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('getting-started');

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", backgroundColor: '#ffffff', color: '#0d0f1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#ffffff', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/">
              <img src="/amira-logo-footer.svg" alt="Amira AI" style={{ height: '28px', width: 'auto' }} />
            </Link>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#10b98115', color: '#047857', border: '1px solid #10b98130' }}>
              DEVELOPER DOCS v2.4
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/" style={{ fontSize: '14px', fontWeight: 600, color: '#475569', textDecoration: 'none' }}>Home</Link>
            <Link href="/dashboard/v3" style={{ padding: '0.55rem 1.2rem', borderRadius: '8px', backgroundColor: '#10b981', color: '#ffffff', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none' }}>
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', flex: 1, display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', padding: '2rem 1.5rem', boxSizing: 'border-box' }}>
        {/* Docs Sidebar Navigation */}
        <aside style={{ borderRight: '1px solid rgba(0,0,0,0.08)', paddingRight: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Getting Started</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {['getting-started', 'quickstart-voice', 'webchat-sdk'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none',
                    backgroundColor: activeTab === tab ? '#1b5a9215' : 'transparent',
                    color: activeTab === tab ? '#1b5a92' : '#475569',
                    fontWeight: activeTab === tab ? 750 : 500, fontSize: '13.5px', cursor: 'pointer'
                  }}
                >
                  {tab === 'getting-started' && '🚀 Overview & Setup'}
                  {tab === 'quickstart-voice' && '🎙️ Voice Agent API'}
                  {tab === 'webchat-sdk' && '💬 Webchat Embed SDK'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>API & Webhooks</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {['tool-actions', 'vapi-webhooks'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none',
                    backgroundColor: activeTab === tab ? '#1b5a9215' : 'transparent',
                    color: activeTab === tab ? '#1b5a92' : '#475569',
                    fontWeight: activeTab === tab ? 750 : 500, fontSize: '13.5px', cursor: 'pointer'
                  }}
                >
                  {tab === 'tool-actions' && '⚡ Autonomous Tools'}
                  {tab === 'vapi-webhooks' && '🔗 Webhooks Payload'}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ minWidth: 0 }}>
          {activeTab === 'getting-started' && (
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>Amira AI Developer Quickstart</h1>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
                Welcome to the Amira AI developer documentation. Build, deploy, and scale autonomous AI customer support agents across Web, Voice Telephony, WhatsApp, and Email.
              </p>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '1.5rem', margin: '2rem 0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 750, color: '#0f172a', margin: '0 0 0.75rem 0' }}>1. Provision Private API Keys</h3>
                <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 1rem 0' }}>Pass your bearer token in the authorization header for REST requests:</p>
                <pre style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '1rem', borderRadius: '8px', fontSize: '13px', overflowX: 'auto' }}>
                  {`Authorization: Bearer YOUR_AMIRA_API_KEY\nContent-Type: application/json`}
                </pre>
              </div>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '1.5rem', margin: '2rem 0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 750, color: '#0f172a', margin: '0 0 0.75rem 0' }}>2. Dispatch Outbound Voice Call</h3>
                <pre style={{ backgroundColor: '#0f172a', color: '#4ade80', padding: '1rem', borderRadius: '8px', fontSize: '13px', overflowX: 'auto' }}>
{`POST https://api.vapi.ai/call
{
  "phoneNumberId": "phone_usr_12345",
  "customer": { "number": "+14152633600", "name": "Orlando Bravo" },
  "assistantId": "asst_amira_v3",
  "metadata": { "workspace_id": "ws_live" }
}`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'quickstart-voice' && (
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>Voice Telephony & Audio Streaming API</h1>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
                Inspect real-time voice call streams, audio recordings hosted on Cloudflare R2, STIR/SHAKEN verification headers, and turn-by-turn speech dialogue payloads.
              </p>

              <pre style={{ backgroundColor: '#0f172a', color: '#f43f5e', padding: '1.25rem', borderRadius: '12px', fontSize: '13px', overflowX: 'auto', marginTop: '1.5rem' }}>
{`// Fetch Call History with Audio Stream URLs
GET /dashboard/v3/calls/api
Headers: Authorization: Bearer <vapi_private_key>

Response 200 OK:
[
  {
    "id": "4b308d23-4d8e-4e8c-aad7-12e7280211d7",
    "status": "ended",
    "recordingUrl": "https://...r2.cloudflarestorage.com/...mono.wav",
    "duration": 75,
    "cost": 0.05,
    "customer": { "name": "Orlando Bravo", "number": "+14152633600" }
  }
]`}
              </pre>
            </div>
          )}

          {activeTab === 'webchat-sdk' && (
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>Webchat Embed Script SDK</h1>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
                Embed the Amira AI webchat widget on any site with 1 line of HTML script code. Connects instantly to your omnichannel inbox.
              </p>

              <pre style={{ backgroundColor: '#0f172a', color: '#a7f3d0', padding: '1.25rem', borderRadius: '12px', fontSize: '13px', overflowX: 'auto', marginTop: '1.5rem' }}>
{`<!-- Amira AI Webchat Widget Embed -->
<script 
  src="https://heyamira.com/widget.js" 
  data-agent-id="asst_amira_v3"
  data-primary-color="#1b5a92"
  async>
</script>`}
              </pre>
            </div>
          )}

          {activeTab === 'tool-actions' && (
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>Autonomous Tool Execution API</h1>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
                Configure tool functions so Amira AI agents can create Linear tickets, push leads to HubSpot CRM, post Slack channel alerts, and schedule Google Calendar events autonomously.
              </p>

              <div style={{ backgroundColor: '#10b98110', border: '1px solid #10b98130', borderRadius: '12px', padding: '1.25rem', margin: '1.5rem 0' }}>
                <div style={{ fontWeight: 750, color: '#047857' }}>Supported Tool Functions</div>
                <div style={{ fontSize: '13.5px', color: '#475569', marginTop: '0.4rem' }}>
                  ✓ <code>linear_create_issue</code> • ✓ <code>hubspot_create_contact</code> • ✓ <code>slack_post_message</code> • ✓ <code>calendar_book_event</code>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vapi-webhooks' && (
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1b5a92', margin: '0 0 0.5rem 0' }}>Webhooks Payload Reference</h1>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
                Receive real-time webhooks at <code>/api/vapi/webhook</code> whenever calls start, complete, or trigger tool execution callbacks.
              </p>
            </div>
          )}
        </main>
      </div>

      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '2rem 1.5rem', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        © 2026 Amira Technologies Inc. All rights reserved. • <Link href="/community" style={{ color: '#1b5a92', textDecoration: 'none' }}>Community</Link> • <Link href="/status" style={{ color: '#1b5a92', textDecoration: 'none' }}>System Status</Link>
      </footer>
    </div>
  );
}
