# Sachsenhausen Tour — Coding Rules & Conventions

## Project Overview
- **Site:** sachsenhausentour.de
- **Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Vercel
- **Architecture:** MVC-inspired, modular, component-driven

---

## Architecture: Three-Layer Rule (STRICT)

### Layer 1 — Components (View)
- All reusable UI lives in `src/components/`
- Components are pure, stateless where possible
- Components accept typed props — never fetch data internally
- NO inline styles, NO hardcoded content strings
- Every component has a barrel export via `index.ts`

### Layer 2 — Content (Model)
- All copy, labels, and structured data live in `src/content/`
- Organized by locale: `src/content/en/`, `src/content/de/`, `src/content/es/`
- Each page has its own content file (e.g., `home.ts`, `tour.ts`)
- Content files export typed objects — never raw strings in JSX
- Types defined in `src/content/types.ts`

### Layer 3 — Pages (Controller)
- Pages in `src/app/` are thin assembly layers
- Pages import components + content, compose sections
- NO business logic in page files
- NO direct styling in page files
- Pages should be under 100 lines

---

## Folder Structure

```
src/
  app/                      # Next.js App Router (Controller layer)
    (site)/                 # Route group for public pages
      page.tsx              # Homepage
      tour/page.tsx
      book/page.tsx
      gallery/page.tsx
      about/page.tsx
      contact/page.tsx
      blog/page.tsx
      blog/[slug]/page.tsx
    layout.tsx              # Root layout
    globals.css             # Global styles + Tailwind

  components/               # View layer
    layout/                 # Nav, Footer, MobileMenu
    sections/               # PageHero, Timeline, TrustBar, Testimonials
    ui/                     # Button, Accordion, Card, Badge, Container
    booking/                # DatePicker, GuestSelector, CheckoutForm

  content/                  # Model layer
    en/                     # English content
    de/                     # German content
    es/                     # Spanish content
    types.ts                # Shared content type definitions

  lib/                      # Utilities & services
    utils/                  # cn(), formatDate(), etc.
    seo/                    # Metadata generators, structured data
    analytics/              # Event tracking
    booking/                # Stripe helpers, availability

  config/                   # App-wide configuration
    site.ts                 # Site metadata, URLs, social links
    theme.ts                # Design tokens (exported for use in components)
    navigation.ts           # Nav items, footer links

  types/                    # Global TypeScript types
    index.ts
```

---

## Naming Conventions

### Files & Folders
- **Components:** PascalCase (`PageHero.tsx`, `Button.tsx`)
- **Content files:** camelCase (`home.ts`, `tour.ts`)
- **Utilities:** camelCase (`cn.ts`, `formatDate.ts`)
- **Types:** camelCase (`content.ts`, `booking.ts`)
- **Folders:** kebab-case (`ui/`, `sections/`, `layout/`)

### Components
- One component per file
- File name matches component name exactly
- Props interface named `{ComponentName}Props`
- Default export for page components, named export for everything else

### CSS / Styling
- Tailwind utility classes ONLY — no CSS modules, no styled-components
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes
- Design tokens in `config/theme.ts`, referenced via Tailwind config
- NO arbitrary values unless absolutely necessary — extend Tailwind theme instead

---

## Component Rules

### Every component MUST:
1. Have a TypeScript interface for props
2. Be a named export (not default)
3. Accept `className` prop for composability
4. Use semantic HTML elements
5. Include `aria-` attributes where applicable
6. Respect `prefers-reduced-motion` for animations

### Every component MUST NOT:
1. Fetch data
2. Contain hardcoded copy/strings
3. Import from `content/` directly (content passed as props)
4. Use `any` type
5. Exceed 150 lines (split if larger)
6. Use emoji in code or output

### Barrel Exports
Each component folder has an `index.ts`:
```ts
export { Button } from './Button'
export { Card } from './Card'
```

---

## Content Rules

### Content files follow this pattern:
```ts
// content/en/home.ts
import type { HomeContent } from '../types'

export const homeContent: HomeContent = {
  hero: {
    title: "Walk Through History. Understand the Past.",
    subtitle: "Guided 6-hour journey from Berlin to Sachsenhausen Memorial",
    cta: "Book Your Tour",
  },
}
```

### Content types are centralized in `content/types.ts`

---

## Page Assembly Rules

Pages are thin — max 100 lines:
```tsx
import { homeContent } from '@/content/en/home'
import { PageHero } from '@/components/sections'

export default function HomePage() {
  return (
    <main>
      <PageHero {...homeContent.hero} />
    </main>
  )
}
```

---

## Design Tokens (config/theme.ts)

| Token | Hex | Usage |
|-------|-----|-------|
| primary | #1A1A1A | Backgrounds, hero |
| secondary | #2D2D2D | Cards, surfaces |
| accent | #C4A35A | CTAs, highlights |
| text | #F0EDE8 | Body text |
| textMuted | #8A8580 | Captions |
| urgent | #8B2500 | Urgency indicators |
| surface | #141517 | Footer, alt sections |

Fonts: Playfair Display (headings), Inter (body), EB Garamond (quotes)

---

## Git Rules

- Commit messages: imperative mood, max 72 chars
- Branch naming: `feature/page-name`, `fix/description`, `refactor/scope`
- No force pushes to main
- No committing `.env`, `node_modules`, or secrets

---

## Tone & Editorial (applies to content files)

- **Write like:** calm, respectful, clear, educational
- **Avoid:** hype, urgency spam, tourism cliches, casual tone, emoji
- See REDESIGN-PLAN.md for full editorial tone guide

---

## Performance Rules

- All images via `next/image` with blur placeholder
- Lazy load everything below the fold
- No client components unless interactivity requires it (`'use client'`)
- Prefer Server Components by default
- Bundle size budget: < 500KB JS (excluding images)
