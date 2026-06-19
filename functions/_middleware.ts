const EDUCATION_LOGO_INJECTION = String.raw`
<style>
  .education-logo-link {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-height: 4.5rem;
    margin-bottom: 1.1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(18, 26, 37, 0.08);
    text-decoration: none;
  }

  .education-logo-img {
    display: block;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  .education-logo-upf {
    max-width: 13.2rem;
    max-height: 2.65rem;
  }

  .education-logo-fing {
    max-width: 13.9rem;
    max-height: 2.35rem;
  }

  @media (max-width: 640px) {
    .education-logo-link {
      min-height: 4rem;
      margin-bottom: 0.95rem;
      padding-bottom: 0.9rem;
    }

    .education-logo-upf {
      max-width: 12.3rem;
      max-height: 2.45rem;
    }

    .education-logo-fing {
      max-width: 13rem;
      max-height: 2.2rem;
    }
  }
</style>
<script>
  (() => {
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
      if (!data || card.querySelector('.education-logo-link')) return;

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
      card.prepend(link);
    });

    education.dataset.logosApplied = 'true';
  })();
</script>
`;

export async function onRequest(context: any) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) {
    return response;
  }

  return new HTMLRewriter()
    .on('body', {
      element(element) {
        element.append(EDUCATION_LOGO_INJECTION, { html: true });
      },
    })
    .transform(response);
}
