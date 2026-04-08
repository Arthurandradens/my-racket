# Design System & Redesign — "Electric Court"

**Date:** 2026-04-07
**Status:** Approved

## Overview

Define a centralized design system for the My Racket project and redesign the UI with the "Electric Court" aesthetic — dark, energetic, sporty. Also fix the quiz color visibility issue and implement a personalized result experience with loading animation and profile-based report.

**Target audience:** Both beginner and advanced tennis players, primarily mobile users.

---

## 1. Design System Tokens

All values defined as CSS custom properties in `globals.css` and consumed via Tailwind's `@theme` directive.

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0f0f0f` | Page background |
| `--color-bg-elevated` | `#1a1a1a` | Cards, elevated sections |
| `--color-bg-subtle` | `#252525` | Hover states, inputs |
| `--color-surface` | `#2d2d2d` | Borders, dividers |
| `--color-primary` | `#ff6b35` | CTAs, links, primary accents |
| `--color-primary-hover` | `#ff8c42` | Primary hover state |
| `--color-accent` | `#f7c948` | Highlights, badges, scores |
| `--color-text` | `#f5f5f5` | Primary text |
| `--color-text-secondary` | `#999999` | Secondary text |
| `--color-text-muted` | `#666666` | Labels, placeholders |
| `--color-success` | `#22c55e` | Positive indicators |
| `--color-danger` | `#ef4444` | Errors |

### Typography

- **Display/Headlines:** Oswald (Google Fonts) — bold, uppercase
- **Body/UI:** DM Sans (Google Fonts) — clean, readable
- **Scale:** `text-4xl` / `text-2xl` / `text-xl` / `text-base` / `text-sm` / `text-xs`
- **Mobile headlines:** Scale down from `text-4xl` → `text-2xl` on small screens

### Component Patterns

- **Buttons primary:** `bg-primary text-white rounded uppercase tracking-wide font-bold` — no `rounded-full`, squared-off is more aggressive
- **Buttons secondary:** `border border-surface text-text-secondary rounded`
- **Cards:** `bg-elevated border border-surface rounded-lg`
- **Inputs:** `bg-subtle border border-surface rounded-lg text-text`
- **Score bars:** Gradient `primary → accent`
- **Hover glow:** `box-shadow: 0 0 20px rgba(255, 107, 53, 0.2)`
- **Transitions:** `transition-all duration-300 ease`

### Decorative Elements

