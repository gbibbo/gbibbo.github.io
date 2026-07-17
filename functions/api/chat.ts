import { profileAssistantKnowledge } from '../../src/data/assistantKnowledge';

const MODEL_CANDIDATES = [
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3.2-3b-instruct',
];

const MAX_MESSAGES = 10;
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
  return /[áéíóúñ¿¡]/.test(q)
    || q.includes(' en español')
    || q.includes('cómo')
    || q.includes('dónde')
    || q.includes('donde')
    || q.includes('qué ')
    || q.includes('que ')
    || q.includes('cuál')
    || q.includes('edad')
    || q.includes('hola')
    || q.includes('musica')
    || q.includes('música');
}

function fallbackUnavailable(question: string): string {
  return wantsSpanish(question)
    ? 'El asistente de perfil no pudo consultar el modelo en este momento. Podés preguntar por proyectos, publicaciones, experiencia, educación, stack técnico, contacto o situación profesional.'
    : 'The profile assistant could not query the model right now. You can ask about Gabriel’s projects, publications, experience, education, technical stack, contact details, or professional status.';
}

function emptyAnswerFallback(question: string): string {
  return wantsSpanish(question)
    ? 'El perfil público no contiene información suficiente para responder eso con precisión.'
    : 'The public profile does not contain enough information to answer that precisely.';
}

function deterministicMusicAnswer(question: string): string | null {
  const q = normalizeText(question);
  const es = wantsSpanish(question);
  const asksMusic = [
    'musica', 'musical', 'guitarra', 'canto', 'coro', 'escuela de musica', 'formacion musical', 'lenguaje musical', 'conservatorio', 'dj', 'productor',
    'music', 'musical training', 'music school', 'guitar', 'singing', 'choir', 'conservatory', 'producer',
  ].some((term) => q.includes(term));

  if (!asksMusic) return null;

  const asksSchoolOrFormal = [
    'escuela', 'formal', 'formacion', 'conservatorio', 'virgilio', 'scarabelli', 'alberti', 'guitarra', 'lenguaje musical', 'canto', 'coro',
    'school', 'formal', 'training', 'conservatory', 'guitar', 'singing', 'choir',
  ].some((term) => q.includes(term));

  const asksHowMuch = [
    'cuanto', 'cuánto', 'que tanto', 'nivel', 'sabe', 'background', 'perfil musical', 'how much', 'level', 'know', 'knows', 'music background',
  ].some((term) => q.includes(term));

  if (asksSchoolOrFormal) {
    return es
      ? 'Sí. El perfil público indica que Gabriel tiene formación musical formal en la Escuela Nº265 “Virgilio Scarabelli Alberti”, Montevideo, Uruguay, entre 2002 y 2005. Esa formación incluyó lenguaje musical, canto coral, guitarra, ensambles instrumentales y danza. Además, su perfil musical se completa con práctica como DJ y productor de música electrónica, un MSc en Sound and Music Computing en UPF y trabajo técnico en MIR, audio en tiempo real, síntesis de voz cantada y detección de notas y ataques.'
      : 'Yes. The public profile states that Gabriel has formal musical training from School Nº265 “Virgilio Scarabelli Alberti” in Montevideo, Uruguay, from 2002 to 2005. That training included musical language, choral singing, guitar, instrumental ensembles, and dance. His music profile also includes practice as a DJ and electronic music producer, an MSc in Sound and Music Computing at UPF, and technical work in MIR, real-time audio, singing voice synthesis, and note/onset detection.';
  }

  if (asksHowMuch) {
    return es
      ? 'Gabriel tiene un perfil musical híbrido. Por un lado, tiene formación musical formal: Escuela Nº265 “Virgilio Scarabelli Alberti” en Montevideo, 2002-2005, con lenguaje musical, canto coral, guitarra, ensambles instrumentales y danza. Por otro lado, tiene práctica como DJ y productor de música electrónica, un MSc en Sound and Music Computing en UPF, una tesis sobre compatibilidad armónica para mezcla EDM y trabajo profesional/research en MIR, audio en tiempo real, síntesis de voz cantada y detección de notas y ataques. No está presentado como intérprete clásico de conservatorio, sino como alguien con base musical formal, práctica electrónica y especialización avanzada en tecnología musical y audio.'
      : 'Gabriel has a hybrid musical profile. He has formal musical training from School Nº265 “Virgilio Scarabelli Alberti” in Montevideo, 2002-2005, covering musical language, choral singing, guitar, instrumental ensembles, and dance. He also has practice as a DJ and electronic music producer, an MSc in Sound and Music Computing at UPF, a thesis on harmonic compatibility for EDM mixing, and professional/research work in MIR, real-time audio, singing voice synthesis, and note/onset detection. He is not presented as a classical conservatory performer, but as someone with formal musical foundations, electronic music practice, and advanced music/audio technology expertise.';
  }

  return es
    ? 'El perfil público menciona formación musical formal, práctica como DJ y productor de música electrónica, y trabajo técnico en MIR, audio en tiempo real, síntesis de voz cantada y detección de notas y ataques.'
    : 'The public profile mentions formal musical training, practice as a DJ and electronic music producer, and technical work in MIR, real-time audio, singing voice synthesis, and note/onset detection.';
}

