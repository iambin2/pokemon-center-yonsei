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
let html = source.replace(/data:image\/(png|webp);base64,([A-Za-z0-9+/=]+)/g, (_, type, base64) => {
  const bytes = Buffer.from(base64, 'base64');
  const name = `assets/${createHash('sha256').update(bytes).digest('hex')}.${type}`;
  images.set(name, bytes);
  return name;
});
// Ask Google Fonts for just the glyphs this page shows: one small file per face instead of ~100 unicode-range slices.
// Japanese faces skip Hangul, the rest skip kana and kanji. Google silently ignores text= past ~800 characters,
// so past 700 we keep the full link (slower, never broken).
const fontLink = /<link href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)" rel="stylesheet">/;
const shown = [...new Set(html.replace(/<style[\s\S]*?<\/style>|<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, ''))].filter(c => c >= ' ');  // keep the space: a face without it is skipped as the line's first font and the fallback's metrics move every baseline
const jaFace = /Shippori|Zen\+Kaku|Dela/, jaChar = /[　-ヿ一-鿿＀-￯]/, hangul = /[가-힣㄰-㆏]/;
const families = html.match(fontLink)[1].match(/family=[^&]+/g);
const fontGroups = [[families.filter(f => !jaFace.test(f)), shown.filter(c => !jaChar.test(c))],
                    [families.filter(f => jaFace.test(f)), shown.filter(c => !hangul.test(c))]];
if (fontGroups.every(([, chars]) => chars.length < 700)) {
  html = html.replace(fontLink, () => fontGroups.map(([fams, chars]) =>
    `<link href="https://fonts.googleapis.com/css2?${fams.join('&')}&display=swap&text=${encodeURIComponent(chars.join(''))}" rel="stylesheet">`).join('\n'));
} else console.warn(`Font subsetting skipped: ${fontGroups.map(([, c]) => c.length)} characters (limit 700)`);
for (const [name, bytes] of images) await writeFile(new URL(name, dist), bytes);
await writeFile(new URL('index.html', dist), html);
for (const name of ['og.png']) await copyFile(new URL(name, root), new URL(name, dist));
await writeFile(new URL('.nojekyll', dist), '');
console.log(JSON.stringify({ sourceHTML: Buffer.byteLength(source), deployedHTML: Buffer.byteLength(html),
  sourceGzip: gzipSync(source).length, deployedGzip: gzipSync(html).length,
  uniqueImages: images.size, imageBytes: [...images.values()].reduce((n, b) => n + b.length, 0),
  output: fileURLToPath(dist) }, null, 2));
