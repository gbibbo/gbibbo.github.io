import { profileAssistantKnowledge } from '../../src/data/assistantKnowledge';

const MODEL_CANDIDATES = [
  '@cf/meta/llama-3.1-8b-instruct-fast',
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  '@cf/meta/llama-3.2-3b-instruct',
];

const MAX_MESSAGES = 10;
const MAX_USER_CHARS = 1000;
const MAX_REPLY_CHARS = 1800;
const CANONICAL_ORIGIN = 'https://gbibbo.github.io';
const CLOUDFLARE_ORIGIN = 'https://gbibbo-site.pages.dev';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type InteractionLog = {
  sessionId: string;
  language: string;
  pagePath: string;
  question: string;
  answer: string;
  source: string;
  model: string;
  success: boolean;
  latencyMs: number;
  error: string;
};

function allowedOrigin(request: Request) {
  const origin = request.headers.get('origin') || '';
  if (!origin) return '';
  if (origin === CANONICAL_ORIGIN || origin === CLOUDFLARE_ORIGIN) return origin;
  if (/^https:\/\/[a-z0-9-]+\.gbibbo-site\.pages\.dev$/i.test(origin)) return origin;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return origin;
  return '';
}

function corsHeaders(request?: Request) {
  if (!request) return {};
  const origin = allowedOrigin(request);
  return origin
    ? {
        'access-control-allow-origin': origin,
        'access-control-allow-methods': 'GET,POST,OPTIONS',
        'access-control-allow-headers': 'content-type',
        'access-control-max-age': '86400',
        vary: 'Origin',
      }
    : {};
}

function jsonResponse(body: unknown, status = 200, request?: Request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...corsHeaders(request),
    },
  });
}

