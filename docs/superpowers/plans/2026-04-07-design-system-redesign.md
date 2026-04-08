# Electric Court Design System & Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a centralized design system with the "Electric Court" dark aesthetic and redesign all pages — including fixing quiz visibility, adding personalized result experience with loading animation and profile report.

**Architecture:** CSS custom properties defined in `globals.css` via Tailwind v4 `@theme inline` directive. Google Fonts (Oswald + DM Sans) loaded via `next/font/google` in the root layout. All components updated to consume design tokens through Tailwind utility classes. New `profile.ts` module handles quiz-answer-to-text mapping.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript, next/font/google

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/app/globals.css` | Modify | Design tokens, @theme, base styles, keyframe animations |
| `src/app/layout.tsx` | Modify | Oswald + DM Sans font imports, dark body classes |
| `src/components/Header.tsx` | Modify | Dark theme, scroll-aware bg, mobile menu |
| `src/components/Footer.tsx` | Modify | Dark theme, accent colors |
| `src/app/page.tsx` | Modify | Full home page redesign (hero, how-it-works, stats, CTA) |
| `src/components/QuizStep.tsx` | Modify | Dark theme, gradient progress bar, touch targets |
| `src/app/quiz/page.tsx` | Modify | Dark bg, loading transition on complete |
| `src/lib/profile.ts` | Create | Quiz answer-to-profile text mapping |
| `src/app/resultado/page.tsx` | Modify | Loading animation, personalized report, animated reveals |
| `src/components/RacketCard.tsx` | Modify | Dark card theme |
| `src/components/ScoresBar.tsx` | Modify | Gradient bar, dark theme |
| `src/components/AffiliateButton.tsx` | Modify | Primary color token |
| `src/app/raquetes/page.tsx` | Modify | Dark theme for catalog |
| `src/app/comparar/page.tsx` | Modify | Dark theme for comparator |
| `src/app/raquete/[slug]/page.tsx` | Modify | Dark theme for detail page |
| `src/components/CompareTable.tsx` | Modify | Dark table theme |
| `src/components/SpecsTable.tsx` | Modify | Dark table theme |

---

## Task 1: Design System Foundation — globals.css + layout.tsx

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace globals.css with design tokens and theme**

```css
@import "tailwindcss";

:root {
  --color-bg: #0f0f0f;
  --color-bg-elevated: #1a1a1a;
  --color-bg-subtle: #252525;
  --color-surface: #2d2d2d;
  --color-primary: #ff6b35;
  --color-primary-hover: #ff8c42;
  --color-accent: #f7c948;
  --color-text: #f5f5f5;
  --color-text-secondary: #999999;
  --color-text-muted: #666666;
  --color-success: #22c55e;
  --color-danger: #ef4444;
}

@theme inline {
  --color-bg: var(--color-bg);
  --color-bg-elevated: var(--color-bg-elevated);
  --color-bg-subtle: var(--color-bg-subtle);
  --color-surface: var(--color-surface);
  --color-primary: var(--color-primary);
  --color-primary-hover: var(--color-primary-hover);
  --color-accent: var(--color-accent);
  --color-text: var(--color-text);
  --color-text-secondary: var(--color-text-secondary);
  --color-text-muted: var(--color-text-muted);
  --color-success: var(--color-success);
  --color-danger: var(--color-danger);
  --font-display: var(--font-oswald);
  --font-body: var(--font-dm-sans);
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body), sans-serif;
}

/* Keyframes for loading animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes growWidth {
  from {
    width: 0%;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
```

- [ ] **Step 2: Update layout.tsx with Oswald + DM Sans fonts**

Replace the entire `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Oswald, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "My Racket — Encontre a raquete ideal para voce",
  description:
    "Responda nosso quiz rapido e descubra qual raquete de tenis combina com o seu nivel, estilo de jogo e orcamento. Mais de 1000 raquetes avaliadas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${oswald.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="flex flex-col min-h-screen bg-bg text-text font-body">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build compiles**

Run: `cd /Users/anakin/projects-arthur/my-racket && npx next build 2>&1 | tail -20`

Expected: Build succeeds (pages may look broken visually but no compile errors).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: add Electric Court design system tokens and fonts"
```

---

## Task 2: Header — Dark Theme + Scroll Behavior

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Replace Header.tsx**

```tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-bg-elevated border-b border-surface" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-bold text-accent uppercase tracking-wider hover:text-primary transition-colors"
          >
            My Racket
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/quiz"
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              Quiz
            </Link>
            <Link
              href="/raquetes"
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              Raquetes
            </Link>
            <Link
              href="/comparar"
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              Comparar
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-primary transition-colors"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-surface bg-bg-elevated">
          <nav className="flex flex-col px-4 py-3 gap-1">
            <Link href="/quiz" className="py-3 px-3 rounded-md text-sm font-medium text-text-secondary hover:text-primary hover:bg-bg-subtle transition-colors" onClick={() => setMenuOpen(false)}>
              Quiz
            </Link>
            <Link href="/raquetes" className="py-3 px-3 rounded-md text-sm font-medium text-text-secondary hover:text-primary hover:bg-bg-subtle transition-colors" onClick={() => setMenuOpen(false)}>
              Raquetes
            </Link>
            <Link href="/comparar" className="py-3 px-3 rounded-md text-sm font-medium text-text-secondary hover:text-primary hover:bg-bg-subtle transition-colors" onClick={() => setMenuOpen(false)}>
              Comparar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Verify the header renders**

Run: `cd /Users/anakin/projects-arthur/my-racket && npx next build 2>&1 | tail -10`

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: redesign header with dark theme and scroll behavior"
```

---

## Task 3: Footer — Dark Theme

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Replace Footer.tsx**

```tsx
import { RACQIX_ATTRIBUTION } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-text-secondary mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Site name & description */}
          <div className="max-w-sm">
            <p className="font-display text-xl font-bold text-accent uppercase tracking-wider mb-2">
              My Racket
            </p>
            <p className="text-sm leading-relaxed text-text-muted">
              Encontre a raquete de tenis ideal para o seu jogo com base no seu
              nivel, estilo de jogo e preferencias pessoais.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-semibold text-text mb-1">Navegacao</p>
            <a href="/quiz" className="hover:text-primary transition-colors">Quiz</a>
            <a href="/raquetes" className="hover:text-primary transition-colors">Raquetes</a>
            <a href="/comparar" className="hover:text-primary transition-colors">Comparar</a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-surface mt-8 pt-6 flex flex-col gap-3 text-xs text-text-muted">
          <p>
            <strong className="text-text-secondary">Aviso de afiliados:</strong> Alguns
            links neste site sao links de afiliados. Isso significa que podemos
            receber uma comissao sem custo adicional para voce se voce fizer uma
            compra atraves desses links. Nossas recomendacoes sao sempre
            baseadas em analises imparciais.
          </p>
          <p>{RACQIX_ATTRIBUTION}</p>
          <p>
            &copy; {new Date().getFullYear()} My Racket. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: redesign footer with dark theme"
