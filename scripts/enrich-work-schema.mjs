import { promises as fs } from 'node:fs';
import path from 'node:path';

const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const profile = await readJson('src/data/profile.json');
const projects = await readJson('src/data/projects.json');
const publications = await readJson('src/data/publications.json');

const siteUrl = profile.links.web.replace(/\/$/, '');
const personId = `${siteUrl}/#person`;

const configs = {
  'audio-language-vad': {
    project: 'Audio-Language Models for Voice Activity Detection',
    type: 'SoftwareSourceCode',
    programmingLanguage: 'Python',
  },
  'asr-enhancement': {
    project: 'ASR Enhancement Platform',
    type: 'SoftwareSourceCode',
    programmingLanguage: 'Python',
  },
  'traktor-ml': {
    project: 'Traktor ML',
    type: 'SoftwareSourceCode',
    programmingLanguage: 'Python',
  },
  'sounds-of-home': {
    project: 'Sounds of Home Dataset',
    type: 'Dataset',
    citations: [
      ['The Sounds of Home: A Speech-Removed Residential Audio Dataset for Sound Event Detection', 'ScholarlyArticle'],
    ],
  },
  'speech-removal': {
    project: 'Speech Removal Framework',
    type: 'SoftwareApplication',
    applicationCategory: 'Audio processing application',
    citations: [
      ['Speech Removal Framework for Privacy-preserving Audio Recordings', 'ScholarlyArticle'],
    ],
  },
  'harmonic-edm-mixing': {
    project: 'Harmonic EDM Mixing Compatibility',
    type: 'SoftwareSourceCode',
    programmingLanguage: 'Python',
    citations: [
      ['A New Compatibility Measure for Harmonic EDM Mixing', 'ScholarlyArticle'],
    ],
  },
  'raspberry-pi-sed': {
    project: 'Raspberry Pi Sound Event Recognition Demo',
    type: 'SoftwareSourceCode',
    programmingLanguage: 'Python',
    citations: [
      ['Recognise and Notify Sound Events Using a Raspberry PI Based Standalone Device [Demo]', 'CreativeWork'],
    ],
  },
  '3h-ato': {
    project: '3H-ATO',
    type: 'Product',
    category: 'Mechanical no-touch tool',
  },
  'iot-soap-dispenser': {
    project: 'Automatic IoT Soap Dispenser',
    type: 'Product',
    category: 'IoT handwashing and hygiene monitoring system',
  },
  'uyvoy': {
    project: 'UyVoy Mobile App',
    type: 'CreativeWork',
    category: 'Civic-tech mobile application concept',
  },
};

const projectByTitle = new Map(projects.map((item) => [item.title, item]));
const publicationByTitle = new Map(publications.map((item) => [item.title, item]));

const personAuthor = (name) => name === profile.name
  ? { '@type': 'Person', '@id': personId, name }
  : { '@type': 'Person', name };

function citationFor(title, type) {
  const publication = publicationByTitle.get(title);
  if (!publication) throw new Error(`Publication not found for schema citation: ${title}`);

  return {
    '@type': type,
    name: publication.title,
    datePublished: publication.year,
    author: publication.authors.map(personAuthor),
    isPartOf: {
      '@type': 'CreativeWork',
      name: publication.venue,
    },
    sameAs: publication.links.map((link) => link.href),
  };
}

function externalLinks(project) {
  return [...new Set((project.links ?? []).map((link) => link.href).filter(Boolean))];
}

function findCodeRepository(project) {
  return project.links?.find((link) => /code|repository/i.test(link.label))?.href;
}

function enrichMainEntity(existing, config, project, canonical) {
  const links = externalLinks(project);
  const entity = {
    ...existing,
    '@type': config.type,
    '@id': `${canonical}#work`,
    name: existing?.name ?? project.title,
    description: existing?.description ?? project.description,
    creator: { '@type': 'Person', '@id': personId, name: profile.name },
    keywords: project.tags,
    url: canonical,
    mainEntityOfPage: { '@id': `${canonical}#webpage` },
    image: `${siteUrl}${project.image}`,
  };

  if (links.length) entity.sameAs = links;

  if (config.type === 'SoftwareSourceCode') {
    const codeRepository = findCodeRepository(project);
    if (codeRepository) entity.codeRepository = codeRepository;
    if (config.programmingLanguage) entity.programmingLanguage = config.programmingLanguage;
  }

  if (config.type === 'SoftwareApplication') {
    if (config.applicationCategory) entity.applicationCategory = config.applicationCategory;
  }

  if (config.category) entity.category = config.category;

  if (config.citations?.length) {
    const citations = config.citations.map(([title, type]) => citationFor(title, type));
    entity.citation = citations.length === 1 ? citations[0] : citations;
  }

  return entity;
}

const schemaPattern = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;

for (const [slug, config] of Object.entries(configs)) {
  const project = projectByTitle.get(config.project);
  if (!project) throw new Error(`Project not found for work schema: ${config.project}`);

  const file = path.resolve('dist', 'work', slug, 'index.html');
  let html = await fs.readFile(file, 'utf8');
  const match = html.match(schemaPattern);
  if (!match) throw new Error(`JSON-LD block not found in ${file}`);

  const schema = JSON.parse(match[1]);
  const canonical = `${siteUrl}/work/${slug}/`;
  schema['@id'] = `${canonical}#webpage`;
  schema.url = canonical;
  schema.author = { '@type': 'Person', '@id': personId, name: profile.name, url: `${siteUrl}/` };
  schema.mainEntity = enrichMainEntity(schema.mainEntity ?? {}, config, project, canonical);

  const replacement = `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  html = html.replace(schemaPattern, replacement);
  await fs.writeFile(file, html, 'utf8');
}

console.log(`Enriched structured data for ${Object.keys(configs).length} work pages with semantic entity types and supported citations.`);
