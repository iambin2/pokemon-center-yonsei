/* 링크 미리보기 이미지(og.png)를 사이트의 첫 화면에서 간추려 찍는다.
   따로 그리지 않는다 — 같은 활자, 같은 천 표지와 속지, 같은 도장을 쓰므로 늘 본문과 일치한다.
   실행: node scripts/make-og.mjs                                                */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const URL = 'file:///' + path.join(root, 'index.html').replace(/\\/g, '/');
const OUT = path.join(root, 'og.png');
const W = 1200, H = 630;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await page.goto(URL);
await page.evaluateHandle('document.fonts.ready');
await page.mouse.move(-500, -500);
await page.waitForTimeout(300);

await page.evaluate(() => {
  /* 미리보기에는 머리줄이 들어갈 자리가 없다. 덮어 둔 여권과 소개 한 줄만 화면 가운데에(작게 보이므로 자료 칸과 단추는 뺀다) */
  document.querySelector('.bar')?.remove();
  document.querySelector('main')?.remove();
  document.querySelectorAll('.fields, .hero-act').forEach(el => el.remove());
  const hero = document.querySelector('.hero');
  Object.assign(hero.style, { minHeight: '100vh', padding: '40px 64px' });
  const passport = document.querySelector('.passport');
  passport.style.setProperty('--pw', '380px');
  document.querySelector('.hero-lead').style.fontSize = '44px';
  document.querySelector('.spread').style.gridTemplateColumns = 'auto minmax(0, 560px)';
});
await page.waitForTimeout(300);

await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();
console.log('og.png 갱신 완료', W + '×' + H, '(2배 해상도)');
