# Contributing to setup-firefox

Thank you for your interest in contributing!

## Development Setup

**Prerequisites:** Node.js ≥ 24, [pnpm](https://pnpm.io/)

```bash
# Install dependencies
pnpm install
```

## Development Workflow

```bash
# Lint (CI mode, no auto-fix)
pnpm lint

# Lint with auto-fix
pnpm lint:fix

# Run unit tests
pnpm test

# Run tests with verbose output
pnpm test -- --reporter=verbose

# Run a single test file
npx vitest run __test__/<file>.test.ts

# Build (compiles TypeScript → dist/index.js via @vercel/ncc)
pnpm build

# Package (copies action.yml + README.md into dist/)
pnpm package
```

## Submitting Changes

1. Fork the repository and create a branch from `master`.
2. Make your changes with tests where applicable.
3. Run `pnpm lint` and `pnpm test` to verify everything passes.
4. Open a pull request against `master`.

**Important:** All commit messages must follow [Conventional Commits][] — this is required for the automated release process to correctly determine version bumps and generate changelog entries.

Examples:
- `fix: resolve incorrect Firefox binary path on macOS`
- `feat: support latest-esr version alias`
- `chore: update dependencies`

## Release Process

Releases are automated with [Release Please](https://github.com/googleapis/release-please):

1. Merge changes to `master` following Conventional Commits.
2. Release Please opens or updates a release PR with version bumps and changelog updates, then creates a `setup-firefox-vX.Y.Z` source tag and Release.
3. Squash and merge the release PR.
4. CI builds and tests `dist/`. `ueokande/publish-built-action` publishes its contents as a signed, parentless commit with an immutable `vX.Y.Z` tag and a floating `vX` tag, then generates the distribution Release notes. The `latest` branch is no longer updated.

The `release` workflow runs release-please on `master`. Only when a release is created, it passes release-please's source commit SHA to the reusable build/test workflow. After all build and test jobs succeed, a publication job in the same `release.yml` workflow checks out that SHA, downloads the build artifact, and publishes `vX.Y.Z` and `vX`. The `setup-firefox-vX.Y.Z` tag identifies the source; its creation does not trigger another workflow.

All jobs use `GITHUB_TOKEN`; no PAT, workflow dispatch, or `actions: write` permission is required. Publication uses the existing `PRIVATE_SIGNING_KEY` secret. If Release creation fails after tags have been pushed, retry only Release creation; rerunning publication will reject the existing immutable tag.

> **Note:** Never commit generated `dist/` files to the source branch — they are built and published automatically by CI.

[Conventional Commits]: https://www.conventionalcommits.org/en/v1.0.0/
