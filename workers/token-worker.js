const TOKEN_TTL = 60; // seconds

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    // ── CORS ───────────────────────────────
    if (method === 'OPTIONS') return corsHeaders(env, 204);

    // ── POST /api/token ────────────────────
    if (method === 'POST' && url.pathname === '/api/token') {
      return handleToken(request, env);
    }

    // ── GET /dl/:fileId ────────────────────
    if (method === 'GET' && url.pathname.startsWith('/dl/')) {
      const fileId = decodeURIComponent(url.pathname.slice(4));
      return handleDirect(request, env, fileId);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleToken(request, env) {
  // ✅ Origin protection
  const origin = request.headers.get('origin') || '';
  if (origin !== env.ALLOWED_ORIGIN) {
    return json({ error: 'Forbidden' }, 403, env);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Bad request' }, 400, env);
  }

  const fileId = (body.fileId || '').trim();
  if (!fileId) return json({ error: 'Missing fileId' }, 400, env);

  // ✅ Check file exists
  const object = await env.R2.get(fileId);
  if (!object) return json({ error: 'File not found' }, 404, env);

  // ✅ Generate signed URL (THIS replaces your entire AWS signing code)
  const url = await object.getSignedUrl({
    expiresIn: TOKEN_TTL,
  });

  return json({ url }, 200, env);
}

async function handleDirect(request, env, fileId) {
  const referer = request.headers.get('referer') || '';

  // ✅ Prevent hotlinking
  if (!referer.startsWith(env.ALLOWED_ORIGIN)) {
    return new Response('Direct linking not allowed.', { status: 403 });
  }

  const object = await env.R2.get(fileId);
  if (!object) return new Response('File not found.', { status: 404 });

  const url = await object.getSignedUrl({
    expiresIn: TOKEN_TTL,
  });

  return Response.redirect(url, 302);
}

// ── Helpers ───────────────────────────────

function json(data, status, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': env?.ALLOWED_ORIGIN || '*',
    },
  });
}

function corsHeaders(env, status) {
  return new Response(null, {
    status,
    headers: {
      'Access-Control-Allow-Origin': env?.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
