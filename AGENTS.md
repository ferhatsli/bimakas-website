# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js 15 App Router project written in TypeScript. UI code lives under `src/app` for route-level layouts and pages, while reusable pieces are grouped in `src/components` (`navigation`, `sections`, `ui`). Shared configuration sits in `src/config`, global providers and contexts are in `src/providers` and `src/contexts`, and utilities are in `src/lib`. Marketing copy and design experiments are stored inside `docs` and `src/visual-edits`. Static assets (logos, images, fonts) belong in `public`.

## Build, Test, and Development Commands
Install dependencies with `pnpm install` (aligns with the committed `pnpm-lock.yaml`). Use `pnpm dev` for a hot-reloading development server, `pnpm build` to produce the production bundle, and `pnpm start` to serve the built output locally. Run `pnpm lint` before opening a pull request to ensure the code matches the configured ESLint rules.

## Coding Style & Naming Conventions
Follow the existing 2-space indentation for TypeScript, TSX, and JSON. Keep React components in PascalCase (`HeroSection`), hooks/functions in camelCase, and folders in kebab-case. Tailwind utility classes are the preferred styling approach; co-locate any non-trivial Tailwind presets in `src/lib` helpers. Avoid default exports for shared utilities—named exports ease tree shaking. Run `pnpm lint` and apply reported fixes (ESLint and Next.js rules; Tailwind class ordering is also enforced).

## Testing Guidelines
There is no automated test suite yet. When adding tests, place them next to the component (`Component.test.tsx`) or under a new `src/__tests__` directory and rely on Testing Library and Vitest/Jest. For now, treat `pnpm lint` plus manual responsive/browser checks as the release gate. Document the scenarios you validated in the pull request description if you add UI changes.

## Commit & Pull Request Guidelines
Commit history is compact and present-tense (`update`, `landing page`). Keep messages short but descriptive—start with a lowercase imperative verb (`add hero CTA`) and list any secondary details in the body if needed. For pull requests, include: a concise summary, linked issue or task ID, screenshots/GIFs for visual updates, and step-by-step QA notes. Label breaking or dependency changes clearly so reviewers can prioritize.
