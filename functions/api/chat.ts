import { profileAssistantKnowledge } from '../../src/data/assistantKnowledge';

const MODEL = '@cf/meta/llama-3.1-8b-instruct';
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
  return 'I could not generate a response right now. Please try again later.';
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  if (!env?.AI?.run) {
    return jsonResponse(
      {
        error: 'Workers AI binding is not configured yet. Add a Workers AI binding named AI in Cloudflare Pages settings.',
      },
      503,
    );
  }

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
    return jsonResponse({ answer });
  } catch (error: any) {
    return jsonResponse(
      {
        error: 'The profile assistant is temporarily unavailable.',
        detail: typeof error?.message === 'string' ? error.message : undefined,
      },
      500,
    );
  }
}

export async function onRequestGet() {
  return jsonResponse({ ok: true, name: 'Gabriel Bibbó profile assistant' });
}
