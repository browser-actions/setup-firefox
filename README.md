![build-test](https://github.com/browser-actions/setup-firefox/workflows/build-test/badge.svg)

# setup-firefox

This action sets by Firefox for use in actions by:

- downloading and caching a version of Firefox by version and add to PATH

## Usage

See [action.yml](action.yml)

Basic usage:

```yaml
steps:
  - uses: browser-actions/setup-firefox@latest
  - run: firefox --version
```

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        firefox: [ '84.0', 'latest-beta', 'latest-devedition', 'latest-esr', 'latest' ]
    name: Firefox ${{ matrix.firefox }} sample
    steps:
      - name: Setup firefox
        uses: browser-actions/setup-firefox@latest
        with:
          firefox-version: ${{ matrix.firefox }}
      - run: firefox --version
```

## License

[MIT](LICENSE)

