import { promises as fs } from 'node:fs';
import path from 'node:path';

const routes = [
  '/work/audio-language-vad/',
  '/work/asr-enhancement/',
  '/work/traktor-ml/',
  '/work/sounds-of-home/',
  '/work/speech-removal/',
  '/work/harmonic-edm-mixing/',
  '/work/raspberry-pi-sed/',
  '/work/3h-ato/',
  '/work/iot-soap-dispenser/',
  '/work/uyvoy/',
];

const imageRoutes = [
  { image: '/homepage_files/asr-raspberry.jpg', route: '/work/asr-enhancement/' },
  { image: '/homepage_files/traktor_interface.svg', route: '/work/traktor-ml/' },
  { image: '/homepage_files/project_3hato.png', route: '/work/3h-ato/' },
  { image: '/homepage_files/project_iot_soap_dispenser.png', route: '/work/iot-soap-dispenser/' },
  { image: '/homepage_files/uyvoy.png', route: '/work/uyvoy/' },
];

const pages = [path.resolve('dist/index.html'), path.resolve('dist/es/index.html')];
const relatedLinks = routes.map((route) => `<link rel="related" href="${route}">`).join('');

for (const file of pages) {
  let html = await fs.readFile(file, 'utf8');

  if (!html.includes('rel="related" href="/work/audio-language-vad/"')) {
    if (!html.includes('</head>')) throw new Error(`Missing </head> in ${file}`);
    html = html.replace('</head>', `${relatedLinks}</head>`);
  }

  for (const { image, route } of imageRoutes) {
    const escapedImage = image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const anchorPattern = new RegExp(`<a(?=[^>]*class="project-thumb[^\"]*")(?=[^>]*href="[^"]+")([^>]*)><img(?=[^>]*src="${escapedImage}")([^>]*)><\\/a>`);
    const match = html.match(anchorPattern);
    if (!match) continue;

    const replacement = match[0]
      .replace(/href="[^"]+"/, `href="${route}"`)
      .replace(/ target="_blank"/, '')
      .replace(/ rel="noreferrer"/, '');
    html = html.replace(anchorPattern, replacement);
  }

  await fs.writeFile(file, html, 'utf8');
}

console.log('Related case-study links injected and selected project thumbnails routed to expanded pages.');
