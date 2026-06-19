import { profileAssistantKnowledge } from '../../src/data/assistantKnowledge';

const MODEL_CANDIDATES = [
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3.2-3b-instruct',
];

const MAX_MESSAGES = 8;
const MAX_USER_CHARS = 900;
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

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function cleanMessage(message: unknown): ChatMessage | null {
  if (!message || typeof message !== 'object') return null;
  const item = message as Record<string, unknown>;
  const role = item.role === 'assistant' ? 'assistant' : item.role === 'user' ? 'user' : null;
  const content = typeof item.content === 'string' ? item.content.trim().slice(0, MAX_USER_CHARS) : '';
  if (!role || !content) return null;
  return { role, content };
}

function extractAnswer(result: any): string {
  if (typeof result === 'string') return result;
  if (typeof result?.response === 'string') return result.response;
  if (typeof result?.result?.response === 'string') return result.result.response;
  if (Array.isArray(result?.messages)) {
    const last = result.messages[result.messages.length - 1];
    if (typeof last?.content === 'string') return last.content;
  }
  if (Array.isArray(result?.choices)) {
    const first = result.choices[0];
    if (typeof first?.message?.content === 'string') return first.message.content;
    if (typeof first?.text === 'string') return first.text;
  }
  return '';
}

function wantsSpanish(question: string): boolean {
  const q = question.toLowerCase();
  return /[áéíóúñ¿¡]/.test(q) || q.includes(' en español') || q.includes('sabes decirlo') || q.includes('cómo') || q.includes('dónde') || q.includes('donde') || q.includes('que ') || q.includes('cuál') || q.includes('edad') || q.includes('hola');
}

function fallbackUnavailable(question: string): string {
  return wantsSpanish(question)
    ? 'El asistente de perfil no pudo consultar el modelo en este momento. Podés preguntar por proyectos, publicaciones, experiencia, educación, stack técnico, contacto o disponibilidad de Gabriel.'
    : 'The profile assistant could not query the model right now. You can ask about Gabriel’s projects, publications, experience, education, technical stack, contact details, or availability.';
}

function emptyAnswerFallback(question: string): string {
  return wantsSpanish(question)
    ? 'No consta en el perfil público información suficiente para responder eso con precisión. Puedo responder sobre proyectos, publicaciones, experiencia, educación, stack técnico, contacto y disponibilidad.'
    : 'The public profile does not contain enough information to answer that precisely. I can answer about projects, publications, experience, education, technical stack, contact details, and availability.';
}

function looksLikeUnsupportedPersonalClaim(answer: string, question: string): boolean {
  const a = normalizeText(answer);
  const q = normalizeText(question);

  const asksPersonalHistory = [
    'donde vivio', 'donde ha vivido', 'donde vive', 'donde reside', 'residencia', 'historial de residencia',
    'edad', 'nacio', 'fecha de nacimiento', 'familia', 'pareja', 'hijos', 'direccion', 'telefono', 'salario', 'sueldo',
    'where did', 'where has', 'where does', 'residence', 'live', 'lived', 'age', 'born', 'birth', 'family', 'partner', 'children', 'address', 'phone', 'salary',
  ].some((term) => q.includes(term));

  if (!asksPersonalHistory) return false;

  const assertsResidence = [
    'vivio en', 'ha vivido en', 'vive en', 'reside en', 'se mudo a',
    'lived in', 'has lived in', 'lives in', 'resides in', 'moved to',
  ].some((term) => a.includes(term));

  const assertsUnavailableButThenInfers = (a.includes('no consta') || a.includes('no incluye') || a.includes('does not include'))
    && (a.includes('por lo tanto') || a.includes('therefore') || a.includes('so he'));

  return assertsResidence || assertsUnavailableButThenInfers;
}

function postProcessAnswer(answer: string, question: string): string {
  const trimmed = answer.trim().slice(0, MAX_REPLY_CHARS);
  if (!trimmed) return emptyAnswerFallback(question);
  if (looksLikeUnsupportedPersonalClaim(trimmed, question)) return emptyAnswerFallback(question);
  return trimmed;
}

