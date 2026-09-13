#!/usr/bin/env python3
"""index.html 정적 검증.

브라우저 없이 파일만 읽어서 확인한다.
  - i18n 3중 정합성 (키 집합 동일 / HTML 기본 텍스트 = ko 값 / 미아 키 없음)
  - 인라인 PNG 무결성
  - HTML 태그 구조
  - 크기 예산

사용법:  python3 scripts/check.py [index.html 경로]
"""
import base64
import gzip
import html.parser
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "index.html")

SIZE_BUDGET_MB = 2.0
GZIP_BUDGET_MB = 1.3

fails: list[str] = []
warns: list[str] = []


def ok(msg):
    print(f"  \033[32m✓\033[0m {msg}")


def bad(msg):
    fails.append(msg)
    print(f"  \033[31m✗\033[0m {msg}")


def warn(msg):
    warns.append(msg)
    print(f"  \033[33m!\033[0m {msg}")


src = open(PATH, encoding="utf-8").read()
print(f"\n검증 대상: {PATH}\n")

# ---------------------------------------------------------------- i18n
print("[i18n]")
used = set(re.findall(r'data-i18n="([^"]+)"', src))
# 대체 텍스트용 키(data-i18n-aria)와 스크립트가 직접 꺼내 쓰는 키(i18n[curLang()]['contact.copied'])도 사용 중으로 친다
used |= set(re.findall(r'data-i18n-aria="([^"]+)"', src))
used |= set(re.findall(r"i18n\[[^\]]+\]\['([^']+)'\]", src))
js = src[src.find("const i18n") : src.find("window.i18n = i18n")]

# 값은 작은따옴표와 큰따옴표를 모두 쓴다 (영문 블록에 아포스트로피가 들어가는 문장이 있다)
ENTRY = re.compile(r"""'([^']+)'\s*:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")""")


def parse_block(body: str) -> dict:
    out = {}
    for m in ENTRY.finditer(body):
        out[m.group(1)] = m.group(2) if m.group(2) is not None else m.group(3)
    return out


langs = {
    m.group(1): parse_block(m.group(2))
    for m in re.finditer(r"^  (ko|en|ja): \{(.*?)^  \}", js, re.S | re.M)
}

if set(langs) != {"ko", "en", "ja"}:
    bad(f"언어 블록 파싱 실패: {sorted(langs)}")
else:
    counts = {k: len(v) for k, v in langs.items()}
    if len(set(counts.values())) == 1:
        ok(f"세 언어 키 개수 동일 ({counts['ko']}개)")
    else:
        bad(f"언어별 키 개수 불일치: {counts}")

    for lang, table in langs.items():
        missing = sorted(used - set(table))
        if missing:
            bad(f"{lang}에 없는 키 {len(missing)}개: {missing[:6]}")
    if not any(used - set(t) for t in langs.values()):
        ok(f"HTML이 쓰는 키 {len(used)}개가 세 언어에 모두 존재")

    orphan = sorted(set().union(*(set(t) for t in langs.values())) - used)
    if orphan:
        warn(f"정의만 되고 안 쓰이는 키 {len(orphan)}개: {orphan[:6]}")
    else:
        ok("미사용 키 없음")

    # HTML 기본 텍스트 == ko 값
    ko = {k: v.replace("\\'", "'") for k, v in langs.get("ko", {}).items()}

    def norm(t: str) -> str:
        """비교용 정규화. 태그 주변 줄바꿈·들여쓰기는 렌더 결과가 같으므로 무시한다."""
        t = re.sub(r"\s+", " ", t).strip()
        t = re.sub(r"\s*(<[^>]+>)\s*", r"\1", t)
        return t

    mismatch = []
    for m in re.finditer(r"<(\w+)([^>]*?)data-i18n=\"([^\"]+)\"([^>]*)>(.*?)</\1>", src, re.S):
        key, inner = m.group(3), m.group(5)
        if key in ko and norm(inner) != norm(ko[key]):
            mismatch.append((key, norm(inner)[:40], norm(ko[key])[:40]))
    if mismatch:
        bad(f"HTML 기본 텍스트 ≠ ko 값 ({len(mismatch)}건)")
        for k, a, b in mismatch[:5]:
            print(f"      [{k}]  HTML={a!r}  ko={b!r}")
    else:
        ok("HTML 기본 텍스트가 ko 값과 일치")

# ---------------------------------------------------------------- 이미지
print("\n[이미지]")
entries = re.findall(r'"([^"]{1,20})"\s*:\s*"data:image/png;base64,([^"]+)"', src)
aliases = re.findall(r'POKE_GIFS\["([^"]+)"\]\s*=\s*POKE_GIFS\["([^"]+)"\]', src)
broken = []
for name, b64 in entries:
    try:
        raw = base64.b64decode(b64)
        assert raw[:8] == b"\x89PNG\r\n\x1a\n" and raw[-8:] == b"IEND\xaeB`\x82"
    except Exception:
        broken.append(name)
