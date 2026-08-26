import { profileAssistantKnowledge } from '../../src/data/assistantKnowledge';

const MODEL_CANDIDATES = [
  '@cf/meta/llama-3.1-8b-instruct-fast',
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  '@cf/meta/llama-3.2-3b-instruct',
];

const MAX_MESSAGES = 10;
const MAX_USER_CHARS = 1000;
const MAX_REPLY_CHARS = 1800;

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function normalizeText(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
  return `You are the conversational assistant for Gabriel Bibbó's public professional website.

Use ONLY the professional knowledge base below. Be concise, natural, and useful. Answer the actual question instead of describing what kinds of questions you can answer.

Rules:
- Reply in the same language as the user.
- Never invent facts. If a fact is not explicitly known, distinguish what the profile does state from what it does not state.
- Do not expose private age, home address, private phone, salary, medical, family, or other non-public details.
- Do not disclose or guess confidential Edge Audio Labs clients, project names, ticket IDs, repositories, or internal identifiers.
- Locations attached to jobs or studies are not automatically home addresses.
- For questions such as "What country is Gabriel from?" / "¿De qué país es Gabriel?", do not guess nationality from a workplace or university. State the supported facts: he is based in Montevideo, Uruguay, and the profile states that he is an Italian citizen with EU work authorization.
- Keep most answers to 1-3 short paragraphs.

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

export async function onRequestPost(context: any) {
  const { request, env } = context;

  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
  }

  const cleaned = Array.isArray(payload?.messages)
    ? payload.messages.map(cleanMessage).filter(Boolean).slice(-MAX_MESSAGES) as ChatMessage[]
    : [];

  const firstUser = cleaned.findIndex((message) => message.role === 'user');
  const messages = firstUser >= 0 ? cleaned.slice(firstUser) : [];

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return jsonResponse({ error: 'Expected the last message to be from the user.' }, 400);
  }

  const question = messages[messages.length - 1].content;
  const guarded = privacyGuard(question);
  if (guarded) return jsonResponse({ answer: guarded, source: 'privacy-guard' });

  if (!env?.AI?.run) {
    return jsonResponse({
      answer: wantsSpanish(question)
        ? 'El asistente de perfil no está disponible temporalmente.'
        : 'The profile assistant is temporarily unavailable.',
      source: 'model-error',
      warning: 'Workers AI binding AI is unavailable in this environment.',
    }, 503);
  }

  try {
    const result = await runModel(env, messages);
    return jsonResponse({ answer: result.answer, source: 'workers-ai', model: result.model });
  } catch (error: any) {
    return jsonResponse({
      answer: wantsSpanish(question)
        ? 'El modelo no pudo responder en este momento. Probá nuevamente en unos segundos.'
        : 'The model could not answer right now. Please try again in a few seconds.',
      source: 'model-error',
      warning: typeof error?.message === 'string' ? error.message : 'Workers AI model call failed.',
    }, 503);
  }
}

export async function onRequestGet(context: any) {
  return jsonResponse({
    ok: true,
    endpoint: 'profile-assistant-chat',
    aiBinding: Boolean(context?.env?.AI?.run),
    models: MODEL_CANDIDATES,
  });
}
