# Contributing

Thanks for helping improve **Zemen**.

## Development setup

Prereqs: Node.js 20+, `pnpm`.

```bash
pnpm install
pnpm dev
```

## What to run before opening a PR

```bash
pnpm lint
pnpm test
pnpm build
```

## Project structure

- `packages/core`: Ethiopian calendar engine (TypeScript)
- `packages/react`: React component library built on `@zemen/core`
- `apps/web`: Next.js app consuming `@zemen/react`

## Commit & PR guidelines

- Keep PRs focused and small when possible
- Add/adjust tests for behavior changes (especially conversions)
- Avoid unrelated refactors