```

---

## Task 4: Shared Components — ScoresBar, RacketCard, AffiliateButton

**Files:**
- Modify: `src/components/ScoresBar.tsx`
- Modify: `src/components/RacketCard.tsx`
- Modify: `src/components/AffiliateButton.tsx`

- [ ] **Step 1: Replace ScoresBar.tsx**

```tsx
interface ScoresBarProps {
  label: string;
  value: number | null;
  animate?: boolean;
}

export default function ScoresBar({ label, value, animate = false }: ScoresBarProps) {
  if (value === null) return null;

  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-xs text-text-secondary shrink-0">{label}</span>
      <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
          style={{
            width: `${pct}%`,
            ...(animate ? { animation: "growWidth 1s ease-out forwards" } : {}),
          }}
        />
      </div>
      <span className="w-8 text-xs font-semibold text-text text-right shrink-0">
        {Math.round(value)}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Replace AffiliateButton.tsx**

```tsx
import { generateAffiliateLink } from "@/lib/affiliate";

interface AffiliateButtonProps {
  brand: string;
  model: string;
}

export default function AffiliateButton({ brand, model }: AffiliateButtonProps) {
  const href = generateAffiliateLink(brand, model);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      Comprar
    </a>
  );
}
```

- [ ] **Step 3: Replace RacketCard.tsx**

```tsx
import Link from "next/link";
import type { Racket } from "@/lib/types";
import AffiliateButton from "./AffiliateButton";

interface RacketCardProps {
  racket: Racket;
  score?: number;
  reasons?: string[];
  showCompareButton?: boolean;
  onAddToCompare?: (racket: Racket) => void;
}

export default function RacketCard({
  racket,
  score,
  reasons,
  showCompareButton = false,
  onAddToCompare,
}: RacketCardProps) {
  const { slug, brand, model, weight, head_size, ra, price_brl } = racket;

  const specs: { label: string; value: string | null }[] = [
    weight !== null ? { label: `${weight}g`, value: null } : null,
    head_size ? { label: `${head_size} in²`, value: null } : null,
    ra ? { label: `RA ${ra}`, value: null } : null,
  ].filter(Boolean) as { label: string; value: string | null }[];

  return (
    <div className="bg-bg-elevated border border-surface rounded-lg hover:border-primary/30 transition-all duration-300 p-5 flex flex-col gap-4 hover:shadow-[0_0_20px_rgba(255,107,53,0.1)]">
      {/* Brand & model */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-0.5">
          {brand}
        </p>
        <Link
          href={`/raquete/${slug}`}
          className="text-lg font-bold text-text hover:text-primary transition-colors leading-snug"
        >
          {model}
        </Link>
      </div>

      {/* Match score badge */}
      {score !== undefined && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center bg-primary/10 text-accent font-bold text-sm px-3 py-1 rounded border border-primary/20">
            {Math.round(score)}% match
          </span>
        </div>
      )}

      {/* Specs chips */}
      {specs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {specs.map((s) => (
            <span
              key={s.label}
              className="bg-bg-subtle text-text-secondary text-xs font-medium px-3 py-1 rounded"
            >
              {s.label}
            </span>
          ))}
        </div>
      )}

      {/* Reasons */}
      {reasons && reasons.length > 0 && (
        <ul className="flex flex-col gap-1">
          {reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="text-primary mt-0.5 shrink-0">&#10003;</span>
              {reason}
            </li>
          ))}
        </ul>
      )}

      {/* Price */}
      {price_brl !== null && (
        <p className="text-base font-bold text-text">
          R${" "}
          {price_brl.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 mt-auto pt-1">
        <AffiliateButton brand={brand} model={model} />

        {showCompareButton && onAddToCompare && (
          <button
            type="button"
            onClick={() => onAddToCompare(racket)}
            className="inline-flex items-center justify-center border border-surface text-text-secondary font-semibold text-sm px-4 py-2.5 rounded hover:border-primary hover:text-primary transition-colors"
          >
            + Comparar
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `cd /Users/anakin/projects-arthur/my-racket && npx next build 2>&1 | tail -10`

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/ScoresBar.tsx src/components/RacketCard.tsx src/components/AffiliateButton.tsx
git commit -m "feat: update shared components to Electric Court theme"
```

---

## Task 5: Home Page Redesign

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace page.tsx with redesigned home**

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-bg overflow-hidden py-20 sm:py-28 px-4">
        {/* Diagonal decorative elements */}
        <div
          className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-bl from-primary to-accent opacity-80"
          style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-tr from-primary to-primary-hover opacity-50"
          style={{ clipPath: "polygon(0 100%, 0 0, 100% 100%)" }}
        />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-display text-xs sm:text-sm uppercase tracking-[4px] text-accent mb-4">
            My Racket
          </p>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase leading-tight mb-6 text-text">
            Encontre sua{" "}
            <span className="text-primary">raquete ideal</span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary mb-10 max-w-xl leading-relaxed">
            Algoritmo inteligente que analisa seu estilo de jogo e encontra o
            match perfeito entre mais de 1.000 raquetes avaliadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/quiz"
              className="inline-block bg-primary text-white font-bold text-sm sm:text-base px-8 py-4 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors text-center"
            >
              Fazer Quiz
            </Link>
            <Link
              href="/raquetes"
              className="inline-block border border-surface text-text-secondary font-semibold text-sm sm:text-base px-8 py-4 rounded hover:border-primary hover:text-primary transition-colors text-center"
            >
              Ver Catalogo
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 sm:py-20 px-4 bg-bg-elevated">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-text uppercase tracking-wide mb-12 sm:mb-14">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                num: "01",
                title: "Quiz",
                desc: "Responda perguntas rapidas sobre seu nivel, frequencia de jogo, estilo e preferencias.",
              },
              {
                num: "02",
                title: "Analise",
                desc: "Nosso algoritmo analisa mais de 1.000 raquetes e calcula compatibilidade com seu perfil.",
              },
              {
                num: "03",
                title: "Compare",
                desc: "Compare as raquetes sugeridas lado a lado por specs, scores e preco.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-bg border border-surface rounded-lg p-6 flex flex-col gap-4"
              >
                <span className="font-display text-3xl font-bold text-accent">
                  {step.num}
                </span>
                <h3 className="font-display text-lg font-semibold text-text uppercase tracking-wide">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-12 sm:py-16 px-4 bg-bg relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {[
            { value: "1000+", label: "Raquetes avaliadas" },
            { value: "6", label: "Metricas de analise" },
            { value: "3", label: "Niveis de jogador" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl sm:text-5xl font-bold text-accent">
                {stat.value}
              </p>
              <p className="text-text-muted text-sm mt-2 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-16 sm:py-20 px-4 bg-bg-elevated overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-text uppercase tracking-wide mb-4">
            Pronto para encontrar sua raquete?
          </h2>
          <p className="text-text-secondary mb-10 text-base sm:text-lg">
            Leva menos de 2 minutos. Comece agora.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quiz"
              className="inline-block bg-primary text-white font-bold text-sm sm:text-base px-8 py-4 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors"
            >
              Fazer o quiz
            </Link>
            <Link
              href="/raquetes"
              className="inline-block border border-surface text-text-secondary font-semibold text-sm sm:text-base px-8 py-4 rounded hover:border-primary hover:text-primary transition-colors"
            >
              Ver todas as raquetes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/anakin/projects-arthur/my-racket && npx next build 2>&1 | tail -10`

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: redesign home page with Electric Court theme"
```

---

## Task 6: Quiz — Fix Colors + Dark Theme

**Files:**
- Modify: `src/components/QuizStep.tsx`
- Modify: `src/app/quiz/page.tsx`

- [ ] **Step 1: Replace QuizStep.tsx**

```tsx
import type { QuizQuestion } from "@/lib/types";

interface QuizStepProps {
  question: QuizQuestion;
  currentStep: number;
  totalSteps: number;
  onAnswer: (questionId: string, value: string) => void;
}

export default function QuizStep({
  question,
  currentStep,
  totalSteps,
  onAnswer,
}: QuizStepProps) {
  const progressPct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs text-text-muted font-medium">
          <span>Pergunta {currentStep} de {totalSteps}</span>
          <span>{progressPct}%</span>
        </div>
        <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="font-display text-xl sm:text-2xl font-bold text-text uppercase tracking-wide leading-snug">
        {question.text}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-4">
        {question.options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onAnswer(question.id, option.value)}
            className="w-full text-left bg-bg-elevated border border-surface rounded-lg px-5 py-5 text-text font-medium hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,53,0.15)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update quiz/page.tsx with dark background**

Replace `src/app/quiz/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PlayerLevel, QuizAnswers } from "@/lib/types";
import { getQuizFlow } from "@/lib/quiz-config";
import QuizStep from "@/components/QuizStep";

export default function QuizPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [level, setLevel] = useState<PlayerLevel | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const flow = getQuizFlow(level ?? "iniciante");
  const currentQuestion = flow[stepIndex];
  const totalSteps = flow.length;

  function handleAnswer(questionId: string, value: string) {
    let updatedAnswers: Partial<QuizAnswers>;

    if (questionId.startsWith("tech_preferences_")) {
      const key = questionId.replace("tech_preferences_", "") as keyof import("@/lib/types").TechPreferences;
      const prevTechPrefs = answers.tech_preferences ?? { weight: "media", balance: "equilibrada", stiffness: "media" };
      updatedAnswers = {
        ...answers,
        tech_preferences: {
          ...prevTechPrefs,
          [key]: value,
        },
      };
    } else if (questionId === "level") {
      const lvl = value as PlayerLevel;
      setLevel(lvl);
      updatedAnswers = { ...answers, level: lvl };
    } else {
      updatedAnswers = { ...answers, [questionId]: value };
    }

    setAnswers(updatedAnswers);

    const nextIndex = stepIndex + 1;
    if (nextIndex >= totalSteps) {
      sessionStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));
      router.push("/resultado");
    } else {
      setStepIndex(nextIndex);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 relative">
      {/* Subtle diagonal decoration */}
      <div
        className="absolute top-0 right-0 w-32 h-32 bg-primary/10 opacity-50"
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />
      <div className="w-full max-w-xl relative z-10">
        <QuizStep
          question={currentQuestion}
          currentStep={stepIndex + 1}
          totalSteps={totalSteps}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/anakin/projects-arthur/my-racket && npx next build 2>&1 | tail -10`

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/QuizStep.tsx src/app/quiz/page.tsx
git commit -m "fix: quiz colors now visible on dark background + improved touch targets"
```

---

## Task 7: Profile Text Generator

**Files:**
- Create: `src/lib/profile.ts`

- [ ] **Step 1: Create profile.ts**

```ts
import type { QuizAnswers } from "./types";

interface PlayerProfile {
  title: string;
  description: string;
  tags: string[];
}

const LEVEL_LABELS: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediario",
  avancado: "Avancado",
};

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  iniciante: "jogador iniciante",
  intermediario: "jogador de nivel intermediario",
  avancado: "jogador experiente",
};

const STYLE_LABELS: Record<string, string> = {
  baseline: "Fundo de Quadra",
  "serve-and-volley": "Saque e Voleio",
  "all-court": "All-Court",
};

const STYLE_DESCRIPTIONS: Record<string, string> = {
  baseline: "estilo de jogo de fundo de quadra",
  "serve-and-volley": "jogo agressivo de saque e voleio",
  "all-court": "jogo versatil all-court",
};

const IMPROVEMENT_DESCRIPTIONS: Record<string, string> = {
  potencia: "foco em ganhar mais potencia",
  controle: "busca por maior precisao e controle",
  spin: "foco em maximizar o efeito nas bolas",
};

const PHYSIQUE_DESCRIPTIONS: Record<string, string> = {
  pequeno: "porte fisico leve",
  medio: "porte fisico medio",
  grande: "porte fisico forte",
};

const MAIN_SHOT_DESCRIPTIONS: Record<string, string> = {
  forehand: "forehand como golpe principal",
  backhand: "backhand como ponto forte",
  saque: "saque como arma principal",
};

const CHANGE_DESCRIPTIONS: Record<string, string> = {
  "mais-potencia": "buscando mais potencia",
  "mais-controle": "buscando mais controle",
  "mais-spin": "buscando mais spin",
  "mais-conforto": "priorizando conforto e menos vibracao",
  "mais-leve": "procurando algo mais leve",
  "mais-pesada": "procurando algo mais pesado",
};

const BUDGET_DESCRIPTIONS: Record<string, string> = {
  baixo: "buscando melhor custo-beneficio",
  medio: "com orcamento intermediario",
  alto: "sem restricao de orcamento",
};

const INJURY_TAGS: Record<string, string> = {
  cotovelo: "Protecao Cotovelo",
  ombro: "Protecao Ombro",
  punho: "Protecao Punho",
};

export function generateProfile(answers: QuizAnswers): PlayerProfile {
  const tags: string[] = [];
  const fragments: string[] = [];

  // Level
  tags.push(LEVEL_LABELS[answers.level] ?? "Jogador");
  fragments.push(LEVEL_DESCRIPTIONS[answers.level] ?? "jogador");

  // Play style
  if (answers.play_style) {
    tags.push(STYLE_LABELS[answers.play_style] ?? "");
    fragments.push(`com ${STYLE_DESCRIPTIONS[answers.play_style]}`);
  }

  // Main shot (advanced)
  if (answers.main_shot) {
    tags.push(MAIN_SHOT_DESCRIPTIONS[answers.main_shot] ? answers.main_shot.charAt(0).toUpperCase() + answers.main_shot.slice(1) : "");
    fragments.push(`${MAIN_SHOT_DESCRIPTIONS[answers.main_shot]}`);
  }

  // Improvement (intermediate)
  if (answers.improvement) {
    fragments.push(`${IMPROVEMENT_DESCRIPTIONS[answers.improvement]}`);
  }

  // Change desired (advanced)
  if (answers.change_desired) {
    fragments.push(CHANGE_DESCRIPTIONS[answers.change_desired] ?? "");
  }

  // Physique (beginner)
  if (answers.physique) {
    fragments.push(PHYSIQUE_DESCRIPTIONS[answers.physique] ?? "");
  }

  // Injury
  if (answers.injury && answers.injury !== "nenhuma") {
    tags.push(INJURY_TAGS[answers.injury] ?? "");
  }

  // Budget
  if (answers.budget) {
    tags.push(answers.budget === "baixo" ? "Custo-beneficio" : answers.budget === "alto" ? "Premium" : "");
    fragments.push(BUDGET_DESCRIPTIONS[answers.budget] ?? "");
  }

  // Build title
  const styleLabel = answers.play_style ? STYLE_LABELS[answers.play_style] : "";
  const title = styleLabel
    ? `Perfil: Jogador ${styleLabel}`
    : `Perfil: ${LEVEL_LABELS[answers.level]}`;

  // Build description
  const validFragments = fragments.filter(Boolean);
  const description =
    `Baseado no seu perfil de ${validFragments.slice(0, 3).join(", ")}, ` +
    `identificamos as raquetes com maior compatibilidade para o seu jogo` +
    (validFragments.length > 3 ? ` — ${validFragments.slice(3).join(", ")}` : "") +
    ".";

  return {
    title,
    description,
    tags: tags.filter(Boolean),
  };
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /Users/anakin/projects-arthur/my-racket && npx tsc --noEmit 2>&1 | tail -10`

Expected: No type errors related to profile.ts.

- [ ] **Step 3: Commit**

```bash
git add src/lib/profile.ts
git commit -m "feat: add quiz answer-to-profile text generator"
```

---

## Task 8: Results Page — Loading Animation + Personalized Report

**Files:**
- Modify: `src/app/resultado/page.tsx`

- [ ] **Step 1: Replace resultado/page.tsx**

```tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { QuizAnswers, ScoredRacket, Racket } from "@/lib/types";
import { recommend } from "@/lib/engine";
import { generateProfile } from "@/lib/profile";
import RacketCard from "@/components/RacketCard";
import ScoresBar from "@/components/ScoresBar";
import racketData from "@/data/rackets.json";

const rackets = racketData as Racket[];

const LOADING_STEPS = [
  "Analisando seu perfil de jogo...",
  "Cruzando dados com 1.000+ raquetes...",
  "Calculando compatibilidade...",
];

export default function ResultadoPage() {
  const router = useRouter();
  const [top3, setTop3] = useState<ScoredRacket[]>([]);
  const [more, setMore] = useState<ScoredRacket[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const [loadingStep, setLoadingStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const raw = sessionStorage.getItem("quizAnswers");
    if (!raw) {
      router.replace("/quiz");
      return;
    }

    let parsed: QuizAnswers;
    try {
      parsed = JSON.parse(raw) as QuizAnswers;
    } catch {
      router.replace("/quiz");
      return;
    }

    setAnswers(parsed);

    const top = recommend(rackets, parsed, 3);
    const rest = recommend(rackets, parsed, 10).slice(3);
    setTop3(top);
    setMore(rest);

    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    // Transition to reveal phase
    setTimeout(() => {
      clearInterval(stepInterval);
      setPhase("reveal");
      setTimeout(() => setPhase("done"), 800);
    }, 4500);

    return () => clearInterval(stepInterval);
  }, [router]);

  function handleAddToCompare(racket: Racket) {
    setCompareList((prev) => {
      const next = prev.includes(racket.slug)
        ? prev
        : [...prev, racket.slug].slice(0, 3);
      sessionStorage.setItem("compareList", JSON.stringify(next));
      return next;
    });
  }

  function goToComparator() {
    router.push(`/comparar?r=${compareList.join(",")}`);
  }

  // Phase 1: Loading animation
  if (phase === "loading") {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 gap-8">
        {/* Pulsing icon */}
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center" style={{ animation: "pulse-glow 2s ease-in-out infinite" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Loading messages */}
        <div className="flex flex-col items-center gap-3 min-h-[60px]">
          {LOADING_STEPS.map((step, i) => (
            <p
              key={step}
              className={`text-sm sm:text-base transition-all duration-500 ${
                i === loadingStep
                  ? "text-text opacity-100"
                  : i < loadingStep
                  ? "text-text-muted opacity-50 text-xs"
                  : "text-text-muted opacity-0 h-0 overflow-hidden"
              }`}
            >
              {step}
            </p>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-64 sm:w-80 bg-surface rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
            style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (top3.length === 0) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-text-secondary text-lg text-center">
          Nenhuma raquete encontrada para o seu perfil.
        </p>
        <Link
          href="/quiz"
          className="bg-primary text-white font-bold px-6 py-3 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors"
        >
          Refazer quiz
        </Link>
      </div>
    );
  }

  const profile = answers ? generateProfile(answers) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-12">
      {/* Personalized Report */}
      {profile && (
        <div
          className="bg-bg-elevated border border-surface rounded-lg p-6 sm:p-8"
          style={{ animation: "fadeInUp 0.6s ease-out" }}
        >
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text uppercase tracking-wide mb-3">
            {profile.title}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4">
            {profile.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-accent text-xs font-semibold px-3 py-1 rounded border border-primary/20 uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className="text-center"
        style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}
      >
        <h2 className="font-display text-xl sm:text-2xl font-bold text-text uppercase tracking-wide mb-3">
          Suas recomendacoes
        </h2>
        <p className="text-text-secondary text-base">
          As raquetes mais compativeis com o seu perfil.
        </p>
      </div>

      {/* Top 3 */}
      <div className="flex flex-col gap-8">
        {top3.map((item, i) => (
          <div
            key={item.racket.slug}
            className="flex flex-col gap-4"
            style={{ animation: `fadeInUp 0.5s ease-out ${0.3 + i * 0.15}s both` }}
          >
            {i === 0 && (
              <div className="flex items-center gap-2">
                <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                  Melhor match
                </span>
              </div>
            )}

            <RacketCard
              racket={item.racket}
              score={item.score}
              reasons={item.reasons}
              showCompareButton
              onAddToCompare={handleAddToCompare}
            />

            {item.racket.scores.overall !== null && (
              <div className="bg-bg-elevated border border-surface rounded-lg p-5 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-text-secondary mb-1 uppercase tracking-wide">
                  Pontuacoes tecnicas
                </h3>
                <ScoresBar label="Geral" value={item.racket.scores.overall} animate={phase === "done"} />
                <ScoresBar label="Potencia" value={item.racket.scores.power} animate={phase === "done"} />
                <ScoresBar label="Controle" value={item.racket.scores.control} animate={phase === "done"} />
                <ScoresBar label="Conforto" value={item.racket.scores.comfort} animate={phase === "done"} />
                <ScoresBar label="Topspin" value={item.racket.scores.topspin} animate={phase === "done"} />
                <ScoresBar label="Manobrabilidade" value={item.racket.scores.maneuverability} animate={phase === "done"} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ver mais */}
      {more.length > 0 && (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className="w-full border border-surface text-text-secondary font-semibold py-3 rounded-lg hover:border-primary hover:text-primary transition-colors"
          >
            {showMore ? "Ocultar raquetes extras" : `Ver mais ${more.length} raquetes`}
          </button>

          {showMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {more.map((item) => (
                <RacketCard
                  key={item.racket.slug}
                  racket={item.racket}
                  score={item.score}
                  showCompareButton
                  onAddToCompare={handleAddToCompare}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Compare indicator */}
      {compareList.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-accent font-medium text-sm">
            {compareList.length} raquete{compareList.length > 1 ? "s" : ""} adicionada{compareList.length > 1 ? "s" : ""} para comparacao
          </p>
          <button
            type="button"
            onClick={goToComparator}
            className="bg-primary text-white font-bold text-sm px-5 py-2 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors"
          >
            Ver comparacao
          </button>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-surface">
        <Link
          href="/quiz"
          className="border border-surface text-text-secondary font-semibold px-6 py-3 rounded hover:border-primary hover:text-primary transition-colors"
        >
          Refazer quiz
        </Link>
        <Link
          href="/comparar"
          className="bg-primary text-white font-bold px-6 py-3 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors"
        >
          Ir para comparador
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/anakin/projects-arthur/my-racket && npx next build 2>&1 | tail -10`

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/resultado/page.tsx
git commit -m "feat: add loading animation and personalized profile report to results"
```

---

## Task 9: Catalog Page — Dark Theme

**Files:**
- Modify: `src/app/raquetes/page.tsx`

- [ ] **Step 1: Replace raquetes/page.tsx**

```tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Racket } from "@/lib/types";
import { getAllRackets, getAllBrands, searchRackets, getRacketsByBrand } from "@/lib/rackets";
import racketData from "@/data/rackets.json";
import AffiliateButton from "@/components/AffiliateButton";

const rackets = racketData as Racket[];
const allRackets = getAllRackets(rackets);
const allBrands = getAllBrands(rackets);

const MAX_DISPLAY = 50;

export default function RaquetesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const filtered = useMemo(() => {
    let result = allRackets;

    if (selectedBrand) {
      result = getRacketsByBrand(result, selectedBrand);
    }

    if (searchQuery.length >= 2) {
      result = searchRackets(result, searchQuery);
      if (selectedBrand) {
        const brandSet = new Set(getRacketsByBrand(allRackets, selectedBrand).map((r) => r.slug));
        result = searchRackets(allRackets, searchQuery).filter((r) => brandSet.has(r.slug));
      }
    }

    return result.slice(0, MAX_DISPLAY);
  }, [searchQuery, selectedBrand]);

  const totalRackets = allRackets.length;
  const totalBrands = allBrands.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-text uppercase tracking-wide mb-2">
          Catalogo de Raquetes
        </h1>
        <p className="text-text-secondary text-base">
          {totalRackets} raquetes de {totalBrands} marcas
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">Buscar raquetes</label>
          <input
            id="search"
            type="text"
            placeholder="Buscar por marca ou modelo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-subtle border border-surface rounded-lg px-4 py-2.5 text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>
        <div className="sm:w-56">
          <label htmlFor="brand" className="sr-only">Filtrar por marca</label>
          <select
            id="brand"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full bg-bg-subtle border border-surface rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          >
            <option value="">Todas as marcas</option>
            {allBrands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-text-muted mb-4">
        {filtered.length === 0
          ? "Nenhuma raquete encontrada"
          : `Exibindo ${filtered.length}${filtered.length === MAX_DISPLAY ? "+" : ""} raquetes`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((racket) => (
            <CatalogCard key={racket.slug} racket={racket} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-text-muted">
          <p className="text-lg font-medium">Nenhuma raquete encontrada.</p>
          <p className="text-sm mt-1">Tente ajustar sua busca ou filtro de marca.</p>
        </div>
      )}
    </div>
  );
}

function CatalogCard({ racket }: { racket: Racket }) {
  const { slug, brand, model, weight, head_size, ra, price_brl } = racket;

  const specChips: string[] = [];
  if (weight !== null) specChips.push(`${weight}g`);
  if (head_size) specChips.push(`${head_size} in²`);
  if (ra) specChips.push(`RA ${ra}`);

  return (
    <div className="bg-bg-elevated border border-surface rounded-lg hover:border-primary/30 transition-all duration-300 p-5 flex flex-col gap-4 hover:shadow-[0_0_20px_rgba(255,107,53,0.1)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-0.5">{brand}</p>
        <Link href={`/raquete/${slug}`} className="text-base font-bold text-text hover:text-primary transition-colors leading-snug">
          {model}
        </Link>
      </div>

      {specChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {specChips.map((chip) => (
            <span key={chip} className="bg-bg-subtle text-text-secondary text-xs font-medium px-3 py-1 rounded">{chip}</span>
          ))}
        </div>
      )}

      {price_brl !== null && (
        <p className="text-base font-bold text-text">
          R$ {price_brl.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      )}

      <div className="mt-auto">
        <AffiliateButton brand={brand} model={model} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/raquetes/page.tsx
git commit -m "feat: apply dark theme to catalog page"
```

---

## Task 10: Compare + Detail Pages + Tables — Dark Theme

**Files:**
- Modify: `src/app/comparar/page.tsx`
- Modify: `src/app/raquete/[slug]/page.tsx`
- Modify: `src/components/CompareTable.tsx`
- Modify: `src/components/SpecsTable.tsx`

- [ ] **Step 1: Replace SpecsTable.tsx**

```tsx
import type { Racket } from "@/lib/types";

interface SpecsTableProps {
  racket: Racket;
}

export default function SpecsTable({ racket }: SpecsTableProps) {
  const rows: { label: string; value: string | number | null }[] = [
    { label: "Peso", value: racket.weight !== null ? `${racket.weight} g` : null },
    { label: "Cabeca", value: racket.head_size ? `${racket.head_size} in²` : null },
    { label: "Rigidez (RA)", value: racket.ra ?? null },
    { label: "Balanco", value: racket.balance_mm !== null ? `${racket.balance_mm} mm` : null },
    { label: "Swingweight", value: racket.swingweight !== null ? racket.swingweight : null },
    { label: "Padrao de corda", value: racket.string_pattern ?? null },
  ];

  return (
    <table className="w-full text-sm border-collapse">
      <tbody>
        {rows.map(({ label, value }) => (
          <tr key={label} className="border-b border-surface last:border-0">
            <td className="py-2 pr-4 text-text-muted font-medium w-1/2">{label}</td>
            <td className="py-2 text-text">{value !== null && value !== undefined ? value : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 2: Replace CompareTable.tsx**

```tsx
import type { Racket } from "@/lib/types";
import AffiliateButton from "./AffiliateButton";

interface CompareTableProps {
  rackets: Racket[];
  matchSlug?: string;
}

type RowConfig = {
  label: string;
  getValue: (r: Racket) => number | string | null;
  higherIsBetter?: boolean;
};

const SPEC_ROWS: RowConfig[] = [
  { label: "Peso (g)", getValue: (r) => r.weight, higherIsBetter: false },
  { label: "Cabeca (in²)", getValue: (r) => r.head_size, higherIsBetter: true },
  { label: "Rigidez (RA)", getValue: (r) => r.ra, higherIsBetter: false },
  { label: "Balanco (mm)", getValue: (r) => r.balance_mm, higherIsBetter: false },
  { label: "Swingweight", getValue: (r) => r.swingweight, higherIsBetter: false },
  { label: "Padrao de corda", getValue: (r) => r.string_pattern, higherIsBetter: undefined },
];

const SCORE_ROWS: RowConfig[] = [
  { label: "Overall", getValue: (r) => r.scores.overall, higherIsBetter: true },
  { label: "Potencia", getValue: (r) => r.scores.power, higherIsBetter: true },
  { label: "Controle", getValue: (r) => r.scores.control, higherIsBetter: true },
  { label: "Conforto", getValue: (r) => r.scores.comfort, higherIsBetter: true },
  { label: "Topspin", getValue: (r) => r.scores.topspin, higherIsBetter: true },
  { label: "Manobrabilidade", getValue: (r) => r.scores.maneuverability, higherIsBetter: true },
  { label: "Estabilidade", getValue: (r) => r.scores.stability, higherIsBetter: true },
];

function getBestIndex(
  rackets: Racket[],
  getValue: (r: Racket) => number | string | null,
  higherIsBetter?: boolean
): number {
  if (higherIsBetter === undefined) return -1;
  const numericValues = rackets.map((r) => {
    const v = getValue(r);
    return typeof v === "number" ? v : null;
  });
  let bestIdx = -1;
  let bestVal: number | null = null;
  for (let i = 0; i < numericValues.length; i++) {
    const v = numericValues[i];
    if (v === null) continue;
    if (bestVal === null || (higherIsBetter && v > bestVal) || (!higherIsBetter && v < bestVal)) {
      bestVal = v;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function formatValue(value: number | string | null): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return String(value);
  return value;
}

export default function CompareTable({ rackets, matchSlug }: CompareTableProps) {
  if (rackets.length === 0) return null;

  const sectionHeaderClass = "px-4 py-2 bg-bg-subtle text-xs font-bold uppercase tracking-wide text-text-muted";
  const cellClass = "px-4 py-3 text-center text-text";
  const labelClass = "px-4 py-3 text-text-secondary font-medium sticky left-0 bg-bg-elevated z-10";

  return (
    <div className="overflow-x-auto rounded-lg border border-surface">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-bg-elevated border-b border-surface">
            <th className="text-left px-4 py-3 font-semibold text-text-muted w-40 sticky left-0 bg-bg-elevated z-10">
              Especificacao
            </th>
            {rackets.map((r) => (
              <th key={r.slug} className="px-4 py-3 text-center font-semibold text-text min-w-[180px]">
                <div className="flex flex-col items-center gap-1">
                  {matchSlug && r.slug === matchSlug && (
                    <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">Seu match</span>
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">{r.brand}</span>
                  <span className="text-sm font-bold text-text leading-snug">{r.model}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={rackets.length + 1} className={sectionHeaderClass}>Especificacoes</td></tr>
          {SPEC_ROWS.map((row) => {
            const bestIdx = getBestIndex(rackets, row.getValue, row.higherIsBetter);
            return (
              <tr key={row.label} className="border-b border-surface/50 hover:bg-bg-subtle/50">
                <td className={labelClass}>{row.label}</td>
                {rackets.map((r, i) => (
                  <td key={r.slug} className={`${cellClass} ${i === bestIdx ? "text-accent font-bold" : ""}`}>
                    {formatValue(row.getValue(r))}
                  </td>
                ))}
              </tr>
            );
          })}

          <tr><td colSpan={rackets.length + 1} className={sectionHeaderClass}>Pontuacoes (0–100)</td></tr>
          {SCORE_ROWS.map((row) => {
            const bestIdx = getBestIndex(rackets, row.getValue, row.higherIsBetter);
            return (
              <tr key={row.label} className="border-b border-surface/50 hover:bg-bg-subtle/50">
                <td className={labelClass}>{row.label}</td>
                {rackets.map((r, i) => (
                  <td key={r.slug} className={`${cellClass} ${i === bestIdx ? "text-accent font-bold" : ""}`}>
                    {formatValue(row.getValue(r))}
                  </td>
                ))}
              </tr>
            );
          })}

          <tr><td colSpan={rackets.length + 1} className={sectionHeaderClass}>Preco</td></tr>
          <tr className="border-b border-surface/50">
            <td className={labelClass}>Preco (R$)</td>
            {rackets.map((r) => (
              <td key={r.slug} className={`${cellClass} font-semibold`}>
                {r.price_brl !== null ? `R$ ${r.price_brl.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
              </td>
            ))}
          </tr>

          <tr className="bg-bg-subtle">
            <td className="px-4 py-3 text-text-secondary font-medium sticky left-0 bg-bg-subtle z-10">Comprar</td>
            {rackets.map((r) => (
              <td key={r.slug} className="px-4 py-4 text-center">
                <AffiliateButton brand={r.brand} model={r.model} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: Replace comparar/page.tsx**

```tsx
"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Racket } from "@/lib/types";
import { getRacketBySlug, searchRackets } from "@/lib/rackets";
import CompareTable from "@/components/CompareTable";
import racketData from "@/data/rackets.json";

const MAX_RACKETS = 3;
const allRackets = racketData as Racket[];

function CompararContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState<Racket[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Racket[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = searchParams.get("r");
    if (r) {
      const slugs = r.split(",").map((s) => s.trim()).filter(Boolean).slice(0, MAX_RACKETS);
      const initialRackets = slugs.map((slug) => getRacketBySlug(allRackets, slug)).filter((r): r is Racket => r !== null);
      setSelected(initialRackets);
    }
  }, [searchParams]);

  useEffect(() => {
    if (query.trim().length < 1) { setResults([]); setShowDropdown(false); return; }
    const found = searchRackets(allRackets, query.trim()).slice(0, 8);
    setResults(found);
    setShowDropdown(true);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateURL = useCallback((rackets: Racket[]) => {
    const slugs = rackets.map((r) => r.slug).join(",");
    const params = new URLSearchParams(searchParams.toString());
    if (slugs) { params.set("r", slugs); } else { params.delete("r"); }
    router.replace(`/comparar?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  function addRacket(racket: Racket) {
    if (selected.length >= MAX_RACKETS || selected.some((r) => r.slug === racket.slug)) return;
    const next = [...selected, racket];
    setSelected(next); setQuery(""); setShowDropdown(false); updateURL(next);
  }

  function removeRacket(slug: string) {
    const next = selected.filter((r) => r.slug !== slug);
    setSelected(next); updateURL(next);
  }

  const matchSlug = searchParams.get("match") ?? undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-text uppercase tracking-wide mb-3">
          Comparador de raquetes
        </h1>
        <p className="text-text-secondary text-lg">Selecione ate 3 raquetes para comparar lado a lado.</p>
      </div>

      <div className="flex flex-col gap-4">
        {selected.length < MAX_RACKETS && (
          <div ref={searchRef} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar raquete por nome ou marca..."
              className="w-full bg-bg-subtle border border-surface rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {showDropdown && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-bg-elevated border border-surface rounded-lg shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                {results.map((r) => (
                  <button key={r.slug} type="button" onClick={() => addRacket(r)} className="w-full text-left px-4 py-3 hover:bg-bg-subtle transition-colors flex items-center justify-between gap-2 border-b border-surface last:border-b-0">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">{r.brand}</span>
                      <p className="text-sm font-medium text-text">{r.model}</p>
                    </div>
                    {r.price_brl && <span className="text-xs text-text-muted shrink-0">R$ {r.price_brl.toLocaleString("pt-BR")}</span>}
                  </button>
                ))}
              </div>
            )}
            {showDropdown && results.length === 0 && query.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-bg-elevated border border-surface rounded-lg shadow-lg z-20 px-4 py-3 text-sm text-text-muted">
                Nenhuma raquete encontrada
              </div>
            )}
          </div>
        )}

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((r) => (
              <div key={r.slug} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-accent text-sm font-medium px-3 py-1.5 rounded">
                <span>{r.brand} {r.model}</span>
                <button type="button" onClick={() => removeRacket(r.slug)} className="text-primary hover:text-accent leading-none" aria-label={`Remover ${r.model}`}>x</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 ? (
        <CompareTable rackets={selected} matchSlug={matchSlug} />
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-bg-subtle flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-text-secondary font-medium text-lg">Nenhuma raquete selecionada</p>
          <p className="text-text-muted text-sm max-w-xs">Use a busca acima para adicionar raquetes a comparacao.</p>
        </div>
      )}
    </div>
  );
}

export default function CompararPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-8rem)] flex items-center justify-center"><p className="text-text-secondary text-lg">Carregando comparador...</p></div>}>
      <CompararContent />
    </Suspense>
  );
}
```

- [ ] **Step 4: Replace raquete/[slug]/page.tsx**

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import type { Racket } from "@/lib/types";
import { getRacketBySlug, getAllRackets } from "@/lib/rackets";
import racketData from "@/data/rackets.json";
import SpecsTable from "@/components/SpecsTable";
import ScoresBar from "@/components/ScoresBar";
import AffiliateButton from "@/components/AffiliateButton";

const rackets = racketData as Racket[];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllRackets(rackets).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const racket = getRacketBySlug(rackets, slug);
  if (!racket) return { title: "Raquete nao encontrada | My Racket" };
  const yearStr = racket.year ? ` ${racket.year}` : "";
  return {
    title: `${racket.brand} ${racket.model}${yearStr} — Specs, Review e Preco | My Racket`,
    description: racket.expert_summary_pt ?? `Confira as especificacoes, scores de performance e preco da ${racket.brand} ${racket.model}${yearStr}.`,
  };
}

const SCORE_LABELS: { key: keyof Racket["scores"]; label: string }[] = [
  { key: "overall", label: "Overall" },
  { key: "groundstrokes", label: "Groundstrokes" },
  { key: "volleys", label: "Volleys" },
  { key: "serves", label: "Saques" },
  { key: "returns", label: "Devolucoes" },
  { key: "power", label: "Potencia" },
  { key: "control", label: "Controle" },
  { key: "maneuverability", label: "Manobrabilidade" },
  { key: "stability", label: "Estabilidade" },
  { key: "comfort", label: "Conforto" },
  { key: "touch_feel", label: "Toque" },
  { key: "topspin", label: "Topspin" },
  { key: "slice", label: "Slice" },
];

export default async function RaquetePage({ params }: PageProps) {
  const { slug } = await params;
  const racket = getRacketBySlug(rackets, slug);

  if (!racket) notFound();

  const { brand, model, year, price_brl, recommended_levels, scores, expert_summary_pt, atp_players, wta_players } = racket;
  const yearStr = year ? ` ${year}` : "";
  const hasProPlayers = atp_players.length > 0 || wta_players.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted mb-6 flex items-center gap-1.5">
        <Link href="/raquetes" className="hover:text-primary transition-colors">Raquetes</Link>
        <span>/</span>
        <span className="text-text-secondary font-medium">{brand} {model}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-1">{brand}</p>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-text uppercase tracking-wide mb-3">{model}{yearStr}</h1>

        {recommended_levels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recommended_levels.map((level) => (
              <span key={level} className="bg-primary/10 text-accent text-xs font-semibold px-3 py-1 rounded border border-primary/20 capitalize">
                {level}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          {price_brl !== null && (
            <p className="text-2xl font-bold text-text">
              R$ {price_brl.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          )}
          <AffiliateButton brand={brand} model={model} />
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-bg-elevated border border-surface rounded-lg p-6">
          <h2 className="text-lg font-bold text-text mb-4">Especificacoes</h2>
          <SpecsTable racket={racket} />
        </div>
        <div className="bg-bg-elevated border border-surface rounded-lg p-6">
          <h2 className="text-lg font-bold text-text mb-4">Performance</h2>
          <div className="flex flex-col gap-3">
            {SCORE_LABELS.map(({ key, label }) => (
              <ScoresBar key={key} label={label} value={scores[key]} />
            ))}
          </div>
        </div>
      </div>

      {/* Expert summary */}
      {expert_summary_pt && (
        <div className="bg-bg-elevated border border-surface rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-text mb-3">Analise dos Especialistas</h2>
          <p className="text-text-secondary leading-relaxed">{expert_summary_pt}</p>
        </div>
      )}

      {/* Pro players */}
      {hasProPlayers && (
        <div className="bg-bg-elevated border border-surface rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-text mb-4">Jogadores Pro</h2>
          <div className="flex flex-col gap-4">
            {atp_players.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">ATP</p>
                <div className="flex flex-wrap gap-2">
                  {atp_players.map((player) => (
                    <span key={player} className="bg-bg-subtle text-text-secondary text-sm font-medium px-3 py-1 rounded border border-surface">{player}</span>
                  ))}
                </div>
              </div>
            )}
            {wta_players.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">WTA</p>
                <div className="flex flex-wrap gap-2">
                  {wta_players.map((player) => (
                    <span key={player} className="bg-bg-subtle text-text-secondary text-sm font-medium px-3 py-1 rounded border border-surface">{player}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom CTAs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-surface">
        <Link href={`/comparar?slugs=${slug}`} className="inline-flex items-center gap-2 border border-surface text-text-secondary font-semibold text-sm px-5 py-2.5 rounded hover:border-primary hover:text-primary transition-colors">
          Comparar com outra raquete
        </Link>
        <Link href="/quiz" className="inline-flex items-center gap-2 bg-primary text-white font-bold text-sm px-5 py-2.5 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors">
          Fazer o quiz
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `cd /Users/anakin/projects-arthur/my-racket && npx next build 2>&1 | tail -20`

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/app/comparar/page.tsx src/app/raquete/\[slug\]/page.tsx src/components/CompareTable.tsx src/components/SpecsTable.tsx
git commit -m "feat: apply dark theme to compare, detail pages, and table components"
```

---

## Task 11: Final Verification

- [ ] **Step 1: Full build check**

Run: `cd /Users/anakin/projects-arthur/my-racket && npx next build 2>&1 | tail -30`

Expected: Build succeeds with all pages generated.

- [ ] **Step 2: Run existing tests**

Run: `cd /Users/anakin/projects-arthur/my-racket && npx vitest run 2>&1`

Expected: All existing tests pass (profile.ts has no tests yet — it's a presentation-only module).

- [ ] **Step 3: Visual smoke test**

Run: `cd /Users/anakin/projects-arthur/my-racket && npx next dev &`

Open in browser and verify:
- Home page: dark background, orange accents, Oswald headlines, diagonal decorations
- Quiz: dark bg, visible text, gradient progress bar, touch-friendly options
- Results: loading animation plays, profile report shows personalized text/tags, score bars animate
- Catalog: dark cards, search/filter works
- Compare: dark table with accent highlights
- Detail: dark specs/scores, pro player badges
- Mobile: all pages responsive, touch targets adequate
