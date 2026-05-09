![build-test](https://github.com/browser-actions/setup-firefox/workflows/build-test/badge.svg)

# setup-firefox

This action sets up Mozilla Firefox for GitHub Actions. This action supports the following features:

- Install and set up Firefox onto the runner.
- Install a specific version of Firefox by the version number or release channel.
- Cross-platform runner support (Windows, macOS, Linux) and self-hosted runner support.
- Support for Firefox release channels: stable, beta, developer edition, nightly, and ESR.

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

### Supported version formats

The action supports the following version formats:

- Release channels: `latest` (default), `latest-beta`, `latest-devedition`, `latest-nightly`, `latest-esr`
- Specific release version: `84.0`, `84.0.1`, `beta-84.0b1`, `devedition-84.0b1`

## Supported platforms

| Linux x64 | Linux ARM32 | Linux ARM64 | macOS x64 | macOS ARM64 | Windows x64 | Windows ARM64 |
| ---       | ---         | ---         | ---       | ---         | ---         | ---           |
| ✅        | ❌          | ✅          | ✅        | ✅          | ✅          | ✅            |

## Parameters

### Inputs

- `firefox-version`: *(Optional)* The Firefox version to install and use.
  Default: `latest`

### Outputs

- `firefox-version`: The installed Firefox version. Useful when given a latest version.
- `firefox-path`: The installed Firefox path.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, workflow, and release process.

## License

[MIT](LICENSE)
