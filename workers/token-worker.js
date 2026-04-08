const TOKEN_TTL = 60;  // seconds a presigned URL stays valid

export default {
  async fetch(request, env) {
    const url    = new URL(request.url);
    const method = request.method;

    // ── CORS preflight ──────────────────────────────────────────
    if (method === 'OPTIONS') return corsHeaders(env, 204);

    // ── POST /api/token ─────────────────────────────────────────
    if (method === 'POST' && url.pathname === '/api/token') {
      return handleToken(request, env);
    }

    // ── GET /dl/:fileId ─────────────────────────────────────────
    if (method === 'GET' && url.pathname.startsWith('/dl/')) {
      const fileId = decodeURIComponent(url.pathname.slice(4));
      return handleDirect(request, env, fileId);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleToken(request, env) {

  // Origin check — only allow requests from your own site
  const origin = request.headers.get('origin') || '';
  if (origin !== env.ALLOWED_ORIGIN) {
    return json({ error: 'Forbidden' }, 403, env);
  }

  // Rate limiting via Cloudflare KV or CF rate limit header
  // Here we do a secondary check using the CF-Ray header's IP info
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  let body;
  try { body = await request.json(); }
  catch { return json({ error: 'Bad request' }, 400, env); }

  const fileId = (body.fileId || '').trim();
  if (!fileId) return json({ error: 'Missing fileId' }, 400, env);

  // Check the object exists in R2 before issuing a token
  const head = await env.R2.head(fileId);
  if (!head) return json({ error: 'File not found' }, 404, env);

  // Generate a presigned R2 URL (valid for TOKEN_TTL seconds)
  const presigned = await generateR2PresignedUrl(fileId, env);

  return json({ url: presigned }, 200, env);
}

async function handleDirect(request, env, fileId) {
  const origin = request.headers.get('referer') || '';
  // Require the referer to be your own site
  if (!origin.startsWith(env.ALLOWED_ORIGIN)) {
    return new Response('Direct linking not allowed.', { status: 403 });
  }

  const head = await env.R2.head(fileId);
  if (!head) return new Response('File not found.', { status: 404 });

  const presigned = await generateR2PresignedUrl(fileId, env);
  return Response.redirect(presigned, 302);
}

async function generateR2PresignedUrl(fileId, env) {
  // R2 is S3-compatible. We use AWS Signature Version 4 presigning.
  const region    = 'auto';
  const service   = 's3';
  const host      = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const bucket    = env.R2_BUCKET_NAME;
  const keyId     = env.R2_ACCESS_KEY_ID;
  const secretKey = env.R2_SECRET_KEY;

  const now       = new Date();
  const dateStr   = now.toISOString().slice(0, 10).replace(/-/g, '');  // YYYYMMDD
  const timeStr   = now.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'; // ISO compact

  const encodedKey = fileId
  .split('/')
  .map(encodeURIComponent)
  .join('/');
  const expiresIn   = TOKEN_TTL;

  const credScope   = `${dateStr}/${region}/${service}/aws4_request`;
  const credential  = `${keyId}/${credScope}`;

  const queryParams = new URLSearchParams({
    'X-Amz-Algorithm':     'AWS4-HMAC-SHA256',
    'X-Amz-Credential':    credential,
    'X-Amz-Date':          timeStr,
    'X-Amz-Expires':       String(expiresIn),
    'X-Amz-SignedHeaders': 'host',
  });

  const sortedQuery = new URLSearchParams([...queryParams.entries()].sort());
  
  const canonicalRequest = [
    'GET',
    `/${bucket}/${encodedKey}`,
    sortedQuery.toString(),
    `host:${host}\n`,
    'host',
    'UNSIGNED-PAYLOAD',
  ].join('\n');

  const encoder = new TextEncoder();

  async function hmac(key, data) {
    const k = typeof key === 'string'
      ? await crypto.subtle.importKey('raw', encoder.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
      : await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return crypto.subtle.sign('HMAC', k, encoder.encode(data));
  }

  const hashBuf = await crypto.subtle.digest('SHA-256', encoder.encode(canonicalRequest));
  const hashHex = [...new Uint8Array(hashBuf)].map(b => b.toString(16).padStart(2, '0')).join('');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    timeStr,
    credScope,
    hashHex,
  ].join('\n');

  // Derive signing key
  const kDate    = await hmac('AWS4' + secretKey, dateStr);
  const kRegion  = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  const kSigning = await hmac(kService, 'aws4_request');

  const sigBuf = await hmac(kSigning, stringToSign);
  const sig    = [...new Uint8Array(sigBuf)].map(b => b.toString(16).padStart(2, '0')).join('');

  return `https://${host}/${bucket}/${encodedKey}?${queryParams}&X-Amz-Signature=${sig}`;
}

function json(data, status, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type':                'application/json',
      'Access-Control-Allow-Origin': env?.ALLOWED_ORIGIN || '*',
    },
  });
}

function corsHeaders(env, status) {
  return new Response(null, {
    status,
    headers: {
      'Access-Control-Allow-Origin':  env?.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
