/* 가운데 배치 전수 검사.
   낱낱의 글이 '제 부모'가 아니라 '그 섹션의 글 기둥' 안에서 가운데인지 본다.
   부모가 통째로 밀려 있으면 부모 기준 검사로는 잡히지 않기 때문이다.
   실행: node scripts/audit-align.mjs [폭]                                   */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const URL = 'file:///' + path.join(root, 'index.html').replace(/\\/g, '/');
const W = Number(process.argv[2] || 390);
const TOL = 6;   /* px. 이보다 크게 치우치면 알린다 */

/* 안에서 왼쪽·오른쪽을 나눠 쓰는 것이 제 역할인 부품들 */
const PAIRED = ['.exec-member', '.nav', '.sheet', '.footer-col', '.mascot-top',
                '.specs', '.types', '.facts', '.copy', '.exec-gen-toggle', '.faq-q'];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: 900 }, isMobile: W < 700, hasTouch: W < 700 });
await page.goto(URL);
await page.waitForTimeout(900);
await page.evaluate(() => {
  document.querySelectorAll('[data-reveal],[data-in]').forEach(e => { e.classList.add('in'); e.style.opacity = 1; e.style.transform = 'none'; });
  document.querySelectorAll('.faq-item, .exec-gen').forEach(e => e.classList.add('open'));
  document.querySelectorAll('[inert]').forEach(e => e.removeAttribute('inert'));
  document.querySelectorAll('.faq-a, .exec-gen-body').forEach(e => e.style.gridTemplateRows = '1fr');
});
await page.waitForTimeout(500);

const bad = await page.evaluate(({ TOL, PAIRED }) => {
  const out = [];
  for (const el of document.querySelectorAll('main *, footer *, header.hero *')) {
    if (!el.offsetParent) continue;
    if (PAIRED.some(s => el.closest(s))) continue;
    const txt = (el.innerText || '').trim();
    if (!txt) continue;
    if (el.children.length && [...el.children].some(c => (c.innerText || '').trim())) continue;
    /* 글 조각(인라인)은 제 부모가 자리를 정한다 */
    if (getComputedStyle(el).display === 'inline') continue;
    if (el.classList.contains('sr-only')) continue;   /* 눈에 보이지 않는 글 */
    const me = el.getBoundingClientRect();
    /* 자기든 조상이든 가로로 나란히 선 형제가 있으면, 기준은 그 줄이지 낱개가 아니다 */
    const inRow = node => [...node.parentElement.children].some(sib => {
      if (sib === node) return false;
      const s2 = sib.getBoundingClientRect();
      if (!s2.width || !s2.height) return false;
      const a = node.getBoundingClientRect();
      return s2.top < a.bottom - 2 && s2.bottom > a.top + 2;      /* 세로로 겹친다 = 같은 줄 */
    });
    let node = el, paired = false;
    while (node && !node.classList.contains('wrap') && node.tagName !== 'HEADER') {
      if (inRow(node)) { paired = true; break; }
      node = node.parentElement;
    }
    if (paired) continue;

    /* 기준은 그 섹션의 글 기둥(.wrap) 안쪽 폭 */
    const col = el.closest('.wrap') || el.closest('.hero');
    if (!col) continue;
    const c = col.getBoundingClientRect(), cs = getComputedStyle(col);
    const l = c.left + parseFloat(cs.paddingLeft), r = c.right - parseFloat(cs.paddingRight);
    const b = me;
    if (b.width >= (r - l) - 1) continue;            /* 기둥을 꽉 채운 글은 셈에서 뺀다 */
    const off = (b.left - l) - (r - b.right);
    if (Math.abs(off) > TOL) {
      out.push({ off: Math.round(off), cls: (el.className || el.tagName).toString().slice(0, 30),
                 txt: txt.slice(0, 26).replace(/\n/g, ' ') });
    }
  }
  return out;
}, { TOL, PAIRED });

const seen = new Set();
for (const r of bad) {
  const k = r.cls + r.off;
  if (seen.has(k)) continue;
  seen.add(k);
  console.log(`${r.off > 0 ? '오른쪽' : '왼쪽'}으로 ${Math.abs(r.off)}px  ${r.cls}  "${r.txt}"`);
}
console.log(seen.size ? `\n치우친 블록 ${seen.size}종 (폭 ${W})` : `치우친 블록 없음 (폭 ${W})`);
await browser.close();
process.exit(seen.size ? 1 : 0);
