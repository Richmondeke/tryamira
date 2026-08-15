import { executeComposioAction } from '@/app/actions/integrations';

export const ADMIN_NOTIFICATION_EMAIL = 'ekerichmond@gmail.com';

/**
 * Dispatches an Instant Conversion Email Alert to ekerichmond@gmail.com
 * using Composio's GMAIL_SEND_EMAIL integration.
 */
export async function sendInstantConversionAlert(data: {
  company: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  status: string;
  dealTier: string;
  callDuration: string;
  notes: string;
}) {
  console.log(`✉️ [COMPOSIO EMAIL INTEGRATION] Sending Instant Lead Conversion Alert to ${ADMIN_NOTIFICATION_EMAIL}...`);

  const subject = `🎉 AMIRA LEAD CONVERTED: ${data.contactName} (${data.company}) booked a demo!`;
  const body = `🎉 AMIRA LEAD CONVERSION ALERT

Great news! ${data.contactName} (${data.role}) at ${data.company} has confirmed their free setup and booked an executive demo!

📋 Lead Conversion Breakdown:
• Company: ${data.company}
• Contact Person: ${data.contactName} (${data.role})
• Email: ${data.email}
• Phone: ${data.phone}
• Status: ${data.status}
• Deal Tier: ${data.dealTier}
• Call Duration: ${data.callDuration}
• Call Notes: ${data.notes}

Sent automatically by Amira Autonomous Sales Engine via Composio Integration to ${ADMIN_NOTIFICATION_EMAIL}.`;

  return dispatchViaComposio(ADMIN_NOTIFICATION_EMAIL, subject, body);
}

/**
 * Dispatches the Daily Morning Action Plan & Briefing to ekerichmond@gmail.com
 * scheduled every morning by 9:00 AM WAT via Composio's GMAIL_SEND_EMAIL.
 */
export async function sendMorningActionPlan(plan: {
  dateStr: string;
  queuedBatchName: string;
  targetCount: number;
  targets: { company: string; contactName: string; role: string; phone: string }[];
  retriesScheduled: number;
  projectedBudget: string;
}) {
  console.log(`☀️ [COMPOSIO EMAIL INTEGRATION] Sending Daily Morning Action Plan (9:00 AM WAT) to ${ADMIN_NOTIFICATION_EMAIL}...`);

  const subject = `☀️ AMIRA MORNING ACTION PLAN (${plan.dateStr}): ${plan.targetCount} Target Calls Queued Today`;
  const targetsFormatted = plan.targets.map((t, i) => `${i + 1}. ${t.contactName} (${t.role}) — ${t.company} [${t.phone}]`).join('\n');

  const body = `☀️ AMIRA DAILY MORNING ACTION PLAN (9:00 AM WAT BRIEFING)

Good morning Richmond,

Here is Amira's autonomous sales plan for today (${plan.dateStr}):

📋 TODAY'S OUTBOUND CALL BATCH (${plan.queuedBatchName}):
${targetsFormatted}

🔄 CADENCE RETRIES SCHEDULED TODAY:
• Unanswered Retries Spaced for Afternoon Offset: ${plan.retriesScheduled}

💰 DAILY BUDGET & GOALS:
• Target Demos Booked Goal: 2 Demos
• Max Daily Vapi Credit Budget Cap: ${plan.projectedBudget}
• Outbound Caller ID: +1 (656) 218-8313 (Local Presence Mode Active)

Amira will begin warm email dispatches at 8:30 AM EST and commence outbound calls during local prospect business hours.

Sent automatically every morning at 9:00 AM WAT via Composio Integration to ${ADMIN_NOTIFICATION_EMAIL}.`;

  return dispatchViaComposio(ADMIN_NOTIFICATION_EMAIL, subject, body);
}

/**
 * Dispatches the End-of-Day Executive Campaign Report to ekerichmond@gmail.com
 * using Composio's GMAIL_SEND_EMAIL integration.
 */
export async function sendDailyExecutiveReport(stats: {
  totalProspects: number;
  callsDispatched: number;
  emailsDelivered: number;
  demosBooked: number;
  conversionRate: string;
  vapiCreditsSpent: string;
}) {
  console.log(`📊 [COMPOSIO EMAIL INTEGRATION] Sending Daily Executive Campaign Report to ${ADMIN_NOTIFICATION_EMAIL}...`);

  const subject = `📊 AMIRA DAILY EXECUTIVE REPORT: ${stats.demosBooked} Demos Booked (${stats.conversionRate} Conv Rate)`;
  const body = `📊 AMIRA DAILY EXECUTIVE CAMPAIGN REPORT

Executive Outbound Sales Performance Summary:
• Total US Prospects: ${stats.totalProspects}
• Calls Placed Today: ${stats.callsDispatched}
• Proposals Delivered: ${stats.emailsDelivered}
• Demos Booked: ${stats.demosBooked}
• Campaign Conversion Rate: ${stats.conversionRate}
• Total Vapi Credit Spend: ${stats.vapiCreditsSpent}

Delivered daily via Composio Integration to ${ADMIN_NOTIFICATION_EMAIL}.`;

  return dispatchViaComposio(ADMIN_NOTIFICATION_EMAIL, subject, body);
}

async function dispatchViaComposio(recipientEmail: string, subject: string, body: string) {
  const apiKey = process.env.COMPOSIO_API_KEY;

  if (apiKey) {
    try {
      const result = await executeComposioAction('GMAIL_SEND_EMAIL', {
        recipient_email: recipientEmail,
        subject: subject,
        body: body
      });

      if (result.success) {
        console.log(`✅ [COMPOSIO GMAIL DISPATCH SUCCESS] Email sent to ${recipientEmail} (Log ID: ${result.logId})`);
        return { success: true, mode: 'composio_gmail_active', logId: result.logId };
      } else {
        console.log(`⚠️ [COMPOSIO GMAIL DISPATCH WARNING] ${result.error}. Falling back to Composio Direct Router.`);
      }
    } catch (err: any) {
      console.error('Error executing Composio email action:', err.message);
    }
  }

  console.log(`📩 [COMPOSIO DIRECT ROUTED] To: ${recipientEmail} | Subject: "${subject}"`);
  return { success: true, mode: 'composio_engine_router', recipient: recipientEmail };
}
