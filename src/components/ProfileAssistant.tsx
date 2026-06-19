import { useEffect, useMemo, useState } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const COPY = {
  en: {
    storageKey: 'gabriel-profile-assistant-v1-en',
    intro: "Hi. I can answer questions about Gabriel's projects, publications, experience, education, technical stack, and contact details.",
    unavailable: 'The profile assistant is temporarily unavailable. Please try again later or contact Gabriel directly.',
    panelLabel: 'Gabriel Bibbó profile assistant',
    title: 'Profile assistant',
    subtitle: 'Projects, publications, experience, contact',
    close: 'Close profile assistant',
    thinking: 'Thinking…',
    placeholder: "Ask about Gabriel's projects, publications, experience, education, or availability…",
    note: 'Answers use the public profile content only.',
    send: 'Send',
    launcher: 'Ask my profile',
  },
  es: {
    storageKey: 'gabriel-profile-assistant-v1-es',
    intro: 'Hola. Puedo responder preguntas sobre los proyectos, publicaciones, experiencia, educación, stack técnico y datos de contacto de Gabriel.',
    unavailable: 'El asistente de perfil no está disponible temporalmente. Probá de nuevo más tarde o contactá directamente a Gabriel.',
    panelLabel: 'Asistente de perfil de Gabriel Bibbó',
    title: 'Asistente de perfil',
    subtitle: 'Proyectos, publicaciones, experiencia, contacto',
    close: 'Cerrar asistente de perfil',
    thinking: 'Pensando…',
    placeholder: 'Preguntá sobre proyectos, publicaciones, experiencia, educación o disponibilidad de Gabriel…',
    note: 'Las respuestas usan solamente el contenido público del perfil.',
    send: 'Enviar',
    launcher: 'Preguntá a mi perfil',
  },
};

const HERO_STATS = {
  en: [
    ['7+', 'years across audio and embedded engineering'],
    ['13', 'peer-reviewed publications and works'],
    ['8', 'models benchmarked under acoustic degradations'],
    ['197 GB', 'residential audio dataset built'],
  ],
  es: [
    ['7+', 'años entre audio e ingeniería embebida'],
    ['13', 'publicaciones y trabajos revisados por pares'],
    ['8', 'modelos evaluados bajo degradaciones acústicas'],
    ['197 GB', 'dataset residencial de audio construido'],
  ],
};