if broken:
    bad(f"손상된 PNG: {broken}")
else:
    ok(f"POKE_GIFS {len(entries)}개 + 별칭 {len(aliases)}개, PNG 전부 정상")

# data-poke 가 맵에 존재하는지
keys = {n for n, _ in entries} | {a for a, _ in aliases}
pokes = set(re.findall(r'data-poke="([^"]+)"', src))
orphan_poke = sorted(pokes - keys)
if orphan_poke:
    bad(f"이미지가 없는 data-poke: {orphan_poke}")
else:
    ok(f"임원 {len(pokes)}명 모두 이미지 연결됨")

# 최애 포켓몬 키가 i18n 에 있는지
favs = set(re.findall(r'data-fav="([^"]+)"', src))
if langs:
    missing_pk = sorted(f for f in favs if f"pk.{f}" not in langs.get("ko", {}))
    if missing_pk:
        bad(f"pk.* 번역이 없는 포켓몬: {missing_pk}")
    else:
        ok(f"포켓몬 {len(favs)}종 3개 국어 표기 존재")

# ---------------------------------------------------------------- 구조
print("\n[구조]")
VOID = {"meta", "link", "img", "br", "hr", "input", "source", "use", "circle", "line", "path", "rect"}


class Checker(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack, self.errors = [], []

    def handle_starttag(self, tag, attrs):
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
        elif tag in self.stack:
            while self.stack and self.stack[-1] != tag:
                self.errors.append(self.stack.pop())
            if self.stack:
                self.stack.pop()


c = Checker()
c.feed(src)
if c.errors or c.stack:
    bad(f"태그 불일치 — 닫히지 않음 {c.errors[:3]}, 잔여 {c.stack[:3]}")
else:
    ok("태그 구조 정상")

# script 3개: 첫 화면 전 테마 결정(head) / 본문 / 임원 이미지
for tag, n in (("<style>", 1), ("</style>", 1), ("<script>", 3), ("</script>", 3)):
    if src.count(tag) != n:
        bad(f"{tag} 개수 이상: {src.count(tag)} (기대 {n})")
if src.count("</style>") == 1 and src.count("</script>") == 3:
    ok("style 1개 / script 3개")

# ---------------------------------------------------------------- 예산
print("\n[크기]")
raw_mb = len(src.encode()) / 1048576
gz_mb = len(gzip.compress(src.encode(), 9)) / 1048576
line = f"{raw_mb:.2f} MB (gzip {gz_mb:.2f} MB)"
if raw_mb > SIZE_BUDGET_MB or gz_mb > GZIP_BUDGET_MB:
    bad(f"예산 초과 — {line} / 한도 {SIZE_BUDGET_MB} MB, gzip {GZIP_BUDGET_MB} MB")
else:
    ok(f"{line} — 예산 내")

# ---------------------------------------------------------------- 링크 공유 카드
# 선언한 크기가 실제 파일과 다르면 스크래퍼가 잘못 그리거나 아예 거부한다.
print("\n[공유 카드]")
og_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "og.png")
if not os.path.exists(og_path):
    bad("og.png 없음 — node scripts/make-og.mjs 로 만들 것")
else:
    with open(og_path, "rb") as f:
        head = f.read(24)
    if head[:8] != bytes.fromhex("89504e470d0a1a0a") or head[12:16] != b"IHDR":
        bad("og.png이 PNG가 아님")
    else:
        real_w = int.from_bytes(head[16:20], "big")
        real_h = int.from_bytes(head[20:24], "big")
        m_w = re.search(r'og:image:width" content="(\d+)"', src)
        m_h = re.search(r'og:image:height" content="(\d+)"', src)
        if not (m_w and m_h):
            bad("og:image:width/height 메타가 없음")
        elif (int(m_w.group(1)), int(m_h.group(1))) != (real_w, real_h):
            bad(f"선언 {m_w.group(1)}×{m_h.group(1)} ≠ 실제 {real_w}×{real_h}")
        elif abs(real_w / real_h - 1200 / 630) > 0.02:
            bad(f"가로세로비가 1.91:1이 아님 — {real_w}×{real_h}")
        else:
            ok(f"og.png {real_w}×{real_h}, 메타와 일치")

# ---------------------------------------------------------------- 결과
print()
if fails:
    print(f"\033[31m실패 {len(fails)}건\033[0m" + (f", 경고 {len(warns)}건" if warns else ""))
    sys.exit(1)
print(f"\033[32m전부 통과\033[0m" + (f" (경고 {len(warns)}건)" if warns else ""))
