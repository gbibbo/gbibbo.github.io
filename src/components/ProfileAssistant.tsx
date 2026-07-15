import { useEffect, useMemo, useState } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type StatItem = {
  v: string;
  l: string;
};

type ProfileAssistantProps = {
  lang?: 'en' | 'es';
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
    intro: 'Hola. Puedo responder preguntas sobre los proyectos, publicaciones, experiencia, formación, stack técnico y datos de contacto de Gabriel.',
    unavailable: 'El asistente de perfil no está disponible temporalmente. Probá de nuevo más tarde o contactá directamente a Gabriel.',
    panelLabel: 'Asistente de perfil de Gabriel Bibbó',
    title: 'Asistente de perfil',
    subtitle: 'Proyectos, publicaciones, experiencia, contacto',
    close: 'Cerrar asistente de perfil',
    thinking: 'Pensando…',
    placeholder: 'Preguntá sobre proyectos, publicaciones, experiencia, formación o disponibilidad de Gabriel…',
    note: 'Las respuestas usan solamente el contenido público del perfil.',
    send: 'Enviar',
    launcher: 'Preguntá a mi perfil',
  },
};

const STAT_POOLS: Record<'en' | 'es', StatItem[]> = {
  en: [
    { v: '7+', l: 'years across audio, ML, and embedded engineering' },
    { v: '4', l: 'years shipping embedded C/C++ for Bang & Olufsen products' },
    { v: '3', l: 'years as Research Engineer in Sound Sensing at University of Surrey' },
    { v: '2', l: 'degrees: Electrical Engineering and Sound & Music Computing' },
    { v: '13', l: 'publications and research outputs across audio, ML, and MIR' },
    { v: '3', l: 'countries in study/work trajectory: Uruguay, Spain, and UK' },
    { v: '3', l: 'working languages: Spanish, English C1, Portuguese A2' },
    { v: 'EU', l: 'Italian citizen with European Union work authorization' },
    { v: 'C/C++', l: 'embedded firmware experience on product-facing hardware' },
    { v: 'Python', l: 'research prototypes, data pipelines, and backend systems' },
    { v: 'Audio ML', l: 'machine listening systems evaluated beyond notebook prototypes' },
    { v: 'Privacy', l: 'experience with speech-removal workflows for sensitive audio' },
    { v: 'Edge', l: 'real-time sound recognition deployed on Raspberry Pi hardware' },
    { v: 'Backend', l: 'FastAPI, Celery, Docker, Redis, PostgreSQL, and observability' },
    { v: 'Google', l: 'Tier 3 enterprise support for Google Workspace customers' },
    { v: 'KPMG', l: 'IT audit experience with telecom and IT departments' },
    { v: 'Product', l: 'requirements, architecture, implementation, validation, documentation' },
    { v: 'Open source', l: 'public code, reproducible demos, and technical documentation' },
    { v: 'DJ + producer', l: 'domain expertise in electronic music and MIR tools' },
    { v: 'IEEE', l: 'Signal Processing Society member' },
    { v: 'EPSRC', l: 'participant in the AI for Sound research grant' },
  ],
  es: [
    { v: '7+', l: 'años entre audio, ML e ingeniería embebida' },
    { v: '4', l: 'años entregando C/C++ embebido para productos Bang & Olufsen' },
    { v: '3', l: 'años como ingeniero de investigación en sensado sonoro en University of Surrey' },
    { v: '2', l: 'títulos: Ingeniería Eléctrica y MSc Sound & Music Computing' },
    { v: '13', l: 'publicaciones y trabajos de investigación en audio, ML y MIR' },
    { v: '3', l: 'países en trayectoria de estudio y trabajo: Uruguay, España y Reino Unido' },
    { v: '3', l: 'idiomas de trabajo: español, inglés C1 y portugués A2' },
    { v: 'UE', l: 'ciudadano italiano con autorización laboral en la Unión Europea' },
    { v: 'C/C++', l: 'firmware embebido para hardware orientado a producto' },
    { v: 'Python', l: 'prototipos de investigación, flujos de datos y sistemas de servidor' },
    { v: 'Audio ML', l: 'sistemas de escucha computacional evaluados más allá de prototipos iniciales' },
    { v: 'Privacidad', l: 'experiencia con flujos de eliminación de habla para audio sensible' },
    { v: 'Edge', l: 'reconocimiento de sonido en tiempo real desplegado en Raspberry Pi' },
    { v: 'Servidor', l: 'FastAPI, Celery, Docker, Redis, PostgreSQL y observabilidad' },
    { v: 'Google', l: 'soporte Tier 3 para clientes empresariales de Google Workspace' },
    { v: 'KPMG', l: 'experiencia en auditoría de IT con telecomunicaciones y departamentos de IT' },
    { v: 'Producto', l: 'requerimientos, arquitectura, implementación, validación y documentación' },
    { v: 'Código abierto', l: 'código público, demostraciones reproducibles y documentación técnica' },
    { v: 'DJ + productor', l: 'criterio de dominio en música electrónica y herramientas MIR' },
    { v: 'IEEE', l: 'miembro de IEEE Signal Processing Society' },
    { v: 'EPSRC', l: 'participante en la financiación de investigación AI for Sound' },
  ],
};