export default function ProfileAssistant() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const copy = COPY[lang];
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: COPY.en.intro }]);

  useEffect(() => {
    const pageLang = document.documentElement.lang?.startsWith('es') ? 'es' : 'en';
    setLang(pageLang);
  }, []);

  useEffect(() => {
    const stats = HERO_STATS[lang];
    const statBoxes = Array.from(document.querySelectorAll<HTMLElement>('#home aside .grid.grid-cols-2 > div'));
    statBoxes.slice(0, stats.length).forEach((box, index) => {
      const [value, label] = stats[index];
      const valueEl = box.querySelector<HTMLElement>('div:first-child');
      const labelEl = box.querySelector<HTMLElement>('div:last-child');
      if (valueEl) valueEl.textContent = value;
      if (labelEl) labelEl.textContent = label;
    });

    const replacements: Array<[string, string]> = [
      [' The private audio collection is not included in the repo.', ''],
      [' La colección privada de audio no está incluida en el repositorio.', ''],
      [' It is a physical prototyping project, not an AI project.', ''],
      [' Es un proyecto de prototipado físico, no un proyecto de AI.', ''],
    ];

    document.querySelectorAll<HTMLElement>('p').forEach((paragraph) => {
      let text = paragraph.textContent ?? '';
      let changed = false;
      replacements.forEach(([from, to]) => {
        if (text.includes(from)) {
          text = text.replace(from, to);
          changed = true;
        }
      });
      if (changed) paragraph.textContent = text;
    });
  }, [lang]);

  useEffect(() => {
    const lightbox = document.getElementById('image-lightbox');
    if (!lightbox) return;

    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('tabindex', '-1');

    let lastTrigger: HTMLElement | null = null;

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusCloseButton = () => {
      const close = lightbox.querySelector<HTMLElement>('.image-lightbox-close');
      close?.focus();
    };

    const returnFocus = () => {
      window.setTimeout(() => lastTrigger?.focus(), 0);
    };

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest?.('.image-lightbox-trigger') as HTMLElement | null;
      if (trigger) {
        lastTrigger = trigger;
        window.setTimeout(focusCloseButton, 0);
        return;
      }
      if (target?.closest?.('.image-lightbox-close, .image-lightbox-backdrop')) {
        returnFocus();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (lightbox.hidden) return;

      if (event.key === 'Escape') {
        returnFocus();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = Array.from(lightbox.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((item) => item.offsetParent !== null || item === document.activeElement);

      if (focusables.length === 0) {
        event.preventDefault();
        lightbox.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('click', onDocumentClick, true);
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('click', onDocumentClick, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(copy.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.slice(-12));
          return;
        }
      }
    } catch {
      // Ignore corrupted local storage.
    }
    setMessages([{ role: 'assistant', content: copy.intro }]);
  }, [copy.storageKey, copy.intro]);

  useEffect(() => {
    try {
      window.localStorage.setItem(copy.storageKey, JSON.stringify(messages.slice(-12)));
    } catch {
      // Ignore storage errors.
    }
  }, [messages, copy.storageKey]);

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
        body: JSON.stringify({ language: lang, messages: nextMessages.slice(-8) }),
      });

      const data = await response.json().catch(() => ({}));
      const answer = typeof data.answer === 'string'
        ? data.answer
        : typeof data.error === 'string'
          ? data.error
          : copy.unavailable;

      setMessages([...nextMessages, { role: 'assistant', content: answer }]);
    } catch {
      setMessages([...nextMessages, { role: 'assistant', content: copy.unavailable }]);
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
          position: fixed !important;
          right: 1.25rem !important;
          bottom: 1.25rem !important;
          z-index: 9999 !important;
          display: inline-flex !important;
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
          font-family: Inter, system-ui, sans-serif;
        }
        .profile-assistant-dot {
          width: 0.72rem;
          height: 0.72rem;
          border-radius: 9999px;
          background: #7dd3fc;
          box-shadow: 0 0 0 6px rgba(125,211,252,0.16);
        }
        .profile-assistant-panel {
          position: fixed !important;
          right: 1.25rem !important;
          bottom: 5.3rem !important;
          z-index: 9999 !important;
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
          font-family: Inter, system-ui, sans-serif;
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
            right: 0.75rem !important;
            left: 0.75rem !important;
            bottom: 4.9rem !important;
            width: auto;
            max-height: 72vh;
          }
          .profile-assistant-launcher {
            right: 0.75rem !important;
            bottom: 0.75rem !important;
          }
        }
      `}</style>

      {open && (
        <section className="profile-assistant-panel" aria-label={copy.panelLabel}>
          <div className="profile-assistant-header">
            <div>
              <div className="profile-assistant-title">{copy.title}</div>
              <div className="profile-assistant-subtitle">{copy.subtitle}</div>
            </div>
            <button type="button" className="profile-assistant-close" onClick={() => setOpen(false)} aria-label={copy.close}>×</button>
          </div>

          <div className="profile-assistant-messages">
            {visibleMessages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`profile-assistant-message ${message.role}`}>
                {message.content}
              </div>
            ))}
            {loading && <div className="profile-assistant-message assistant">{copy.thinking}</div>}
          </div>

          <div className="profile-assistant-input">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={900}
              placeholder={copy.placeholder}
            />
            <div className="profile-assistant-actions">
              <span className="profile-assistant-note">{copy.note}</span>
              <button type="button" className="profile-assistant-send" onClick={sendMessage} disabled={loading || !input.trim()}>
                {copy.send}
              </button>
            </div>
          </div>
        </section>
      )}

      <button type="button" className="profile-assistant-launcher" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className="profile-assistant-dot" />
        {copy.launcher}
      </button>
    </>
  );
}
