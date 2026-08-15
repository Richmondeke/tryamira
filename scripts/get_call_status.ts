const VAPI_KEY = process.env.VAPI_PRIVATE_API_KEY || '8c2bb74f-8251-42f7-ae7a-3e6fb2d0703a';
const CALL_ID = '019ffd6e-0466-7117-8d75-714aa6f3a49d';

async function checkCallStatus() {
  console.log('----------------------------------------------------');
  console.log(`📞 CHECKING VAPI REAL-TIME CALL LOG (ID: ${CALL_ID})`);
  console.log('----------------------------------------------------\n');

  try {
    const res = await fetch(`https://api.vapi.ai/call/${CALL_ID}`, {
      headers: { 'Authorization': `Bearer ${VAPI_KEY}` }
    });
    const callData = await res.json();

    console.log('📊 LIVE VAPI CALL LOG & METRICS:');
    console.log(`• Status: ${callData.status}`);
    console.log(`• Duration: ${callData.endedAt ? 'Ended' : 'In Progress / Ringing'}`);
    console.log(`• Ended Reason: ${callData.endedReason || 'N/A (Active)'}`);
    console.log(`• Destination: ${callData.customer?.number} (${callData.customer?.name})`);
    console.log(`• Bound Phone Line: ${callData.phoneNumberId} (+1 656-218-8313)`);
    console.log(`• Vapi Cost: $${callData.cost || 0}`);
    console.log('\n💬 Transcript Snippet:');
    console.log(callData.transcript || 'No transcript generated yet (Call in progress or ended by switchboard).');
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

checkCallStatus();
