import { chromium } from 'playwright';
const URL = 'file:///C:/Users/jaebi/Documents/Homepages/pokemon-center-yonsei/index.html';
const lang = process.argv[2] || 'ko';
const w = Number(process.argv[3] || 1440);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: 1000 } });
await p.goto(URL);
await p.waitForTimeout(900);
await p.evaluate(l => { if (l !== 'ko') window.setLang(l); }, lang).catch(() => {});
await p.evaluate(l => {
  document.querySelectorAll('[data-reveal],[data-in]').forEach(e => { e.classList.add('in'); e.style.opacity = 1; e.style.transform = 'none'; });
  document.querySelectorAll('.faq-item, .exec-gen').forEach(e => e.classList.add('open'));
  document.querySelectorAll('[inert]').forEach(e => e.removeAttribute('inert'));
  document.querySelectorAll('.faq-a, .exec-gen-body').forEach(e => e.style.gridTemplateRows = '1fr');
  if (l !== 'ko' && typeof setLang === 'function') setLang(l);
}, lang);
await p.waitForTimeout(600);

const out = await p.evaluate(() => {
  const sel = 'p, h1, h2, h3, h4, li, .label, time, dd, dt, span.value, a';
  const seen = new Set(), res = [];
  for (const el of document.querySelectorAll(sel)) {
    if (el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
    if (!el.offsetParent && el.tagName !== 'BODY') continue;
    if (el.querySelector(sel)) continue;              // 잎 노드만
    const txt = el.innerText.trim();
    if (!txt || txt.length < 6) continue;
    // 줄 단위로 쪼갠다
    const node = [...el.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
    const r = document.createRange();
    const lines = [];
    if (el.childNodes.length === 1 && node) {
      const s = node.textContent;
      let cur = '', top = null;
      for (let i = 0; i < s.length; i++) {
        r.setStart(node, i); r.setEnd(node, i + 1);
        const rect = r.getBoundingClientRect();
        if (top === null) top = rect.top;
        if (Math.abs(rect.top - top) > 3) { lines.push(cur); cur = ''; top = rect.top; }
        cur += s[i];
      }
      if (cur) lines.push(cur);
    } else {
      lines.push(...txt.split('\n'));
    }
    if (lines.length < 2) continue;
    const key = lines.join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    res.push({ cls: el.className || el.tagName, lines: lines.map(x => x.trim()) });
  }
  return res;
});
for (const r of out) {
  console.log(`[${String(r.cls).slice(0, 26)}]`);
  r.lines.forEach(l => console.log('   | ' + l));
}
console.log('블록 수:', out.length);
await b.close();
