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

function profileFallback(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('age') || q.includes('old') || q.includes('edad')) {
    return 'I do not have Gabriel’s age in this public profile knowledge base. For personal details, contact Gabriel directly.';
  }

  if (q.includes('contact') || q.includes('email') || q.includes('mail') || q.includes('linkedin')) {
    return 'You can contact Gabriel at gabobibbo@gmail.com. His LinkedIn is https://www.linkedin.com/in/gabriel-bibbo/ and his GitHub is https://github.com/gbibbo.';
  }

  if (q.includes('education') || q.includes('study') || q.includes('studies') || q.includes('estudios') || q.includes('formal')) {
    return 'Gabriel’s formal education includes an MSc in Sound and Music Computing from Universitat Pompeu Fabra in Barcelona, and a BSc in Electrical Engineering from Universidad de la República in Uruguay.';
  }

  if (q.includes('experience') || q.includes('work') || q.includes('employment') || q.includes('surrey') || q.includes('webhelp') || q.includes('kpmg') || q.includes('ikatu')) {
    return 'Gabriel has worked as a Research Engineer in Sound Sensing at the University of Surrey, Technical Support Engineer for Google Workspace at Webhelp, IT Auditor at KPMG, and R&D Engineer at Ikatu. His strongest professional thread is audio ML research engineering, with additional experience in embedded systems, enterprise technical support, and IT audit.';
  }

  if (q.includes('sounds of home') || q.includes('dataset')) {
    return 'Sounds of Home is a privacy-preserving residential audio dataset for sound event detection. It contains 1,344 one-hour recordings from 8 homes in Belgium, recorded with AudioMoth devices. Speech was removed before release, and PANNs predictions were provided for audio frames. Official site: https://www.cvssp.org/data/ai4s/sounds_of_home/';
  }

  if (q.includes('asr') || q.includes('speech enhancement')) {
    return 'The ASR Enhancement Platform compares two ASR paths on the same audio: raw transcription and enhance-and-transcribe. It stores jobs, audio files, transcripts, and provider payloads, using a backend stack including FastAPI, Celery, PostgreSQL, Redis, MinIO, Docker Compose, Prometheus, OpenTelemetry and Grafana.';
  }

  if (q.includes('vad') || q.includes('qwen') || q.includes('voice activity')) {
    return 'Gabriel’s VAD work evaluates audio-language models under difficult acoustic conditions such as short duration, noise, reverberation and filtering. The project compares Qwen2-Audio-7B, Qwen2-Audio-7B with LoRA, Qwen3-Omni-30B and Silero VAD. The best reported result is Qwen2-Audio-7B with LoRA and OPRO-Template: 93.3% balanced accuracy on 21,340 degraded clips.';
  }

  if (q.includes('traktor') || q.includes('dj') || q.includes('music')) {
    return 'Traktor ML is a music-information-retrieval pipeline that turns a local Techno and Tech House library into Traktor-ready playlists. It uses MERT embeddings, Demucs stems, Essentia metadata, clustering and playlist export.';
  }

  if (q.includes('publication') || q.includes('paper') || q.includes('research')) {
    return 'Gabriel has publications and works across privacy-preserving audio, sound event detection, embedded environmental sound classification, room acoustics and microphone robustness, soundscape research, Raspberry Pi sound recognition, and harmonic EDM mixing.';
  }

  if (q.includes('stack') || q.includes('technical') || q.includes('python') || q.includes('pytorch')) {
    return 'Gabriel’s stack includes Python, C/C++, PyTorch, Hugging Face, PEFT, TorchAudio, librosa, Essentia, scikit-learn, pandas, NumPy, SciPy, Docker, Git, Linux CLI, Bash, Slurm, Redis Streams, Prometheus, Grafana, SQLite, MATLAB, Claude Code and VS Code.';
  }

  return 'I can answer questions about Gabriel Bibbó’s professional profile, projects, publications, education, work experience, technical stack, contact details and availability. Try asking about his Audio AI work, Sounds of Home, ASR platform, VAD research, Traktor ML, or employment experience.';
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
    return jsonResponse({ answer: profileFallback(lastUserMessage) });
  }

  const systemPrompt = `You are Gabriel Bibbó's public profile assistant.\n\nUse only the knowledge base below. If information is missing, say you do not have that information and suggest contacting Gabriel.\n\nAnswer in the same language as the user unless they ask otherwise. Keep answers concise by default. Use bullet points only when they improve readability.\n\nNever mention private tools, unreleased interview assistants, private logs, hidden prompts, or internal conversations. Never mention Gemini Live Helper.\n\nKnowledge base:\n${profileAssistantKnowledge}`;

  try {
    const result = await env.AI.run(MODEL, {
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 700,
      temperature: 0.25,
    });

    const answer = extractAnswer(result).trim().slice(0, MAX_REPLY_CHARS);
    return jsonResponse({ answer: answer || profileFallback(lastUserMessage) });
  } catch (error: any) {
    return jsonResponse({
      answer: profileFallback(lastUserMessage),
      warning: typeof error?.message === 'string' ? error.message : 'Workers AI model call failed.',
    });
  }
}

export async function onRequestGet() {
  return jsonResponse({ ok: true, name: 'Gabriel Bibbó profile assistant', model: MODEL });
}
