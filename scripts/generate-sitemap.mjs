import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const site = 'https://gbibbo.github.io';
const urls = [];

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

    urls.push(`${site}${route}`);
  }
}

await walk(root);
urls.sort();

const body = urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

await fs.writeFile(path.join(root, 'sitemap.xml'), xml, 'utf8');
console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
