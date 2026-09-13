# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Yonsei University students deciding whether to join 포켓몬 센터 연세점 — freshmen and prospective members who arrive from the club fair, Instagram, or a shared link, usually on a phone. Their job is to understand what the club is, what it does, what it costs, and how to join, then act.

Secondary: current members and alumni who revisit the history and the past executives archive, and English or Japanese speaking visitors (international students) who use the language switch.

## Product Purpose

The club's official home page: introduce the club, show its history, activities, league, mascots and people, answer the common questions, and turn interest into a join inquiry. Success is a prospective member who finishes the page knowing the facts and how to contact the club.

## Positioning

A real, officially recognised general club at Yonsei (총동아리연합회 공인, 2024.03) with its own history since 2022, its own battle league (YPL), and a documented line of executives from generation 1 to 8. No other site can truthfully show this record.

## Operating Context

- Recruiting peaks at the start of each semester (club fair, 신입생 환영회); the link is shared through Instagram and KakaoTalk.
- Biweekly meetups around Sinchon, monthly battle tournaments, subgroups, annual events.
- The battle league lives on its own site (YPL, https://iambin2.github.io/ypl-site/).
- Maintained by a non-developer; see CLAUDE.md for the operating model.

## Capabilities and Constraints

- One self-contained `index.html` (CSS, JS, base64 images inline). No build tool or framework, by design. Push to `main` deploys via GitHub Pages.
- Trilingual (ko / en / ja) through the `i18n` dictionary and `data-i18n` keys; the three key sets must match and HTML default text must equal the ko value (enforced by `scripts/check.py`).
- Features that must keep working: language switch with saved preference, in-page navigation, mobile menu, executive generation accordions (8, newest first) with per-person Pokémon icons, FAQ accordion (13), contact links (email, Instagram, phone), link to YPL.
- Light and dark themes with a user toggle (decided 2026-09-11), following the device setting by default.
- Budgets: file ≤ 2 MB, WCAG AA contrast, focus visible, reduced motion respected, 44px touch targets.

## Brand Commitments

- Name: 포켓몬 센터 연세점 (포센연), Pokémon Center Yonsei. Motto: 우리는 모두 친구.
- Yonsei Blue is the core colour and stays.
- The existing club emblem (footer logo image) and the mascot artwork (수리둥보 Rufflet, 워글 Braviary) are the club's own assets; use them as they are, never redraw them.
- Copy edits keep every fact (years, counts, fee, contacts) and only improve the sentences: no middle-dot (·) separators anywhere, no meaningless line breaks; all three languages updated together. The small tracked English section labels are part of the incumbent identity and stay.
- Unofficial fan club disclaimer about Pokémon trademarks stays in the footer.
- Standing direction preference (2026-09-12, revised): respect the incumbent site's own style and layout as the reference — its editorial serif wordmark, navy trilingual marquee, big serif quote, numbered cards, dex-style mascot cards, numbered FAQ and navy footer — and rebuild it new at a higher craft level. The user rejected both a concept world (airport signage, "cheap") and a generic Apple-style category standard ("별로"); what they want is their own site's identity, refined.

## Evidence on Hand

Real content only: history entries (2022.11 → 2024.03), activities and subgroups, mascot facts, 8 generations of executives with department, year, and favourite Pokémon icons, 13 FAQ answers, contacts. Member count "약 130명" (8th generation, 2026-09) is the club's own figure. No testimonials, photos of events, or sponsor logos exist; do not fabricate them.

## Product Principles

1. A prospective member should reach "how do I join" in one scroll or one tap from anywhere.
2. Facts over flourish: every number and date on the page is real and stated plainly.
3. One system everywhere: every section, state, and language follows the same rules.
4. The operator must be able to edit text and swap images without breaking anything.

## Accessibility & Inclusion

Korean-first, with full English and Japanese. Readable type on phones, visible focus, AA contrast in both themes, reduced motion respected.
