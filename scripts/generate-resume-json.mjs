import { promises as fs } from 'node:fs';
import path from 'node:path';

const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const profile = await readJson('src/data/profile.json');
const experience = await readJson('src/data/experience.json');
const education = await readJson('src/data/education.json');
const publications = await readJson('src/data/publications.json');
const projects = await readJson('src/data/projects.json');
const skills = await readJson('src/data/skills.json');

const monthMap = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

function parsePart(value) {
  if (!value || /present/i.test(value)) return '';
  const cleaned = value.trim().replace(/\.$/, '');
  const monthYear = cleaned.match(/^([A-Za-z]{3})\.?\s*(\d{4})$/);
  if (monthYear) return `${monthYear[2]}-${monthMap[monthYear[1]] ?? '01'}`;
  const year = cleaned.match(/^(\d{4})$/);
  return year ? year[1] : cleaned;
}

function parseRange(value) {
  const [start = '', end = ''] = String(value ?? '').split('-').map((part) => part.trim());
  return { startDate: parsePart(start), endDate: parsePart(end) };
}

function profileLink(network, url, username = '') {
  return { network, username, url };
}

const resume = {
  $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
  basics: {
    name: profile.name,
    label: profile.role,
    image: `${profile.links.web.replace(/\/$/, '')}/homepage_files/profile.jpg`,
    email: profile.email,
    url: profile.links.web,
    summary: profile.summary,
    location: {
      city: 'Montevideo',
      countryCode: 'UY',
      region: 'Montevideo',
    },
    profiles: [
      profileLink('LinkedIn', profile.links.linkedin, 'gabriel-bibbo'),
      profileLink('GitHub', profile.links.github, 'gbibbo'),
      profileLink('Google Scholar', profile.links.scholar),
      profileLink('ORCID', profile.links.orcid, '0009-0003-2493-7412'),
    ],
  },
  work: experience.map((item) => ({
    name: item.org,
    position: item.role,
    url: item.orgUrl,
    location: item.location,
    ...parseRange(item.dates),
    summary: item.summary,
    highlights: item.bullets,
  })),
  education: education.map((item) => ({
    institution: item.institution,
    area: item.focus,
    studyType: item.degree,
    ...parseRange(item.dates),
    score: '',
    courses: [item.credits, item.details].filter(Boolean),
  })),
  publications: publications.map((item) => ({
    name: item.title,
    publisher: item.venue,
    releaseDate: item.year,
    url: item.links?.[0]?.href ?? '',
    summary: `Authors: ${item.authors.join(', ')}`,
  })),
  skills: skills.map((group) => ({
    name: group.name,
    level: '',
    keywords: group.items,
  })),
  languages: profile.languages.map((item) => ({
    language: item.nameEn,
    fluency: item.levelEn,
  })),
  projects: projects.map((item) => ({
    name: item.title,
    description: item.description,
    highlights: [item.category],
    keywords: item.tags,
    url: item.links?.[0]?.href ?? '',
    roles: [],
    entity: '',
    type: 'application',
  })),
  meta: {
    canonical: profile.links.web,
    version: '1.0.0',
    lastModified: profile.updated,
  },
};

await fs.mkdir('dist', { recursive: true });
await fs.writeFile('dist/resume.json', `${JSON.stringify(resume, null, 2)}\n`, 'utf8');

const alternateTag = '<link rel="alternate" type="application/json" href="/resume.json" title="Machine-readable CV" />';
for (const relative of ['index.html', 'es/index.html', 'cv/index.html', 'es/cv/index.html']) {
  const file = path.join('dist', relative);
  let html = await fs.readFile(file, 'utf8');
  if (!html.includes('/resume.json')) {
    if (!html.includes('</head>')) throw new Error(`Missing </head> in ${file}`);
    html = html.replace('</head>', `${alternateTag}</head>`);
    await fs.writeFile(file, html, 'utf8');
  }
}

console.log('Generated /resume.json and linked it from EN/ES profile and CV pages.');
