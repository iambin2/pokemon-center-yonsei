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
await page.waitForTimeout(2400);   /* 모토 도장이 찍히고 표지의 은박 빛이 지나가기를 기다린다 */

await page.evaluate(() => {
  /* 미리보기에는 머리줄이 들어갈 자리가 없다. 표지와 자료 쪽만 화면 가운데에 */
  document.querySelector('.bar')?.remove();
  document.querySelector('main')?.remove();
  const hero = document.querySelector('.hero');
  hero.style.padding = '36px 48px';
  hero.style.minHeight = '100vh';
  hero.style.display = 'grid';
  hero.style.alignItems = 'center';
  /* 미리보기는 작게 보이므로 간추린다: 왼쪽은 은박 표지 그대로, 오른쪽 자료 쪽엔 모토 도장과 기계 판독 줄만 */
  document.querySelectorAll('.fields, .hero-sub, .hero-act').forEach(el => el.remove());
  const data = document.querySelector('.paper.data');
  Object.assign(data.style, { alignSelf: 'stretch', margin: '28px 0 28px calc(var(--lap) * -1)' });
  const motto = document.querySelector('.motto-stamp');
  Object.assign(motto.style, { left: 'auto', right: '16%', top: '20%', bottom: 'auto', width: '280px' });
  /* 수첩이 화면보다 크면 통째로 줄여 위아래가 잘리지 않게 */
  const spread = document.querySelector('.spread');
  spread.style.zoom = Math.min(1, (innerHeight - 64) / spread.offsetHeight);
});
await page.waitForTimeout(300);

await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();
console.log('og.png 갱신 완료', W + '×' + H, '(2배 해상도)');
