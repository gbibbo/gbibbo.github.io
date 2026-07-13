(() => {
  const install = () => {
    const grid = document.querySelector('#home aside .grid');
    if (!grid || grid.dataset.rotatingStats === 'true') return;

    const isEs = document.documentElement.lang?.startsWith('es');
    const cards = isEs
      ? [
          [
            ['3+ años', 'ingeniería de investigación en audio ML'],
            ['4 años', 'desarrollo de productos en C/C++ embebido'],
            ['10+ años', 'producción de música electrónica y práctica como DJ'],
          ],
          [
            ['13', 'publicaciones y trabajos'],
            ['197 GB', 'dataset residencial con preservación de privacidad'],
            ['1.344 horas', 'de grabaciones residenciales recopiladas y curadas'],
          ],
          [
            ['UE', 'autorización de trabajo'],
            ['3 países', 'trayectoria de estudio y trabajo: Uruguay, España y Reino Unido'],
            ['3 idiomas', 'español, inglés y portugués'],
          ],
          [
            ['Audio', 'AI · DSP · MIR'],
            ['2 productos', 'trabajo actual en machine learning y DSP bajo NDA'],
            ['104 ms', 'retardo sistemático de onset identificado y eliminado'],
          ],
        ]
      : [
          [
            ['3+ yrs', 'audio ML research engineering'],
            ['4 yrs', 'embedded C/C++ product development'],
            ['10+ yrs', 'electronic music production and DJ practice'],
          ],
          [
            ['13', 'publications & works'],
            ['197 GB', 'privacy-preserving residential audio dataset'],
            ['1,344 hrs', 'of residential audio collected and curated'],
          ],
          [
            ['EU', 'work authorization'],
            ['3 countries', 'study/work trajectory: Uruguay, Spain, and UK'],
            ['3 languages', 'Spanish, English, and Portuguese'],
          ],
          [
            ['Audio', 'AI · DSP · MIR'],
            ['2 products', 'current machine learning and DSP work under NDA'],
            ['104 ms', 'systematic onset delay identified and removed'],
          ],
        ];

    if (!document.getElementById('rotating-stat-styles')) {
      const style = document.createElement('style');
      style.id = 'rotating-stat-styles';
      style.textContent = `
        #home .rotating-stat-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
          padding-top: 1rem;
          font-size: 0.875rem;
        }
        #home .stat-flip {
          position: relative;
          min-height: 7.25rem;
          perspective: 900px;
          border-radius: 1rem;
        }
        #home .stat-face {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.10);
          padding: 1rem;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          opacity: 0;
          transform: rotateY(-88deg) scale(0.98);
          animation: profileStatCycle 24s infinite ease-in-out;
          animation-delay: calc((var(--face-index) * 8s) - var(--card-shift));
          will-change: transform, opacity;
        }
        #home .stat-value {
          font-family: 'Space Grotesk', Inter, system-ui, sans-serif;
          font-size: 1.5rem;
          line-height: 1.1;
          font-weight: 700;
          color: #fff;
        }
        #home .stat-label {
          margin-top: 0.35rem;
          line-height: 1.35;
          color: rgba(255, 255, 255, 0.62);
        }
        #home .stat-flip:hover .stat-face,
        #home .stat-flip:focus-within .stat-face {
          animation-play-state: paused;
        }
        @keyframes profileStatCycle {
          0%, 100% { opacity: 0; transform: rotateY(-88deg) scale(0.98); }
          4% { opacity: 1; transform: rotateY(0deg) scale(1); }
          28% { opacity: 1; transform: rotateY(0deg) scale(1); }
          33% { opacity: 0; transform: rotateY(88deg) scale(0.98); }
        }
        @media (max-width: 420px) {
          #home .stat-flip { min-height: 8rem; }
          #home .stat-value { font-size: 1.3rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          #home .stat-face { display: none; animation: none; opacity: 1; transform: none; }
          #home .stat-face:first-child { display: flex; }
        }
      `;
      document.head.append(style);
    }

    const fragment = document.createDocumentFragment();
    cards.forEach((faces, cardIndex) => {
      const card = document.createElement('div');
      card.className = 'stat-flip';
      card.style.setProperty('--card-shift', `${cardIndex * 2}s`);
      card.setAttribute('aria-live', 'off');

      faces.forEach(([value, label], faceIndex) => {
        const face = document.createElement('div');
        face.className = 'stat-face';
        face.style.setProperty('--face-index', String(faceIndex));

        const valueNode = document.createElement('div');
        valueNode.className = 'stat-value';
        valueNode.textContent = value;

        const labelNode = document.createElement('div');
        labelNode.className = 'stat-label';
        labelNode.textContent = label;

        face.append(valueNode, labelNode);
        card.append(face);
      });

      fragment.append(card);
    });

    grid.className = 'rotating-stat-grid';
    grid.replaceChildren(fragment);
    grid.dataset.rotatingStats = 'true';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }

  const observer = new MutationObserver(install);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
