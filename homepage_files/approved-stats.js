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
    window.setTimeout(install, 700);
    window.setTimeout(install, 1600);
    window.setTimeout(install, 3000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleInstall, { once: true });
  } else {
    scheduleInstall();
  }
})();