- Diagonal shapes using `clip-path: polygon(...)` on hero sections
- Subtle glow radials as background atmosphere
- Grid pattern overlay on dark sections: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)`

---

## 2. Mobile-First Approach

All components are designed mobile-first and adapted upward with `sm:` / `md:` / `lg:` breakpoints.

### Principles

- Touch targets minimum 44x44px
- Typography scales: `text-2xl` mobile → `text-5xl` desktop for headlines
- Full-width CTAs on mobile, inline on desktop
- Stack layouts vertically on mobile, horizontal on desktop

### Component Breakpoints

| Component | Mobile | Desktop |
|-----------|--------|---------|
| Hero | Vertical stack, full-width CTA, smaller diagonal | Full diagonal layout |
| How It Works | Stacked cards | 3-column grid |
| Stats Strip | 2x2 grid | Single row |
| Quiz options | Full-width cards, `py-5 px-4`, `gap-4` | Centered with max-width |
| Result cards | Full-width stack | Wider layout with spacing |
| Header | Hamburger menu | Horizontal nav |

---

## 3. Home Page Restructure

### Sections (top to bottom)

1. **Header** — Transparent on top, `bg-elevated` on scroll. Logo in `accent` color. Hamburger on mobile, horizontal nav on desktop.

2. **Hero** — Dark background with diagonal `clip-path` shapes in `primary`/`accent`. Oswald headline "Encontre sua raquete ideal". DM Sans subtitle. Two CTAs: "Fazer Quiz" (primary) + "Ver Catalogo" (outline). Decorative glow effect.

3. **How It Works** — 3 step cards in `bg-elevated` with numbered icons in `accent`. Steps: "Responda o quiz" → "Analisamos seu perfil" → "Receba recomendacoes". Stacked on mobile, 3-col on desktop.

4. **Stats Strip** — Impactful numbers: "1000+ raquetes", "6 metricas de analise", "3 niveis de jogador". Oswald large numbers + `accent` color. 2x2 grid mobile, row on desktop.

5. **Final CTA** — Section with diagonal gradient, "Pronto para encontrar sua raquete?" + quiz button.

6. **Footer** — `bg-[#0a0a0a]`, column layout, logo in `accent`.

---

## 4. Quiz Redesign

### Visual Fix (Color Problem)

The current quiz uses light-mode colors (dark text on assumed-white background). All quiz text must use `text` token (#f5f5f5) on `bg` (#0f0f0f). Option cards use `bg-elevated` with `border-surface`.

### Quiz UI

- Dark background with subtle diagonal decorative elements
- Progress bar: gradient `primary → accent` (orange → gold), animated width
- Step indicator: "Pergunta 3 de 6" in `text-secondary`
- Question text: Oswald uppercase, `text-text`
- Option buttons: `bg-elevated`, `border-surface`, `rounded-lg`, `py-5 px-4` on mobile
  - Hover: border glows `primary`, subtle `box-shadow`
  - Selected: `border-primary`, `bg-subtle`
- Gap between options: `gap-4` minimum (touch-friendly)

### Personalized Result Experience

Three-phase transition from quiz completion to results:

#### Phase 1 — Loading Animation (4-6 seconds)

Full-screen dark overlay with centered content:
- Sequential messages with fade-in animation (each ~1.5s):
  1. "Analisando seu perfil de jogo..."
  2. "Cruzando dados com 1.000+ raquetes..."
  3. "Calculando compatibilidade..."
- Animated progress bar with gradient `primary → accent`
- Pulsing racket icon or chart graphic
- Implementation: CSS animations with `animation-delay`, no external libraries needed

#### Phase 2 — Result Reveal (staggered entrance)

- Racket cards enter one by one with slide-up + fade-in (`animation-delay` stagger)
- Score bars animate from 0 to final value (CSS `@keyframes` width transition)
- Score numbers count up effect (JS counter animation)

#### Phase 3 — Personalized Report

A report block at the top of results, generated from quiz answers:

- **Profile title:** e.g., "Perfil: Jogador Agressivo de Fundo de Quadra"
- **Description text:** e.g., "Baseado no seu estilo agressivo com foco em topspin e preferencia por raquetes leves, identificamos 3 raquetes com alta compatibilidade para o seu jogo."
- **Profile tags:** Visual badges derived from answers, e.g., `Agressivo`, `Topspin`, `Intermediario`

The text is assembled by mapping each quiz answer to descriptive fragments. The combination of fragments creates a unique-feeling description for each answer set. This is NOT AI-generated — it's template-based string composition using the user's actual answers.

**Answer-to-profile mapping (examples):**

| Answer Category | Answer | Profile Fragment |
|----------------|--------|-----------------|
| Level | iniciante | "jogador iniciante" |
| Level | avancado | "jogador experiente" |
| Play style | agressivo | "estilo agressivo" |
| Play style | defensivo | "jogo defensivo e consistente" |
| Main shot | topspin | "foco em topspin" |
| Main shot | flat | "preferencia por bolas chapadas" |
| Budget | alto | "sem restricao de orcamento" |
| Budget | baixo | "buscando melhor custo-beneficio" |

The full mapping must cover every answer option in `src/lib/quiz-config.ts` across all three level paths (iniciante, intermediario, avancado). The examples above are illustrative — the implementation must map all options to produce coherent profile text for any valid answer combination.

The loading + template approach makes every result feel individually analyzed and generated, even though the recommendation engine runs instantly.

---

## 5. Technical Implementation Notes

### Design System Location

- CSS variables and Tailwind theme: `src/app/globals.css`
- Extend Tailwind via `@theme` directive in globals.css (Tailwind v4 approach)
- Google Fonts loaded in `src/app/layout.tsx` via `next/font/google`

### No New Dependencies

- Loading animations: CSS-only (`@keyframes`, `animation-delay`)
- Score counter: Vanilla JS in component
- Profile text: Template literals in `src/lib/engine.ts` or new `src/lib/profile.ts`

### Files to Modify

- `src/app/globals.css` — Design tokens, theme, base styles
- `src/app/layout.tsx` — Font imports (Oswald, DM Sans), dark body
- `src/app/page.tsx` — Home page redesign
- `src/components/Header.tsx` — Dark theme, scroll behavior, mobile menu
- `src/components/Footer.tsx` — Dark theme update
- `src/components/QuizStep.tsx` — Dark theme, color fix, improved touch targets
- `src/app/quiz/page.tsx` — Loading transition state
- `src/app/resultado/page.tsx` — Personalized report, animated reveals
- `src/components/RacketCard.tsx` — Dark theme card
- `src/components/ScoresBar.tsx` — Gradient animation

### New Files

- `src/lib/profile.ts` — Quiz answer-to-profile mapping and text generation

### Pages That Need Theme Update (but no structural change)

- `src/app/raquetes/page.tsx` — Catalog: dark bg, card styling
- `src/app/comparar/page.tsx` — Compare: dark table styling
- `src/app/raquete/[slug]/page.tsx` — Detail: dark theme
