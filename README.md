![build-test](https://github.com/browser-actions/setup-firefox/workflows/build-test/badge.svg)

# setup-firefox

This action sets by Firefox for use in actions by:

- downloading and caching a version of Firefox by version and add to PATH

## Usage

See [action.yml](action.yml)

Basic usage:

```yaml
steps:
  - uses: browser-actions/setup-firefox@v1
  - run: firefox --version
```

Use in the matrix:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        firefox: [ '84.0', 'devedition-84.0b1', 'latest-beta', 'latest-devedition', 'latest-nightly', 'latest-esr', 'latest' ]
    name: Firefox ${{ matrix.firefox }} sample
    steps:
      - name: Setup firefox
        id: setup-firefox
        uses: browser-actions/setup-firefox@v1
        with:
          firefox-version: ${{ matrix.firefox }}
      - run: |
          echo Installed firefox versions: ${{ steps.setup-firefox.outputs.firefox-version }}
          ${{ steps.setup-firefox.outputs.firefox-path }} --version
```

## Contributing

### Local development

```bash
# Instal dependencies
pnpm install

# Run tests
pnpm lint
pnpm test

# Build and create package in dist/
pnpm build
pnpm package
```

## Release

Releases are automated with Release Please.  All changes must follow [Conventional Commits][], since Release Please derives versions and changelog entries from commit messages.

1. Merge some changes to the main branch.
2. Release Please opens or updates a release PR with version bumps and changelog updates.
3. Squash and merge the release PR to the main branch with a commit message that follows [Conventional Commits][].
4. Create a GitHub release and publish the action to the marketplace.

[Conventional Commits]: https://www.conventionalcommits.org/en/v1.0.0/

## License

[MIT](LICENSE)
