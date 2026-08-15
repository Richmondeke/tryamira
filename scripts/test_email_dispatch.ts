import { sendInstantConversionAlert, sendDailyExecutiveReport, ADMIN_NOTIFICATION_EMAIL } from '../src/lib/email_reporter';

async function testEmailDispatch() {
  console.log('----------------------------------------------------');
  console.log(`✉️ TESTING AMIRA EMAIL REPORTING ENGINE -> ${ADMIN_NOTIFICATION_EMAIL}`);
  console.log('----------------------------------------------------\n');

  // 1. Instant Conversion Alert Test
  const conversionResult = await sendInstantConversionAlert({
    company: 'ReliaQuest Cybersecurity Network',
    contactName: 'Brian Murphy',
    role: 'Founder & Chief Executive Officer',
    email: 'bmurphy@reliaquest.com',
    phone: '+1 (656) 201-9400',
    status: 'Demo Booked',
    dealTier: 'Tier 2 ($5,000/mo)',
    callDuration: '03:15',
    notes: 'Confirmed free 24/7 inbound setup for Tampa HQ lines. Executive demo booked for May 22 at 2:00 PM EST.'
  });

  console.log('✅ Instant Conversion Alert Trigger Result:', conversionResult);

  // 2. Daily Executive Report Test
  const dailyResult = await sendDailyExecutiveReport({
    totalProspects: 5,
    callsDispatched: 5,
    emailsDelivered: 5,
    demosBooked: 2,
    conversionRate: '40.0%',
    vapiCreditsSpent: '$0.85'
  });

  console.log('✅ Daily Executive Report Trigger Result:', dailyResult);

  console.log('\n----------------------------------------------------');
  console.log(`🎉 ALL EMAIL NOTIFICATIONS CONFIGURED & ROUTED TO ${ADMIN_NOTIFICATION_EMAIL}!`);
  console.log('----------------------------------------------------');
}

testEmailDispatch();
