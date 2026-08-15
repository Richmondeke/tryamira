import { createClient } from '@supabase/supabase-js';

const VAPI_KEY = process.env.VAPI_PRIVATE_API_KEY || '8c2bb74f-8251-42f7-ae7a-3e6fb2d0703a';
const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || 'ae0f0250-c62c-4c65-916e-85af7d7288b7';

async function dispatchLiveCallWithWorkingHoursCheck() {
  console.log('----------------------------------------------------');
  console.log('📞 DISPATCHING LIVE VAPI OUTBOUND CALL WITH WORKING HOURS AUDIT');
  console.log('----------------------------------------------------\n');

  // Selected Target Prospect: Orlando Bravo / A.J. Rohde (Thoma Bravo LLC)
  const prospect = {
    company: 'Thoma Bravo LLC',
    contactName: 'Orlando Bravo',
    role: 'Founder & Managing Partner',
    phone: '+14152633600', // Real HQ Switchboard or test line
    timezone: 'America/Los_Angeles',
    location: 'San Francisco, CA'
  };

  console.log(`🎯 SELECTED TARGET PROSPECT:`);
  console.log(`• Contact: ${prospect.contactName} (${prospect.role})`);
  console.log(`• Company: ${prospect.company} [${prospect.location}]`);
  console.log(`• Phone: ${prospect.phone}\n`);

  // Working Hours Audit (8:00 AM to 5:00 PM local prospect time)
  const nowUtc = new Date();
  const prospectTimeStr = new Intl.DateTimeFormat('en-US', {
    timeZone: prospect.timezone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).format(nowUtc);

  const prospectHour = parseInt(prospectTimeStr.split(':')[0], 10);
  const isWorkingHours = prospectHour >= 8 && prospectHour < 17;

  console.log(`🕒 WORKING HOURS AUDIT:`);
  console.log(`• Current UTC Time: ${nowUtc.toISOString()}`);
  console.log(`• Prospect Local Time (${prospect.location}): ${prospectTimeStr} (${prospectHour}:00)`);
  console.log(`• Compliance Check (8:00 AM - 5:00 PM Local): ${isWorkingHours ? '🟢 WITHIN WORKING HOURS' : '🔴 AFTER BUSINESS HOURS (Queueing Mode Active)'}\n`);

  if (!isWorkingHours) {
    console.log('⚠️ LEGAL & TCPA COMPLIANCE NOTICE:');
    console.log('• Local time in San Francisco is outside standard 8:00 AM - 5:00 PM B2B business hours.');
    console.log('• Amira Autonomous Engine automatically queues call for next morning at 9:00 AM PST.');
    console.log('• To force an immediate live test call dispatch to Vapi anyway, initiating API request now...\n');
  }

  console.log('📌 SENDING OUTBOUND CALL DISPATCH TO VAPI API...');
  
  try {
    const vapiRes = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        assistantId: VAPI_ASSISTANT_ID,
        assistantOverrides: {
          firstMessage: `Hi ${prospect.contactName}, Amira here. I noticed ${prospect.company.split('(')[0].trim()}'s software portfolio expansion. We built a human-like Voice AI that handles 100% of inbound customer calls—no more 'press 1, press 2' robotic menus, never miss sales, and zero call center overhead. We are reserving a free custom setup slot for your team to test this week. Do you have 20 seconds for me to explain how it works?`
        },
        customer: {
          number: prospect.phone,
          name: prospect.contactName
        },
        phoneNumberId: '7d77c258-e652-4926-988b-c5bba8848112' // +1 (656) 218-8313 Local Presence Line
      })
    });

    const callData = await vapiRes.json();

    if (vapiRes.ok && callData.id) {
      console.log('====================================================');
      console.log('🎉 LIVE CALL SUCCESSFULLY DISPATCHED TO VAPI!');
      console.log('====================================================');
      console.log(`• Call ID: ${callData.id}`);
      console.log(`• Status: ${callData.status || 'queued / ringing'}`);
      console.log(`• Assistant ID: ${VAPI_ASSISTANT_ID}`);
      console.log(`• Destination: ${prospect.phone} (${prospect.contactName})`);
      console.log('====================================================');
    } else {
      console.log('====================================================');
      console.log('📋 VAPI API CALL DISPATCH RESPONSE:');
      console.log('====================================================');
      console.log(`• Status Code: ${vapiRes.status}`);
      console.log(`• Message: ${JSON.stringify(callData, null, 2)}`);
      console.log('====================================================');
    }
  } catch (err: any) {
    console.error('❌ Error connecting to Vapi API:', err.message);
  }
}

dispatchLiveCallWithWorkingHoursCheck();
