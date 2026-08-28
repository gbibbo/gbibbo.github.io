import { promises as fs } from 'node:fs';
import path from 'node:path';

const assets = [
  {
    chunksDir: path.resolve('binary-assets/iot-soap-schematic'),
    output: path.resolve('dist/homepage_files/case_study_iot_schematic.webp'),
    expectedMagic: 'WEBP',
  },
];

for (const asset of assets) {
  const files = (await fs.readdir(asset.chunksDir))
    .filter((name) => name.endsWith('.b64'))
    .sort();

  if (!files.length) throw new Error(`No base64 chunks found in ${asset.chunksDir}`);

  const parts = await Promise.all(
    files.map(async (name) => (await fs.readFile(path.join(asset.chunksDir, name), 'utf8')).trim()),
  );
  const buffer = Buffer.from(parts.join(''), 'base64');

  if (buffer.length < 10_000) throw new Error(`Decoded asset is unexpectedly small: ${asset.output}`);
  if (asset.expectedMagic === 'WEBP') {
    const riff = buffer.subarray(0, 4).toString('ascii');
    const webp = buffer.subarray(8, 12).toString('ascii');
    if (riff !== 'RIFF' || webp !== 'WEBP') {
      throw new Error(`Decoded asset is not a valid WebP container: ${asset.output}`);
    }
  }

  await fs.mkdir(path.dirname(asset.output), { recursive: true });
  await fs.writeFile(asset.output, buffer);
  console.log(`Decoded ${files.length} chunks -> ${asset.output} (${buffer.length} bytes)`);
}
