import { NextRequest, NextResponse } from 'next/server';

function getVapiApiKey(): string {
  return process.env.VAPI_PRIVATE_API_KEY || '';
}

// POST /api/v1/files — Upload File to Knowledge Base RAG
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Missing or invalid Authorization header.' }, { status: 401 });
  }

  const apiKey = getVapiApiKey();
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'Amira Telephony Key not configured.' }, { status: 500 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    
    // Handle JSON payload: { title, content, assistantId }
    if (contentType.includes('application/json')) {
      const { title, content, assistantId } = await req.json();
      if (!title || !content) {
        return NextResponse.json({ success: false, error: 'Fields "title" and "content" are required.' }, { status: 400 });
      }

      // Step 1: Upload text blob to Vapi File Registry
      const fileBlob = new Blob([content], { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', fileBlob, title);

      const fileRes = await fetch('https://api.vapi.ai/file', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body: formData
      });

      if (!fileRes.ok) {
        const errText = await fileRes.text();
        return NextResponse.json({ success: false, error: errText }, { status: fileRes.status });
      }

      const fileData = await fileRes.json();

      // Step 2: Create Knowledge Base linking fileId
      const kbRes = await fetch('https://api.vapi.ai/knowledge-base', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${title} KB`,
          provider: 'trieve',
          fileIds: [fileData.id]
        })
      });

      let kbData = null;
      if (kbRes.ok) {
        kbData = await kbRes.json();

        // Step 3: If assistantId provided, attach Knowledge Base to Assistant
        if (assistantId && kbData?.id) {
          await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: {
                knowledgeBaseId: kbData.id
              }
            })
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Knowledge base document uploaded & synchronized with Amira Edge RAG.',
        data: {
          fileId: fileData.id,
          knowledgeBaseId: kbData?.id || null,
          title
        }
      }, { status: 201 });
    }

    // Handle Multipart FormData upload directly
    const formData = await req.formData();
    const fileRes = await fetch('https://api.vapi.ai/file', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: formData
    });

    if (!fileRes.ok) {
      const errText = await fileRes.text();
      return NextResponse.json({ success: false, error: errText }, { status: fileRes.status });
    }

    const fileData = await fileRes.json();
    return NextResponse.json({ success: true, data: fileData }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
