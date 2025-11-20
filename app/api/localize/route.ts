import { NextResponse } from 'next/server';

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

    // Forward to n8n
    const n8nResponse = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blog_content,
        seo_context: seo_context || '',
      }),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('n8n error:', n8nResponse.status, errorText);
      return NextResponse.json(
        { error: `Upstream error: ${n8nResponse.statusText}` },
        { status: n8nResponse.status }
      );
    }

    const data = await n8nResponse.json();
    
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
