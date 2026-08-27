import { promises as fs } from 'node:fs';
import path from 'node:path';

const token = (process.env.PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN || '').trim();
if (!token) {
  console.log('Cloudflare Web Analytics token not configured; skipping beacon injection.');
  process.exit(0);
}

const root = path.resolve('dist');
const beacon = `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${JSON.stringify({ token })}'></script>`;

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
    if (!html.includes('</body>')) continue;
    if (html.includes('static.cloudflareinsights.com/beacon.min.js')) continue;
    const updated = html.replace('</body>', `${beacon}</body>`);
    await fs.writeFile(filePath, updated, 'utf8');
  }
}

await walk(root);
console.log('Cloudflare Web Analytics beacon injected into generated site pages.');
