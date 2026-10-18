import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

// Keep the editable single file; split byte-identical images only for deployment.
const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
await rm(dist, { recursive: true, force: true });
await mkdir(new URL('assets/', dist), { recursive: true });
const source = await readFile(new URL('index.html', root), 'utf8');
const images = new Map();
const html = source.replace(/data:image\/(png|webp);base64,([A-Za-z0-9+/=]+)/g, (_, type, base64) => {
  const bytes = Buffer.from(base64, 'base64');
  const name = `assets/${createHash('sha256').update(bytes).digest('hex')}.${type}`;
  images.set(name, bytes);
  return name;
});
for (const [name, bytes] of images) await writeFile(new URL(name, dist), bytes);
await writeFile(new URL('index.html', dist), html);
for (const name of ['og.png']) await copyFile(new URL(name, root), new URL(name, dist));
await writeFile(new URL('.nojekyll', dist), '');
console.log(JSON.stringify({ sourceHTML: Buffer.byteLength(source), deployedHTML: Buffer.byteLength(html),
  sourceGzip: gzipSync(source).length, deployedGzip: gzipSync(html).length,
  uniqueImages: images.size, imageBytes: [...images.values()].reduce((n, b) => n + b.length, 0),
  output: fileURLToPath(dist) }, null, 2));
