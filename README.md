<p>
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# setup-firefox

This action sets by Firefox for use in actions by:

- downloading and caching a version of Firefox by version and add to PATH

## Usage

See [action.yml](action.yml)

Basic usage:

```yaml
steps:
  - uses: ueokande/setup-firefox@latest
  - run: firefox --version
```

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        firefox: [ '84.0', 'latest-esr', 'latest' ]
    name: Firefox ${{ matrix.firefox }} sample
    steps:
      - name: Setup firefox
        uses: ueokandee/setup-firefox@latest
        with:
          firefox-version: ${{ matrix.firefox }}
      - run: firefox --version
```

## License

[MIT](LICENSE)

