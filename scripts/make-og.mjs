/* 링크 미리보기 이미지(og.png)를 사이트의 첫 화면 그대로 찍는다.
   따로 그리지 않는다 — 같은 활자, 같은 색, 같은 풀숲을 쓰므로 늘 본문과 일치한다.
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
await page.waitForTimeout(900);

await page.evaluate(() => {
  /* 미리보기에는 메뉴와 스크롤 신호가 들어갈 자리가 없다 */
  document.querySelector('.nav').remove();
  document.querySelector('.hero-scroll').remove();
  const hero = document.querySelector('.hero');
  hero.style.minHeight = '100vh';
  hero.style.padding = '0 56px';
  /* 등장 애니메이션을 끝난 상태로 고정 */
  hero.querySelectorAll('[data-in]').forEach(el => {
    el.style.animation = 'none';
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  document.querySelector('.hero h1').style.letterSpacing = '.16em';
});

/* 글 덩어리를 실제로 재서 화면 한가운데로 맞춘다 */
await page.evaluate(() => {
  const els = [...document.querySelectorAll('.hero-meta, .hero h1, .hero-kr, .hero-sub')];
  const top = Math.min(...els.map(e => e.getBoundingClientRect().top));
  const bottom = Math.max(...els.map(e => e.getBoundingClientRect().bottom));
  const shift = innerHeight / 2 - (top + bottom) / 2;
  for (const e of els) e.style.transform = `translateY(${shift}px)`;
});

/* 풀숲이 커서에 비켜서지 않도록 포인터를 화면 밖에 둔다 */
await page.mouse.move(-500, -500);
await page.waitForTimeout(700);

await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();
console.log('og.png 갱신 완료', W + '×' + H, '(2배 해상도)');
