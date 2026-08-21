export interface AgentRequiredIntegration {
  name: string;
  icon: string;
  reason: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  desc: string;
  capabilities: string[];
  requiredIntegrations: AgentRequiredIntegration[];
  voice: string;
  callsHandled: string;
  prompt: string;
}

export const templatesData: AgentTemplate[] = [
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
    voice: 'rachel',
    callsHandled: '~240 calls/mo',
    prompt: `You are an expert Emergency Plumbing Dispatcher.
Your goal is to triage inbound calls for plumbing issues.
1. Determine if it is an emergency (flooding, active burst pipe) or routine maintenance (slow drain, quote).
2. Book a plumber appointment using Google Calendar.
3. Collect the service call deposit fee live using Stripe.
4. Dispatch the technician details automatically via Twilio SMS.`
  },
  {
    id: 'hvac-scheduler',
    name: 'HVAC Repair Scheduler',
    category: 'HVAC',
    categoryColor: '#10b981',
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
    voice: 'josh',
    callsHandled: '~180 calls/mo',
    prompt: `You are a professional HVAC Repair Scheduler.
Your objective is to schedule furnace or air conditioning repair service calls.
1. Triage the heating or cooling issue and note down system type/details.
2. Find available time slots and book appointments in Google Calendar.
3. Log customer details and call transcripts directly to HubSpot.
4. Send email booking confirmations via Gmail.`
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
    voice: 'rachel',
    callsHandled: '~120 calls/mo',
    prompt: `You are a reliable AI Electrical Dispatcher.
Your goal is to handle incoming electrical service requests and hazards.
1. Ask the customer about the nature of the issue (outage, sparks, routine wiring).
2. Book emergency electrician appointments in Google Calendar.
3. Secure safety check deposits via Stripe.
4. Dispatch active electricians via Twilio SMS with hazard briefings.`
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
    voice: 'nova',
    callsHandled: '~300 calls/mo',
    prompt: `You are a Tow Truck Dispatcher assistant.
Your main goals:
1. Capture the customer's exact location, destination, vehicle make/model, and drive type.
2. Coordinate driver calendars via Google Calendar.
3. Dispatch active tow truck drivers via Twilio with the location and truck details.`
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
    voice: 'josh',
    callsHandled: '~90 calls/mo',
    prompt: `You are a 24/7 Locksmith Dispatcher.
Your role is to triage lockout emergencies (auto, residential, commercial).
1. Capture key details and location.
2. Check Google Calendar for the next available locksmith.
3. Collect lock-out booking deposits via Stripe.
4. Alert the locksmith via Twilio with client and hardware details.`
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
    voice: 'rachel',
    callsHandled: '~150 calls/mo',
    prompt: `You are a friendly Cleaning Services Dispatcher.
Your goal is to qualify clean requests and schedule jobs.
1. Ask the customer about the size of their home (bedrooms, bathrooms) and specific clean preferences.
2. Schedule cleaner bookings in Google Calendar.
3. Log customer intake preferences in Notion.
4. Send summary confirmation emails via Gmail.`
  }
];
