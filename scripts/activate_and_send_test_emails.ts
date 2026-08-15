import { sendInstantConversionAlert, sendDailyExecutiveReport, ADMIN_NOTIFICATION_EMAIL } from '../src/lib/email_reporter';
import { executeComposioAction } from '../src/app/actions/integrations';

async function activateAndSendTestEmails() {
  console.log('----------------------------------------------------');
  console.log(`🚀 ACTIVATING AMIRA COMPOSIO EMAIL DISPATCH ENGINE`);
  console.log(`✉️ Target Admin Recipient: ${ADMIN_NOTIFICATION_EMAIL}`);
  console.log('----------------------------------------------------\n');

  console.log('📌 1. DISPATCHING LIVE INSTANT LEAD CONVERSION ALERT...');
  const conversionAlertRes = await sendInstantConversionAlert({
    company: 'ReliaQuest Cybersecurity (Tampa, FL)',
    contactName: 'Brian Murphy',
    role: 'Founder & Chief Executive Officer',
    email: 'bmurphy@reliaquest.com',
    phone: '+1 (656) 201-9400',
    status: 'Demo Booked',
    dealTier: 'Tier 2 ($5,000/mo Enterprise SaaS)',
    callDuration: '03:15',
    notes: 'Confirmed free setup for Tampa HQ lines. Executive demo booked for May 22 at 2:00 PM EST.'
  });
  console.log('✅ Conversion Alert Status:', conversionAlertRes, '\n');

  console.log('📌 2. DISPATCHING LIVE DAILY EXECUTIVE CAMPAIGN REPORT...');
  const dailyReportRes = await sendDailyExecutiveReport({
    totalProspects: 5,
    callsDispatched: 5,
    emailsDelivered: 5,
    demosBooked: 2,
    conversionRate: '40.0%',
    vapiCreditsSpent: '$0.85'
  });
  console.log('✅ Daily Report Status:', dailyReportRes, '\n');

  console.log('📌 3. DISPATCHING LIVE MISSED CALL FOLLOW-UP DEMO VIA COMPOSIO GMAIL...');
  const composioRes = await executeComposioAction('GMAIL_SEND_EMAIL', {
    recipient_email: ADMIN_NOTIFICATION_EMAIL,
    subject: 'Amira Voice AI — Live Activation Test & Campaign Status',
    body: `Hi Richmond,

This is an automated live activation test from Amira Autonomous Sales Engine via Composio Integration.

System Status:
• Outbound Call Dispatcher: ACTIVE (+1 656 Local Presence Match)
• Email Reporter: ACTIVE (Configured to ${ADMIN_NOTIFICATION_EMAIL})
• Vapi Assistant ID: ae0f0250-c62c-4c65-916e-85af7d7288b7 (Rachel US Female)
• Composio Integration: ACTIVE

Target Admin Email: ${ADMIN_NOTIFICATION_EMAIL}
Timestamp: ${new Date().toISOString()}

Best regards,
Amira Executive Assistant`
  });

  console.log('✅ Composio Direct Test Status:', composioRes);

  console.log('\n----------------------------------------------------');
  console.log(`🎉 TEST EMAIL DISPATCH COMPLETE! ALL ALERTS SENT TO ${ADMIN_NOTIFICATION_EMAIL}`);
  console.log('----------------------------------------------------');
}

activateAndSendTestEmails();
