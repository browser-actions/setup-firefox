# Agentic Coding Guide

This file provides guidance for AI coding agents working in this repository.

## Repository Purpose

`setup-firefox` is a GitHub Action that installs Firefox on GitHub Actions runners. It supports stable, beta, devedition, nightly, and ESR releases, as well as specific version numbers.

## Commands

```bash
pnpm install --frozen-lockfile   # install dependencies
pnpm lint                        # lint with Biome (CI mode, no auto-fix)
pnpm lint:fix                    # lint with auto-fix
pnpm test                        # run all unit tests with Vitest
pnpm test -- --reporter=verbose  # verbose test output
npx vitest run __test__/<file>.test.ts  # run a single test file
pnpm build                       # compile TypeScript → dist/index.js
pnpm package                     # copy action.yml + README.md into dist/
```

## Project Layout

```
src/
  index.ts               # action entry point: reads inputs, invokes installer, sets outputs
  platform.ts            # OS/arch detection → Platform struct
  versions.ts            # version alias resolution (latest, latest-beta, latest-esr, etc.)
  DownloadURL.ts         # constructs the download URL for a given version and platform
  DownloadURLFactory.ts  # factory that picks the right DownloadURL strategy for a version spec
  installers.ts          # installer registry: maps platform to the right installer class
  LinuxInstaller.ts      # Firefox installer for Linux
  MacOSInstaller.ts      # Firefox installer for macOS
  WindowsInstaller.ts    # Firefox installer for Windows
  firefoxUtils.ts        # shared utilities (e.g. finding the installed binary)
  errors.ts              # custom error types
__test__/
  DownloadURL.test.ts         # tests for URL construction
  DownloadURLFactory.test.ts  # tests for URL factory dispatch
  installers.test.ts          # tests for installer selection
action.yml              # action metadata: inputs, outputs, runs.using: node24
biome.json              # linter/formatter config
```

## Architecture

Version resolution and download URL construction are separated:

1. `versions.ts` resolves alias strings (e.g. `latest-beta`) to actual release version numbers by querying the Mozilla release API.
2. `DownloadURLFactory.ts` picks the right `DownloadURL` strategy for the resolved version and platform.
3. Platform-specific installer classes (`LinuxInstaller`, `MacOSInstaller`, `WindowsInstaller`) handle download, extraction, and PATH setup.

## Testing

Tests live in `__test__/` and use [Vitest](https://vitest.dev/).

- Tests mock network/HTTP calls; no real requests are made at test time.
- When adding support for a new version alias or platform, add or update the corresponding test file.

## Conventions

- **TypeScript strict mode** — all types must be explicit; avoid `any`.
- **Linter:** Biome — run `pnpm lint` before committing. `useLiteralKeys` and `noUselessElse` rules are disabled.
- **Formatter:** Biome with space indentation.
- **Node.js ≥ 24** is required.
- **Conventional Commits** are required for all commits (`feat:`, `fix:`, `chore:`, etc.).
- **Never commit `dist/`** — it is built by CI and deployed to the `latest` branch on release.
- The `action.yml` `main` field points to `index.js` inside `dist/`, not the TypeScript source.
