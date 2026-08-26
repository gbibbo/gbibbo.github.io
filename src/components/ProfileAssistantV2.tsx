import { useEffect, useMemo, useRef, useState } from 'react';

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type Props = { lang?: 'en' | 'es' };

const COPY = {
  en: {
    intro: "Ask me about Gabriel's professional profile. I answer from the public CV content on this site.",
    title: 'Ask my profile',
    subtitle: 'Projects, publications, experience, skills and availability',
    launcher: 'Ask profile',
    close: 'Close',
    clear: 'New chat',
    placeholder: 'Ask a question about Gabriel…',
    send: 'Send',
    thinking: 'Thinking…',
    unavailable: 'The profile assistant is temporarily unavailable. Please try again later or contact Gabriel directly.',
    note: 'Answers use public professional information only.',
    suggestions: [
      'What embedded systems experience does Gabriel have?',
      'Which publications are about audio privacy?',
      'Where can Gabriel work and in what modality?',
    ],
  },
  es: {
    intro: 'Preguntame sobre el perfil profesional de Gabriel. Respondo usando el contenido público del CV de este sitio.',
    title: 'Preguntá a mi perfil',
    subtitle: 'Proyectos, publicaciones, experiencia, habilidades y disponibilidad',
    launcher: 'Preguntar al perfil',
    close: 'Cerrar',
    clear: 'Nuevo chat',
    placeholder: 'Preguntá algo sobre Gabriel…',
    send: 'Enviar',
    thinking: 'Pensando…',
    unavailable: 'El asistente de perfil no está disponible temporalmente. Probá de nuevo más tarde o contactá directamente a Gabriel.',
    note: 'Las respuestas usan sólo información profesional pública.',
    suggestions: [
      '¿Qué experiencia tiene Gabriel en sistemas embebidos?',
      '¿Qué publicaciones tiene sobre privacidad en audio?',
      '¿Dónde puede trabajar Gabriel y en qué modalidad?',
    ],
  },
};

export default function ProfileAssistantV2({ lang: initialLang = 'en' }: Props) {
  const [lang, setLang] = useState<'en' | 'es'>(initialLang);
  const copy = COPY[lang];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: COPY[initialLang].intro }]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLang(document.documentElement.lang.startsWith('es') ? 'es' : 'en');
  }, []);

  useEffect(() => {
    const openAssistant = () => setOpen(true);
    window.addEventListener('open-profile-assistant', openAssistant);
    return () => window.removeEventListener('open-profile-assistant', openAssistant);
  }, []);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, loading, open]);

  const visibleMessages = useMemo(() => messages.slice(-30), [messages]);

  function resetChat() {
    setMessages([{ role: 'assistant', content: copy.intro }]);
    setInput('');
    setLoading(false);
  }

  async function submit(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ language: lang, messages: next.slice(-10) }),
      });
      const data = await response.json().catch(() => ({}));
      const answer = typeof data.answer === 'string'
        ? data.answer
        : typeof data.error === 'string'
          ? data.error
          : copy.unavailable;
      setMessages([...next, { role: 'assistant', content: answer }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: copy.unavailable }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .pa2-launcher{position:fixed;right:18px;bottom:18px;z-index:80;border:1px solid #1b332d;background:#173f35;color:#fff;padding:10px 14px;font:700 13px/1.2 Arial,sans-serif;cursor:pointer;border-radius:4px;box-shadow:0 8px 26px rgba(17,20,15,.14)}
        .pa2-panel{position:fixed;right:18px;bottom:66px;z-index:90;width:min(92vw,610px);height:min(78vh,690px);display:flex;flex-direction:column;background:#f5f6f2;color:#11140f;border:1px solid #aeb6aa;box-shadow:0 22px 65px rgba(17,20,15,.18);font-family:Arial,sans-serif}
        .pa2-head{display:flex;justify-content:space-between;gap:20px;padding:18px 20px;border-bottom:1px solid #c9cec4}.pa2-title{font-family:Georgia,serif;font-size:22px}.pa2-sub{margin-top:3px;color:#61665d;font-size:12px}.pa2-actions{display:flex;gap:8px;align-items:flex-start}.pa2-actions button,.pa2-send{border:1px solid #9aa398;background:transparent;color:#11140f;padding:7px 10px;cursor:pointer;font-weight:700}.pa2-close{width:34px}
        .pa2-messages{flex:1;overflow:auto;padding:18px 20px;display:flex;flex-direction:column;gap:10px}.pa2-msg{max-width:90%;padding:10px 12px;line-height:1.5;font-size:14px;border:1px solid #d4d8d0}.pa2-msg.assistant{align-self:flex-start;background:#fff}.pa2-msg.user{align-self:flex-end;background:#dce8e2;border-color:#a9c6ba}
        .pa2-suggestions{display:flex;flex-wrap:wrap;gap:8px;padding:0 20px 14px}.pa2-suggestions button{border:1px solid #a9b4aa;background:#fff;color:#173f35;padding:8px 10px;font-size:12px;cursor:pointer;text-align:left}.pa2-input{padding:14px 20px 18px;border-top:1px solid #c9cec4}.pa2-input textarea{width:100%;min-height:72px;resize:vertical;border:1px solid #aeb6aa;background:#fff;color:#11140f;padding:10px;font:14px/1.45 Arial,sans-serif}.pa2-input-row{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:8px}.pa2-note{color:#70766e;font-size:11px}.pa2-send{background:#173f35;color:#fff;border-color:#173f35}.pa2-send:disabled{opacity:.5;cursor:not-allowed}
        @media(max-width:640px){.pa2-panel{left:10px;right:10px;bottom:58px;width:auto;height:78vh}.pa2-launcher{right:10px;bottom:10px}.pa2-head,.pa2-messages,.pa2-input{padding-left:14px;padding-right:14px}.pa2-suggestions{padding-left:14px;padding-right:14px}}
        @media print{.pa2-launcher,.pa2-panel{display:none!important}}
      `}</style>

      {open && (
        <section className="pa2-panel" aria-label={copy.title}>
          <header className="pa2-head">
            <div><div className="pa2-title">{copy.title}</div><div className="pa2-sub">{copy.subtitle}</div></div>
            <div className="pa2-actions">
              <button type="button" onClick={resetChat}>{copy.clear}</button>
              <button type="button" className="pa2-close" onClick={() => setOpen(false)} aria-label={copy.close}>×</button>
            </div>
          </header>
          <div className="pa2-messages">
            {visibleMessages.map((message, index) => <div key={`${message.role}-${index}`} className={`pa2-msg ${message.role}`}>{message.content}</div>)}
            {loading && <div className="pa2-msg assistant">{copy.thinking}</div>}
            <div ref={endRef} />
          </div>
          {messages.length === 1 && (
            <div className="pa2-suggestions">
              {copy.suggestions.map((question) => <button type="button" key={question} onClick={() => submit(question)}>{question}</button>)}
            </div>
          )}
          <div className="pa2-input">
            <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); } }} placeholder={copy.placeholder} maxLength={1200} />
            <div className="pa2-input-row"><span className="pa2-note">{copy.note}</span><button type="button" className="pa2-send" onClick={() => submit()} disabled={loading || !input.trim()}>{copy.send}</button></div>
          </div>
        </section>
      )}
      <button type="button" className="pa2-launcher" onClick={() => setOpen((value) => !value)} aria-expanded={open}>{copy.launcher}</button>
    </>
  );
}
