import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const site = 'https://gbibbo.github.io';
const profile = JSON.parse(await fs.readFile('src/data/profile.json', 'utf8'));
const routes = [];

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(filePath);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const html = await fs.readFile(filePath, 'utf8');
    if (!/<html\b/i.test(html)) continue;

    const relative = path.relative(root, filePath).split(path.sep).join('/');
    let route;
    if (relative === 'index.html') route = '/';
    else if (relative.endsWith('/index.html')) route = `/${relative.slice(0, -'index.html'.length)}`;
    else route = `/${relative.replace(/\.html$/, '')}/`;

    routes.push(route);
  }
}

await walk(root);
routes.sort();
const routeSet = new Set(routes);

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

function languagePair(route) {
  if (route.startsWith('/es/')) {
    const en = route === '/es/' ? '/' : route.replace(/^\/es/, '');
    return routeSet.has(en) ? { en, es: route } : null;
  }
  const es = route === '/' ? '/es/' : `/es${route}`;
  return routeSet.has(es) ? { en: route, es } : null;
}

const body = routes.map((route) => {
  const url = `${site}${route}`;
  const pair = languagePair(route);
  const alternates = pair
    ? [
        `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(`${site}${pair.en}`)}" />`,
        `    <xhtml:link rel="alternate" hreflang="es" href="${escapeXml(`${site}${pair.es}`)}" />`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${site}${pair.en}`)}" />`,
      ].join('\n')
    : '';

  return [
    '  <url>',
    `    <loc>${escapeXml(url)}</loc>`,
    `    <lastmod>${escapeXml(profile.updated)}</lastmod>`,
    alternates,
    '  </url>',
  ].filter(Boolean).join('\n');
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;

await fs.writeFile(path.join(root, 'sitemap.xml'), xml, 'utf8');
console.log(`Generated sitemap.xml with ${routes.length} URLs, lastmod, and available EN/ES alternates.`);
