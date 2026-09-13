#!/usr/bin/env node
/**
 * index.html 브라우저 렌더 검증.
 *
 *   node scripts/verify.mjs [index.html 경로]
 *
 * 확인 항목
 *   - 콘솔/페이지 에러
 *   - 인라인 이미지 전부 디코딩되는지
 *   - 한국어/영어/일본어 전환이 모든 섹션에 적용되는지
 *   - 영문 모드에 남은 한글이 없는지 (마퀴 제외 — 3개 국어 병기가 의도됨)
 *   - FAQ와 기수 아코디언 동작, aria 상태
 *   - 명암비 WCAG AA (4.5:1, 큰 글씨 3:1), 라이트와 다크 두 테마 모두
 *   - 모바일 가로 오버플로
 *   - 스킵 링크와 포커스 표시
 *
 * Playwright 필요:  npm i -D playwright
 * (브라우저는 PLAYWRIGHT_BROWSERS_PATH 에 이미 있으면 재다운로드하지 않는다)
 */
import { chromium } from 'playwright';
import path from 'node:path';
import process from 'node:process';

const FILE = path.resolve(process.argv[2] ?? 'index.html');
const URL = 'file://' + FILE;

let failed = 0;
const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => { failed++; console.log(`  \x1b[31m✗\x1b[0m ${m}`); };

console.log(`\n검증 대상: ${FILE}\n`);

const browser = await chromium.launch();

/* ------------------------------------------------------------ 데스크톱 */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    // 외부 폰트가 막힌 샌드박스에서는 네트워크 실패가 정상적으로 발생한다
    if (m.type() === 'error' && !/ERR_TUNNEL|ERR_NAME|ERR_INTERNET|net::/.test(m.text())) {
      errors.push('console: ' + m.text().slice(0, 120));
    }
  });

  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(1200);

  console.log('[에러]');
  errors.length ? bad(`JS 에러 ${errors.length}건: ${errors.slice(0, 3).join(' | ')}`)
                : ok('JS 에러 없음');

  /* 이미지 --------------------------------------------------------- */
  console.log('\n[이미지]');
  await page.evaluate(() => {
    document.querySelectorAll('.exec-poke img').forEach((i) => (i.loading = 'eager'));
  });
  await page.waitForTimeout(2500);
  const img = await page.evaluate(() => {
    const a = [...document.querySelectorAll('img')];
    return { total: a.length, loaded: a.filter((i) => i.naturalWidth > 0).length };
  });
  img.loaded === img.total
    ? ok(`이미지 ${img.total}개 전부 로드`)
    : bad(`이미지 ${img.total}개 중 ${img.total - img.loaded}개 실패`);

  /* 아코디언 ------------------------------------------------------- */
  console.log('\n[아코디언]');
  await page.evaluate(() => document.querySelectorAll('.exec-gen-toggle').forEach((b) => b.click()));
  await page.waitForTimeout(600);
  const acc = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('.exec-gen-toggle')];
    return {
      genCount: btns.length,
      gen: btns.length > 0 && btns.every((b) => {
        const host = b.closest('.exec-gen');
        const panel = document.getElementById(b.getAttribute('aria-controls'));
        const expanded = b.getAttribute('aria-expanded') === 'true';
        return panel && host.classList.contains('open') === expanded && panel.inert === !expanded;
      }),
      faqCount: document.querySelectorAll('.faq-q').length,
    };
  });
  acc.gen ? ok(`기수 아코디언 ${acc.genCount}개 상태·aria·inert 일치`)
          : bad('기수 아코디언 상태 불일치');
  await page.evaluate(() => document.querySelectorAll('.exec-gen-toggle').forEach((b) => { if (b.getAttribute('aria-expanded') === 'true') b.click(); }));

  await page.evaluate(() => document.querySelector('.faq-q').click());
  const faq = await page.evaluate(() => {
    const b = document.querySelector('.faq-q');
    return b.getAttribute('aria-expanded') === 'true' && b.closest('.faq-item').classList.contains('open');
  });
  faq ? ok(`FAQ 아코디언 ${acc.faqCount}개 동작`) : bad('FAQ 아코디언 동작 실패');

  /* 다국어 --------------------------------------------------------- */
  console.log('\n[다국어]');
  for (const L of ['ko', 'en', 'ja']) {
    await page.evaluate((l) => setLang(l), L);
    await page.waitForTimeout(300);
    const s = await page.evaluate(() => ({
      html: document.documentElement.lang,
      body: document.body.getAttribute('data-lang'),
      nav: document.querySelector('.nav-link').textContent.trim(),
      chip: document.querySelector('.type-normal')?.textContent.trim(),
    }));
    s.html === L && s.body === L
      ? ok(`${L} — nav "${s.nav}" / 타입 칩 "${s.chip}"`)
      : bad(`${L} 전환 실패: ${JSON.stringify(s)}`);
  }

  await page.evaluate(() => setLang('en'));
  await page.waitForTimeout(400);
  const leftover = await page.evaluate(() => {
    const out = new Set();
    document.querySelectorAll('main *, footer *, nav *').forEach((el) => {
      if (el.children.length) return;
      const t = el.textContent.trim();
      if (/[가-힣]/.test(t) && !el.closest('.marquee')) out.add(`${el.className || el.tagName}: ${t.slice(0, 24)}`);
    });
    return [...out];
  });
  leftover.length ? bad(`영문 모드에 남은 한글 ${leftover.length}건: ${leftover.slice(0, 4).join(' | ')}`)
                  : ok('영문 모드에 남은 한글 없음');
  await page.evaluate(() => setLang('ko'));

  /* 명암비 --------------------------------------------------------- */
  console.log('\n[명암비]');
  for (const theme of ['light', 'dark']) {
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
  await page.waitForTimeout(700);
  const contrast = await page.evaluate(() => {
    const lum = (c) => {
      const s = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
    };
    const parse = (c) => { const m = c.match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : null; };
    const alpha = (c) => { const m = c.match(/[\d.]+/g); return m && m.length > 3 ? parseFloat(m[3]) : 1; };
    const bgOf = (el) => {
      let e = el, acc = null;
      while (e) {
        const cs = getComputedStyle(e).backgroundColor;
        const p = parse(cs), a = alpha(cs);
        if (p && a > 0) {
          acc = acc ? { c: acc.c.map((v, i) => v * acc.a + p[i] * a * (1 - acc.a)), a: acc.a + a * (1 - acc.a) }
                    : { c: p, a };
          if (acc.a >= 0.999) return acc.c.map(Math.round);
        }
        e = e.parentElement;
      }
      return acc ? acc.c.map((v) => Math.round(v * acc.a + 255 * (1 - acc.a))) : [255, 255, 255];
    };
    const out = [];
    document.querySelectorAll('p,span,a,h1,h2,h3,h4,li,dt,dd,div').forEach((el) => {
      if (!el.textContent.trim() || el.children.length) return;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.1) return;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const fg = parse(cs.color), bg = bgOf(el);
      const L1 = lum(fg), L2 = lum(bg);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight) >= 700);
      const need = large ? 3 : 4.5;
      if (ratio < need) out.push(`${ratio.toFixed(2)}:1 (필요 ${need}) ${size}px .${String(el.className).split(' ')[0]} "${el.textContent.trim().slice(0, 20)}"`);
    });
    return [...new Set(out)];
  });
  contrast.length ? bad(`${theme} 테마 AA 미달 ${contrast.length}건:\n      ${contrast.slice(0, 6).join('\n      ')}`)
                  : ok(`${theme} 테마 WCAG AA 미달 0건`);
  }
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));

  /* 키보드 --------------------------------------------------------- */
  console.log('\n[키보드]');
  const p2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p2.goto(URL);
  await p2.waitForTimeout(800);
  await p2.keyboard.press('Tab');
  const skip = await p2.evaluate(() => {
    const el = document.activeElement;
    return { cls: el.className, outline: getComputedStyle(el).outlineWidth };
  });
  skip.cls === 'skip-link' && skip.outline !== '0px'
    ? ok('첫 Tab에서 스킵 링크 포커스 + 아웃라인 표시')
    : bad(`스킵 링크/포커스 이상: ${JSON.stringify(skip)}`);
  await p2.close();
  await page.close();
}

