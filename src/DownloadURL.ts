import { Platform, OS, Arch } from "./platform";
import { LatestVersion } from "./versions";
import { UnsupportedPlatformError } from "./errors";

export default interface DownloadURL {
  getURL(): string;
}

export class ArchiveDownloadURL implements DownloadURL {
  constructor(
    private readonly version: string,
    private readonly platform: Platform,
    private readonly language: string
  ) {}

  getURL(): string {
    return `https://ftp.mozilla.org/pub/firefox/releases/${
      this.version
    }/${this.platformPart()}/${this.language}/${this.filename()}`;
  }

  private platformPart(): string {
    const { os, arch } = this.platform;
    if (os === OS.MACOS && arch === Arch.AMD64) {
      return "mac";
    } else if (os === OS.LINUX && arch === Arch.I686) {
      return "linux-i686";
    } else if (os === OS.LINUX && arch === Arch.AMD64) {
      return "linux-x86_64";
    } else if (os === OS.WINDOWS && arch === Arch.I686) {
      return "win32";
    } else if (os === OS.WINDOWS && arch === Arch.AMD64) {
      return "win64";
    } else if (os === OS.WINDOWS && arch === Arch.ARM64) {
      return "win64-aarch64";
    }
    throw new UnsupportedPlatformError({ os, arch }, this.version);
  }

  private filename(): string {
    const { os } = this.platform;
    switch (os) {
      case OS.MACOS:
        return `Firefox%20${this.version}.dmg`;
      case OS.LINUX:
        return `firefox-${this.version}.tar.bz2`;
      case OS.WINDOWS:
        return `Firefox%20Setup%20${this.version}.exe`;
    }
  }
}

export class LatestDownloadURL implements DownloadURL {
  constructor(
    private readonly version: LatestVersion,
    private readonly platform: Platform,
    private readonly language: string
  ) {}

  getURL(): string {
    return `https://download.mozilla.org/?product=${this.productPart()}&os=${this.platformPart()}&lang=${
      this.language
    }`;
  }

  private productPart(): string {
    switch (this.version) {
      case LatestVersion.LATEST:
        return "firefox-latest";
      case LatestVersion.LATEST_BETA:
        return "firefox-beta-latest";
      case LatestVersion.LATEST_DEVEDITION:
        return "firefox-devedition-latest";
      case LatestVersion.LATEST_NIGHTLY:
        return "firefox-nightly-latest";
      case LatestVersion.LATEST_ESR:
        return "firefox-esr-latest";
    }
  }

  private platformPart(): string {
    const { os, arch } = this.platform;
    if (os === OS.MACOS && arch === Arch.AMD64) {
      return "osx";
    } else if (os === OS.LINUX && arch === Arch.I686) {
      return "linux";
    } else if (os === OS.LINUX && arch === Arch.AMD64) {
      return "linux64";
      // TODO Unable to launch silent install on latest version for windows
      // } else if (os === OS.WINDOWS && arch === Arch.I686) {
      //   return "win";
      // } else if (os === OS.WINDOWS && arch === Arch.AMD64) {
      //   return "win64";
    }
    throw new UnsupportedPlatformError({ os, arch }, this.version);
  }
}
