import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const root = new URL('../dist/', import.meta.url);
const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const html = await readFile(new URL('index.html', root), 'utf8');
let restored = html;
for (const name of new Set(html.match(/assets\/[a-f0-9]{64}\.(?:png|webp)/g))) {
  const bytes = await readFile(new URL(name, root));
  restored = restored.replaceAll(name, `data:image/${name.split('.').pop()};base64,${bytes.toString('base64')}`);
}
assert.equal(restored, source, 'Extracted images must restore the exact source');
assert.ok(!html.includes('data:image/'), 'All raster images must be external');
assert.ok(Buffer.byteLength(html) < 300_000, 'HTML budget exceeded');
const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname.replace(/^\/pokemon-center-yonsei\//, '');
    if (!/^(?:index\.html|og\.png|x-ball\.png|assets\/[a-f0-9]{64}\.(?:png|webp))$/.test(path)) { res.writeHead(404).end(); return; }
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
  await page.evaluate(() => { Math.random = () => 0; });
  await page.locator('.hero-grass').dispatchEvent('pointerdown', { clientX: 120, clientY: 400 });
  await page.waitForTimeout(800);
  assert.equal(requests.size, before + 1, 'First encounter fetches exactly one selected image');
  await page.waitForTimeout(3500);
  await page.locator('.hero-grass').dispatchEvent('pointerdown', { clientX: 120, clientY: 400 });
  await page.waitForTimeout(500);
  assert.equal(requests.size, before + 1, 'Repeated encounter reuses the image');
  assert.deepEqual(errors, []);
  console.log(`Asset integrity passed; initial images ${before}, first encounter +1, repeated encounter +0`);
  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  const reducedRequests = new Set();
  reduced.on('request', r => { if (r.url().includes('/assets/')) reducedRequests.add(r.url()); });
  await reduced.goto(url);
  await reduced.waitForTimeout(800);
  const count = reducedRequests.size;
  await reduced.locator('.hero-grass').dispatchEvent('pointerdown', { clientX: 120, clientY: 400 });
  await reduced.waitForTimeout(400);
  assert.equal(reducedRequests.size, count, 'Reduced motion does not load encounter images');
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
