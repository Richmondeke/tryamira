'use client';
import { useRouter } from 'next/navigation';

const templates = [
  {
    id: 'emergency-plumber',
    name: 'Emergency Plumbing Dispatcher',
    category: 'Plumbing',
    categoryColor: '#0ea5e9',
    desc: 'Triages plumbing emergencies (leaks, floods), books repair slots, collects dispatch fees, and alerts your plumber.',
    capabilities: [
      'Triage emergency vs routine calls',
      'Schedule appointments on Jobber/GCal',
      'Collect booking deposits via Stripe',
      'Dispatch tech details via Twilio SMS',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Find & book plumber slots' },
      { name: 'Stripe', icon: '💳', reason: 'Collect emergency dispatch fees' },
      { name: 'Twilio', icon: '📱', reason: 'SMS job notes to the active plumber' },
    ],
    voice: 'ElevenLabs – Rachel (Friendly)',
    callsHandled: '~240 calls/mo',
  },
  {
    id: 'hvac-scheduler',
    name: 'HVAC Repair Scheduler',
    category: 'HVAC',
    categoryColor: '#8b5cf6',
    desc: 'Qualifies heating/cooling failures, schedules technician slots, and logs furnace/AC details to your CRM.',
    capabilities: [
      'Qualify system details (furnace, AC)',
      'Cross-reference open service slots',
      'Log call history and customer CRM logs',
      'Send confirmation email receipts',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Book available service slots' },
      { name: 'HubSpot', icon: '🟠', reason: 'Log system notes and customer details' },
      { name: 'Gmail', icon: '📧', reason: 'Send confirmation receipts' },
    ],
    voice: 'ElevenLabs – Josh (Professional)',
    callsHandled: '~180 calls/mo',
  },
  {
    id: 'electrical-dispatcher',
    name: 'Electrical Dispatcher',
    category: 'Electrical',
    categoryColor: '#10b981',
    desc: 'Triages power outages and electrical safety hazards, books emergency slots, and dispatches field electricians.',
    capabilities: [
      'Triage safety hazards and outages',
      'Book emergency electrician slots',
      'Pre-authorize dispatch fees live',
      'SMS hazard briefs to electricians',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Book urgent electrician slots' },
      { name: 'Stripe', icon: '💳', reason: 'Collect safety check deposits' },
      { name: 'Twilio', icon: '📱', reason: 'Alert electrician on hazard notes' },
    ],
    voice: 'ElevenLabs – Rachel (Friendly)',
    callsHandled: '~120 calls/mo',
  },
  {
    id: 'tow-dispatcher',
    name: 'Tow Truck Dispatcher',
    category: 'Logistics',
    categoryColor: '#f59e0b',
    desc: 'Captures breakdown locations, vehicle details, books roadside service windows, and dispatches tow drivers.',
    capabilities: [
      'Capture pickup & drop-off locations',
      'Qualify vehicle issue & drive types',
      'Schedule driver arrival windows',
      'SMS job dispatch briefs to drivers',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Book driver scheduling slots' },
      { name: 'Twilio', icon: '📱', reason: 'Alert driver on location and vehicle' },
    ],
    voice: 'OpenAI – Nova (Warm)',
    callsHandled: '~300 calls/mo',
  },
  {
    id: 'locksmith-dispatcher',
    name: 'Emergency Locksmith Dispatcher',
    category: 'Security',
    categoryColor: '#ef4444',
    desc: 'Triages residential/commercial lockout emergencies, schedules mobile locksmiths, and pre-authorizes dispatch deposits.',
    capabilities: [
      'Triage lockouts & security failures',
      'Schedule mobile locksmith arrival',
      'Collect emergency deposits live',
      'SMS lockout details to locksmiths',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Find mobile locksmith slots' },
      { name: 'Stripe', icon: '💳', reason: 'Collect booking deposit fees' },
      { name: 'Twilio', icon: '📱', reason: 'Alert locksmith with key details' },
    ],
    voice: 'ElevenLabs – Josh (Professional)',
    callsHandled: '~90 calls/mo',
  },
  {
    id: 'cleaning-dispatcher',
    name: 'Cleaning Services Dispatcher',
    category: 'Cleaning',
    categoryColor: '#ec4899',
    desc: 'Qualifies home size and cleaning preferences, schedules recurring slots, and updates customer intake records.',
    capabilities: [
      'Qualify home size & cleaning needs',
      'Schedule recurring clean appointments',
      'Send intake notes to customer files',
      'Email confirmation schedules',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Schedule cleaner calendars' },
      { name: 'Notion', icon: '📝', reason: 'Update customer intake files' },
      { name: 'Gmail', icon: '📧', reason: 'Send confirmation details' },
    ],
    voice: 'ElevenLabs – Rachel (Friendly)',
    callsHandled: '~150 calls/mo',
  },
];

export default function Page() {
  const router = useRouter();

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>Agent Templates</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>
          Pre-built AI employees ready to deploy in 60 seconds. Each template includes a system prompt, voice, and required workflows.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--stripe-border)',
              borderRadius: '8px',
              boxShadow: 'var(--stripe-shadow-ambient)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minHeight: '450px',
            }}
          >
            {/* Card Header */}
            <div style={{ padding: '1.25rem 1.25rem 1rem 1.25rem', borderBottom: '1px solid var(--stripe-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: tpl.categoryColor,
                  backgroundColor: `${tpl.categoryColor}18`,
                  padding: '2px 8px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {tpl.category}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--stripe-muted)', backgroundColor: '#f6f9fc', padding: '2px 8px', borderRadius: '4px' }}>
                  {tpl.callsHandled}
                </span>
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0' }}>{tpl.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--stripe-body)', margin: 0, lineHeight: 1.6 }}>{tpl.desc}</p>
            </div>

            {/* Capabilities */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--stripe-border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--stripe-label)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                What it can do
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {tpl.capabilities.map((cap, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#10b981', fontSize: '12px', flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '12px', color: 'var(--stripe-body)' }}>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Integrations */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--stripe-border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--stripe-label)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                Required integrations
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {tpl.requiredIntegrations.map((int, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                    <span style={{ fontSize: '14px' }}>{int.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{int.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--stripe-muted)' }}>{int.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
              <button
                onClick={() => router.push(`/dashboard/ai-agent?template=${tpl.id}`)}
                style={{
                  width: '100%',
                  backgroundColor: '#4caf50',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.65rem 1rem',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.1px',
                  display: 'block',
                }}
              >
                Hire Agent →
              </button>
              <button
                onClick={() => router.push(`/dashboard/ai-agent?template=${tpl.id}&preview=true`)}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: 'var(--stripe-muted)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.4rem',
                  fontSize: '12px',
                  fontWeight: 400,
                  cursor: 'pointer',
                }}
              >
                Preview template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
