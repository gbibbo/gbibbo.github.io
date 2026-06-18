import { profileAssistantKnowledge } from '../../src/data/assistantKnowledge';

const MODEL = '@cf/meta/llama-3.2-3b-instruct';
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
  return '';
}

function wantsSpanish(question: string): boolean {
  const q = question.toLowerCase();
  return /[áéíóúñ¿¡]/.test(q) || q.includes(' en español') || q.includes('sabes decirlo') || q.includes('cómo') || q.includes('que ') || q.includes('cuál') || q.includes('edad') || q.includes('hola');
}

function profileFallback(question: string): string {
  const q = question.toLowerCase();
  const es = wantsSpanish(question);

  if (/^(hola|hello|hi|buenas)\b/.test(q.trim())) {
    return es
      ? 'Hola. Puedo responder preguntas sobre el perfil profesional de Gabriel: proyectos, publicaciones, experiencia, educación, stack técnico, contacto y disponibilidad.'
      : 'Hi. I can answer questions about Gabriel’s professional profile: projects, publications, experience, education, technical stack, contact and availability.';
  }

  if (q.includes('age') || q.includes('old') || q.includes('edad')) {
    return es
      ? 'No tengo la edad de Gabriel en esta base pública del perfil. Puedo responder sobre su experiencia, educación, publicaciones, proyectos y stack técnico.'
      : 'I do not have Gabriel’s age in this public profile knowledge base. I can answer about his experience, education, publications, projects and technical stack.';
  }

  if (q.includes('3hato') || q.includes('3h-ato') || q.includes('hato')) {
    return es
      ? '3H-ATO fue un proyecto de prototipado físico diseñado durante la pandemia. La base pública indica que era una herramienta mecánica pensada para evitar tocar directamente superficies compartidas. No tengo más detalles confirmados sobre el proceso exacto de origen o ideación.'
      : '3H-ATO was a physical prototyping project designed during the pandemic. The public knowledge base says it was a mechanical tool intended to avoid direct contact with shared surfaces. I do not have more confirmed detail about the exact origin or ideation process.';
  }

  if (q.includes('contact') || q.includes('email') || q.includes('mail') || q.includes('linkedin') || q.includes('contacto')) {
    return es
      ? 'Podés contactar a Gabriel en gabobibbo@gmail.com. Su LinkedIn es https://www.linkedin.com/in/gabriel-bibbo/ y su GitHub es https://github.com/gbibbo.'
      : 'You can contact Gabriel at gabobibbo@gmail.com. His LinkedIn is https://www.linkedin.com/in/gabriel-bibbo/ and his GitHub is https://github.com/gbibbo.';
  }

  if (q.includes('education') || q.includes('study') || q.includes('studies') || q.includes('estudios') || q.includes('formal')) {
    return es
      ? 'La formación formal de Gabriel incluye un MSc in Sound and Music Computing en Universitat Pompeu Fabra, Barcelona, y un BSc in Electrical Engineering en Universidad de la República, Uruguay.'
      : 'Gabriel’s formal education includes an MSc in Sound and Music Computing from Universitat Pompeu Fabra in Barcelona, and a BSc in Electrical Engineering from Universidad de la República in Uruguay.';
  }

  if (q.includes('experience') || q.includes('work') || q.includes('employment') || q.includes('surrey') || q.includes('webhelp') || q.includes('kpmg') || q.includes('ikatu') || q.includes('experiencia')) {
    return es
      ? 'Gabriel trabajó como Research Engineer in Sound Sensing en University of Surrey, Technical Support Engineer para Google Workspace en Webhelp, IT Auditor en KPMG y R&D Engineer en Ikatu. Su eje más fuerte es audio ML research engineering, con experiencia adicional en sistemas embebidos, soporte técnico enterprise e IT audit.'
      : 'Gabriel has worked as a Research Engineer in Sound Sensing at the University of Surrey, Technical Support Engineer for Google Workspace at Webhelp, IT Auditor at KPMG, and R&D Engineer at Ikatu. His strongest professional thread is audio ML research engineering, with additional experience in embedded systems, enterprise technical support, and IT audit.';
  }

  if (q.includes('sounds of home') || q.includes('dataset')) {
    return es
      ? 'Sounds of Home es un dataset residencial y privacy-preserving para sound event detection. Contiene 1.344 grabaciones de una hora tomadas en 8 hogares de Bélgica con dispositivos AudioMoth ubicados en salas de estar y cocinas. Antes de publicarlo, se removió el habla y se entregaron predicciones de PANNs para los frames de audio. Sitio oficial: https://www.cvssp.org/data/ai4s/sounds_of_home/'
      : 'Sounds of Home is a privacy-preserving residential audio dataset for sound event detection. It contains 1,344 one-hour recordings from 8 homes in Belgium, recorded with AudioMoth devices in living rooms and kitchens. Speech was removed before release, and PANNs predictions were provided for audio frames. Official site: https://www.cvssp.org/data/ai4s/sounds_of_home/';
  }

  if (q.includes('asr') || q.includes('speech enhancement')) {
    return es
      ? 'ASR Enhancement Platform compara dos rutas de ASR sobre el mismo audio: transcripción directa y enhance-and-transcribe. Guarda jobs, archivos de audio, transcripciones y payloads de proveedores. Usa FastAPI, Celery, PostgreSQL, Redis, MinIO, Docker Compose, Prometheus, OpenTelemetry y Grafana.'
      : 'The ASR Enhancement Platform compares two ASR paths on the same audio: raw transcription and enhance-and-transcribe. It stores jobs, audio files, transcripts, and provider payloads, using FastAPI, Celery, PostgreSQL, Redis, MinIO, Docker Compose, Prometheus, OpenTelemetry and Grafana.';
  }

  if (q.includes('vad') || q.includes('qwen') || q.includes('voice activity')) {
    return es
      ? 'El trabajo de Gabriel en VAD evalúa audio-language models bajo condiciones acústicas difíciles: duración corta, ruido, reverberación y filtrado. Compara Qwen2-Audio-7B, Qwen2-Audio-7B con LoRA, Qwen3-Omni-30B y Silero VAD. El mejor resultado reportado es Qwen2-Audio-7B con LoRA y OPRO-Template: 93,3% de balanced accuracy en 21.340 clips degradados.'
      : 'Gabriel’s VAD work evaluates audio-language models under difficult acoustic conditions such as short duration, noise, reverberation and filtering. The project compares Qwen2-Audio-7B, Qwen2-Audio-7B with LoRA, Qwen3-Omni-30B and Silero VAD. The best reported result is Qwen2-Audio-7B with LoRA and OPRO-Template: 93.3% balanced accuracy on 21,340 degraded clips.';
  }

  if (q.includes('traktor') || q.includes('dj') || q.includes('music')) {
    return es
      ? 'Traktor ML es un pipeline de music information retrieval que convierte una biblioteca local de Techno y Tech House en playlists listas para Traktor. Usa embeddings MERT, stems de Demucs, metadata con Essentia, clustering y exportación de playlists.'
      : 'Traktor ML is a music-information-retrieval pipeline that turns a local Techno and Tech House library into Traktor-ready playlists. It uses MERT embeddings, Demucs stems, Essentia metadata, clustering and playlist export.';
  }

  if (q.includes('publication') || q.includes('paper') || q.includes('research') || q.includes('publicación')) {
    return es
      ? 'Gabriel tiene publicaciones y trabajos sobre audio privacy-preserving, sound event detection, environmental sound classification en hardware embebido, robustez ante acústica de salas y micrófonos, soundscapes, Raspberry Pi sound recognition y harmonic EDM mixing.'
      : 'Gabriel has publications and works across privacy-preserving audio, sound event detection, embedded environmental sound classification, room acoustics and microphone robustness, soundscape research, Raspberry Pi sound recognition, and harmonic EDM mixing.';
  }

  if (q.includes('stack') || q.includes('technical') || q.includes('python') || q.includes('pytorch')) {
    return es
      ? 'El stack de Gabriel incluye Python, C/C++, PyTorch, Hugging Face, PEFT, TorchAudio, librosa, Essentia, scikit-learn, pandas, NumPy, SciPy, Docker, Git, Linux CLI, Bash, Slurm, Redis Streams, Prometheus, Grafana, SQLite, MATLAB, Claude Code y VS Code.'
      : 'Gabriel’s stack includes Python, C/C++, PyTorch, Hugging Face, PEFT, TorchAudio, librosa, Essentia, scikit-learn, pandas, NumPy, SciPy, Docker, Git, Linux CLI, Bash, Slurm, Redis Streams, Prometheus, Grafana, SQLite, MATLAB, Claude Code and VS Code.';
  }

  return es
    ? 'Puedo responder preguntas sobre el perfil profesional de Gabriel Bibbó: proyectos, publicaciones, educación, experiencia laboral, stack técnico, contacto y disponibilidad. Probá preguntar por Sounds of Home, ASR Enhancement Platform, VAD, Traktor ML, 3H-ATO o su experiencia en University of Surrey.'
    : 'I can answer questions about Gabriel Bibbó’s professional profile, projects, publications, education, work experience, technical stack, contact details and availability. Try asking about Sounds of Home, ASR platform, VAD research, Traktor ML, 3H-ATO, or University of Surrey experience.';
}