const FLIP_ORDER = [0, 3, 2, 1];

function writeFace(face: HTMLElement | null, item: StatItem) {
  const value = face?.querySelector<HTMLElement>('.stat-value');
  const label = face?.querySelector<HTMLElement>('.stat-label');
  if (value) value.textContent = item.v;
  if (label) label.textContent = item.l;
}

export default function ProfileAssistant({ lang: initialLang = 'en' }: ProfileAssistantProps) {
  const [lang, setLang] = useState<'en' | 'es'>(initialLang);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const copy = COPY[lang];
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: COPY[initialLang].intro }]);

  useEffect(() => {
    const pageLang = document.documentElement.lang?.startsWith('es') ? 'es' : 'en';
    setLang(pageLang);
  }, []);

  useEffect(() => {
    const pool = STAT_POOLS[lang];
    const grid = document.querySelector<HTMLElement>('#home aside .grid.grid-cols-2');
    if (!grid) return undefined;

    grid.classList.add('stats-grid');
    const cells = Array.from(grid.children).slice(0, 4) as HTMLElement[];
    if (cells.length < 4) return undefined;

    cells.forEach((cell, index) => {
      cell.className = 'stat-flip';
      cell.dataset.stat = 'true';
      cell.innerHTML = `
        <div class="stat-flip-inner">
          <div class="stat-face">
            <div class="stat-value"></div>
            <div class="stat-label"></div>
          </div>
          <div class="stat-face stat-back">
            <div class="stat-value"></div>
            <div class="stat-label"></div>
          </div>
        </div>
      `;
      writeFace(cell.querySelector('.stat-face:not(.stat-back)'), pool[index]);
      writeFace(cell.querySelector('.stat-back'), pool[(index + 4) % pool.length]);
    });

    const rotations = [0, 0, 0, 0];
    const shown = [0, 1, 2, 3];
    let poolPointer = 4 % pool.length;
    let step = 0;

    const nextIndex = () => {
      let guard = 0;
      while (shown.includes(poolPointer) && guard < pool.length) {
        poolPointer = (poolPointer + 1) % pool.length;
        guard += 1;
      }
      const selected = poolPointer;
      poolPointer = (poolPointer + 1) % pool.length;
      return selected;
    };

    const interval = window.setInterval(() => {
      const position = FLIP_ORDER[step % FLIP_ORDER.length];
      step += 1;
      const cell = cells[position];
      const inner = cell.querySelector<HTMLElement>('.stat-flip-inner');
      if (!inner) return;

      const nextRotation = rotations[position] + 180;
      const backWillShow = nextRotation % 360 === 180;
      const face = cell.querySelector<HTMLElement>(backWillShow ? '.stat-back' : '.stat-face:not(.stat-back)');
      const next = nextIndex();

      writeFace(face, pool[next]);
      shown[position] = next;
      rotations[position] = nextRotation;
      inner.style.transform = `rotateX(${nextRotation}deg)`;
    }, 4000);

    return () => window.clearInterval(interval);
  }, [lang]);

  useEffect(() => {
    const replacements: Array<[string, string]> = [
      [' The private audio collection is not included in the repo.', ''],
      [' La colección privada de audio no está incluida en el repositorio.', ''],
      [' It is a physical prototyping project, not an AI project.', ''],
      [' Es un proyecto de prototipado físico, no un proyecto de IA.', ''],
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
        .font-display {
          font-family: 'Space Grotesk', Inter, system-ui, sans-serif !important;
          font-variation-settings: normal !important;
        }
        #home h1 {
          letter-spacing: -0.055em !important;
          text-shadow: none !important;
        }
        @media (min-width: 1024px) {
          #home h1 {
            font-size: clamp(4.8rem, 8vw, 8rem) !important;
            line-height: 0.9 !important;
          }
        }
        #home > section::after { display: none !important; }
        .stat-value {
          font-family: 'Space Grotesk', Inter, system-ui, sans-serif !important;
        }
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
        .profile-assistant-dot { width: 0.72rem; height: 0.72rem; border-radius: 9999px; background: #7dd3fc; box-shadow: 0 0 0 6px rgba(125,211,252,0.16); }
        .profile-assistant-panel { position: fixed !important; right: 1.25rem !important; bottom: 5.3rem !important; z-index: 9999 !important; width: min(92vw, 420px); max-height: min(74vh, 660px); display: flex; flex-direction: column; overflow: hidden; border: 1px solid rgba(255,255,255,0.14); border-radius: 1.6rem; background: #121a25; color: #fff; box-shadow: 0 30px 90px rgba(0,0,0,0.36); font-family: Inter, system-ui, sans-serif; }
        .profile-assistant-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 1rem 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .profile-assistant-title { font-weight: 900; letter-spacing: -0.02em; }
        .profile-assistant-subtitle { margin-top: 0.1rem; font-size: 0.78rem; color: rgba(255,255,255,0.62); }
        .profile-assistant-close { border: 1px solid rgba(255,255,255,0.16); border-radius: 9999px; background: rgba(255,255,255,0.06); color: #fff; width: 2rem; height: 2rem; cursor: pointer; }
        .profile-assistant-messages { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .profile-assistant-message { max-width: 86%; white-space: pre-wrap; line-height: 1.55; font-size: 0.92rem; border-radius: 1rem; padding: 0.75rem 0.85rem; }
        .profile-assistant-message.assistant { align-self: flex-start; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); }
        .profile-assistant-message.user { align-self: flex-end; background: #7dd3fc; color: #121a25; font-weight: 700; }
        .profile-assistant-input { padding: 0.9rem; border-top: 1px solid rgba(255,255,255,0.1); display: grid; gap: 0.7rem; }
        .profile-assistant-input textarea { width: 100%; min-height: 4.2rem; resize: vertical; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.06); color: #fff; padding: 0.85rem; outline: none; }
        .profile-assistant-input textarea::placeholder { color: rgba(255,255,255,0.45); }
        .profile-assistant-actions { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
        .profile-assistant-note { font-size: 0.72rem; color: rgba(255,255,255,0.5); }
        .profile-assistant-send { border: 0; border-radius: 9999px; background: #7dd3fc; color: #121a25; padding: 0.65rem 1rem; font-weight: 900; cursor: pointer; }
        .profile-assistant-send:disabled { opacity: 0.55; cursor: not-allowed; }
        @media (max-width: 640px) {
          .profile-assistant-panel { right: 0.75rem !important; left: 0.75rem !important; bottom: 4.9rem !important; width: auto; max-height: 72vh; }
          .profile-assistant-launcher { right: 0.75rem !important; bottom: 0.75rem !important; }
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
            <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} maxLength={900} placeholder={copy.placeholder} />
            <div className="profile-assistant-actions">
              <span className="profile-assistant-note">{copy.note}</span>
              <button type="button" className="profile-assistant-send" onClick={sendMessage} disabled={loading || !input.trim()}>{copy.send}</button>
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
