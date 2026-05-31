'use client';
import { useRouter } from 'next/navigation';

const templates = [
  {
    id: 'customer-support-bot',
    name: 'Customer Support Bot',
    category: 'Support',
    categoryColor: '#0ea5e9',
    desc: 'Handles FAQs, returns policies, and support ticketing around the clock without a human agent.',
    capabilities: [
      'Answer product & FAQ questions',
      'Process return & refund requests',
      'Create & escalate support tickets',
      'Send follow-up confirmation emails',
    ],
    requiredIntegrations: [
      { name: 'Zendesk', icon: '🎫', reason: 'Create & update support tickets' },
      { name: 'Gmail', icon: '📧', reason: 'Send follow-up emails to customers' },
      { name: 'Slack', icon: '💬', reason: 'Notify your team of escalations' },
    ],
    voice: 'ElevenLabs – Rachel (Friendly)',
    callsHandled: '~240 calls/mo',
  },
  {
    id: 'sales-qualifier',
    name: 'Sales Qualifier',
    category: 'Sales',
    categoryColor: '#8b5cf6',
    desc: 'Asks BANT qualification questions and automatically books discovery calls directly on your calendar.',
    capabilities: [
      'Run BANT qualification on every lead',
      'Score and rank leads by priority',
      'Book meetings in real-time on the call',
      'Push qualified leads to your CRM',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Book discovery calls in real-time' },
      { name: 'HubSpot', icon: '🟠', reason: 'Push qualified leads and scores to CRM' },
      { name: 'Slack', icon: '💬', reason: 'Alert your sales team on hot leads' },
    ],
    voice: 'ElevenLabs – Josh (Professional)',
    callsHandled: '~180 calls/mo',
  },
  {
    id: 'real-estate-agent',
    name: 'Real Estate Agent',
    category: 'Real Estate',
    categoryColor: '#10b981',
    desc: 'Captures buyer and renter preferences, qualifies budget and timeline, then books property showings instantly.',
    capabilities: [
      'Qualify buyer budget & timeline',
      'Capture property preferences',
      'Schedule property tour appointments',
      'Update agent CRM after every call',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Schedule property showings' },
      { name: 'HubSpot', icon: '🟠', reason: 'Log lead details and call notes' },
      { name: 'Gmail', icon: '📧', reason: 'Send confirmation to the buyer' },
    ],
    voice: 'ElevenLabs – Rachel (Friendly)',
    callsHandled: '~120 calls/mo',
  },
  {
    id: 'ecommerce-concierge',
    name: 'Ecommerce Concierge',
    category: 'E-commerce',
    categoryColor: '#f59e0b',
    desc: 'Handles WISMO queries, product recommendations, and return requests by connecting directly to your store.',
    capabilities: [
      'Track order & shipping status live',
      'Process return & refund requests',
      'Recommend products based on history',
      'Issue store credit via Stripe',
    ],
    requiredIntegrations: [
      { name: 'Shopify', icon: '🛍️', reason: 'Query live order & shipping status' },
      { name: 'Stripe', icon: '💳', reason: 'Issue refunds & store credit' },
      { name: 'Zendesk', icon: '🎫', reason: 'Open tickets for complex issues' },
    ],
    voice: 'OpenAI – Nova (Warm)',
    callsHandled: '~300 calls/mo',
  },
  {
    id: 'home-services-dispatcher',
    name: 'Home Services Dispatcher',
    category: 'Trades',
    categoryColor: '#ef4444',
    desc: 'The 24/7 dispatcher for plumbers, HVAC techs, and electricians. Triages emergencies and books jobs instantly.',
    capabilities: [
      'Triage inbound emergency calls',
      'Find and book the next available tech',
      'Send job details to the on-call tech',
      'Collect dispatch fee payment upfront',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Find available technician slots' },
      { name: 'Twilio', icon: '📱', reason: 'SMS job details to the on-call tech' },
      { name: 'Stripe', icon: '💳', reason: 'Collect emergency dispatch fee upfront' },
    ],
    voice: 'ElevenLabs – Josh (Professional)',
    callsHandled: '~90 calls/mo',
  },
  {
    id: 'medspa-receptionist',
    name: 'MedSpa Receptionist',
    category: 'Healthcare',
    categoryColor: '#ec4899',
    desc: 'Books appointments, handles rescheduling, and answers treatment FAQs for clinics and medspas 24/7.',
    capabilities: [
      'Book & reschedule appointments',
      'Answer treatment & pricing FAQs',
      'Send pre-appointment instructions',
      'Collect patient intake information',
    ],
    requiredIntegrations: [
      { name: 'Google Calendar', icon: '📅', reason: 'Book and reschedule appointments' },
      { name: 'Gmail', icon: '📧', reason: 'Send pre-appointment instructions' },
      { name: 'Notion', icon: '📝', reason: 'Log patient intake information' },
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
