import { useEffect, useMemo, useState } from 'react';

type CopyEmailButtonProps = {
  email: string;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const STORAGE_KEY = 'gabriel-profile-assistant-v1';

function ProfileAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi. I can answer questions about Gabriel's projects, publications, experience, education, technical stack, and contact details.",
    },
  ]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.slice(-12));
        }
      }
    } catch {
      // Ignore corrupted local storage.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-12)));
    } catch {
      // Ignore storage errors.
    }
  }, [messages]);

  const visibleMessages = useMemo(() => messages.slice(-10), [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-8) }),
      });

      const data = await response.json().catch(() => ({}));
      const answer = typeof data.answer === 'string'
        ? data.answer
        : typeof data.error === 'string'
          ? data.error
          : 'The profile assistant is temporarily unavailable.';

      setMessages([...nextMessages, { role: 'assistant', content: answer }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: 'The profile assistant is temporarily unavailable. Please try again later or contact Gabriel directly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <style>{`
        .profile-assistant-launcher {
          position: fixed;
          right: 1.25rem;
          bottom: 1.25rem;
          z-index: 70;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 9999px;
          background: #121a25;
          color: #fff;
          padding: 0.9rem 1rem;
          font-weight: 800;
          box-shadow: 0 18px 55px rgba(0,0,0,0.28);
          cursor: pointer;
        }
        .profile-assistant-dot {
          width: 0.72rem;
          height: 0.72rem;
          border-radius: 9999px;
          background: #7dd3fc;
          box-shadow: 0 0 0 6px rgba(125,211,252,0.16);
        }
        .profile-assistant-panel {
          position: fixed;
          right: 1.25rem;
          bottom: 5.3rem;
          z-index: 70;
          width: min(92vw, 420px);
          max-height: min(74vh, 660px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 1.6rem;
          background: #121a25;
          color: #fff;
          box-shadow: 0 30px 90px rgba(0,0,0,0.36);
        }
        .profile-assistant-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1rem 0.85rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .profile-assistant-title {
          font-weight: 900;
          letter-spacing: -0.02em;
        }
        .profile-assistant-subtitle {
          margin-top: 0.1rem;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.62);
        }
        .profile-assistant-close {
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 9999px;
          background: rgba(255,255,255,0.06);
          color: #fff;
          width: 2rem;
          height: 2rem;
          cursor: pointer;
        }
        .profile-assistant-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .profile-assistant-message {
          max-width: 86%;
          white-space: pre-wrap;
          line-height: 1.55;
          font-size: 0.92rem;
          border-radius: 1rem;
          padding: 0.75rem 0.85rem;
        }
        .profile-assistant-message.assistant {
          align-self: flex-start;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.9);
        }
        .profile-assistant-message.user {
          align-self: flex-end;
          background: #7dd3fc;
          color: #121a25;
          font-weight: 700;
        }
        .profile-assistant-input {
          padding: 0.9rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: grid;
          gap: 0.7rem;
        }
        .profile-assistant-input textarea {
          width: 100%;
          min-height: 4.2rem;
          resize: vertical;
          border-radius: 1rem;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          color: #fff;
          padding: 0.85rem;
          outline: none;
        }
        .profile-assistant-input textarea::placeholder {
          color: rgba(255,255,255,0.45);
        }
        .profile-assistant-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .profile-assistant-note {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.5);
        }
        .profile-assistant-send {
          border: 0;
          border-radius: 9999px;
          background: #7dd3fc;
          color: #121a25;
          padding: 0.65rem 1rem;
          font-weight: 900;
          cursor: pointer;
        }
        .profile-assistant-send:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        @media (max-width: 640px) {
          .profile-assistant-panel {
            right: 0.75rem;
            left: 0.75rem;
            bottom: 4.9rem;
            width: auto;
            max-height: 72vh;
          }
          .profile-assistant-launcher {
            right: 0.75rem;
            bottom: 0.75rem;
          }
        }
      `}</style>

      {open && (
        <section className="profile-assistant-panel" aria-label="Gabriel Bibbó profile assistant">
          <div className="profile-assistant-header">
            <div>
              <div className="profile-assistant-title">Profile assistant</div>
              <div className="profile-assistant-subtitle">Projects, publications, experience, contact</div>
            </div>
            <button type="button" className="profile-assistant-close" onClick={() => setOpen(false)} aria-label="Close profile assistant">×</button>
          </div>

          <div className="profile-assistant-messages">
            {visibleMessages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`profile-assistant-message ${message.role}`}>
                {message.content}
              </div>
            ))}
            {loading && <div className="profile-assistant-message assistant">Thinking…</div>}
          </div>

          <div className="profile-assistant-input">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={900}
              placeholder="Ask about Gabriel's projects, publications, experience, education, or availability…"
            />
            <div className="profile-assistant-actions">
              <span className="profile-assistant-note">Answers use a public profile knowledge base.</span>
              <button type="button" className="profile-assistant-send" onClick={sendMessage} disabled={loading || !input.trim()}>
                Send
              </button>
            </div>
          </div>
        </section>
      )}

      <button type="button" className="profile-assistant-launcher" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="profile-assistant">
        <span className="profile-assistant-dot" />
        Ask my profile
      </button>
    </>
  );
}

export default function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copyEmail}
        className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-signal hover:bg-white/10"
        aria-label="Copy email address"
      >
        {copied ? 'Email copied' : 'Copy email'}
      </button>
      <ProfileAssistant />
    </>
  );
}
