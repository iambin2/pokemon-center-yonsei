# 포켓몬 센터 연세점 (PCY) 홈페이지

연세대학교 포켓몬 동아리 공식 홈페이지. 한국어, 영어, 일본어 3개 국어 단일 페이지. 라이트와 다크 테마 지원.

**→ https://iambin2.github.io/pokemon-center-yonsei/**

## 구조

사이트 전체가 `index.html` 파일 하나다. CSS, JavaScript, 이미지(base64)가 모두 인라인되어 있고,
빌드 도구나 프레임워크가 없다. `main` 브랜치에 푸시하면 GitHub Actions가 자동으로 배포한다.

| 경로 | 설명 |
|---|---|
| `index.html` | 사이트 전체 (약 1.6MB) |
| `og.png` | 링크 공유용 미리보기 카드 (1200×630) |
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
