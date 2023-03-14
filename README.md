![build-test](https://github.com/itsjwala/setup-firefox/workflows/build-test/badge.svg)

# setup-firefox

This action sets by Firefox for use in actions by:

- downloading and caching a version of Firefox by version and add to PATH

## Usage

See [action.yml](action.yml)

Basic usage:

```yaml
steps:
  - uses: itsjwala/setup-firefox@v1
  - run: firefox --version
```

Use in the matrix:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        firefox: [ '84.0', 'latest-beta', 'latest-devedition', 'latest-nightly', 'latest-esr', 'latest' ]
    name: Firefox ${{ matrix.firefox }} sample
    steps:
      - name: Setup firefox
        id: setup-firefox
        uses: itsjwala/setup-firefox@v1
        with:
          firefox-version: ${{ matrix.firefox }}
      - run: |
          echo Installed firefox versions: ${{ steps.setup-firefox.outputs.firefox-version }}
          firefox --version
```

## License

[MIT](LICENSE)
