import { promises as fs } from 'node:fs';
import path from 'node:path';

const token = '3be599b0fe114d2c8821c689fbb50d80';
const canonicalHost = 'gbibbo.github.io';
const root = path.resolve('dist');
const beaconData = JSON.stringify({ token });
const beaconLoader = `<script>(function(){if(location.hostname!==${JSON.stringify(canonicalHost)})return;var s=document.createElement('script');s.type='module';s.src='https://static.cloudflareinsights.com/beacon.min.js';s.setAttribute('data-cf-beacon',${JSON.stringify(beaconData)});document.head.appendChild(s);}());</script>`;

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
    if (html.includes(token) || html.includes('static.cloudflareinsights.com/beacon.min.js')) continue;
    const updated = html.replace('</body>', `${beaconLoader}</body>`);
    await fs.writeFile(filePath, updated, 'utf8');
  }
}

await walk(root);
console.log(`Cloudflare Web Analytics loader injected for ${canonicalHost} only.`);
