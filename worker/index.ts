export interface Env {
  OPENROUTER_API_KEY: string;
  PROXY_SECRET: string;
  ENVIRONMENT: string;
}

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'https://apoc.pages.dev',
];

function corsHeaders(origin: string): Record<string, string> {
  const allowed = ALLOWED_ORIGINS.some((o) => origin.startsWith(o)) || origin.endsWith('.apoc.pages.dev');
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Proxy-Secret',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/api/health' && request.method === 'GET') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // Models list
    if (url.pathname === '/api/models' && request.method === 'GET') {
      return new Response(
        JSON.stringify({
          models: [
            { id: 'google/gemma-4-31b-it', name: 'Gemma 4 31B', status: 'active' },
          ],
        }),
        { headers: { ...cors, 'Content-Type': 'application/json' } },
      );
    }

    // Chat endpoint
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      // Validate proxy secret
      const secret = request.headers.get('X-Proxy-Secret');
      if (secret !== env.PROXY_SECRET) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...cors, 'Content-Type': 'application/json' },
        });
      }

      let body: Record<string, unknown>;
      try {
        body = await request.json() as Record<string, unknown>;
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: { ...cors, 'Content-Type': 'application/json' },
        });
      }

      // Forward to OpenRouter
      const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://apoc.pages.dev',
          'X-Title': 'APOC Chat Room',
        },
        body: JSON.stringify(body),
      });

      if (!openRouterResponse.ok) {
        const errorText = await openRouterResponse.text();
        return new Response(
          JSON.stringify({ error: `OpenRouter error: ${openRouterResponse.status}`, details: errorText }),
          {
            status: openRouterResponse.status,
            headers: { ...cors, 'Content-Type': 'application/json' },
          },
        );
      }

      // Stream the response through
      if (body.stream) {
        return new Response(openRouterResponse.body, {
          headers: {
            ...cors,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }

      // Non-streaming response
      const result = await openRouterResponse.json();
      return new Response(JSON.stringify(result), {
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  },
};
