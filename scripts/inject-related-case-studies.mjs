import { promises as fs } from 'node:fs';
import path from 'node:path';

const routes = [
  '/work/audio-language-vad/',
  '/work/sounds-of-home/',
  '/work/speech-removal/',
  '/work/harmonic-edm-mixing/',
  '/work/raspberry-pi-sed/',
  '/work/3h-ato/',
];

const pages = [path.resolve('dist/index.html'), path.resolve('dist/es/index.html')];
const relatedLinks = routes.map((route) => `<link rel="related" href="${route}">`).join('');

for (const file of pages) {
  let html = await fs.readFile(file, 'utf8');

  if (!html.includes('rel="related" href="/work/audio-language-vad/"')) {
    if (!html.includes('</head>')) throw new Error(`Missing </head> in ${file}`);
    html = html.replace('</head>', `${relatedLinks}</head>`);
  }

  const threeHAtoAnchor = /<a(?=[^>]*class="project-thumb[^\"]*")(?=[^>]*href="[^"]+")([^>]*)><img(?=[^>]*src="\/homepage_files\/project_3hato\.png")([^>]*)><\/a>/;
  const match = html.match(threeHAtoAnchor);
  if (match) {
    const replacement = match[0].replace(/href="[^"]+"/, 'href="/work/3h-ato/"').replace(/ target="_blank"/, '').replace(/ rel="noreferrer"/, '');
    html = html.replace(threeHAtoAnchor, replacement);
  }

  await fs.writeFile(file, html, 'utf8');
}

console.log('Related case-study links injected and 3H-ATO thumbnail routed to its expanded page.');
