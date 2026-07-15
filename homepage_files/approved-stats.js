(() => {
  const cards = [
    ['10 años / 10 years', 'De firmware embebido a research en audio ML'],
    ['Bang & Olufsen', '4 años de C/C++ embebido en productos que se enviaron'],
    ['Surrey', '3 años Research Engineer · EPSRC AI for Sound'],
    ['13 papers', 'Peer-reviewed: ICASSP, WASPAA, CHiME, AES'],
    ['Producción / Ships', 'Features vivos en pipelines de audio de clientes'],
    ['Edge', 'Audio ML en tiempo real sobre hardware real'],
    ['Full stack', 'Del notebook al servicio: FastAPI, Docker, CI'],
    ['Open source', 'Repos, datasets y demos que cualquiera puede correr'],
    ['Google · KPMG', 'Soporte Tier 3 y auditoría IT en entornos enterprise'],
    ['Privacidad / Privacy', 'Speech removal antes de publicar cualquier audio'],
    ['4 países / 4 countries', 'Uruguay, España, Reino Unido, Países Bajos'],
    ['Mentoría / Mentoring', 'Supervisé tesis y formé programadores entrantes'],
    ['MSc + BSc', 'Sound & Music Computing (UPF) · Eléctrica (UdelaR)'],
    ['Visa UE / EU work', 'Ciudadano italiano, con base en Montevideo'],
    ['ES · EN C1', 'Trabajo remoto diario con equipos de UK y la UE'],
    ['DJ', 'El oído detrás de la investigación'],
  ];

  const edgeLogoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="420" height="300" viewBox="0 0 420 300">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2637ff"/>
          <stop offset="0.55" stop-color="#5c26e8"/>
          <stop offset="1" stop-color="#b500ff"/>
        </linearGradient>
        <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#70e2ff" stop-opacity="0.95"/>
          <stop offset="1" stop-color="#e88bff" stop-opacity="0.85"/>
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2"/>
        </filter>
      </defs>
      <rect width="420" height="300" rx="24" fill="url(#bg)"/>
      <g opacity="0.95" fill="none" stroke="url(#wave)" stroke-width="2.2">
        <path d="M-50 77 C48 33 120 38 211 78 C296 116 356 114 470 66"/>
        <path d="M-53 99 C51 55 133 61 218 98 C304 136 365 133 474 85" opacity="0.7"/>
        <path d="M-58 121 C46 79 136 78 221 118 C307 158 371 153 480 104" opacity="0.48"/>
        <path d="M-60 145 C60 102 145 104 230 140 C314 176 377 175 481 127" opacity="0.32"/>
      </g>
      <g transform="translate(73 89)" fill="#ffffff">
        <rect x="0" y="13" width="72" height="13" rx="6.5" opacity="0.95"/>
        <rect x="0" y="48" width="72" height="13" rx="6.5" opacity="0.95"/>
        <rect x="0" y="83" width="72" height="13" rx="6.5" opacity="0.95"/>
        <rect x="39" y="7" width="28" height="25" rx="7" opacity="0.95"/>
        <rect x="16" y="42" width="28" height="25" rx="7" opacity="0.95"/>
        <rect x="45" y="77" width="28" height="25" rx="7" opacity="0.95"/>
      </g>
      <text x="176" y="116" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="37" fill="#fff" letter-spacing="1.2">EDGE</text>
      <text x="176" y="158" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="37" fill="#fff" letter-spacing="1.2">AUDIO</text>
      <text x="176" y="200" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="37" fill="#fff" letter-spacing="1.2">LABS</text>
      <ellipse cx="316" cy="222" rx="115" ry="35" fill="#4b17cc" opacity="0.24" filter="url(#soft)"/>
    </svg>
  `;

  const edgeLogoUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(edgeLogoSvg)}`;

  const edgeExperienceCopy = {
    en: {
      period: 'Jun. 2026–Present',
      title: 'ML/DSP Engineer',
      org: 'Edge Audio Labs, Montevideo, Uruguay (Hybrid)',
      bullets: [
        'Machine learning, signal processing, and listening-based evaluation across two audio products under NDA.',
        'Singing voice synthesis for Dorico, Sibelius, and MuseScore. I work on the neural rendering pipeline that turns a written score into a sung performance, in Python and PyTorch, validated with objective measurement and blind listening tests. Score dynamics now shape the timbre of the voice and not only its loudness, shipped without retraining the model.',
        'Real-time note detection for guitar. I work on the C++ DSP that tracks pitch and onsets from a live guitar signal, and on the headless evaluation pipeline that regression-tests it against known cases. Removed a systematic 104 ms delay between the note played and the note reported, and hardened the detector against the edge cases slipping through it.',
      ],
    },
    es: {
      period: 'Jun. 2026–Presente',
      title: 'Ingeniero de ML/DSP',
      org: 'Edge Audio Labs, Montevideo, Uruguay (híbrido)',
      bullets: [
        'Aprendizaje automático, procesamiento de señales y evaluación basada en escucha en dos productos de audio bajo NDA.',
        'Síntesis de voz cantada para Dorico, Sibelius y MuseScore. Trabajo sobre el pipeline de renderizado neuronal que convierte una partitura escrita en una interpretación cantada, en Python y PyTorch, validado con mediciones objetivas y pruebas ciegas de escucha. Las dinámicas de partitura ahora moldean el timbre de la voz y no solo su volumen, entregado sin reentrenar el modelo.',
        'Detección de notas en tiempo real para guitarra. Trabajo sobre el DSP C++ que sigue altura y ataques desde una señal de guitarra en vivo, y sobre el pipeline de evaluación sin interfaz que lo prueba contra casos conocidos. Eliminé un retraso sistemático de 104 ms entre la nota tocada y la nota reportada, y robustecí el detector contra casos límite que se estaban filtrando.',
      ],
    },
  };

  const flipOrder = [0, 3, 2, 1];

  const writeFace = (face, item) => {
    const value = face?.querySelector('.stat-value');
    const label = face?.querySelector('.stat-label');
    if (value) value.textContent = item[0];
    if (label) label.textContent = item[1];
  };

  const installStyle = () => {
    if (document.getElementById('approved-stat-card-styles')) return;
    const style = document.createElement('style');
    style.id = 'approved-stat-card-styles';
    style.textContent = `
      #home .approved-stat-grid {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 0.75rem !important;
      }
      #home .approved-stat {
        min-height: 7.25rem !important;
        border-radius: 1rem !important;
        perspective: 900px !important;
      }
      #home .approved-stat .stat-flip-inner {
        position: relative !important;
        width: 100% !important;
        height: 100% !important;
        min-height: 7.25rem !important;
        transition: transform 700ms cubic-bezier(.22,.61,.36,1) !important;
        transform-style: preserve-3d !important;
      }
      #home .approved-stat .stat-face {
        position: absolute !important;
        inset: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        border-radius: 1rem !important;
        background: rgba(255, 255, 255, 0.10) !important;
        padding: 1rem !important;
        backface-visibility: hidden !important;
      }
      #home .approved-stat .stat-back {
        transform: rotateX(180deg) !important;
      }
      #home .approved-stat .stat-value {
        font-family: 'Space Grotesk', Inter, system-ui, sans-serif !important;
        font-size: 1.35rem !important;
        line-height: 1.08 !important;
        font-weight: 800 !important;
        color: #fff !important;
        overflow-wrap: anywhere !important;
      }
      #home .approved-stat .stat-label {
        margin-top: 0.35rem !important;
        line-height: 1.32 !important;
        color: rgba(255, 255, 255, 0.68) !important;
        font-size: 0.82rem !important;
      }
      #home .approved-stat-grid:hover .stat-flip-inner {
        transition-duration: 900ms !important;
      }
      #experience article.card:first-of-type .experience-logo-link {
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
      }
      #experience article.card:first-of-type img {
        display: block !important;
        width: 8.6rem !important;
        height: 7.1rem !important;
        max-width: none !important;
        max-height: none !important;
        object-fit: cover !important;
        object-position: center center !important;
        border-radius: 0.9rem !important;
      }
      @media (max-width: 640px) {
        #experience article.card:first-of-type img {
          width: 7.4rem !important;
          height: 6.1rem !important;
        }
      }
      @media (max-width: 420px) {
        #home .approved-stat, #home .approved-stat .stat-flip-inner { min-height: 8rem !important; }
        #home .approved-stat .stat-value { font-size: 1.14rem !important; }
        #home .approved-stat .stat-label { font-size: 0.76rem !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        #home .approved-stat .stat-flip-inner { transition: none !important; transform: none !important; }
        #home .approved-stat .stat-back { display: none !important; }
      }
    `;
    document.head.append(style);
  };

  const installEdgeExperiencePatch = () => {
    const article = document.querySelector('#experience article.card');
    if (!article) return false;

    const lang = document.documentElement.lang?.startsWith('es') ? 'es' : 'en';
    const copy = edgeExperienceCopy[lang];

    const period = article.querySelector('.experience-side div');
    const title = article.querySelector('h3');
    const org = title?.nextElementSibling;
    const list = article.querySelector('ul');
    const logo = article.querySelector('.experience-side img');
    const logoLink = article.querySelector('.experience-logo-link');

    if (period) period.textContent = copy.period;
    if (title) title.textContent = copy.title;
    if (org) org.textContent = copy.org;
    if (logo) {
      logo.src = edgeLogoUrl;
      logo.alt = 'Edge Audio Labs logo';
      logo.classList.add('experience-logo-edge');
    }
    if (logoLink) logoLink.setAttribute('aria-label', `${lang === 'es' ? 'Visitar' : 'Visit'} ${copy.org}`);

    if (list) {
      list.replaceChildren(...copy.bullets.map((bullet) => {
        const item = document.createElement('li');
        item.className = "pl-4 before:mr-3 before:content-['•']";
        item.textContent = bullet;
        return item;
      }));
    }

    article.dataset.approvedExperience = '20260715';
    return true;
  };

  const install = () => {
    const grid = document.querySelector('#home aside .grid');
    if (!grid) return false;
    if (grid.dataset.approvedStats === '20260713') return true;

    installStyle();

    const fragment = document.createDocumentFragment();
    const cells = [];

    for (let index = 0; index < 4; index += 1) {
      const cell = document.createElement('div');
      cell.className = 'stat-flip approved-stat';
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
      writeFace(cell.querySelector('.stat-face:not(.stat-back)'), cards[index]);
      writeFace(cell.querySelector('.stat-back'), cards[(index + 4) % cards.length]);
      cells.push(cell);
      fragment.append(cell);
    }

    grid.className = 'approved-stat-grid';
    grid.replaceChildren(fragment);
    grid.dataset.approvedStats = '20260713';

    const rotations = [0, 0, 0, 0];
    const shown = [0, 1, 2, 3];
    let poolPointer = 4;
    let step = 0;
    let paused = false;

    grid.addEventListener('mouseenter', () => { paused = true; });
    grid.addEventListener('mouseleave', () => { paused = false; });

    const nextIndex = () => {
      let guard = 0;
      while (shown.includes(poolPointer) && guard < cards.length) {
        poolPointer = (poolPointer + 1) % cards.length;
        guard += 1;
      }
      const selected = poolPointer;
      poolPointer = (poolPointer + 1) % cards.length;
      return selected;
    };

    window.clearInterval(window.__approvedStatsInterval);
    window.__approvedStatsInterval = window.setInterval(() => {
      if (paused) return;
      const position = flipOrder[step % flipOrder.length];
      step += 1;

      const cell = cells[position];
      const inner = cell.querySelector('.stat-flip-inner');
      if (!inner) return;

      const nextRotation = rotations[position] + 180;
      const backWillShow = nextRotation % 360 === 180;
      const face = cell.querySelector(backWillShow ? '.stat-back' : '.stat-face:not(.stat-back)');
      const next = nextIndex();

      writeFace(face, cards[next]);
      shown[position] = next;
      rotations[position] = nextRotation;
      inner.style.transform = `rotateX(${nextRotation}deg)`;
    }, 4000);

    return true;
  };

  const scheduleInstall = () => {
    window.setTimeout(() => { installStyle(); install(); installEdgeExperiencePatch(); }, 100);
    window.setTimeout(() => { installStyle(); install(); installEdgeExperiencePatch(); }, 700);
    window.setTimeout(() => { installStyle(); install(); installEdgeExperiencePatch(); }, 1600);
    window.setTimeout(() => { installStyle(); install(); installEdgeExperiencePatch(); }, 3000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleInstall, { once: true });
  } else {
    scheduleInstall();
  }
})();