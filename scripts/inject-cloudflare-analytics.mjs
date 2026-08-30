import { promises as fs } from 'node:fs';
import path from 'node:path';

const token = '3be599b0fe114d2c8821c689fbb50d80';
const canonicalHost = 'gbibbo.github.io';
const optOutKey = 'gbibbo_cloudflare_analytics_opt_out';
const root = path.resolve('dist');
const beaconData = JSON.stringify({ token });
const beaconLoader = `<script>(function(){if(location.hostname!==${JSON.stringify(canonicalHost)})return;var key=${JSON.stringify(optOutKey)};var params=new URLSearchParams(location.search);var choice=params.get('analytics');function clean(){params.delete('analytics');var q=params.toString();history.replaceState(null,'',location.pathname+(q?'?'+q:'')+location.hash);}if(choice==='off'){try{localStorage.setItem(key,'1');}catch(e){}clean();return;}if(choice==='on'){try{localStorage.removeItem(key);}catch(e){}clean();}try{if(localStorage.getItem(key)==='1')return;}catch(e){}var s=document.createElement('script');s.type='module';s.src='https://static.cloudflareinsights.com/beacon.min.js';s.setAttribute('data-cf-beacon',${JSON.stringify(beaconData)});document.head.appendChild(s);}());</script>`;

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
console.log(`Cloudflare Web Analytics loader injected for ${canonicalHost} only, with browser-local owner opt-out.`);
