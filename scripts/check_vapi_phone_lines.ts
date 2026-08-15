const VAPI_KEY = process.env.VAPI_PRIVATE_API_KEY || '8c2bb74f-8251-42f7-ae7a-3e6fb2d0703a';
const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || 'ae0f0250-c62c-4c65-916e-85af7d7288b7';

async function checkVapiPhoneLinesAndCall() {
  console.log('----------------------------------------------------');
  console.log('📞 QUERYING VAPI ACCOUNT PHONE NUMBER IDS');
  console.log('----------------------------------------------------\n');

  try {
    const res = await fetch('https://api.vapi.ai/phone-number', {
      headers: { 'Authorization': `Bearer ${VAPI_KEY}` }
    });
    const phoneLines = await res.json();

    console.log('📋 PROVISIONED VAPI PHONE LINES:');
    console.log(JSON.stringify(phoneLines, null, 2));

    let phoneId = null;
    if (Array.isArray(phoneLines) && phoneLines.length > 0) {
      phoneId = phoneLines[0].id;
      console.log(`\n✅ Found Active Vapi Phone Line ID: ${phoneId}`);
    } else {
      console.log('\n⚠️ No outbound phone line ID bound on Vapi dashboard yet.');
    }

    if (phoneId) {
      console.log('\n📌 DISPATCHING LIVE CALL TO TARGET WITH BOUND PHONE LINE ID...');
      const callRes = await fetch('https://api.vapi.ai/call', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VAPI_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assistantId: VAPI_ASSISTANT_ID,
          phoneNumberId: phoneId,
          customer: {
            number: '+14152633600',
            name: 'Orlando Bravo'
          }
        })
      });

      const callResult = await callRes.json();
      console.log('\n🎉 CALL DISPATCH RESULT:');
      console.log(JSON.stringify(callResult, null, 2));
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

checkVapiPhoneLinesAndCall();
