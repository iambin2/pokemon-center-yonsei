# 포켓몬 센터 연세점 (PCY) 홈페이지

연세대학교 포켓몬 동아리 공식 홈페이지. 한국어, 영어, 일본어 3개 국어 단일 페이지. 라이트와 다크 테마 지원.

**→ https://iambin2.github.io/pokemon-center-yonsei/**

## 구조

사이트 전체가 `index.html` 파일 하나다. CSS, JavaScript, 이미지(base64)가 모두 인라인되어 있고,
프레임워크나 추가 배포 의존성은 없다. 배포 시 Node.js 기본 기능으로 이미지를 분리한다. `main` 브랜치에 푸시하면 GitHub Actions가 자동으로 배포한다.

| 경로 | 설명 |
|---|---|
| `index.html` | 사이트 전체 (약 1.6MB) |
| `og.png` | 링크 공유용 미리보기 카드 (1200×630) |
| `dist/` | 자동 생성되는 배포본. 수정하지 않는다 |
| `scripts/build.mjs` | 이미지를 원본 바이트 그대로 분리하고 필요한 파일만 배포 준비 |
| `scripts/` | 검증과 이미지 처리 도구 |
| `docs/인수인계.md` | 운영자용 안내서 |
| `CLAUDE.md` | 클로드가 읽는 프로젝트 규칙 |

## 검증

```bash
npm install        # 최초 1회 (playwright)
npm run check      # i18n 정합성, 이미지 무결성, 태그 구조, 크기 예산
npm run verify     # 3개 국어, 아코디언, 이미지, 두 테마 명암비, 모바일
npm test           # 둘 다
```

## 관리

저장소 폴더에서 `claude`를 실행하면 `CLAUDE.md`의 프로젝트 규칙을 읽고 작업한다.
자세한 운영 방법은 [`docs/인수인계.md`](docs/인수인계.md) 참고.

## 용량 최적화 (2026-09)

편집은 기존처럼 루트 `index.html`에서 한다. GitHub Actions가 `node scripts/build.mjs`로
`dist/`를 만들고 이 폴더만 배포한다. 이미지 내용으로 파일 이름을 만들어 같은 이미지는
재사용하고, 내용이 바뀌면 새 주소가 된다. 이미지 화질과 해상도는 변경하지 않는다.
풀숲 효과는 클릭한 포켓몬만 로드하며, 임원 카드는 기존 지연 로딩을 사용한다.

```powershell
node scripts/build.mjs
node scripts/verify-build.mjs
```

두 번째 명령은 Playwright와 Chromium이 필요하다 (`npm install`, `npx playwright install chromium`).
배포본 이미지 무결성, 첫 로딩과 클릭 시 이미지 요청 수, 기존 브라우저 검증을 수행한다.
원본 정적 검증은 기존처럼 `npm run check`로 한다. `dist/`는 자동 생성물이므로 커밋하지 않는다.
