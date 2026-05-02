# Landing-v2 — Linting, Build Checks & Component Structure Standard

Author: Clide | Date: 2026-05-02
Task ID: 60fe11ec-cfec-4dfa-9d0d-eb872b36d596
Repo: clicloud/Landing-v2 | Branch: main
Stack: Next.js 16.2.4, React 19.2.4, Tailwind v4, ESLint 9, TypeScript 5

---

## Current State

The repo already has:
- ESLint 9 with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- CI pipeline (`.github/workflows/ci.yml`) running `npm run lint` and `npm run build` on push/PR to main
- TypeScript strict mode enabled
- Tailwind v4 via `@tailwindcss/postcss`

What's missing:
- Prettier for consistent formatting
- Stricter ESLint rules (unused vars, explicit return types on exports, import ordering)
- Pre-commit hooks to catch issues before push
- Component structure convention documentation
- Type-check step in CI (currently only lint + build)

---

## 1. Prettier Configuration

### 1a. Install

```bash
npm install --save-dev prettier prettier-plugin-tailwindcss
```

### 1b. `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Tailwind plugin auto-sorts `className` attributes to match the official recommended order. Critical for a codebase this large — prevents merge conflicts on className diffs.

### 1c. `.prettierignore`

```
.next/
node_modules/
out/
build/
public/hero-video.mp4
public/pitch/
content-reference.jsx
package-lock.json
```

### 1d. Add format script to `package.json`

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\""
  }
}
```

---

## 2. Stricter ESLint Rules

### Updated `eslint.config.mjs`

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "content-reference.jsx",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // TypeScript strictness
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],

      // React quality
      "react/self-closing-comp": "warn",
      "react/jsx-sort-props": "off", // let Prettier handle

      // Import hygiene
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
    },
  },
]);

export default eslintConfig;
```

This adds:
- Warning on unused vars (with underscore escape hatch)
- Consistent type imports (`import type { X }` over `import { X }`)
- Self-closing empty JSX elements
- No console.log in production code (warn/error allowed)
- prefer-const for variables never reassigned

The rules are warnings, not errors, so the CI build won't fail on existing code — but they'll surface in `npm run lint` output and IDE feedback.

---

## 3. Type-Check Step in CI

Add a `typecheck` script and CI step to catch type errors independent of the build:

### `package.json` scripts addition

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

### Updated `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Format check
        run: npm run format:check

      - name: Build
        run: npm run build
```

Four gates: typecheck, lint, format, build. Format check catches unformatted code without blocking on warnings.

---

## 4. Pre-Commit Hooks (Optional but Recommended)

Using `lint-staged` + `husky` for local enforcement:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

### `.husky/pre-commit`

```bash
npx lint-staged
```

### `package.json` lint-staged config

```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "src/**/*.{css,json}": [
      "prettier --write"
    ]
  }
}
```

This runs ESLint fix + Prettier on staged files only — fast enough for pre-commit without slowing down the workflow.

---

## 5. Component Structure Standard

### Directory Convention

```
src/
  components/
    blocks/              # Page-level section components
      hero-section.tsx
      features-section.tsx
      ...
    ui/                  # Reusable primitive components (shadcn)
      button.tsx
      card.tsx
      ...
    shared/              # Shared composite components (non-primitive, non-section)
      container-catalog-card.tsx
      ...
  app/
    page.tsx             # Assembles blocks
    layout.tsx           # Root layout
    globals.css          # Global styles + CSS variables
```

### File Naming
- kebab-case for all files: `hero-section.tsx`, not `HeroSection.tsx`
- One component per file
- Test files colocated: `hero-section.test.tsx` (when tests are added)

### Component Template

```tsx
import type { FC } from "react";

interface HeroSectionProps {
  // props here
}

export const HeroSection: FC<HeroSectionProps> = ({ /* props */ }) => {
  return (
    <section aria-label="Hero">
      {/* content */}
    </section>
  );
};
```

Rules:
- Named exports only (no default exports for components — enables better refactoring and IDE search)
- Explicit `FC` typing with props interface
- `aria-label` on section elements for accessibility
- Type imports use `import type` syntax

### Import Order (enforced by convention, Prettier sorts Tailwind classes)
1. React / Next.js
2. Third-party libraries (framer-motion, lucide-react, etc.)
3. UI components (@/components/ui/*)
4. Block components (@/components/blocks/*)
5. Utilities (@/lib/*)
6. Types (import type)

---

## 6. Checklist for Implementation

- [ ] Install Prettier + tailwindcss plugin
- [ ] Create `.prettierrc` and `.prettierignore`
- [ ] Add format/format:check scripts to package.json
- [ ] Update `eslint.config.mjs` with stricter rules
- [ ] Add `typecheck` script to package.json
- [ ] Update CI workflow with typecheck + format:check steps
- [ ] Run `npm run format` once to format entire codebase
- [ ] Run `npm run lint` and `npm run typecheck` — fix any surfaced issues
- [ ] (Optional) Install husky + lint-staged for pre-commit hooks
- [ ] Commit all config changes together with message: `chore: add stricter linting, prettier, typecheck CI gate`

---

## Notes for Reviewer

The existing ESLint + CI setup is solid as a baseline. These additions layer on Prettier for formatting consistency, slightly stricter TypeScript rules as warnings (not errors), a typecheck gate in CI, and a documented component structure convention. The pre-commit hooks are optional — useful for teams but not essential if CI is the enforcement point.

The `content-reference.jsx` dead file (24KB) should be deleted — I've added it to the ESLint globalIgnores so it won't cause lint failures in the meantime, but it should be removed entirely per code review issue C3.
