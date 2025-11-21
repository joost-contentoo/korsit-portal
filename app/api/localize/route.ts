import { NextResponse } from 'next/server';
import { localizeRequestSchema } from '../../lib/schemas';
import { env } from '../../config/env';
import { parseN8nResponse } from '../../lib/n8n';

// Extend API route timeout to 3 minutes for long-running n8n workflows
export const maxDuration = 180; // 180 seconds = 3 minutes

export async function POST(request: Request) {
  const n8nUrl = env.N8N_WEBHOOK_URL;

  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = localizeRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { blog_content, seo_context, additional_instructions, style_guide, glossary } = validationResult.data;

    // Forward to n8n with 120-second timeout
    const shouldLogPayloads = process.env.LOG_LOCALIZE_PAYLOADS === 'true';

    if (shouldLogPayloads) {
      console.log('[Localize API] Sending request to n8n:', n8nUrl);
      console.log('[Localize API] Request payload:', JSON.stringify({
        blog_content: blog_content.substring(0, 50) + '...', // Log snippet even in verbose mode for sanity
        seo_context,
        additional_instructions,
        style_guide,
        glossary
      }));
    } else {
      console.log('[Localize API] Sending request to n8n (payload redacted)');
    }

    const n8nResponse = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blog_content,
        seo_context: seo_context || '',
        additional_instructions: additional_instructions || '',
        style_guide: style_guide || '',
        glossary: glossary || '',
      }),
      signal: AbortSignal.timeout(120000), // 120 seconds timeout
    });

    console.log('[Localize API] n8n response status:', n8nResponse.status);

    if (shouldLogPayloads) {
      console.log('[Localize API] n8n response headers:', Object.fromEntries(n8nResponse.headers.entries()));
    }

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      // Sanitize error text if not in verbose mode, though usually error text is safe enough, 
      // but to be strict we might want to be careful. 
      // However, n8n errors often contain useful debugging info. 
      // Let's log it but be mindful.
      console.error('[Localize API] n8n error status:', n8nResponse.status);
      if (shouldLogPayloads) {
        console.error('[Localize API] n8n error text:', errorText);
      } else {
        console.error('[Localize API] n8n error text redacted. Set LOG_LOCALIZE_PAYLOADS=true to view.');
      }

      return NextResponse.json(
        { error: `Upstream error: ${n8nResponse.statusText}` },
        { status: n8nResponse.status }
      );
    }

    const responseText = await n8nResponse.text();

    if (shouldLogPayloads) {
      console.log('[Localize API] n8n raw response:', responseText);
    } else {
      console.log('[Localize API] n8n response received (body redacted)');
    }

    let data;
    try {
      data = JSON.parse(responseText);
      if (shouldLogPayloads) {
        console.log('[Localize API] Parsed n8n response:', data);
      }
    } catch {
      console.error('[Localize API] Failed to parse n8n response as JSON');
      if (shouldLogPayloads) {
        console.error('[Localize API] Raw response was:', responseText);
      }
      throw new Error('n8n returned invalid JSON');
    }

    // Resiliency: Check for various output formats
    const localizedContent = parseN8nResponse(data);

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

