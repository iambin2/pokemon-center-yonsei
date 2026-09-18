---
name: 포켓몬 센터 연세점 (Pokémon Center Yonsei)
description: An editorial club record in Yonsei Blue — one serif voice, pokéball-marked English labels, italic numerals.
colors:
  navy: "#003876"
  navy-2: "#2A5589"
  navy-hover: "#0B4A94"
  band: "#003876"
  on-band: "#FFFFFF"
  on-band-2: "#BCCBE3"
  on-band-accent: "#A9C8F5"
  band-tint: "#E8EFF9"
  bg: "#FFFFFF"
  bg-alt: "#F6F7F9"
  card: "#FFFFFF"
  card-on-bg: "#F6F7F9"
  ink: "#14181C"
  ink-soft: "#4A5158"
  ink-mute: "#666E77"
  hair: "rgba(0, 56, 118, .12)"
  nav-bg: "rgba(255, 255, 255, .82)"
  type-normal: "#A4A6A1"
  type-flying: "#88AEEB"
typography:
  display:
    fontFamily: "Fraunces, 'Noto Serif KR', Georgia, serif"
    fontSize: "clamp(30px, 5.6vw, 76px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "0.16em"
    fontVariation: "'opsz' 144"
  quote:
    fontFamily: "'Noto Serif KR', Fraunces, serif"
    fontSize: "clamp(46px, 6.4vw, 88px)"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'Noto Serif KR', Fraunces, serif"
    fontSize: "clamp(34px, 4.4vw, 58px)"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Noto Serif KR', Fraunces, serif"
    fontSize: "clamp(21px, 1.9vw, 25px)"
    fontWeight: 500
    lineHeight: 1.4
  lead:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.75
  body:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "-0.006em"
  ui:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.02em"
  label:
    fontFamily: "Fraunces, 'Noto Serif KR', Georgia, serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.3em"
    fontVariation: "'opsz' 14"
  numeral:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "22px"
    fontWeight: 300
    lineHeight: 1
    fontFeature: "lining-nums"
    fontVariation: "'opsz' 144"
rounded:
  s: "10px"
  card: "20px"
  pill: "999px"
  circle: "50%"
spacing:
  nav: "68px"
  gutter: "clamp(20px, 4vw, 48px)"
  section: "clamp(88px, 11vw, 152px)"
  head-gap: "clamp(44px, 5.4vw, 72px)"
  card-pad: "clamp(28px, 3vw, 40px)"
  grid-gap: "20px"
  wrap: "1180px"
components:
  pill:
    backgroundColor: "{colors.band}"
    textColor: "{colors.on-band}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  pill-hover:
    backgroundColor: "{colors.navy-hover}"
  pill-white:
    backgroundColor: "{colors.on-band}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
  pill-white-hover:
    backgroundColor: "{colors.band-tint}"
  pill-sm:
    backgroundColor: "{colors.band}"
    textColor: "{colors.on-band}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "38px"
  link-underline:
    textColor: "{colors.navy}"
    height: "44px"
  card:
    backgroundColor: "{colors.card-on-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  card-on-alt:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.card}"
  tag-pill:
    backgroundColor: "{colors.bg-alt}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "0 13px"
    height: "30px"
  nav-bar:
    backgroundColor: "{colors.nav-bg}"
    textColor: "{colors.navy}"
    height: "{spacing.nav}"
  sheet-menu:
    backgroundColor: "{colors.band}"
    textColor: "{colors.on-band}"
  exec-member:
    backgroundColor: "{colors.card-on-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "14px 16px"
  icon-btn:
    textColor: "{colors.navy}"
    rounded: "{rounded.circle}"
    size: "44px"
  icon-btn-hover:
    backgroundColor: "{colors.hair}"
---

# Design System: 포켓몬 센터 연세점 (Pokémon Center Yonsei)

## Overview

**Creative North Star: "The Club Record in Yonsei Blue"**