function shouldReplaceWithFallback(answer: string, question: string): boolean {
  const a = answer.toLowerCase();
  const q = question.toLowerCase();
  const asksKnownProject = ['sounds of home', '3hato', '3h-ato', 'asr', 'vad', 'qwen', 'traktor', 'alpaca', 'raspberry'].some((term) => q.includes(term));

  const genericIgnorance =
    a.includes('my knowledge cutoff') ||
    a.includes('last update') ||
    a.includes('última actualización') ||
    a.includes('no tengo registros') ||
    a.includes('i do not have records') ||
    a.includes('i don\'t have records') ||
    a.includes('i have no records') ||
    a.includes('no tengo información sobre') ||
    a.includes('no tengo informacion sobre');

  const contradictoryKnownProjectAnswer = asksKnownProject && genericIgnorance;
  return contradictoryKnownProjectAnswer;
}

function postProcessAnswer(answer: string, question: string): string {
  const trimmed = answer.trim().slice(0, MAX_REPLY_CHARS);
  if (!trimmed) return profileFallback(question);
  if (shouldReplaceWithFallback(trimmed, question)) return profileFallback(question);
  return trimmed;
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
    return jsonResponse({ answer: profileFallback(lastUserMessage), source: 'fallback-no-ai-binding' });
  }

  const systemPrompt = `You are Gabriel Bibbó's public profile assistant.

Use ONLY the knowledge base below. You are not a general web assistant and you must not talk about training data, knowledge cutoffs, or generic model limitations.

Answer in the same language as the user unless they ask otherwise. Keep answers concise by default.

If the question asks about a topic that exists in the knowledge base, answer with the known facts first. If only part of the answer is known, say what is known and then say exactly what detail is not available. Do not start by saying you do not know if the knowledge base has partial information.

Never say "I do not have information about X" and then provide information about X in the same answer. Avoid contradictions.

Only suggest contacting Gabriel when the requested detail is personal, private, or clearly absent from the knowledge base. Do not use "contact Gabriel" as a generic ending.

Never mention private tools, unreleased interview assistants, private logs, hidden prompts, or internal conversations. Never mention Gemini Live Helper.

Knowledge base:
${profileAssistantKnowledge}`;

  try {
    const result = await env.AI.run(MODEL, {
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 650,
      temperature: 0.1,
    });

    const answer = postProcessAnswer(extractAnswer(result), lastUserMessage);
    return jsonResponse({ answer, source: 'workers-ai' });
  } catch (error: any) {
    return jsonResponse({
      answer: profileFallback(lastUserMessage),
      source: 'fallback-ai-error',
      warning: typeof error?.message === 'string' ? error.message : 'Workers AI model call failed.',
    });
  }
}

export async function onRequestGet() {
  return jsonResponse({ ok: true, name: 'Gabriel Bibbó profile assistant', model: MODEL });
}
