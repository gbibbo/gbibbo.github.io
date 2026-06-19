const EDUCATION_LOGO_INJECTION = String.raw`
<style>
  .education-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 1.35rem;
  }

  .education-card-header > p {
    margin: 0;
    flex: 0 0 auto;
  }

  .education-logo-link {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1 1 auto;
    min-width: 0;
    text-decoration: none;
  }

  .education-logo-img {
    display: block;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  .education-logo-upf {
    max-width: 11.1rem;
    max-height: 2.08rem;
  }

  .education-logo-fing {
    max-width: 11.5rem;
    max-height: 1.92rem;
  }

  @media (max-width: 640px) {
    .education-card-header {
      gap: 1rem;
      margin-bottom: 1.1rem;
    }

    .education-logo-upf {
      max-width: 9.4rem;
      max-height: 1.8rem;
    }

    .education-logo-fing {
      max-width: 9.8rem;
      max-height: 1.65rem;
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
