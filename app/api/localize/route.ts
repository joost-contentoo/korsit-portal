import { NextResponse } from 'next/server';

// Extend API route timeout to 3 minutes for long-running n8n workflows
export const maxDuration = 180; // 180 seconds = 3 minutes

export async function POST(request: Request) {
  const n8nUrl = process.env.N8N_WEBHOOK_URL;

  if (!n8nUrl) {
    console.error('N8N_WEBHOOK_URL is missing in environment variables.');
    return NextResponse.json(
      { error: 'Server configuration error: N8N_WEBHOOK_URL is missing.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { blog_content, seo_context } = body;

    if (!blog_content) {
      return NextResponse.json(
        { error: 'Missing required field: blog_content' },
        { status: 400 }
      );
    }

    // Forward to n8n with 120-second timeout
    console.log('[Localize API] Sending request to n8n:', n8nUrl);
    const n8nResponse = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blog_content,
        seo_context: seo_context || '',
      }),
      signal: AbortSignal.timeout(120000), // 120 seconds timeout
    });

    console.log('[Localize API] n8n response status:', n8nResponse.status);
    console.log('[Localize API] n8n response headers:', Object.fromEntries(n8nResponse.headers.entries()));

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('[Localize API] n8n error:', n8nResponse.status, errorText);
      return NextResponse.json(
        { error: `Upstream error: ${n8nResponse.statusText}` },
        { status: n8nResponse.status }
      );
    }

    const responseText = await n8nResponse.text();
    console.log('[Localize API] n8n raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('[Localize API] Parsed n8n response:', data);
    } catch (parseError) {
      console.error('[Localize API] Failed to parse n8n response as JSON:', parseError);
      console.error('[Localize API] Raw response was:', responseText);
      throw new Error('n8n returned invalid JSON');
    }

    // Resiliency: Check for various output formats
    const localizedContent = data.localized_content || data.output || data.text || data.content;

    if (!localizedContent && typeof data === 'string') {
      // In case n8n returns raw string
      return NextResponse.json({ localized_content: data });
    }

    if (!localizedContent) {
      console.warn('Unexpected response format from n8n:', data);
      // Return the whole data object if we can't find the specific field, 
      // hoping the frontend can handle it or just to debug.
      return NextResponse.json({ localized_content: JSON.stringify(data), ...data });
    }

    return NextResponse.json({ localized_content: localizedContent });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing request.' },
      { status: 500 }
    );
  }
}
