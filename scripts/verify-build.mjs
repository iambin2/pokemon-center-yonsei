import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';

const root = new URL('../dist/', import.meta.url);
const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const html = await readFile(new URL('index.html', root), 'utf8');
let restored = html;
for (const name of new Set(html.match(/assets\/[a-f0-9]{64}\.(?:png|webp)/g))) {
  const bytes = await readFile(new URL(name, root));
  restored = restored.replaceAll(name, `data:image/${name.split('.').pop()};base64,${bytes.toString('base64')}`);
}
const noFonts = s => s.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2[^>]*>\n?/g, '');   /* 폰트 주소는 배포 때 쓰인 글자만 받도록 바뀐다 */
assert.equal(noFonts(restored), noFonts(source), 'Extracted images must restore the exact source');
assert.ok(!/data:image\/(?:png|webp|jpe?g|gif)/.test(html), 'All raster images must be external');   /* 작은 SVG(구름띠)는 글자라 안에 둬도 된다 */
/* 예산은 실제로 내려받는 크기(압축 후)로 잰다. 글이 많은 단일 파일이라 압축 전 크기는 로딩 시간을 잘 나타내지 못한다 */
const gz = gzipSync(html).length;
assert.ok(gz < 120_000, `HTML budget exceeded: ${gz} bytes gzip (limit 120000)`);
const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname.replace(/^\/pokemon-center-yonsei\//, '');
    if (!/^(?:index\.html|og\.png|assets\/[a-f0-9]{64}\.(?:png|webp))$/.test(path)) { res.writeHead(404).end(); return; }
    const type = path.endsWith('.html') ? 'text/html; charset=utf-8' : path.endsWith('.webp') ? 'image/webp' : 'image/png';
    res.writeHead(200, { 'Content-Type': type });
    res.end(await readFile(new URL(path, root)));
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}/pokemon-center-yonsei/index.html`;
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [], requests = new Set();
  page.on('pageerror', error => errors.push(String(error)));
  page.on('request', request => { if (request.url().includes('/assets/')) requests.add(request.url()); });
  await page.goto(url);
  await page.waitForTimeout(1000);
  const before = requests.size;
  assert.ok(before < 20, `Initial load fetched too many images: ${before}`);
  assert.deepEqual(errors, []);
  console.log(`Asset integrity passed; initial images ${before}`);
  await browser.close(); browser = null;
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['scripts/verify.mjs', url], { stdio: 'inherit' });
    child.on('error', reject); child.on('exit', resolve);
  });
  assert.equal(code, 0, 'Browser regression checks');
} finally {
  if (browser) await browser.close();
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
