# 포켓몬 센터 연세점 (PCY) 홈페이지

연세대학교 포켓몬 동아리 공식 홈페이지. 한국어, 영어, 일본어 3개 국어 단일 페이지. 페이지 전체가 동아리의 스탬프 랠리 수첩이다.

**→ https://iambin2.github.io/pokemon-center-yonsei/**

## 구조

사이트 전체가 `index.html` 파일 하나다. CSS, JavaScript, 이미지(base64)가 모두 들어 있다.
`main` 브랜치에 푸시하면 GitHub Actions가 `node scripts/build.mjs`로 이미지만 떼어 낸 `dist/`를 만들어 배포한다.

| 경로 | 설명 |
|---|---|
| `index.html` | 사이트 전체이자 유일한 편집 대상 |
| `og.png` | 링크 공유용 미리보기 카드 (`node scripts/make-og.mjs`로 생성) |
| `scripts/` | 배포 준비(`build.mjs`), 검증, 이미지 추가 도구 |
| `dist/` | 자동 생성되는 배포본. 커밋하지 않는다 |
| `DESIGN.md` | 디자인 규칙과 토큰 |
| `CLAUDE.md` | AI가 읽는 프로젝트 규칙 |
| `docs/인수인계.md` | 운영자용 안내서 |

## 검증

```powershell
npm install                     # 최초 1회 (playwright)
npm test                        # 정적 검증 + 브라우저 검증
node scripts/build.mjs          # 배포본 만들기
node scripts/verify-build.mjs   # 배포본 검증
```

## 관리

저장소 폴더에서 `claude`를 실행하면 `CLAUDE.md`의 규칙을 읽고 작업한다.
자세한 운영 방법은 [`docs/인수인계.md`](docs/인수인계.md) 참고.
