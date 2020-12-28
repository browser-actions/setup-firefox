import {Platform, OS, Arch} from './platform'
import {LatestVersion} from './versions'
import * as tc from '@actions/tool-cache'
import * as core from '@actions/core'

export const install = async (
  version: string,
  platform: Platform,
  language: string
): Promise<string> => {
  return installForLinux(version, platform, language)
}

async function installForLinux(
  version: string,
  platform: Platform,
  language: string
): Promise<string> {
  const toolPath = tc.find('firefox', version)
  if (toolPath) {
    core.info(`Found in cache @ ${toolPath}`)
    return toolPath
  }
  core.info(`Attempting to download ${version}...`)

  const url = makeDownloadURL(version, platform, language)
  core.info(`Acquiring ${version} from ${url}`)

  const archivePath = await tc.downloadTool(url)
  core.info('Extracting Firefox...')
  const extPath = await tc.extractTar(archivePath, '', 'xj')
  core.info(`Successfully extracted fiirefox to ${extPath}`)

  core.info('Adding to the cache ...')
  const cachedDir = await tc.cacheDir(extPath, 'firefox', version)
  core.info(`Successfully cached firefox to ${cachedDir}`)
  return cachedDir
}

const makeDownloadURL = (
  version: string,
  platform: Platform,
  language: string
): string => {
  if (
    version === LatestVersion.LATEST ||
    version === LatestVersion.LATEST_BETA ||
    version === LatestVersion.LATEST_ESR
  ) {
    return makeDownloaderDownloadURL(version, platform, language)
  }
  return makeArchiveDownloadURL(version, platform, language)
}

const makeDownloaderDownloadURL = (
  version: LatestVersion,
  {os, arch}: Platform,
  language: string
): string => {
  const platform = (() => {
    if (os === OS.DARWIN && arch === Arch.AMD64) {
      return 'osx'
    } else if (os === OS.LINUX && arch === Arch.I386) {
      return 'linux'
    } else if (os === OS.LINUX && arch === Arch.AMD64) {
      return 'linux64'
    } else if (os === OS.WINDOWS && arch === Arch.AMD64) {
      return 'win64'
    }
    throw new Error(`Unsupported firefox ${version} for platform ${os} ${arch}`)
  })()

  const product = (() => {
    switch (version) {
      case LatestVersion.LATEST:
        return 'firefox-latest'
      case LatestVersion.LATEST_BETA:
        return 'firefox-beta-lates'
      case LatestVersion.LATEST_ESR:
        return 'firefox-esr-latest'
    }
  })()

  return `https://download.mozilla.org/?product=${product}&os=${platform}&lang=${language}`
}

const makeArchiveDownloadURL = (
  version: string,
  {os, arch}: Platform,
  language: string
): string => {
  const platform = ((): string => {
    if (os === OS.DARWIN && arch === Arch.AMD64) {
      return 'mac'
    } else if (os === OS.LINUX && arch === Arch.I386) {
      return 'linux-i686'
    } else if (os === OS.LINUX && arch === Arch.AMD64) {
      return 'linux-x86_64'
    } else if (os === OS.WINDOWS && arch === Arch.I386) {
      return 'win32'
    } else if (os === OS.WINDOWS && arch === Arch.AMD64) {
      return 'win64'
    } else if (os === OS.WINDOWS && arch === Arch.ARM64) {
      return 'win64-aarch64'
    }
    throw new Error(`Unsupported firefox ${version} for platform ${os} ${arch}`)
  })()

  return `https://ftp.mozilla.org/pub/firefox/releases/${version}/${platform}/${language}/firefox-${version}.tar.bz2`
}