/* ------------------------------------------------------------ 모바일 */
{
  console.log('\n[모바일]');
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(URL);
  await page.waitForTimeout(1200);

  const ov = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  ov.scrollW <= ov.clientW ? ok('가로 오버플로 없음')
                           : bad(`가로 오버플로: ${ov.scrollW}px > ${ov.clientW}px`);

  await page.click('#mobileToggle');
  await page.waitForTimeout(600);
  const menu = await page.evaluate(() => {
    const t = document.getElementById('mobileToggle');
    const links = [...document.querySelectorAll('.nav-links .nav-link')];
    return {
      open: document.getElementById('navLinks').classList.contains('open'),
      expanded: t.getAttribute('aria-expanded') === 'true',
      small: links.filter((a) => a.getBoundingClientRect().height < 44).length,
    };
  });
  menu.open && menu.expanded ? ok('모바일 메뉴 열림 + aria-expanded 갱신')
                             : bad(`모바일 메뉴 이상: ${JSON.stringify(menu)}`);
  menu.small === 0 ? ok('메뉴 항목 터치 타깃 44px 이상')
                   : bad(`44px 미만 메뉴 항목 ${menu.small}개`);
  await page.close();
}

await browser.close();

console.log();
if (failed) {
  console.log(`\x1b[31m실패 ${failed}건\x1b[0m`);
  process.exit(1);
}
console.log('\x1b[32m전부 통과\x1b[0m');