function normalizeText(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function safeString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function cleanMessage(message: unknown): ChatMessage | null {
  if (!message || typeof message !== 'object') return null;
  const item = message as Record<string, unknown>;
  const role = item.role === 'assistant' ? 'assistant' : item.role === 'user' ? 'user' : null;
  const content = typeof item.content === 'string' ? item.content.trim().slice(0, MAX_USER_CHARS) : '';
  return role && content ? { role, content } : null;
}

function extractAnswer(result: any): string {
  if (typeof result === 'string') return result;
  if (typeof result?.response === 'string') return result.response;
  if (typeof result?.result?.response === 'string') return result.result.response;
  if (Array.isArray(result?.choices)) {
    const first = result.choices[0];
    if (typeof first?.message?.content === 'string') return first.message.content;
    if (typeof first?.text === 'string') return first.text;
  }
  return '';
}

function wantsSpanish(question: string) {
  const q = question.toLowerCase();
  return /[áéíóúñ¿¡]/.test(q)
    || [' que ', 'qué ', 'donde', 'dónde', 'como ', 'cómo ', 'cual', 'cuál', 'por que', 'porqué', 'puedes', 'puede', 'gabriel?'].some((token) => q.includes(token));
}

function privacyGuard(question: string): string | null {
  const q = normalizeText(question);
  const es = wantsSpanish(question);
  const privateTerms = [
    'direccion particular', 'domicilio', 'calle donde vive', 'telefono privado', 'numero de telefono',
    'fecha de nacimiento', 'edad', 'salario', 'sueldo', 'historia medica', 'salud', 'familia', 'pareja', 'hijos',
    'home address', 'street address', 'private phone', 'phone number', 'date of birth', 'birth date', 'age',
    'salary', 'medical', 'health', 'family', 'partner', 'children',
  ];
  if (!privateTerms.some((term) => q.includes(term))) return null;
  return es
    ? 'El perfil público no contiene esa información personal.'
    : 'The public profile does not contain that personal information.';
}

function systemPrompt() {
  return `You are the conversational assistant embedded in Gabriel Bibbó's professional website.

Use ONLY the professional knowledge base below. Answer the user's actual question directly and naturally.

VOICE AND STYLE
- Speak about him simply as "Gabriel" after the name is established by the page context.
- Do NOT begin answers with stock attribution phrases such as "According to Gabriel Bibbó's public professional profile", "Based on his profile", "The profile states", or equivalent wording in Spanish.
- Start with the answer itself. Example: "Gabriel is available for...", not "According to his profile, he is available for...".
- Reply in the same language as the user.
- Use plain text only. Do not emit Markdown markers such as **, ##, or backticks because the website renders responses as plain text.
- Prefer concise prose or a short numbered list only when a list materially improves clarity. Keep most answers to 1-3 short paragraphs.
- Avoid repetitive conclusions that merely restate the preceding list.

FACTUAL DISCIPLINE
- Never invent facts. If a fact is not explicitly known, distinguish what is known from what is not known.
- Respect the user's requested category strictly. If the user asks for publications, use only the "Publications and research outputs" section. Do not add projects, demos, courses, or experience entries merely because they are related. If the user asks for projects, use only the Projects section unless they explicitly ask for broader context.
- When asked which items are "about" a topic, include only items whose title or supplied metadata clearly and centrally concerns that topic. Do not include tangentially adjacent work just because it shares a broad domain such as audio, privacy, soundscapes, or machine learning.
- Do not duplicate the same work because it appears conceptually elsewhere in the knowledge base.
- Do not expose private age, home address, private phone, salary, medical, family, or other non-public details.
- Do not disclose or guess confidential Edge Audio Labs clients, project names, ticket IDs, repositories, or internal identifiers.
- Locations attached to jobs or studies are not automatically home addresses.
- For questions such as "What country is Gabriel from?" / "¿De qué país es Gabriel?", do not guess nationality from a workplace or university. State only the supported facts: Gabriel is based in Montevideo, Uruguay, and the profile states that he is an Italian citizen with EU work authorization.

PUBLIC PROFESSIONAL KNOWLEDGE BASE
${profileAssistantKnowledge}`;
}

async function runModel(env: any, messages: ChatMessage[]) {
  let lastError = '';

  for (const model of MODEL_CANDIDATES) {
    try {
      const result = await env.AI.run(model, {
        messages: [
          { role: 'system', content: systemPrompt() },
          ...messages,
        ],
        max_tokens: 600,
        temperature: 0.15,
      });
      const answer = extractAnswer(result).trim();
      if (answer) return { answer: answer.slice(0, MAX_REPLY_CHARS), model };
      lastError = `${model} returned an empty response.`;
    } catch (error: any) {
      lastError = typeof error?.message === 'string' ? error.message : `Model call failed for ${model}.`;
      console.error('Profile assistant Workers AI error', { model, error: lastError });
    }
  }

  throw new Error(lastError || 'All Workers AI model calls failed.');
}

async function writeInteraction(env: any, entry: InteractionLog) {
  if (!env?.ANALYTICS_DB?.prepare) return;
  try {
    await env.ANALYTICS_DB.prepare(`
      INSERT INTO bot_questions (
        session_id, language, page_path, question, answer, source, model, success, latency_ms, error
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      entry.sessionId,
      entry.language,
      entry.pagePath,
      entry.question,
      entry.answer,
      entry.source,
      entry.model,
      entry.success ? 1 : 0,
      entry.latencyMs,
      entry.error,
    ).run();
  } catch (error: any) {
    console.error('Profile assistant analytics write failed', typeof error?.message === 'string' ? error.message : error);
  }
}

function queueInteraction(context: any, entry: InteractionLog) {
  const write = writeInteraction(context.env, entry);
  if (typeof context.waitUntil === 'function') context.waitUntil(write);
}

function baseLog(payload: any, question: string): Omit<InteractionLog, 'answer' | 'source' | 'model' | 'success' | 'latencyMs' | 'error'> {
  return {
    sessionId: safeString(payload?.sessionId, 100),
    language: safeString(payload?.language, 8) || (wantsSpanish(question) ? 'es' : 'en'),
    pagePath: safeString(payload?.pagePath, 240) || '/',
    question,
  };
}

export async function onRequestOptions(context: any) {
  const { request } = context;
  if (!allowedOrigin(request)) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const startedAt = Date.now();

  if (request.headers.get('origin') && !allowedOrigin(request)) {
    return jsonResponse({ error: 'Origin not allowed.' }, 403, request);
  }

  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload.' }, 400, request);
  }

  const cleaned = Array.isArray(payload?.messages)
    ? payload.messages.map(cleanMessage).filter(Boolean).slice(-MAX_MESSAGES) as ChatMessage[]
    : [];

  const firstUser = cleaned.findIndex((message) => message.role === 'user');
  const messages = firstUser >= 0 ? cleaned.slice(firstUser) : [];

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return jsonResponse({ error: 'Expected the last message to be from the user.' }, 400, request);
  }

  const question = messages[messages.length - 1].content;
  const logBase = baseLog(payload, question);
  const guarded = privacyGuard(question);
  if (guarded) {
    queueInteraction(context, {
      ...logBase,
      answer: guarded,
      source: 'privacy-guard',
      model: '',
      success: true,
      latencyMs: Date.now() - startedAt,
      error: '',
    });
    return jsonResponse({ answer: guarded, source: 'privacy-guard' }, 200, request);
  }

  if (!env?.AI?.run) {
    const answer = wantsSpanish(question)
      ? 'El asistente de perfil no está disponible temporalmente.'
      : 'The profile assistant is temporarily unavailable.';
    const warning = 'Workers AI binding AI is unavailable in this environment.';
    queueInteraction(context, {
      ...logBase,
      answer,
      source: 'model-error',
      model: '',
      success: false,
      latencyMs: Date.now() - startedAt,
      error: warning,
    });
    return jsonResponse({ answer, source: 'model-error', warning }, 503, request);
  }

  try {
    const result = await runModel(env, messages);
    queueInteraction(context, {
      ...logBase,
      answer: result.answer,
      source: 'workers-ai',
      model: result.model,
      success: true,
      latencyMs: Date.now() - startedAt,
      error: '',
    });
    return jsonResponse({ answer: result.answer, source: 'workers-ai', model: result.model }, 200, request);
  } catch (error: any) {
    const answer = wantsSpanish(question)
      ? 'El modelo no pudo responder en este momento. Probá nuevamente en unos segundos.'
      : 'The model could not answer right now. Please try again in a few seconds.';
    const warning = typeof error?.message === 'string' ? error.message : 'Workers AI model call failed.';
    queueInteraction(context, {
      ...logBase,
      answer,
      source: 'model-error',
      model: '',
      success: false,
      latencyMs: Date.now() - startedAt,
      error: warning,
    });
    return jsonResponse({ answer, source: 'model-error', warning }, 503, request);
  }
}

export async function onRequestGet(context: any) {
  const { request } = context;
  return jsonResponse({
    ok: true,
    endpoint: 'profile-assistant-chat',
    aiBinding: Boolean(context?.env?.AI?.run),
    analyticsBinding: Boolean(context?.env?.ANALYTICS_DB?.prepare),
    models: MODEL_CANDIDATES,
  }, 200, request);
}