This is the club's own world, rebuilt: a printed club record (동아리 기록물) rather than a landing page. One serif voice carries every heading, wordmark, label and numeral; one blue — Yonsei Blue (#003876) — carries every heading, band, button and mark. The page reads as paper: white and a faint cool grey ground, untextured, with surfaces separated by tone and hairlines and never by boxes and borders. The saturated navy appears as full-bleed fields (the 리그 section, the footer, the mobile sheet) that punctuate the paper rather than decorate it.

Density is editorial and generous: 88–152px between sections, a 1180px measure, body text at 17px/1.8 with Korean `word-break: keep-all` so lines break at word boundaries. Facts are stated plainly and typeset with care — 숫자 (dates, counts, dex numbers, 기수 numbers, FAQ numbers) always set in Fraunces italic, light weight, in the softer navy (#2A5589), so the record's numbers read as a single running voice across the page.

The build has moved toward less since the first pass: the trilingual marquee band and the background dot texture are gone, and the first screen no longer opens on the emblem. What is left is the type. The first viewport is now a hairline-flanked `Since 2023 ◓ Yonsei University` label, the tracked serif wordmark whose letter-spacing opens on load, the Korean name, one serif line of description, the navy pill, and the scroll cue. The emblem appears in two places, the top-left of the nav (40px, beside the wordmark) and the footer (64px), both drawing on one inline SVG symbol, `#emblem`. Confirmed rejections, from the user's own words: the concept world (airport signage, "cheap") and the generic Apple-style category standard ("별로"). This world is the incumbent site refined, not replaced.

**Key Characteristics:**
- One serif voice (Noto Serif KR / JP + Fraunces) for every heading, wordmark, label and numeral; Pretendard (KR / JP) for body and UI only.
- One saturated blue, used as full-bleed bands and as heading ink; nothing else is saturated.
- Tone and hairlines separate surfaces; no outlined boxes, no page texture.
- Small tracked uppercase English labels, each carrying a pokéball mark — the incumbent identity, kept by the maintainer's standing instruction.
- Italic Fraunces numerals everywhere a number appears.
- Every font-size in the file is a named token; no literal size is written at a use site.
- One easing curve (`cubic-bezier(.16, 1, .3, 1)`) and three durations; nothing moves under reduced motion.

## Colors

A single institutional blue on cool paper, with a graphite ink family for prose and two Pokémon type dots as the only foreign hues.

### Primary
- **Yonsei Blue** (`{colors.navy}`): the club's core colour. Every heading, section title, label, nav link, pill button, timeline dot and icon. Also the full-bleed band colour (`{colors.band}`) for the 리그 section, the footer and the mobile sheet.
- **Blue Ink** (`{colors.navy-2}`): the numeral colour. Every italic numeral, the focus ring, the group-list bullet ring, and executive role lines.
- **Pressed Blue** (`{colors.navy-hover}`): the navy pill button's hover fill only.
- **Band Tint** (`{colors.band-tint}`): the white-on-navy pill's hover fill, and the only token whose light and dark values are both tints of the band rather than of paper (dark theme `#123A6E`).

### Secondary (on-band family)
- **Band White** (`{colors.on-band}`): text on navy bands.
- **Band Haze** (`{colors.on-band-2}`): secondary text on navy — footer body and legal text, 리그 body copy, sheet numerals and unselected sheet language buttons.
- **Band Sky** (`{colors.on-band-accent}`): one emphasis phrase inside the 리그 tagline. Nothing else.

### Tertiary (dex types)
- **Normal Grey** (`{colors.type-normal}`) and **Flying Blue** (`{colors.type-flying}`): 9px dots on the mascot type chips only. They exist because the dex card is a real Pokémon convention, not as a palette extension.

### Neutral
- **Paper** (`{colors.bg}`) and **Cool Paper** (`{colors.bg-alt}`): alternating section grounds. `.sec.alt` takes Cool Paper; the rhythm alternates down the page.
- **Card surfaces** (`{colors.card}`, `{colors.card-on-bg}`): a card inverts against its ground — white on a Cool Paper section, Cool Paper on a white section. That inversion is the entire card treatment.
- **Ink** (`{colors.ink}`) for body, **Soft Ink** (`{colors.ink-soft}`) for paragraphs under a heading, **Muted Ink** (`{colors.ink-mute}`) for meta lines, counts and captions.
- **Hairline** (`{colors.hair}`): a 12%-navy 1px line, drawn as `box-shadow: inset` on lists, specs and column dividers, and as a 1px background on the timeline rail and section-head rule.
- **Nav glass** (`{colors.nav-bg}`): the scrolled nav's translucent plate, under `backdrop-filter: saturate(160%) blur(16px)`.

Dark theme is a token override on `:root[data-theme="dark"]`, not a second system: navy inverts to a pale blue (`#C6D8F5`) for ink-on-dark headings, the band deepens to `#0D3366`, paper becomes `#0B1422` / `#0F1A2B`, cards `#152238` / `#121E31`. Every class stays the same. Theme is resolved in an inline script before first paint and stored under `pcy-theme`; the device setting is the default.

### Named Rules
**The One Blue Rule.** There is exactly one saturated colour on this site. If a surface needs emphasis, it becomes a navy band or it takes navy type — it never gets a second accent hue.

**The Tone-Not-Border Rule.** Surfaces separate by ground tone, and lists separate by a single hairline. No element gets an outline border; a card is a tonal inversion of its section, nothing more.

**The Band Rule.** Saturated navy appears only as a full-bleed field (리그, footer, mobile sheet). Navy is never a small filled block in the middle of paper — except as a pill button.

**The Bare Paper Rule.** The page ground is flat colour. No texture, pattern, gradient wash or dot grid sits behind content; the ground earns its character from the tone change between sections alone.

## Typography

**Display / Serif:** Fraunces (variable, `opsz` 9–144, ital) for Latin; Noto Serif KR for Korean; Noto Serif JP for Japanese — all three loaded from Google Fonts in one request.
**Body / Sans:** Pretendard Variable, with Pretendard JP Variable for Japanese — both loaded as dynamic-subset stylesheets from jsDelivr.
**Label:** Fraunces at `opsz 14`, 12px, `.3em` tracking, uppercase.

**Character:** A high-contrast editorial serif paired with a neutral Korean UI sans. The serif does all the speaking — wordmark, headings, quotes, English labels, numerals — and Pretendard does all the explaining. Fraunces' optical-size axis is used deliberately: `opsz 144` on display sizes for sharp thin serifs, `opsz 14` on small tracked labels so they stay legible at 12px.

The language switch is a typographic switch. `body[data-lang]` reassigns the serif family (`--serif-kr` / `--serif-en` / `--serif-ja`), reassigns the body sans for Japanese (`--sans-ja`), and resets letter-spacing and line-height per script (`ko` 1.8 / -0.006em, `en` 1.7 / 0, `ja` 1.8 / 0 with `line-break: strict` and `word-break: normal`). English headings also take italic in a few places the Korean does not (hero subtitle, about quote, 리그 tagline, annual list) — the Latin serif is allowed a voice the Korean serif would not carry. Swapping languages fades and blurs the copy for 260ms.

### The size ramp

Every font-size in the stylesheet is a `var()`. The ramp is the complete list; a new surface picks a step from it rather than writing a number.

| Token | Value | Role |
| --- | --- | --- |
| `--t-tiny` | 13px | executive role, department, favourite; spec keys; the nav's small pill |
| `--t-label` | 12px | English labels, nav wordmark, language buttons, tag pills, footer legal |
| `--t-small` | 14px | supporting notes, nav links, counts, captions, footer brand line |
| `--t-ui` | 15px | buttons, text links, footer links, timeline dates, sheet numerals |
| `--t-body` | 17px | all prose (16px ≤640px) |
| `--t-lead` | 19px | section intros, first about paragraph, FAQ questions, join copy (17px ≤640px) |
| `--t-name` | 18px | names, group-list items, FAQ numerals, contact values (17px ≤640px) |
| `--t-num` | 22px | dex numbers, spec values, the Korean mascot name |
| `--t-card-num` | 44px | the activity card's italic numeral |
| `--t-h3` | clamp(21px, 1.9vw, 25px) | timeline and card titles |
| `--t-h4` | clamp(22px, 2vw, 26px) | 기수 labels, sheet menu links |
| `--t-h2` | clamp(34px, 4.4vw, 58px) | section titles |
| `--t-quote` | clamp(46px, 6.4vw, 88px) | the 소개 pull quote |
| `--t-quote-mark` | 96px | the opening quotation glyph above it |
| `--t-hero` | clamp(30px, 5.6vw, 76px) | the hero wordmark |
| `--t-hero-kr` | clamp(18px, 1.7vw, 23px) | the tracked Korean name under it |
| `--t-hero-sub` | clamp(17px, 1.5vw, 20px) | the one-line hero description |
| `--t-tag` | clamp(19px, 1.8vw, 23px) | the annual-events list |
| `--t-ypl-tag` | clamp(21px, 2.4vw, 32px) | the 리그 tagline |
| `--t-mascot` | clamp(38px, 3.6vw, 48px) | the mascot's English name |
| `--t-join` | clamp(42px, 6.2vw, 84px) | the 가입 title |
| `--t-watermark` | clamp(160px, 28vw, 420px) | the `League` watermark |

At ≤640px the ramp itself is re-pointed rather than overridden per rule: `--t-body` 16px, `--t-lead` 17px, `--t-name` 17px.

### Hierarchy
- **Wordmark / Display** (Fraunces 400, `--t-hero`, 1.08, `.16em`): the hero `POKÉMON CENTER YONSEI` only. Tracking narrows to `.1em` under 640px. Always compensated with a negative right margin equal to the tracking so the optical centre is true.
- **Quote** (`--t-quote`, 1.18, -0.025em): the 소개 pull quote; the 가입 title runs one step larger at `--t-join`. One per section at most.
- **Headline** (`--t-h2`, 1.16, -0.02em): `.sec-title`, the Korean section heading beside its English label.
- **Title** (serif 500, `--t-h3`, 1.4): timeline entry titles and card titles. 기수 labels and sheet links run at `--t-h4`; FAQ questions at `--t-lead`.
- **Lead** (Pretendard 400, `--t-lead`, 1.75): section intros and the first paragraph of the about body.
- **Body** (Pretendard 400, `--t-body`, 1.8, -0.006em): all prose. Korean sets with `word-break: keep-all`.
- **UI** (Pretendard 600, `--t-ui`, `.02em`): pills, text links, footer links.
- **Label** (Fraunces 500, `--t-label`, `.3em`, uppercase): the tracked English section labels. The nav wordmark and footer wordmark use the same face at `.24em`, the copyright line at `.18em`, the language buttons at `.16em`.
- **Numeral** (Fraunces italic 300, `opsz 144`, lining figures, Blue Ink): `01`–`03` card numbers at `--t-card-num`, `№ 0627` dex numbers and spec values at `--t-num`, FAQ numbers at `--t-name`, sheet menu numbers at `--t-ui`. Tabular figures (`.num`, `font-variant-numeric: tabular-nums`) on dates, counts and phone numbers.

### Named Rules
**The Serif-Speaks Rule.** Anything that names something — wordmark, heading, label, quote, group-list item, number — is serif. Anything that explains — paragraphs, nav links, buttons, meta, form UI — is Pretendard. Two voices only: the serif has a cut per script (KR / EN / JA) and the sans has two (KR, JP), but a third voice is never introduced.

**The Named Size Rule.** No font-size literal is written at a use site. Every size is one of the `--t-*` tokens above; a responsive change re-points the token at the breakpoint instead of overriding the rule.

**The Italic Numeral Rule.** Every number visible on the page is Fraunces italic 300 in Blue Ink. Dates, dex numbers, 기수, FAQ indices, heights and weights. A number set in the body sans is a defect.

**The Tracked Label Rule.** English section labels are set at `--t-label` / `.3em` / uppercase with a 14px pokéball mark at `gap: 12px`. They are design elements of the incumbent identity and are never translated into Korean or Japanese by the i18n dictionary.

## Layout

A single centred measure: `.wrap` is `max-width: calc(1180px + 2 × gutter)` with a fluid gutter `clamp(20px, 4vw, 48px)`. Sections run `clamp(88px, 11vw, 152px)` of vertical padding and alternate ground tone via `.sec.alt`; `scroll-margin-top` compensates for the fixed 68px nav (60px under 640px).

The first screen is `min(100svh, 920px)`, centred, and opens directly on type: a hairline-flanked meta row (`36px rule — Since 2023 — pokéball — Yonsei University — 36px rule`), then the wordmark, the Korean name, the description, the CTAs and the scroll cue. No image sits in the hero.

The section head is a baseline-aligned flex row — tracked English label, then Korean title — with `gap: 14px 28px` and `clamp(44px, 5.4vw, 72px)` beneath. `.sec-head.center` stacks and centres the same parts for 리그 and 가입. Intros pull up by 55% of that head gap so the label / title / intro reads as one block.

Grids: activities 3 columns at 20px, mascots 2 columns at 20px inside a 1040px cap, subgroups 2 columns, contacts 3 columns, footer 1.5fr / 1fr / 1fr, executive members `auto-fill minmax(260px, 1fr)` at 10px. The timeline is a 150px date column plus body with a hairline rail at 150px and a 9px ringed dot per entry, the last one filled solid.

**Breakpoints** (max-width):
- **1120px** — desktop nav links, language buttons and theme button hide; the hamburger and the navy sheet menu take over (and the sheet is `display: none` above 1121px).
- **900px** — about, activities, subgroups, mascots, contacts and footer collapse to single or two columns; the contact divider flips from vertical to horizontal.
- **640px** — nav shrinks to 60px, the body / lead / name steps of the ramp drop one size, the wordmark abbreviates to `PCY`, wordmark tracking narrows to `.1em`, the timeline collapses to a single left-rail column, the section head stacks left-aligned, 기수 rows shorten to 72px, executive members go one column, hero CTAs stack.

Motion: one easing curve `cubic-bezier(.16, 1, .3, 1)` and three durations — `220ms` (colour and hover), `420ms` (fades, theme change, card lift), `720ms` (travel: underline wipes, accordion rows, sheet clip-path, mascot art). Reveal on scroll is opacity + 22px rise, staggered by `--d × 100ms`. Under `prefers-reduced-motion: reduce` every animation and transition collapses to `.01ms` and reveals render at rest. Print hides the nav, sheet, skip link and scroll cue and forces every accordion open.

### Named Rules
**The Alternating Ground Rule.** Sections alternate `{colors.bg}` and `{colors.bg-alt}` down the page, and a card always takes the opposite ground of its section. Two adjacent sections never share a tone.

**The One Curve Rule.** Every transition and animation on the page uses `--ease` at `--t1`, `--t2` or `--t3`. A new bezier or a new duration is not a new component's prerogative.

## Elevation & Depth

Near-flat by design. Depth comes from tonal layering (paper → alt paper → card) and from 1px hairlines drawn as inset box-shadows, not from stacked shadows. Nothing carries a resting shadow. Three things lift on interaction — a hovered activity card, a hovered pill button, a hovered executive tile — and the scrolled nav plate fades in a 1px hairline plus backdrop blur rather than a drop shadow.

### Shadow Vocabulary
- **Lift** (`--shadow`: `0 1px 2px rgba(0, 30, 70, .05), 0 18px 40px -22px rgba(0, 30, 70, .28)`): an activity card on hover, paired with a 4px rise. Dark theme swaps to a black-based pair of the same geometry.
- **Button lift** (`box-shadow: 0 12px 28px -14px rgba(0, 40, 90, .6)`): navy pill buttons on hover only.
- **Hairline** (`box-shadow: inset 0 -1px 0 var(--hair)`, or `inset 0 1px 0` / `inset 1px 0 0`): every divider in the system — list rows, accordion rows, spec rails, contact column dividers, footer bottom rule. On navy bands the hairline becomes `rgba(255,255,255,.14–.16)`.
- **Ring** (`box-shadow: inset 0 0 0 1.5px …`): hollow 9px timeline dots (Yonsei Blue) and 7px group-list bullets (Blue Ink). The last timeline dot fills solid instead.

### Named Rules
**The Flat-At-Rest Rule.** No surface carries a shadow at rest. Every shadow in the system is a response to hover, and the page must read correctly with all of them removed.

**The Inset Hairline Rule.** Dividers are inset box-shadows, never `border`. A border would change the box and is the incumbent's bordered-box habit the rebuild removed.

## Shapes

Two radii, a pill and a circle. Cards, mascot cards and executive member tiles take a generous 20px (`{rounded.card}`); the focus ring rounds at 10px (`{rounded.s}`); anything interactive and text-bearing takes a full pill (`999px`) — buttons, tag pills, the copy button, the skip link. Circles are structural: the 40px nav emblem, the 64px footer emblem, the 44px icon buttons, the 36px accordion chevron buttons, the 64px executive Pokémon well, the 9px timeline dots, the 7px group-list ring, the 9px type dots, the 6px department dot, and the pokéball mark itself.

The pokéball is the system's one recurring silhouette: a single 24px SVG symbol (`#i-ball`) drawn with presentation attributes (`fill="currentColor"`, `stroke="currentColor"`, `stroke-width="1.4"`) so it inherits the text colour of whatever label carries it, used at 14px beside labels and in the hero meta row. All other icons are inline SVG from one `<defs>` sprite (arrow, external, sun, moon, copy, check, plus/chevron) with 1.6–1.8px round-cap strokes inherited from `.ic`.

### Japanese line breaking

Japanese text breaks at phrase boundaries, not at arbitrary characters: `@supports (word-break: auto-phrase)` applies `word-break: auto-phrase` to `body[data-lang="ja"]` paragraphs, intros, section titles, the quote and the join title. Korean keeps `word-break: keep-all`; English wraps normally. All three languages are checked for orphan last lines at 1440px and 390px.

### Fixed ink on white

`--band-ink` (#003876 in both themes) is the text colour of the white pill on a navy ground. It does not follow the theme, because the pill stays white in both.

## Components

### Buttons
- **Shape:** full pill (`{rounded.pill}`), minimum 52px tall (38px for `.pill-sm` in the nav, at `--t-tiny`).
- **Primary (`.pill`):** navy band fill, white text, Pretendard 600 at `--t-ui` with `.02em`, 28px horizontal padding, 12px gap to a 17px stroked arrow.
- **Hover / Focus:** fill deepens to Pressed Blue, a soft button lift appears, and the arrow slides 4px right (an external-link glyph slides 3px up-right instead). Hover treatments are all inside `@media (hover: hover)` so touch never sticks them. Active presses to `scale(.97)`. Focus-visible draws a 2px Blue Ink ring at 3px offset with a 10px radius, switched to white inside navy bands.
- **On-band (`.pill.white`):** white fill, navy text, hovering to Band Tint. Used once, in the 리그 section. The same inversion is applied to the nav pill while the mobile sheet is open.
- **Text link (`.link`):** navy, 600 at `--t-ui`, 44px tall, with a 1px underline that wipes in from the left over 720ms on hover and out to the right on leave. The same wipe underlines nav links and contact values.

### Chips
- **Activity tag (`.tag span`):** 30px pill, Cool Paper fill (inverted to Paper on white sections), navy Fraunces at `--t-label` / `.24em` uppercase, pinned to the bottom of the card by `margin-top: auto`. A one-word category, never a sentence.
- **Type chip (`.type-chip`):** text plus a 9px coloured dot from the dex type palette; no fill, no border.

### Cards / Containers
- **Corner Style:** 20px.
- **Background:** inverted against the section ground (white card on Cool Paper, Cool Paper card on white).
- **Shadow Strategy:** flat at rest; `.card.lift` rises 4px with the Lift shadow on hover. Mascot cards do not lift — their artwork does.
- **Border:** none.
- **Internal Padding:** `clamp(28px, 3vw, 40px)`.

### Navigation
- **Desktop:** fixed, 68px, transparent over the hero. On scroll a `::before` plate fades in — 82% paper, `saturate(160%) blur(16px)`, 1px hairline underneath. Left: the 40px circular emblem and, 12px after it, `POKÉMON CENTER YONSEI` in Fraunces `--t-label` / `.24em` (`PCY` under 640px), one link to the top. Right: Korean section links (Pretendard `--t-small` / `.03em`, 44px tall, wipe underline on hover), a KO / EN / JA group in Fraunces `--t-label` / `.16em` (muted until selected or hovered), a 44px circular theme toggle, and a navy 가입하기 pill.
- **Active section:** `.is-here` holds the link's underline fully drawn (left origin), driven by scroll position.
- **Mobile (≤1120px):** a two-bar hamburger whose bars cross into an X, over a full-screen navy sheet revealed by `clip-path: inset(0 0 100% 0) → inset(0)` over 720ms. Inside: eight 58px serif links at `--t-h4`, each prefixed by its italic numeral and staggered in at `120ms + i × 40ms`; a footer strip with full language names and the theme toggle. While the sheet is open the nav's wordmark and icons invert to white, the pill inverts to white-on-navy-text, the nav plate hides, and the body locks scroll.

### Hero
Centred column, type only: the hairline-flanked meta row, the wordmark, the Korean name at `.32em` (`.24em` in Japanese), a serif one-line description, then the navy pill plus a YPL text link, then the scroll cue. Everything rises and fades in on load at `--d × 120ms + 100ms`; the wordmark instead opens its tracking from `.04em` to `.16em` over 1.8s at a 260ms delay — the signature moment, re-targeted to `.1em` under 640px. The scroll cue is a `Scroll` label at `--t-label`, 60% opacity, above a 48px hairline down which a navy segment falls on a 2.4s loop.

### Accordions (executives and FAQ)
One mechanism, two dressings. A full-width button row (84px for 기수, 80px for FAQ) in a grid, with a 36px circular chevron button on the right whose vertical stroke rotates 90° when open; the panel is a `grid-template-rows: 0fr → 1fr` transition over 720ms with the inner content fading and rising at a 90–100ms delay. Rows are separated by inset hairlines only, and the list as a whole is capped top and bottom by one.

- **기수 rows** carry the 기수 label at `--t-h4` and its member count in muted ink — no index numeral. Eight generations are listed newest first (8기 … 1기); 8기 is open on load and holds 12 members. Each panel opens into department blocks (a 6px navy dot plus the department name) and member tiles.
- **Member tile (`.exec-member`)**: a 64px circular well on Paper holding a 58px PokeAPI HOME render (128×128 source for the newer entries, 192×192 for the older ones, all embedded), then serif name at `--t-name`, Blue Ink role at `--t-tiny` / `.06em`, muted meta and favourite lines. 20px radius, Cool Paper fill, rises 2px on hover.
- **FAQ rows** carry their italic number in a 64px column and answers indent to match (76px, 52px on mobile).

### Dex-style mascot card
A 20px card with a hairlined top row — italic `№ 0627` left, form right — then a 260px square artwork block, the English name in Fraunces italic at `--t-mascot`, the Korean or Japanese name beneath at `--t-num` (hidden in English), the category, the two type chips, a hairline-railed height/weight spec row in italic numerals, and a one-line description. The artwork lifts 6px and scales 1.03 on hover.

### League band
A full-bleed navy section with a giant `League` watermark in Fraunces italic at `--t-watermark` in `rgba(255,255,255,.032)`, centred and behind the content. Label and title turn white, one phrase in the tagline takes Band Sky, the body takes Band Haze, and the single white pill leads offsite.

### Join and contacts
Centred: tracked label, a serif title at `--t-join`, a supporting line with a serif flourish beneath, the navy mailto pill, a wrapped facts row (`회비`, `가입 대상`, `모집 시기` — muted keys, ink values), then a three-column contact table bounded top and bottom by hairlines with vertical hairline dividers (horizontal below 900px). Email carries a copy button that swaps its icon to a check and turns navy in the done state.

### Footer
The navy band that closes the page: 64px circular emblem image, tracked wordmark, one-line description in Band Haze, an Explore column and a Contact column under tracked labels, then a hairlined bottom row with `© 2023–2026 POKÉMON CENTER YONSEI` in Fraunces `--t-label` / `.18em` and the Pokémon trademark disclaimer in Band Haze.

## Do's and Don'ts

### Do:
- **Do** set every heading, label, quote and number in the serif and every paragraph and control in Pretendard, and switch the serif and sans by `body[data-lang]` for ko / en / ja.
- **Do** pick every font-size from the `--t-*` ramp; if a new surface needs a size the ramp lacks, add a named token with a role comment rather than a literal.
- **Do** set every visible number in Fraunces italic 300 `opsz 144` in Blue Ink (`{colors.navy-2}`), with tabular figures on dates, counts and phone numbers.
- **Do** give each section a tracked uppercase English label with the 14px pokéball mark, and leave those labels untranslated across all three dictionaries.
- **Do** alternate section grounds with `.sec.alt` and invert card fills against their ground.
- **Do** draw every divider as an inset hairline box-shadow in `{colors.hair}`.
- **Do** keep saturated navy to full-bleed bands and pill buttons.
- **Do** use the one easing curve with `--t1` / `--t2` / `--t3`, put hover treatments behind `@media (hover: hover)`, and make sure the surface is still complete when `prefers-reduced-motion` kills all of it.
- **Do** keep every interactive target at least 44px tall and every focus-visible ring at 2px / 3px offset, white inside navy bands.
- **Do** use the club's own assets as they are: the emblem (nav and footer, embedded once as the SVG symbol `#emblem`), the two mascot renders (embedded once each as `.art-rufflet` / `.art-braviary` background images and reused), the executive Pokémon renders, the favicons and `og.png`.
- **Do** state facts plainly in all three languages together, with matching key sets and Korean HTML defaults.

### Don't:
- **Don't** introduce a second accent hue. The dex type dots exist only inside mascot type chips.
- **Don't** put a `border` on a surface. Tone and inset hairlines do the separating.
- **Don't** introduce a third type voice, and don't set a heading, label or number in Pretendard. Adding a per-script cut of the existing serif or sans is not a third voice; a new typeface is.
- **Don't** lay texture, pattern or gradient over the page ground.
- **Don't** use middle-dot (·) separators anywhere, in any language.
- **Don't** use emoji — flag, pokéball or otherwise — as an icon. Icons are inline SVG from the one sprite, and the pokéball mark inherits `currentColor` rather than carrying its own fill.
- **Don't** redraw the club emblem or the mascot artwork, or re-embed either render a second time.
- **Don't** give any surface a resting shadow.
- **Don't** translate the English section labels, the wordmark, or the `League` watermark.
- **Don't** add a new easing curve or duration for a new component.
