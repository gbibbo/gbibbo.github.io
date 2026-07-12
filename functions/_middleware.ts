declare const HTMLRewriter: any;

const SITE_PATCH = String.raw`
<style>
  .education-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 1.35rem;
  }
  .education-card-header > p { margin: 0; flex: 0 0 auto; }
  .education-logo-link {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1 1 auto;
    min-width: 0;
    text-decoration: none;
  }
  .education-logo-img { display: block; width: auto; height: auto; object-fit: contain; }
  .education-logo-upf { max-width: 11.1rem; max-height: 2.08rem; }
  .education-logo-fing { max-width: 11.5rem; max-height: 1.92rem; }
  @media (max-width: 640px) {
    .education-card-header { gap: 1rem; margin-bottom: 1.1rem; }
    .education-logo-upf { max-width: 9.4rem; max-height: 1.8rem; }
    .education-logo-fing { max-width: 9.8rem; max-height: 1.65rem; }
  }
</style>
<script>
  (() => {
    const isEs = document.documentElement.lang?.startsWith('es');

    try {
      if (!localStorage.getItem('gabriel-profile-facts-v2-cleared')) {
        localStorage.removeItem('gabriel-profile-assistant-v1-en');
        localStorage.removeItem('gabriel-profile-assistant-v1-es');
        localStorage.setItem('gabriel-profile-facts-v2-cleared', 'true');
      }
    } catch {}

    const applyEducationLogos = () => {
      const education = document.getElementById('education');
      if (!education || education.dataset.logosApplied === 'true') return;
      const logos = [
        {
          href: 'https://www.upf.edu/web/smc',
          src: '/homepage_files/UPFMTG.png',
          alt: 'Universitat Pompeu Fabra - Music Technology Group',
          className: 'education-logo-upf',
        },
        {
          href: 'https://www.fing.edu.uy/es/carreras/grado/ingenieriaelectrica',
          src: '/homepage_files/FING.png',
          alt: 'Facultad de Ingeniería - Universidad de la República',
          className: 'education-logo-fing',
        },
      ];
      const cards = Array.from(education.querySelectorAll('article.card')).slice(0, 2);
      cards.forEach((card, index) => {
        const data = logos[index];
        if (!data || card.querySelector('.education-card-header')) return;
        const period = card.querySelector('p');
        const title = card.querySelector('h3');
        if (!period || !title) return;
        const header = document.createElement('div');
        header.className = 'education-card-header';
        const link = document.createElement('a');
        link.href = data.href;
        link.target = '_blank';
        link.rel = 'noreferrer';
        link.className = 'education-logo-link';
        link.setAttribute('aria-label', data.alt);
        const image = document.createElement('img');
        image.src = data.src;
        image.alt = data.alt;
        image.className = 'education-logo-img ' + data.className;
        image.loading = 'lazy';
        image.decoding = 'async';
        link.append(image);
        header.append(period, link);
        card.insertBefore(header, title);
      });
      education.dataset.logosApplied = 'true';
    };

    const setText = (node, text) => {
      if (node && node.textContent !== text) node.textContent = text;
    };

    const replaceExactText = (from, to) => {
      document.querySelectorAll('p, li, span, h3').forEach((node) => {
        if (node.textContent?.trim() === from) node.textContent = to;
      });
    };

    const patchStaticFacts = () => {
      applyEducationLogos();

      const heroRole = document.querySelector('#home h1 + p');
      setText(heroRole, isEs
        ? 'Ingeniero ML/DSP · Ingeniero de investigación en Audio AI'
        : 'ML/DSP Engineer · Audio AI Research Engineer');

      const heroBio = heroRole?.nextElementSibling;
      setText(heroBio, isEs
        ? 'Construyo sistemas de machine learning y DSP de audio que funcionan fuera del notebook. Actualmente trabajo de forma híbrida en Edge Audio Labs, en Montevideo, sobre audio en tiempo real, evaluación perceptual, detección musical y sistemas de machine listening.'
        : 'I build audio machine learning and DSP systems that run outside the notebook. I currently work hybrid at Edge Audio Labs in Montevideo on real-time audio, perceptual evaluation, music detection, and machine-listening systems.');

      const contactCopy = document.querySelector('#contact h2 + p');
      setText(contactCopy, isEs
        ? 'Actualmente trabajo de forma híbrida en Montevideo, Uruguay. Soy ciudadano italiano y tengo autorización de trabajo en la Unión Europea.'
        : 'Currently working hybrid in Montevideo, Uruguay. Italian citizen with European Union work authorization.');

      replaceExactText(
        'IEEE Signal Processing Society member',
        'IEEE Signal Processing Society member, 2025'
      );
      replaceExactText(
        'Miembro de IEEE Signal Processing Society',
        'Miembro de IEEE Signal Processing Society, 2025'
      );
      replaceExactText(
        'Participant in EPSRC AI for Sound',
        'Participant in EPSRC AI for Sound, 2022-2025'
      );
      replaceExactText(
        'Participante en EPSRC AI for Sound',
        'Participante en EPSRC AI for Sound, 2022-2025'
      );

      document.querySelectorAll('#experience article').forEach((card) => {
        const title = card.querySelector('h3')?.textContent?.trim();
        const link = card.querySelector('.experience-logo-link');
        if (!link) return;
        if (title === 'ML/DSP Engineer') link.href = 'https://edgeaudiolabs.com/';
        if (title === 'PhD Candidate') link.href = 'https://www.tudelft.nl/';
      });

      replaceExactText(
        'Diseño de pipelines VAD basados en Slurm para comparar 8 modelos bajo degradaciones acústicas controladas, con análisis de robustez y comparación estadística entre familias de modelos.',
        'Construcción de un benchmark VAD de ocho modelos sobre CHiME-Home y, por separado, evaluación de audio-language models bajo degradaciones controladas de duración, ruido, reverberación y filtrado espectral.'
      );
      replaceExactText(
        'Publicación y presentación de investigación en IEEE WASPAA, CHiME Workshop, ICWE, Inter-Noise, SMC, UKAI, UKIS y AES. Supervisión de proyectos de grado y máster.',
        'Publicación y presentación de investigación en ICASSP, IEEE WASPAA, CHiME Workshop, Inter-Noise, SMC, UKAI, UKIS y AES. Supervisión de proyectos de grado y máster.'
      );
    };

    const patchRotatingStats = () => {
      document.querySelectorAll('.stat-label').forEach((label) => {
        const text = label.textContent?.trim();
        if (text === '3 countries in study/work trajectory: Uruguay, Spain, and UK') {
          label.textContent = '4 countries in study/work trajectory: Uruguay, Spain, UK, and the Netherlands';
          const value = label.closest('.stat-face')?.querySelector('.stat-value');
          if (value) value.textContent = '4';
        }
        if (text === '3 países en trayectoria de estudio/trabajo: Uruguay, España y Reino Unido') {
          label.textContent = '4 países en trayectoria de estudio/trabajo: Uruguay, España, Reino Unido y Países Bajos';
          const value = label.closest('.stat-face')?.querySelector('.stat-value');
          if (value) value.textContent = '4';
        }
      });
    };

    patchStaticFacts();
    patchRotatingStats();

    const observer = new MutationObserver(() => {
      patchRotatingStats();
      patchStaticFacts();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  })();
</script>
`;

export async function onRequest(context: any) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  return new HTMLRewriter()
    .on('body', {
      element(element) {
        element.append(SITE_PATCH, { html: true });
      },
    })
    .transform(response);
}
