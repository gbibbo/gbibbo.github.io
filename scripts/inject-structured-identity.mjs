import { promises as fs } from 'node:fs';
import path from 'node:path';

const profile = JSON.parse(await fs.readFile('src/data/profile.json', 'utf8'));
const experience = JSON.parse(await fs.readFile('src/data/experience.json', 'utf8'));
const education = JSON.parse(await fs.readFile('src/data/education.json', 'utf8'));

const siteUrl = profile.links.web.replace(/\/$/, '');
const personId = `${siteUrl}/#person`;
const imageUrl = `${siteUrl}/homepage_files/profile.jpg`;
const currentEmployer = experience.find((item) => item.org === 'Edge Audio Labs');
const surrey = experience.find((item) => item.org === 'University of Surrey');

const caseStudies = [
  { name: 'Robust VAD with Audio-Language Models', route: '/work/audio-language-vad/' },
  { name: 'Sounds of Home Dataset', route: '/work/sounds-of-home/' },
  { name: 'Speech Removal Framework', route: '/work/speech-removal/' },
  { name: 'Harmonic EDM Mixing Compatibility', route: '/work/harmonic-edm-mixing/' },
  { name: 'Raspberry Pi Sound Event Recognition Demo', route: '/work/raspberry-pi-sed/' },
  { name: '3H-ATO mechanical no-touch tool', route: '/work/3h-ato/' },
  { name: 'Automatic IoT Soap Dispenser', route: '/work/iot-soap-dispenser/' },
  { name: 'UyVoy Mobile App', route: '/work/uyvoy/' },
];

const person = {
  '@type': 'Person',
  '@id': personId,
  name: profile.name,
  url: `${siteUrl}/`,
  image: imageUrl,
  email: `mailto:${profile.email}`,
  jobTitle: profile.role,
  description: profile.headline,
  sameAs: [
    profile.links.linkedin,
    profile.links.github,
    profile.links.scholar,
    profile.links.orcid,
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Montevideo',
    addressCountry: 'UY',
  },
  worksFor: currentEmployer ? {
    '@type': 'Organization',
    name: currentEmployer.org,
    url: currentEmployer.orgUrl,
  } : undefined,
  affiliation: surrey ? {
    '@type': 'Organization',
    name: surrey.org,
    url: surrey.orgUrl,
  } : undefined,
  alumniOf: education
    .filter((item) => /Pompeu Fabra|Universidad de la República/.test(item.institution))
    .map((item) => ({ '@type': 'EducationalOrganization', name: item.institution })),
  knowsAbout: [
    'Audio machine learning',
    'Machine listening',
    'Digital signal processing',
    'Voice activity detection',
    'Sound event detection',
    'Audio-language models',
    'Privacy-preserving audio',
    'Real-time audio',
    'Edge AI',
    'Music information retrieval',
  ],
  knowsLanguage: ['Spanish', 'English', 'Portuguese'],
  subjectOf: caseStudies.map((item) => ({
    '@type': 'WebPage',
    name: item.name,
    url: `${siteUrl}${item.route}`,
  })),
};

const pages = [
  {
    file: path.resolve('dist/index.html'),
    url: `${siteUrl}/`,
    lang: 'en',
    description: profile.headline,
  },
  {
    file: path.resolve('dist/es/index.html'),
    url: `${siteUrl}/es/`,
    lang: 'es',
    description: profile.headlineEs,
  },
];

for (const page of pages) {
  let html = await fs.readFile(page.file, 'utf8');
  if (html.includes('"@id":"https://gbibbo.github.io/#person"')) continue;

  const graph = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${page.url}#profilepage`,
    url: page.url,
    name: `${profile.name} · Audio ML research and engineering`,
    description: page.description,
    inLanguage: page.lang,
    dateModified: profile.updated,
    mainEntity: person,
  };

  const jsonLd = `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
  if (!html.includes('</head>')) throw new Error(`Missing </head> in ${page.file}`);
  html = html.replace('</head>', `${jsonLd}</head>`);
  await fs.writeFile(page.file, html, 'utf8');
}

console.log('Structured ProfilePage/Person identity injected into EN and ES homepages.');