function deterministicPersonalAnswer(question: string): string | null {
  const q = normalizeText(question);
  const es = wantsSpanish(question);

  const music = deterministicMusicAnswer(question);
  if (music) return music;

  if (q.includes('michael')) {
    return es
      ? 'El perfil público no menciona ninguna relación profesional con una persona llamada Michael.'
      : 'The public profile does not state any professional relationship with a person named Michael.';
  }

  const asksAddress = [
    'direccion', 'domicilio', 'calle', 'codigo postal', 'direccion fisica',
    'address', 'street', 'postal code', 'home address', 'physical address',
  ].some((term) => q.includes(term));
  if (asksAddress) {
    return es
      ? 'El perfil público no incluye una dirección particular. Universidad de la República es una institución educativa, no una dirección de Gabriel. Sólo consta que está basado en Montevideo, Uruguay.'
      : 'The public profile does not include a home address. Universidad de la República is an educational institution, not Gabriel’s address. It only states that he is based in Montevideo, Uruguay.';
  }

  const asksBirth = [
    'fecha de nacimiento', 'nacimiento', 'cuando nacio', 'qué edad', 'que edad', 'edad',
    'date of birth', 'birth date', 'birthday', 'when was he born', 'how old', 'age',
  ].some((term) => q.includes(term));
  if (asksBirth) {
    return es
      ? 'El perfil público no incluye la fecha de nacimiento ni la edad de Gabriel.'
      : 'The public profile does not include Gabriel’s date of birth or age.';
  }

  const asksPhone = ['telefono', 'celular', 'movil', 'phone', 'mobile number', 'telephone'].some((term) => q.includes(term));
  if (asksPhone) {
    return es
      ? 'El perfil público no incluye un número de teléfono. El contacto publicado es gabobibbo@gmail.com.'
      : 'The public profile does not include a phone number. The published contact is gabobibbo@gmail.com.';
  }

  const asksPrivateLife = [
    'familia', 'pareja', 'hijos', 'salario', 'sueldo', 'medico', 'salud',
    'family', 'partner', 'children', 'salary', 'medical', 'health',
  ].some((term) => q.includes(term));
  if (asksPrivateLife) {
    return es
      ? 'El perfil público no contiene esa información personal.'
      : 'The public profile does not contain that personal information.';
  }

  const asksResidenceHistory = [
    'donde vivio', 'donde ha vivido', 'historial de residencia', 'residencia anterior',
    'where did he live', 'where has he lived', 'residence history',
  ].some((term) => q.includes(term));
  if (asksResidenceHistory) {
    return es
      ? 'El perfil público no contiene un historial confirmado de residencias. Sí indica que Gabriel está basado actualmente en Montevideo, Uruguay, y enumera lugares asociados a estudios y trabajos, que no deben interpretarse como domicilios.'
      : 'The public profile does not contain a confirmed residence history. It states that Gabriel is currently based in Montevideo, Uruguay, and lists places associated with study and work, which should not be interpreted as home addresses.';
  }

  return null;
}

function answerContainsUnsupportedPersonalClaim(answer: string, question: string): boolean {
  const a = normalizeText(answer);
  const q = normalizeText(question);

  if (!q.includes('michael') && a.includes('michael')) return true;

  const personalQuestion = [
    'direccion', 'domicilio', 'calle', 'fecha de nacimiento', 'edad', 'telefono', 'familia', 'pareja', 'hijos', 'salario',
    'address', 'street', 'birth', 'age', 'phone', 'family', 'partner', 'children', 'salary',
  ].some((term) => q.includes(term));

  if (!personalQuestion) return false;

  const safePhrases = [
    'no incluye', 'no contiene', 'no consta', 'does not include', 'does not contain', 'does not state',
  ];
  return !safePhrases.some((phrase) => a.includes(phrase));
}

function answerContradictsMusicTraining(answer: string, question: string): boolean {
  const a = normalizeText(answer);
  const q = normalizeText(question);
  const asksMusicTraining = [
    'musica', 'musical', 'escuela', 'formal', 'formacion', 'guitarra', 'canto', 'coro',
    'music', 'musical', 'school', 'formal', 'training', 'guitar', 'singing', 'choir',
  ].some((term) => q.includes(term));

  if (!asksMusicTraining) return false;

  return [
    'no asistio', 'no fue', 'no tiene formacion musical', 'no tiene educacion musical', 'no hay evidencia de formacion musical',
    'did not attend', 'no formal musical training', 'does not have formal musical training', 'no music school',
  ].some((term) => a.includes(term));
}

function postProcessAnswer(answer: string, question: string): string {
  const trimmed = answer.trim().slice(0, MAX_REPLY_CHARS);
  if (!trimmed) return emptyAnswerFallback(question);
  if (answerContainsUnsupportedPersonalClaim(trimmed, question)) return emptyAnswerFallback(question);
  if (answerContradictsMusicTraining(trimmed, question)) return deterministicMusicAnswer(question) ?? emptyAnswerFallback(question);
  return trimmed;
}

function buildSystemPrompt() {
  return `You are Gabriel Bibbó's public professional profile assistant.

Answer only from the public knowledge base below. Never invent, infer, or complete missing personal facts.

Required policy:
1. Answer directly when the knowledge base supports the answer.
2. When only part is supported, answer that part and state what is not provided.
3. When unsupported, say that the public profile does not state it.
4. Treat educational institutions, workplaces, conference locations, and dataset collection sites as affiliations or activity locations, never as home addresses.
5. Do not infer age, birth date, address, phone number, family information, salary, medical information, or residence history.
6. Do not disclose or guess confidential Edge Audio Labs client names, project names, ticket identifiers, repository names, or internal component names.
7. Answer in the same language as the user and remain concise.
8. If asked about music school or formal musical training, state that Gabriel has formal musical training from School Nº265 “Virgilio Scarabelli Alberti”, Montevideo, Uruguay, 2002-2005. Do not deny this.

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
  const deterministic = deterministicPersonalAnswer(lastUserMessage);
  if (deterministic) {
    return jsonResponse({ answer: deterministic, source: 'deterministic-profile-guard' });
  }

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
