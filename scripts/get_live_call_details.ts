const VAPI_KEY = process.env.VAPI_PRIVATE_API_KEY || '8c2bb74f-8251-42f7-ae7a-3e6fb2d0703a';
const CALL_ID = '019ffd6e-0466-7117-8d75-714aa6f3a49d';

async function checkAndHangupLiveCall() {
  console.log('----------------------------------------------------');
  console.log(`📞 REAL-TIME VAPI CALL AUDIT & HANGUP CONTROL (Call ID: ${CALL_ID})`);
  console.log('----------------------------------------------------\n');

  try {
    const res = await fetch(`https://api.vapi.ai/call/${CALL_ID}`, {
      headers: { 'Authorization': `Bearer ${VAPI_KEY}` }
    });
    const callData = await res.json();

    console.log('📊 REAL VAPI API TELEMETRY LOGS:');
    console.log(`• Call Status: ${callData.status}`);
    console.log(`• Started At: ${callData.startedAt || 'N/A'}`);
    console.log(`• Ended At: ${callData.endedAt || 'Not Ended (In Progress / Ringing)'}`);
    console.log(`• Ended Reason: ${callData.endedReason || 'Active / In Call'}`);
    console.log(`• Destination Phone: ${callData.customer?.number} (${callData.customer?.name})`);
    console.log(`• Outbound Line: ${callData.phoneNumberId} (+1 656-218-8313)`);
    console.log(`• Vapi Billing Cost: $${callData.cost || 0}`);
    console.log(`• Carrier Provider: ${callData.phoneCallProvider || 'twilio'}`);

    if (callData.status === 'in-progress' || callData.status === 'ringing' || callData.status === 'queued') {
      console.log('\n🔴 ISSUING AMIRA HANGUP SIGNAL TO VAPI API...');
      const endRes = await fetch(`https://api.vapi.ai/call/${CALL_ID}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${VAPI_KEY}` }
      });
      if (endRes.ok) {
        console.log('✅ Call successfully terminated and hung up on Vapi!');
      } else {
        const endData = await endRes.json();
        console.log(`• Hangup API Response: ${JSON.stringify(endData)}`);
      }
    } else {
      console.log(`\n✅ Call has already completed and hung up automatically. Reason: ${callData.endedReason}`);
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

checkAndHangupLiveCall();
