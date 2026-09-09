#!/usr/bin/env python3
"""임원 카드 포켓몬 이미지를 규격에 맞춰 index.html 에 넣는다.

  python3 scripts/add_pokemon.py <이미지파일> <임원이름> [--fav 포켓몬] [--dry-run]

하는 일
  1. 대상 임원이 실제로 존재하는지, 그 임원의 최애(data-fav)가 무엇인지 확인
  2. 원본 PNG 를 192×192 로 축소 (LANCZOS) 후 oxipng 무손실 최적화
  3. POKE_GIFS 맵의 해당 항목 교체
  4. 같은 이미지를 쓰는 항목이 생기면 별칭으로 정리해 중복 저장을 막는다

필요 패키지:  pip install pillow pyoxipng
"""
from __future__ import annotations

import argparse
import base64
import io
import os
import re
import shutil
import sys

SIZE = 192  # 92px 표시 × 2 DPR + 여유

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, "index.html")


def die(msg: str):
    print(f"\033[31m오류\033[0m {msg}")
    sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("image", help="원본 포켓몬 이미지 (공식 렌더 권장)")
    ap.add_argument("name", help="임원 이름 (예: 윤상원)")
    ap.add_argument("--fav", help="이 포켓몬이 맞는지 대조할 이름 (예: 디아루가)")
    ap.add_argument("--dry-run", action="store_true", help="파일을 쓰지 않고 결과만 보여준다")
    a = ap.parse_args()

    try:
        from PIL import Image
        import oxipng
    except ImportError:
        die("pillow / pyoxipng 가 필요하다:  pip install pillow pyoxipng")

    src = open(INDEX, encoding="utf-8").read()

    # 1) 대상 확인 -------------------------------------------------------
    slots = re.findall(r'data-poke="([^"]+)"\s+data-fav="([^"]+)"', src)
    favs = {n: f for n, f in slots}
    if a.name not in favs:
        near = [n for n in favs if a.name[:2] in n]
        die(f"'{a.name}' 임원을 찾을 수 없다." + (f" 혹시: {near}" if near else ""))
    fav = favs[a.name]
    print(f"대상: {a.name} · 최애 {fav}")
    if a.fav and a.fav != fav:
        die(f"최애 불일치 — 파일은 '{a.fav}' 인데 {a.name}의 최애는 '{fav}' 다.")

    if f'"{a.name}"' not in src:
        die(f"POKE_GIFS 에 '{a.name}' 항목이 없다. 먼저 맵에 자리를 만들어야 한다.")

    # 2) 변환 ------------------------------------------------------------
    raw = open(a.image, "rb").read()
    im = Image.open(io.BytesIO(raw))
    print(f"원본: {im.size[0]}×{im.size[1]} {im.mode}  {len(raw)/1024:.0f} KB")
    if min(im.size) < SIZE:
        print(f"\033[33m경고\033[0m 원본이 {SIZE}px 보다 작다. 확대되어 흐려질 수 있다.")

    im = im.convert("RGBA").resize((SIZE, SIZE), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    out = oxipng.optimize_from_memory(buf.getvalue(), level=4, strip=oxipng.StripChunks.safe())
    print(f"결과: {SIZE}×{SIZE}  {len(out)/1024:.0f} KB")

    b64 = base64.b64encode(out).decode("ascii")

    # 3) 교체 ------------------------------------------------------------
    pat = re.compile('("%s"\\s*:\\s*")data:image/png;base64,[^"]*(")' % re.escape(a.name))
    if not pat.search(src):
        die(f"'{a.name}' 항목이 별칭으로만 존재한다. 별칭을 먼저 실제 항목으로 되돌려야 한다.")
    src = pat.sub(lambda m: m.group(1) + "data:image/png;base64," + b64 + m.group(2), src, count=1)

    # 4) 중복 정리 --------------------------------------------------------
    entries = re.findall(r'"([^"]{1,20})"\s*:\s*"data:image/png;base64,([^"]+)"', src)
    by_val: dict[str, list[str]] = {}
    for n, v in entries:
        by_val.setdefault(v, []).append(n)
    saved = 0
    for v, names in by_val.items():
        if len(names) < 2:
            continue
        keep, *rest = names
        for n in rest:
            src = src.replace('"%s": "data:image/png;base64,%s"' % (n, v), '"%s": 0' % n, 1)
            alias = 'POKE_GIFS["%s"]=POKE_GIFS["%s"];' % (n, keep)
            src = src.replace('document.querySelectorAll(".exec-poke[data-poke]")',
                              alias + '\n' + 'document.querySelectorAll(".exec-poke[data-poke]")', 1)
            saved += len(v)
        print(f"중복 정리: {rest} → {keep} 참조 ({saved/1024:.0f} KB 절감)")

    if a.dry_run:
        print("\n--dry-run 이므로 파일을 쓰지 않았다.")
        return

    shutil.copyfile(INDEX, INDEX + ".bak")
    open(INDEX, "w", encoding="utf-8").write(src)
    print(f"\n\033[32m완료\033[0m {INDEX} 갱신 (백업: index.html.bak)")
    print("이제 python3 scripts/check.py 와 node scripts/verify.mjs 로 검증할 것.")


if __name__ == "__main__":
    main()