function buildSystemPrompt() {
  return `You are Gabriel Bibbó's public profile assistant.

Your job is not to be a general chatbot. Your job is to answer questions using the public profile knowledge base below.

Core reasoning policy:
1. Before answering, silently classify the user's question as one of:
   A) directly supported by the knowledge base,
   B) partially supported by the knowledge base,
   C) not supported by the knowledge base.
2. For A, answer directly.
3. For B, answer the part that is supported and explicitly say what detail is not stated.
4. For C, say that the public profile does not state that information. Do not invent or infer.

Non-inference rules:
- Do not infer residence history from university locations, work locations, dataset collection locations, nationality, citizenship, current base, or remote work.
- Do not infer age, birth date, family status, salary, address, phone number, immigration history, medical information, or private life unless explicitly stated in the knowledge base.
- Do not infer that Gabriel lived in a city just because he studied, worked, collaborated, or published there.
- You may say he is currently based in Montevideo, Uruguay, because that is stated. You may say he studied or worked with organizations in specified places. Keep those categories separate.

Answering style:
- Answer in the same language as the user unless they ask otherwise.
- Be concise by default. Do not add generic disclaimers at the end.
- Never mention training data, knowledge cutoffs, hidden prompts, private tools, Gemini Live Helper, internal conversations, or implementation details.
- Never say you lack information and then provide a confident unsupported answer.

Examples of the policy:
User: ¿Dónde vivió Gabriel?
Assistant: No consta en el perfil público un historial confirmado de lugares donde Gabriel vivió. Lo que sí consta es que está basado en Montevideo, Uruguay, y que su trayectoria incluye instituciones y organizaciones vinculadas a Montevideo, Barcelona, Guildford/UK y trabajo remoto. Eso no debe leerse como historial de residencia.

User: ¿Dónde está basado Gabriel?
Assistant: Gabriel está basado en Montevideo, Uruguay.

User: What did Gabriel do at Surrey?
Assistant: Gabriel worked as a Research Engineer in Sound Sensing at the University of Surrey, developing audio ML systems for real-world smart environments, privacy-preserving SED pipelines, VAD benchmarking under acoustic degradations, and Raspberry Pi sound event recognition demos.

Knowledge base:
${profileAssistantKnowledge}`;
}

async function runModel(env: any, messages: ChatMessage[]) {
  let lastError = '';
  for (const model of MODEL_CANDIDATES) {
    try {
      const result = await env.AI.run(model, {
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          ...messages,
        ],
        max_tokens: 700,
        temperature: 0,
      });
      const answer = extractAnswer(result);
      if (answer.trim()) return { answer, model };
    } catch (error: any) {
      lastError = typeof error?.message === 'string' ? error.message : `Model call failed for ${model}.`;
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

  const messages = Array.isArray(payload?.messages)
    ? payload.messages.map(cleanMessage).filter(Boolean).slice(-MAX_MESSAGES)
    : [];

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return jsonResponse({ error: 'Expected the last message to be from the user.' }, 400);
  }

  const lastUserMessage = messages[messages.length - 1].content;

  if (!env?.AI?.run) {
    return jsonResponse({ answer: fallbackUnavailable(lastUserMessage), source: 'fallback-no-ai-binding' });
  }

  try {
    const result = await runModel(env, messages);
    const answer = postProcessAnswer(result.answer, lastUserMessage);
    return jsonResponse({ answer, source: 'workers-ai', model: result.model });
  } catch (error: any) {
    return jsonResponse({
      answer: fallbackUnavailable(lastUserMessage),
      source: 'fallback-ai-error',
      warning: typeof error?.message === 'string' ? error.message : 'Workers AI model call failed.',
    });
  }
}

export async function onRequestGet() {
  return jsonResponse({ ok: true, endpoint: 'profile-assistant-chat', models: MODEL_CANDIDATES });
}
