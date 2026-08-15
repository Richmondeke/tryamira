import { sendMorningActionPlan, ADMIN_NOTIFICATION_EMAIL } from '../src/lib/email_reporter';
import masterProspectsRaw from '../src/data/master_us_prospects.json';

async function testMorningPlanEmail() {
  console.log('----------------------------------------------------');
  console.log(`☀️ TESTING AMIRA 9:00 AM WAT MORNING BRIEFING EMAIL -> ${ADMIN_NOTIFICATION_EMAIL}`);
  console.log('----------------------------------------------------\n');

  const batch1Targets = masterProspectsRaw.slice(0, 4).map(p => ({
    company: p.company,
    contactName: p.contactName,
    role: p.role,
    phone: p.phone
  }));

  const res = await sendMorningActionPlan({
    dateStr: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
    queuedBatchName: 'Batch 1 (Florida & East Coast B2B Tech Hubs)',
    targetCount: batch1Targets.length,
    targets: batch1Targets,
    retriesScheduled: 1,
    projectedBudget: '$0.85'
  });

  console.log('✅ 9:00 AM WAT Morning Briefing Email Dispatch Result:', res);
  console.log('\n----------------------------------------------------');
  console.log(`🎉 MORNING BRIEFING DISPATCHED TO ${ADMIN_NOTIFICATION_EMAIL} VIA COMPOSIO!`);
  console.log('----------------------------------------------------');
}

testMorningPlanEmail();
